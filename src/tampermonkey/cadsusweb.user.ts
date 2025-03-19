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
  };

  window.solicitarDialogoGerarCartao = (usuario) => {
    console.log('solicitarDialogoGerarCartao');

    if (typeof usuario !== 'object') {
      usuario = JSON.parse(atob(usuario));
    }

    const {
      nome,
      dataNascimento,
      sexo,
      cpf,
      numeroCns,
      municipioNascimento,
      municipioNascimentoCodigo,
      nomeMae,
      nomePai
    } = usuario;

    console.log(numeroCns, nome);
  };

  // Connect to WebSocket server
  const socket = io('ws://localhost:3000');

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  // Listen for pong response
  // socket.on('pong', () => {
  //     console.log("Received: pong");
  // });

  socket.on('disconnect', () => {
    console.warn('Disconnected from WebSocket server');
  });
})();
