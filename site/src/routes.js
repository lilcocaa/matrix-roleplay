const express = require('express');
const router = express.Router();

router.get('/', require('./controllers/home'));
router.get('/regras', require('./controllers/rules'));
router.get('/hierarquia', require('./controllers/hierarchy'));
router.get('/hierarquia-graficos', require('./controllers/hierarchy-graphics'));
router.all('/webhook', require('./controllers/webhook'));
router.get('/site', (req, res) => {
    res.redirect('/');
});

module.exports = router;
