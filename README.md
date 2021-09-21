# cadsusweb

Melhorias locais no ambiente de impressão do Cartão do SUS.

**[FAZER DOWNLOAD](https://drive.google.com/open?id=1Z-9o7Brmub0PTjnVrBulepW6RkiEHRml)**

## Requisitos mínimos

- NodeJS v12 ou superior.
- Google Chrome ou Firefox na versão mais recente.
- Banco de Dados MongoDB

## Recursos

- Três botões adicionais para controle de fila de impressão.
- Exclusão de cartões fila
- Impressão de até quatro cartões na mesma folha
- Fila de impressão implementada em localStorage
- Página de impressão com listagem de todos os cartões que estão em fila.

### Configuração

Primeiro passo é baixar a extenção Tampermonkey, que será responsável por executar os scripts que farão a comunicação com o servidor local e consequentemente enviarão os dados para o servidor principal salvar no banco de dados offline.

Download no site oficial [Tampermonkey para Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=pt-BR) ou [Tampermonkey para Firefox](https://addons.mozilla.org/pt-BR/firefox/addon/tampermonkey/).

### Instalação e Configuração

##### Userscript
É o código responsável por gerar os botões extras na tela de consulta, controlar fila e tela de impressão. O primeiro passo é instalar o Tampermonkey no seu navegador, após instalado, clique no link abaixo para instalar o userscript no tampermonkey.

**[INSTALAR USERSCRIPT](https://github.com/fellypsantos/cadsusweb/raw/master/src/cadsusweb.user.js)**

##### Instalação do script servidor
Após feito o download da distribuição através do link disponibilizado no início deste documento, abra o arquivo **dist.zip** e extraia seu conteúdo para uma pasta de sua preferência, eg: C:\cadsusweb\

Abra com algum editor de texto, o arquivo tm_userscript.js localizado na pasta cadsusweb/src/tm_userscript.js copie todo o conteúdo.
Crie um novo script no Tampermonkey e cole o script que acabou de copiar, e salve.
Pronto.
