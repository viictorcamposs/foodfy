<h1 align="center">
  <img src="public/assets/logo.png"/>
  <br>
<br>
Foodfy
</h1>

<p align="center">
  Plataforma de receitas desenvolvida como critério de aprovação para o bootcamp Launchbase, da 
  <a href="https://rocketseat.com.br/">
    Rocketseat.
  </a>
</p>

<p align="center">
  <img src="public/assets/finalizado.svg" alt="Work's finished!">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

[//]: # (Add your gifs/images here:)
<div>
  <img src="public/assets/gif.gif" alt="demo" height="425">
  <hr />
  <img src="public/assets/gif2.gif" alt="demo" height="425">
</div>

<hr />

## Funcionalidades
[//]: # (Add the features of your project here:)
- Estrutura de autenticação e login de usuários;
- Plataforma para manutenção do site, com opção de criar, editar e excluir receitas, chefs e usuários.
- Site com informações do aplicativo, chefs cadastrados, receitas disponíveis, etc.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/en/) 
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Lottie](https://github.com/airbnb/lottie-web)

## Como usar / instalar projeto:

#### Ferramentas necessárias para rodar o projeto com sucesso:
Node.js / PostgreSQL / Postbird / IDE (recomendação: Visual Studio Code) 

<br>

### Passos
#### 1. Clone o projeto

```bash
git clone https://github.com/viictorcamposs/Foodfy
```
#### 2. Instale as dependências

```bash
npm install ou yarn install
```


#### 3. Crie o banco de dados na sua máquina rodando a linha a seguir no Postbird

```bash
CREATE DATABASE foodfy
```

#### 4. Copie o conteúdo fora dos comentários do arquivo database.sql (Foodfy/database.sql) e rode no seu software de gerenciamento de banco de dados as tabelas e relacionamentos necessários

#### 5. Para o funcionamento do projeto você precisa fazer 2 alterações em arquivos
```bash
Importante!

no arquivo db.js da pasta config (Foodfy/src/config/db.js) altere os valores de user e password com a autenticação do postgres da sua maquina

no arquivo mailer.js da pasta lib (Foodfy/src/lib/mailer.js) altere os valores de user e pass com a autenticação do seu mailtrap
``` 

#### 6. No seu terminal, dentro da pasta Foodfy, rode o arquivo seeds para criar receitas e chefs falsos

```bash
node seeds.js
```

#### 7. Rode o servidor 

```bash
npm start ou yarn start
```

```bash
Importante!
vai ser criado apenas um usuario administrador

email: admin@foodfy.com
senha: 12345

se for excluir alguma receita ou chef, lembre que todos estao utilizando as mesmas imagens da pasta public/images
```


## Licença

Esse projeto está sob licença MIT - veja a página de [LICENÇA](https://opensource.org/licenses/MIT) para mais detalhes.
