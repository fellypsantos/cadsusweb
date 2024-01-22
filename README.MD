# CADSUSWEB - Aprimoramentos

![bg-graphics-header](https://github.com/fellypsantos/cadsusweb/assets/11094932/1caccdf0-27e6-4a7c-94ab-5305def8ccf3)

Este projeto NodeJS foi desenvolvido para criar um servidor local que gerencia operações CRUD (Create, Read, Update, Delete) de dados, utilizando um banco de dados MongoDB para armazenamento offline dos Cartões do SUS emitidos na nossa Secretaria Municipal de Saúde. Além disso, inclui um userscript para instalação na extensão Tampermonkey.

<!-- ![server-running](https://github.com/fellypsantos/cadsusweb/assets/11094932/c8b2f6e2-a2a4-4d8b-a081-f1498eb007b8) -->

![server-running](https://github.com/fellypsantos/cadsusweb/assets/11094932/e906f93d-d779-4ad4-8772-aea9533c62ef)

## Objetivo

O projeto foi concebido para atender à demanda por segundas vias de cartões, mesmo em situações de internet instável ou offline. A solução proposta envolve a criação de um cache local para armazenar os dados dos cartões, permitindo a emissão de segundas vias sem acesso à internet, contanto que os dados já tenham sido previamente salvos no banco local.

Além disso, o projeto aborda o desperdício de papel ao possibilitar a impressão de múltiplos cartões em uma única folha, otimizando o processo e reduzindo a quantidade de papel utilizada.

## Recursos

- Três botões adicionais para controle de fila de impressão.
- Exclusão de cartões fila.
- Impressão de até quatro cartões na mesma folha.
- Fila de impressão implementada em localStorage.
- Página de impressão com listagem de todos os cartões que estão em fila.

![multi-card-print](https://github.com/fellypsantos/cadsusweb/assets/11094932/6b0b2a5c-fd8d-46f8-88aa-d75c06db58ea)

## Pré Requisitos

Certifique-se de ter as seguintes dependências instaladas:

- [NodeJS](https://nodejs.org/) v16.20.1 ou superior.
- Extensão [Tampermonkey](https://www.tampermonkey.net/) instalada no navegador.

## Banco de Dados MongoDB

### Instalação

1. Instale o MongoDB Server em uma máquina principal.
2. (Opcional) Instale o MongoDB Compass para gerenciar os dados no banco.

### Configurações na LAN

Para acessar o banco em rede local:

- Libere o acesso no firewall do Windows, criando uma regra de entrada para o programa `mongod.exe` e permitindo acesso à porta `27017`.
- Modifique o arquivo de configurações do MongoDB em `C:\Program Files\MongoDB\Server\[VERSAO]\bin\mongod.cfg`:

```yaml
#network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0 # modifique aqui
```

- Reinicie o serviço do MongoDB pelos serviços do Windows.

## Instalação

1. Na pasta do projeto, modifique o arquivo `mongodb.ini`, ajustando a propriedade `SERVER_IP` nas outras máquinas em rede para conter o IP da máquina principal que contém o MongoDB Server.
2. Na máquina principal, não é necessário modificar a configuração de IP do servidor.
3. Execute o arquivo `SERVER.bat`.
4. Três endereços serão exibidos no terminal:
   - O primeiro mostra o IP usado para conectar ao MongoDB Server.
   - O segundo é o endereço para instalar o userscript no Tampermonkey.
   - O terceiro abre a página de pesquisa para buscar cartões no banco offline.
5. O console acompanha um pequeno menú acessível através dos respectivos números.
6. Por exemplo, pressione o número `2` para abrir a página de instalação o script.
7. Pronto, tudo deve estar funcionando corretamente. Agora você pode utilizar o sistema CRUD e visualizar os dados no MongoDB Compass, se instalado.

## Resumo dos Desafios Técnicos

O projeto enfrentou desafios técnicos significativos, abordados em diferentes etapas.

#### Persistência de Dados

A escolha do MongoDB para armazenamento local de dados foi baseada em sua simplicidade de instalação e uso. O desafio subsequente foi integrar os dados pesquisados no site CadSusWeb ao banco local. A solução envolveu a criação de scripts usando a extensão Tampermonkey para manipular conexões e elementos na página, permitindo a transferência dos dados para o banco MongoDB.

#### Conexão do Site com o Banco Local

A abordagem adotada foi a utilização da extensão Tampermonkey para injetar scripts nas páginas do site durante o carregamento. Isso permitiu a manipulação de conexões e elementos na tela, recriando janelas modais, adicionando botões e interceptando os dados de pesquisa para salvá-los no banco local. Essa abordagem manteve a identidade visual do CadSUS.

#### Servidor Local

Para facilitar a integração com o MongoDB, foi escolhido `Node.js` com `Express` para criar um servidor local. Esse servidor atuou como intermediário entre o script Tampermonkey e o banco de dados, gerenciando solicitações do CadSUS, verificando a existência de pacientes, salvando novos pacientes localmente e fornecendo acesso ao userscript.

#### Limitações

Por questões de segurança, o script Tampermonkey enfrentou limitações ao realizar requisições HTTP para endereços IP e não HTTPS. Isso exigiu que o servidor Node.js fosse executado em todas as máquinas, já que o script só conseguia fazer requisições para o localhost. A ideia inicial de centralizar o banco de dados e o servidor em um computador principal foi inviabilizada, resultando na necessidade de ter o servidor Node em todas as máquinas para contornar as limitações de segurança.

![syste-architecture ](https://github.com/fellypsantos/cadsusweb/assets/11094932/79af7814-ad81-4e82-aae8-5ed9b095929e)
