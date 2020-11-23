
<h1 align="center">
<img src="public/assets/logo.png"/>
<br>
<br>
<img src="public/assets/chef.png" alt="FOODFY LOGO" width="200">

<br>  
<br>
Desafio final do Launchbase!
</h1>

<p align="center">#Projeto Fullstack desenvolvido como critério de aprovação para o bootcamp Launchbase, da <a href="https://rocketseat.com.br/">Rocketseat </a>.</p>

<hr />

<h2> <img src= "https://img.icons8.com/plasticine/2x/rocket.png" width="50px" height="50px" align="center"/> Projeto </h2>



<p> Foodfy é uma aplicação web de receitas criada usando:</p>

- [Node.js](https://nodejs.org/en/) 
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Lottie](https://github.com/airbnb/lottie-web)
  
<h2> <img src="https://i.dlpng.com/static/png/6577858_preview.png" width="50px" align="center"/> Como utilizar: </h2>
   

<h4> Ferramentas necessárias para rodar o projeto com sucesso:</h4>
Node.js / PostgreSQL / Postbird / IDE (recomendação: Visual Studio Code) 

<br>
<br>

<h3>Passos</h3>
1. Clone o projeto

```bash
git clone https://github.com/viictorcamposs/Foodfy
```
2. Instale as dependências

```bash
npm install ou yarn install
```


3. Crie o banco de dados na sua máquina rodando a linha a seguir no Postbird

```bash
CREATE DATABASE foodfy
```

4. Copie o conteúdo descomentado do arquivo database.sql (Foodfy/database.sql) e rode no postbird para criar as tabelas e relacionamentos necessários

5. Para o funcionamento do projeto você precisa fazer 2 alterações em arquivos
```bash
Importante!

no arquivo db.js da pasta config (Foodfy/src/config/db.js) altere os valores de user e password com a autenticação do postgres da sua maquina

no arquivo mailer.js da pasta lib (Foodfy/src/lib/mailer.js) altere os valores de user e pass com a autenticação do seu mailtrap
``` 

6. No seu terminal, dentro da pasta Foodfy, rode o arquivo seeds para criar receitas e chefs falsos

```bash
node seeds.js
```

7. Rode o servidor 

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
 