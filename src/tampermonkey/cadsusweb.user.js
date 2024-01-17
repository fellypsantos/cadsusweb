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

(function () {
  "use strict";

  const HOST = "localhost";
  const PORT = 7125;
  const BASE_URL = `http://${HOST}:${PORT}`;

  const mainForm = window.$("form").eq(0);
  const getStack = () => JSON.parse(localStorage.getItem("fila_cartoes"));
  const setStack = (data) =>
    localStorage.setItem("fila_cartoes", JSON.stringify(data));

  const setStackCounterValue = (value) =>
    window.$("#stack-counter").text(value.toString());

  window.deleteFromStack = (cns) => {
    let stack = getStack();
    let newStack = stack.filter((item) => item != cns);

    setStack(newStack);
    setStackCounterValue(newStack.length);
    window.showStack();
    return false;
  };

  window.showStack = () => {
    window.$("#stack-diag").dialog({ width: 450, height: 250 });
    window.$("#tbl-stack-diag tbody").html("");

    let stack = getStack();
    stack.forEach((cns) => {
      window.$("#tbl-stack-diag tbody").append(`
      <tr>
        <th scope="col">${cns}</th>
        <th scope="col" class="text-center">
        <a href="#!" onClick="javascript:deleteFromStack(${cns})" class="btn-sm btn-danger">Excluir</a>
        </th>
      </tr>`);
    });
  };

  window.clearStack = () => {
    if (window.confirm("Limpar a fila atual ?")) {
      setStack([]);
      setStackCounterValue(0);
    }
  };

  window.printStack = () => {
    let fila = getStack();
    console.log("enviar get com a lista de cartões", JSON.stringify(fila));
    window.open(`${BASE_URL}/cartao/${fila.join(",")}`);
  };

  // 3 ADITIONAL BUTTONS
  mainForm.append(`<div class="row text-center btnFooter icoNone">
    <button class="btn btn-success" onClick="javascript:printStack(); return false;">Imprimir Fila</button>
    <button class="btn btn-primary" onClick="javascript:showStack(); return false;">Mostrar Fila</button>
    <button class="btn btn-danger" onClick="javascript:clearStack(); return false;">Limpar Fila</button></div>`);

  // STACK COUNTER
  mainForm.append(
    `<h6 class="text-center">Cartões na fila: <span class="badge badge-secondary" id="stack-counter">-</span></h6>`
  );

  // HTML FOR ACTION DIALOG
  mainForm.append(`<div id="stack-confirmation" title="Cartão pronto para impressão.">
    <h4>
      <span class="ui-icon ui-icon-print" style="float:left; margin:12px 12px 20px 0;"></span>
      O cartão está pronto pra ser impresso, o que faremos agora ?
    </h4>
    </div>`);

  // ACTION DIALOG WHEN CARD IS READY TO PRINT
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
    window.$("#stack-diag").hide();
    window.$("#stack-confirmation").hide();
    if (getStack() == null) {
      setStack([]);
    }
    setStackCounterValue(getStack().length);
  };

  // INITIALIZE
  window.cadsuswebPlugin_Init();

  window.offlinePrint = (cns) => {
    window.$("#stack-confirmation").dialog({
      width: 400,
      resizable: false,
      buttons: {
        "Adicionar na fila": () => {
          let stack = getStack();
          if (stack.indexOf(cns) == -1) {
            stack.push(cns);
            setStackCounterValue(stack.length);
            setStack(stack);
          }

          window.$("#stack-confirmation").dialog("close");
        },

        "Imprimir agora": () => {
          window.$("#stack-confirmation").dialog("close");
          window.open(`${BASE_URL}/cartao/${cns}`);
        },
      },
    });
  };

  window.gerarCartaoCadastro = (user) => {
    var urlRetorno = "usuarioConsulta.jsp";
    if (user.numeroProtocoloPrecadastro || user.protocoloPrimeiroAcesso) {
      urlRetorno = "usuarioConsultaProtocolo.jsp";
    }

    console.log("gerarCartaoCadastro()");
    window.solicitarDialogoGerarCartao(user);

    window.dialogoGerarCartao(
      urlRetorno,
      JSON.toBase64(user),
      "Voltar para a consulta",
      function () {
        window.bloqueioAguarde();
        window.$(window).unbind("beforeunload");
        window.location.href = urlRetorno;
      },
      "ui-icon-arrowrefresh-1-w"
    );
  };

  window.solicitarDialogoGerarCartao = (usuario) => {
    /**
     *  usuario -> pode vir como string base64 ou object
     *
     *  base64 -> quando vier da tela de cadastro
     *  object -> quando vier da tela de consulta
     */

    console.log("solicitarDialogoGerarCartao");

    if (typeof usuario !== "object") {
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
      nomePai,
    } = usuario;

    // verificar se o usuario existe
    window.$.get(`${BASE_URL}/existe_usuario/${numeroCns}`, (response) => {
      if (response !== null) {
        // tem dado
        console.log("Recuperado da base de dados offline.");
        window.offlinePrint(numeroCns);
      } else {
        window.bloqueioPesquisa();
        // pede dados extras e salva
        console.log("Coletando dados para salvar offline...");
        window.$.post(
          "https://cadastro.saude.gov.br/novocartao/restrito/consultar/visualizar.form",
          { cns: numeroCns },
          (responseExtraData) => {
            console.log("Dados coletados");

            const { cpf, municipioNascimentoCodigo, cartoesAgregados } =
              responseExtraData;

            let myCards = cartoesAgregados.filter(
              (cns) => cns.tipo === "Provisório"
            );

            myCards.forEach((card) => {
              // verificar se os cartões provisórios estão no banco
              // deleta se existir, pra não duplicar cadastros
              window.$.get(
                `${BASE_URL}/existe_usuario/${card.cns}`,
                (responseTempCard) => {
                  if (responseTempCard !== null) {
                    // encontrou cartão do usuário, com número provisório
                    // delete o encontrado e salva o novo
                    console.log(`Remover ${card.cns} e salvar ${numeroCns}`);

                    window.$.ajax({
                      url: `${BASE_URL}/remove_usuario/${responseTempCard._id}`,
                      type: "DELETE",
                      contentType: "application/json",
                      success: (responseUpdated) => {
                        console.log("Cartão provisório removido.");
                      },
                    });
                  }
                }
              );
            });

            // CRIA O NOVO CADASTRO
            window.$.ajax({
              type: "POST",
              url: `${BASE_URL}/novo_usuario`,
              data: JSON.stringify({
                numeroCns,
                cpf,
                nome,
                dataNascimento,
                sexo,
                municipioNascimento,
                municipioNascimentoCodigo,
                nomeMae,
                nomePai,
              }),
              contentType: "application/json",
              success: (response) => {
                console.log("Cartão agora está disponível offline.");
                window.bloqueioLiberar();
                window.offlinePrint(numeroCns);
              },
            });
          },
          "json"
        );
      }
    });

    // CRIA O NOVO CADASTRO
    window.$.ajax({
      type: "POST",
      url: `${BASE_URL}/novo_usuario`,
      data: JSON.stringify({
        numeroCns,
        cpf,
        nome,
        dataNascimento,
        sexo,
        municipioNascimento,
        municipioNascimentoCodigo,
        nomeMae,
        nomePai,
      }),
      contentType: "application/json",
      success: (response) => {
        console.log("Cartão agora está disponível offline.");
        window.bloqueioLiberar();
        window.offlinePrint(numeroCns);
      },
    });
  };

  window.gravar = (usuarioSus) => {
    var usuarioOperacao;

    console.log("na funcao gravar - com proxy para salva em database");

    // Wrap da classe: br.gov.saude.cadsusweb.operacao.UsuarioOperacao
    usuarioOperacao =
      new pacote.br.gov.saude.cadsusweb.operacao.UsuarioOperacao();

    // Efetua a gravação
    bloqueioGravacao();

    // Capturando a flag de dataquality
    var dataQuality = false;
    if ($("#desabilitarDataQuality").is(":checked")) {
      dataQuality = true;
    }

    if (
      !usuarioSus.numeroProtocoloPrecadastro &&
      !usuarioSus.protocoloPrimeiroAcesso
    ) {
      console.log(">>>> a");

      usuarioOperacao.gravar(
        usuarioSus,
        dataQuality,
        function (response) {
          console.log(">>>> usuarioOperacao.gravar : response");

          if (response.merge) {
            // chama janela para mostrar janelas os dois registros
            openModalMerge(response);
          } else {
            console.log(">>>> usuarioOperacao.gravar : gerarCartaoCadastro");
            // TELA: NOVO CADASTRO
            window.solicitarDialogoGerarCartao(response.usuario);
            gerarCartaoCadastro(response.usuario);
          }
        },
        function (erro) {
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
      console.log(">>>> b");

      usuarioOperacao.validarProtocolo(
        usuarioSus,
        dataQuality,
        function (response) {
          if (response.merge != null) {
            // chama janela para mostrar janelas os dois registros
            openModalMerge(response);
            this.isProtocoloHomologacao = true;
          } else if (response.usuario) {
            gerarCartaoCadastro(response.usuario);
          } else {
            gerarCartaoCadastro(response);
          }
        },
        function (erro) {
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

    console.log(">>>> end gravar");
    return false;
  };

  var timeoutDialog;

  window.$.idleTimeout(timeoutDialog, "div.ui-dialog-buttonpane button:first", {
    titleMessage: "",
    idleAfter: 9999,
    pollingInterval: 9999,
    keepAliveURL: window.context + "restrito/manterSessaoAtiva.form",
    serverResponseEquals: "OK",
    onTimeout: () => { },
    onIdle: () => { },
    onCountdown: () => { },
  });

  // KEEP SESSION ALIVE
  setInterval(() => {
    window.$.ajax(
      "https://cadastro.saude.gov.br/novocartao/restrito/manterSessaoAtiva.form"
    ).then((response) => {
      console.log("manterSessaoAtiva: ", response);
    });
  }, 30 * 1000);
})();
