// ==UserScript==
// @name         CADSUS Web - Plugin
// @namespace    https://github.com/fellypsantos/cadsusweb
// @version      1.2
// @description  Melhorias locais no ambiente de impressão do Cartão do SUS.
// @author       Fellyp Santos
// @match        https://cadastro.saude.gov.br/novocartao/restrito/usuarioConsulta.jsp*
// @match        https://cadastro.saude.gov.br/novocartao/restrito/usuarioCadastro.jsp*
// @icon         https://www.google.com/s2/favicons?domain=gov.br
// @downloadURL  https://github.com/fellypsantos/cadsusweb/raw/master/src/cadsusweb.user.js
// @updateURL    https://github.com/fellypsantos/cadsusweb/raw/master/src/cadsusweb.user.js
// @grant        none
// ==/UserScript==

import { showStack } from './sample';

(function () {
  'use strict';

  const HOST: string = 'localhost';
  const PORT: number = 7125;
  const BASE_URL: string = `http://${HOST}:${PORT}`;

  const mainForm: JQuery = $('form').eq(0);
  const getStack = (): string[] => JSON.parse(localStorage.getItem('fila_cartoes') || '[]');
  const setStack = (data: string[]) => localStorage.setItem('fila_cartoes', JSON.stringify(data));

  const setStackCounterValue = (value: number) =>
    $('#stack-counter').text(value.toString());

  window.deleteFromStack = (cns: string): boolean => {
    const stack: string[] = getStack();
    const newStack: string[] = stack.filter((item) => item !== cns);

    setStack(newStack);
    setStackCounterValue(newStack.length);
    window.showStack();
    return false;
  };

  //SAMPLE
  showStack(getStack());
  //SAMPLE


  window.clearStack = (): void => {
    if (window.confirm('Limpar a fila atual ?')) {
      setStack([]);
      setStackCounterValue(0);
    }
  };

  window.printStack = (): void => {
    const fila: string[] = getStack();
    console.log('enviar get com a lista de cartões', JSON.stringify(fila));
    window.open(`${BASE_URL}/card/${fila.join(',')}`);
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

  window.cadsuswebPlugin_Init = (): void => {
    $('#stack-diag').hide();
    $('#stack-confirmation').hide();
    if (getStack().length === 0) {
      setStack([]);
    }
    setStackCounterValue(getStack().length);
  };

  // Initialize
  window.cadsuswebPlugin_Init();

  window.offlinePrint = (cns: string): void => {
    $('#stack-confirmation').dialog({
      width: 400,
      resizable: false,
      buttons: {
        'Adicionar na fila': () => {
          const stack: string[] = getStack();
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

  window.gerarCartaoCadastro = (user: any): void => {
    let urlRetorno: string = 'usuarioConsulta.jsp';
    if (user.numeroProtocoloPrecadastro || user.protocoloPrimeiroAcesso) {
      urlRetorno = 'usuarioConsultaProtocolo.jsp';
    }

    console.log('gerarCartaoCadastro()');
    window.solicitarDialogoGerarCartao(user);

    window.dialogoGerarCartao(
      urlRetorno,
      btoa(JSON.stringify(user)),
      'Voltar para a consulta',
      function () {
        window.bloqueioAguarde();
        $(window).unbind('beforeunload');
        window.location.href = urlRetorno;
      },
      'ui-icon-arrowrefresh-1-w'
    );
  };

  window.solicitarDialogoGerarCartao = (usuario: any): void => {
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

    // Check if the user exists
    $.get(`${BASE_URL}/user/${numeroCns}`, (response) => {
      if (response !== null) {
        // Data found
        console.log('Recuperado da base de dados offline.');
        window.offlinePrint(numeroCns);
      } else {
        window.bloqueioPesquisa();
        console.log('Coletando dados para salvar offline...');
        $.post(
          'https://cadastro.saude.gov.br/novocartao/restrito/consultar/visualizar.form',
          { cns: numeroCns },
          (responseExtraData) => {
            console.log('Dados coletados');

            const { cpf, municipioNascimentoCodigo, cartoesAgregados } = responseExtraData;

            const myCards = cartoesAgregados.filter((cns: any) => cns.tipo === 'Provisório');

            myCards.forEach((card: any) => {
              $.get(
                `${BASE_URL}/user/${card.cns}`,
                (responseTempCard) => {
                  if (responseTempCard !== null) {
                    console.log(`Remover ${card.cns} e salvar ${numeroCns}`);
                    $.ajax({
                      url: `${BASE_URL}/user/${responseTempCard._id}`,
                      type: 'DELETE',
                      contentType: 'application/json',
                      success: (responseUpdated) => {
                        console.log('Cartão provisório removido.');
                      }
                    });
                  }
                }
              );
            });

            $.ajax({
              type: 'POST',
              url: `${BASE_URL}/user`,
              data: JSON.stringify({
                numeroCns,
                cpf,
                nome,
                dataNascimento,
                sexo,
                municipioNascimento,
                municipioNascimentoCodigo,
                nomeMae,
                nomePai
              }),
              contentType: 'application/json',
              success: (response) => {
                console.log('Cartão agora está disponível offline.');
                window.bloqueioLiberar();
                window.offlinePrint(numeroCns);
              }
            });
          },
          'json'
        );
      }
    });
  };

  window.gravar = (usuarioSus: any): boolean => {
    let usuarioOperacao: any;

    console.log('na funcao gravar - com proxy para salva em database');

    // Wrap da classe: br.gov.saude.cadsusweb.operacao.UsuarioOperacao
    usuarioOperacao =
      new pacote.br.gov.saude.cadsusweb.operacao.UsuarioOperacao();

    // Efetua a gravação
    bloqueioGravacao();

    // Capturando a flag de dataquality
    let dataQuality = false;
    if ($('#desabilitarDataQuality').is(':checked')) {
      dataQuality = true;
    }

    if (
      !usuarioSus.numeroProtocoloPrecadastro &&
      !usuarioSus.protocoloPrimeiroAcesso
    ) {
      console.log('>>>> a');

      usuarioOperacao.gravar(
        usuarioSus,
        dataQuality,
        function (response: any) {
          console.log('>>>> usuarioOperacao.gravar : response');

          if (response.merge) {
            // Call a window to show both records
            openModalMerge(response);
          } else {
            console.log('>>>> usuarioOperacao.gravar : gerarCartaoCadastro');
            window.solicitarDialogoGerarCartao(response.usuario);
            gerarCartaoCadastro(response.usuario);
          }
        },
        function (erro: any) {
          if (!erro) return false;

          if (erro.errorNoAltToNew) {
            criarJanelaIncluirNaoAlteracao(erro.msgErro);
          }

          if (erro.errorNoAltToOutroCad) {
            criarJanelaNaoAlteracaOutroUsuario(erro.msgErro);
          }
        }
      );
    } else {
      console.log('>>>> b');

      usuarioOperacao.validarProtocolo(
        usuarioSus,
        dataQuality,
        function (response: any) {
          if (response.merge != null) {
            // Call a window to show both records
            openModalMerge(response);
            this.isProtocoloHomologacao = true;
          } else if (response.usuario) {
            gerarCartaoCadastro(response.usuario);
          } else {
            gerarCartaoCadastro(response);
          }
        },
        function (erro: any) {
          if (!erro) return false;

          if (erro.errorNoAltToNew) {
            criarJanelaIncluirNaoAlteracao(erro.msgErro);
          }

          if (erro.errorNoAltToOutroCad) {
            criarJanelaNaoAlteracaOutroUsuario(erro.msgErro);
          }
        }
      );
    }

    console.log('>>>> end gravar');
    return false;
  };

  let timeoutDialog: any;

  $.idleTimeout(timeoutDialog, 'div.ui-dialog-buttonpane button:first', {
    titleMessage: '',
    idleAfter: 9999,
    pollingInterval: 9999,
    keepAliveURL: 'http://your-keep-alive-url.example.com/restrito/manterSessaoAtiva.form',
    serverResponseEquals: 'OK',
    onTimeout: () => { },
    onIdle: () => { },
    onCountdown: () => { }
  });

  // Keep session alive
  setInterval(() => {
    $.ajax(
      'https://cadastro.saude.gov.br/novocartao/restrito/manterSessaoAtiva.form'
    ).then((response) => {
      console.log('manterSessaoAtiva: ', response);
    });
  }, 30 * 1000);
})();
