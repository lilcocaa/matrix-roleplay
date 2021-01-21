const express = require('express');
const router = express.Router();

router.get('/', require('./list'));
router.get('/buy', require('./buy'));

module.exports = router;
