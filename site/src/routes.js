const express = require('express');
const router = express.Router();

router.get('/', require('./controllers/home'));
router.get('/regras', require('./controllers/rules'));
router.get('/site', (req, res) => {
    res.redirect('/');
});

module.exports = router;
