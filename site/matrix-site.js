console.clear();
require('dotenv-safe').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middlaware de Retorno JSON
app.use(require('./src/middlewares/json-return'));

// Setando o layout do app
app.use('/app', expressLayouts);
app.set('layout', 'app/layout');

// Arquivos de rotas
app.use(require('./src/routes'));

var port = process.env.APP_PORT;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
