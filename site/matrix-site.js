console.clear();
require('dotenv-safe').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middlaware de Retorno JSON
app.use(require('./src/middlewares/json-return'));

app.use(require('./src/routes'));

// catch 404 and forward to error handler
app.use(require('./src/middlewares/error-404-middleware'));

// error handler
app.use(require('./src/middlewares/error-500-middleware'));

var port = process.env.APP_PORT;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
