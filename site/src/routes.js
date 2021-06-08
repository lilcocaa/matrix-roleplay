const express = require('express');
const router = express.Router();

// Rotas do site
router.get('/', require('./controllers/manutencao'));
// router.get('/', require('./controllers/home'));
// router.get('/layout-novo', require('./controllers/layout-novo'));
// router.get('/auth/callback', require('./controllers/auth/callback'));
// router.get('/regras', require('./controllers/rules'));
// router.get('/hierarquia', require('./controllers/hierarchy'));

// router.get('/hierarquia-graficos', require('./controllers/hierarchy-graphics'));
// router.all('/webhook', require('./controllers/webhook'));
// router.get('/site', (req, res) => {
//     res.redirect('/');
// });

// Rotas do app
router.use('/app', require('./controllers/app'));

// Rotas da api
router.use('/api', require('./controllers/api'));

// Erro 404 do site
router.use(require('./controllers/error-404'));

// Erro 500 do site
router.use(require('./controllers/error-500'));

module.exports = router;
