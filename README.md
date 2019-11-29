# cadsusweb

Melhorias locais no ambiente de impressão do Cartão do SUS.

## Requisitos mínimos

- NodeJS v10.16.3 ou superior.
- Google Chrome v76 ou superior.

## Recursos

- Três botões adicionais para controle de fila de impressão.
- Exclusão de cartões fila
- Impressão de vários cartões na mesma folha
- Fila de impressão implementada em localStorage

### Configuração

Por motivos de segurança, é necessário utilizar especificamente o Google Chrome para esse sistema, pois o Mozilla Firefox bloqueia requisições AJAX para outros endereços IP, o que é um problema já que rodaremos o servidor pra ser acessado também de outros computadores na rede local.

Primeiro passo é baixar a extenção Tampermonkey, que será responsável por executar os scripts que farão a comunicação com o servidor local.
Download no site oficial [Tampermonkey para Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=pt-BR).

#### Instalação do script

Abra com algum editor de texto, o arquivo tm_userscript.js localizado na pasta cadsusweb/src/tm_userscript.js copie todo o conteúdo.
Crie um novo script no Tampermonkey e cole o script que acabou de copiar, e salve.
Pronto.
