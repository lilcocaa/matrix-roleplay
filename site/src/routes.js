const express = require('express');
const router = express.Router();

router.get('/', require('./controllers/home'));
router.get('/layout-novo', require('./controllers/layout-novo'));
router.get('/auth/callback', require('./controllers/auth/callback'));
router.get('/regras', require('./controllers/rules'));
router.get('/hierarquia', require('./controllers/hierarchy'));
router.get('/hierarquia-graficos', require('./controllers/hierarchy-graphics'));
router.all('/webhook', require('./controllers/webhook'));
router.get('/site', (req, res) => {
    res.redirect('/');
});
router.use('/app', require('./controllers/app'));
router.use('/api', require('./controllers/api'));

module.exports = router;
