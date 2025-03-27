// ==UserScript==
// @name         CADSUS Web - Plugin
// @namespace    https://github.com/fellypsantos/cadsusweb
// @version      2.0
// @description  Melhorias locais no ambiente de impressão do Cartão do SUS.
// @author       Fellyp Santos
// @match        https://cadastro.saude.gov.br/novocartao/restrito/usuarioConsulta.jsp*
// @match        https://cadastro.saude.gov.br/novocartao/restrito/usuarioCadastro.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @require      https://cdn.socket.io/4.7.2/socket.io.min.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  console.log('Tampermonkey WebSocket Script Running...');

  const HOST = 'localhost';
  const PORT = 7125;
  const BASE_URL = `http://${HOST}:${PORT}`;

  const mainForm = $('form').eq(0);
  const getStack = () => JSON.parse(localStorage.getItem('fila_cartoes') || '[]');
  const setStack = (data) => localStorage.setItem('fila_cartoes', JSON.stringify(data));

  const setStackCounterValue = (value) => $('#stack-counter').text(value.toString());

  window.showStack = () => {
    $('#stack-diag').dialog({ width: 450, height: 250 });
    $('#tbl-stack-diag tbody').html('');

    const stack = getStack();

    stack.forEach((cns) => {
      $('#tbl-stack-diag tbody').append(`
      <tr>
        <th scope="col">${cns}</th>
        <th scope="col" class="text-center">
        <a href="#!" onClick="javascript:deleteFromStack('${cns}')" class="btn-sm btn-danger">Excluir</a>
        </th>
      </tr>`);
    });
  };

  window.clearStack = () => {
    if (window.confirm('Limpar a fila atual ?')) {
      setStack([]);
      setStackCounterValue(0);
    }
  };

  window.printStack = () => {
    const stack = getStack();
    if (stack.length === 0) {
      alert('Nada para imprimir.');
      return;
    }

    window.open(`${BASE_URL}/card/${stack.join(',')}`);
  };

  // Additional buttons
  mainForm.append(`<div class="row text-center btnFooter icoNone">
    <button class="btn btn-success" onClick="javascript:printStack(); return false;">Imprimir Fila</button>
    <button class="btn btn-primary" onClick="javascript:showStack(); return false;">Mostrar Fila</button>
    <button class="btn btn-danger" onClick="javascript:clearStack(); return false;">Limpar Fila</button></div>`);

  // Stack Counter
  mainForm.append(
    '<h6 class="text-center">Cartões na fila: <span class="badge badge-secondary" id="stack-counter">-</span></h6>'
  );

  // HTML for Action Dialog
  mainForm.append(`<div id="stack-confirmation" title="Cartão pronto para impressão.">
    <h4>
      <span class="ui-icon ui-icon-print" style="float:left; margin:12px 12px 20px 0;"></span>
      O cartão está pronto pra ser impresso, o que faremos agora ?
    </h4>
    </div>`);

  // Action Dialog when Card is Ready to Print
  mainForm.append(`<div id="stack-diag" title="Fila de Impressão Atual">
      <table class="table table-dark" id="tbl-stack-diag">
        <thead>
          <tr>
            <th scope="col">CNS</th>
            <th scope="col" class="text-center">-</th>
          </tr>
        </thead>
        <tbody></tbody>
        </table>
      </div>`);

  window.cadsuswebPlugin_Init = () => {
    $('#stack-diag').hide();
    $('#stack-confirmation').hide();
    if (getStack().length === 0) {
      setStack([]);
    }
    setStackCounterValue(getStack().length);
  };

  // Initialize
  window.cadsuswebPlugin_Init();

  window.offlinePrint = (cns) => {
    $('#stack-confirmation').dialog({
      width: 400,
      resizable: false,
      buttons: {
        'Adicionar na fila': () => {
          const stack = getStack();
          if (stack.indexOf(cns) === -1) {
            stack.push(cns);
            setStackCounterValue(stack.length);
            setStack(stack);
          }

          $('#stack-confirmation').dialog('close');
        },

        'Imprimir agora': () => {
          $('#stack-confirmation').dialog('close');
          window.open(`${BASE_URL}/card/${cns}`);
        }
      }
    });
  };

  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._requestUrl = url; // Store the request URL
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener('load', function () {
      try {
        const url = this._requestUrl;
        const responseText = this.responseText;
        const jsonResponse = JSON.parse(responseText);
        processXHRResponse(url, jsonResponse);
      } catch (error) {
        console.warn('XHR Response is not JSON:', this.responseText);
      }
    });

    return originalSend.apply(this, arguments);
  };

  const processXHRResponse = (url, jsonResponse) => {
    console.log('url', url);
    console.log('jsonResponse', jsonResponse);

    if (url.includes('incluir.form')) {
      console.log('Novo cartão foi criado e será sincronizado localmente.');
      socket.emit('sync_user', jsonResponse.usuario);
      return;
    }

    if (url.includes('alterar.form')) {
      console.log('Os dados de um cadastro foram alterados e serão sincronizado localmente.');
      socket.emit('sync_user', jsonResponse.usuario);
      return;
    }
  };

  window.solicitarDialogoGerarCartao = (usuario) => {
    if (typeof usuario !== 'object') {
      usuario = JSON.parse(atob(usuario));
    }

    socket.emit('sync_user', usuario);
  };

  // Connect to WebSocket server
  const socket = io('ws://localhost:3000');

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('sync_completed', (userdata) => {
    console.log('sync_completed', userdata);
    window.offlinePrint(userdata.numeroCns);
  });

  socket.on('disconnect', () => {
    console.warn('Disconnected from WebSocket server');
  });

  var timeoutDialog;

  window.$.idleTimeout(timeoutDialog, 'div.ui-dialog-buttonpane button:first', {
    titleMessage: '',
    idleAfter: 9999,
    pollingInterval: 9999,
    keepAliveURL: window.context + 'restrito/manterSessaoAtiva.form',
    serverResponseEquals: 'OK',
    onTimeout: () => { },
    onIdle: () => { },
    onCountdown: () => { }
  });

  // KEEP SESSION ALIVE
  setInterval(() => {
    window.$.ajax(
      'https://cadastro.saude.gov.br/novocartao/restrito/manterSessaoAtiva.form'
    ).then((response) => {
      console.log('manterSessaoAtiva: ', response);
    });
  }, 30 * 1000);
})();
