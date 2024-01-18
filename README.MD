# CADSUSWEB - Aprimoramentos

Este projeto NodeJS foi desenvolvido para criar um servidor local que gerencia operações CRUD (Create, Read, Update, Delete) de dados, utilizando um banco de dados MongoDB para armazenamento offline dos Cartões do SUS emitidos na nossa Secretaria Municipal de Saúde. Além disso, inclui um userscript para instalação na extensão Tampermonkey.

## Objetivo

O projeto foi concebido para atender à demanda por segundas vias de cartões, mesmo em situações de internet instável ou offline. A solução proposta envolve a criação de um cache local para armazenar os dados dos cartões, permitindo a emissão de segundas vias sem acesso à internet, contanto que os dados já tenham sido previamente salvos no banco local.

Além disso, o projeto aborda o desperdício de papel ao possibilitar a impressão de múltiplos cartões em uma única folha, otimizando o processo e reduzindo a quantidade de papel utilizada.

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

1.  Na pasta do projeto, modifique o arquivo `mongodb.ini`, ajustando a propriedade `SERVER_IP` nas outras máquinas em rede para conter o IP da máquina principal que contém o MongoDB Server.

2.  Na máquina principal, não é necessário modificar a configuração de IP do servidor.

3.  Execute o arquivo `SERVER.bat`.

4.  Dois endereços serão exibidos no terminal:

    - O primeiro mostra o IP usado para conectar ao MongoDB Server.
    - O segundo é o endereço para instalar o userscript no Tampermonkey.

5.  Acesse o segundo endereço no navegador para instalar o script.

6.  Pronto, tudo deve estar funcionando corretamente. Agora você pode utilizar o sistema CRUD e visualizar os dados no MongoDB Compass, se instalado.
