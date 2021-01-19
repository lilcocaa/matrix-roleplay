const express = require('express');
const router = express.Router();

router.get('/', require('./list'));
router.get('/:member_id', require('./show'));

module.exports = router;
