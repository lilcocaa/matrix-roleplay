const express = require('express');
const router = express.Router();

router.get('/', require('./controllers/home'));
router.get('/regras', require('./controllers/rules'));

module.exports = router;
