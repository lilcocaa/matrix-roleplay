const express = require('express');
const router = express.Router();

router.use(require('../../middlewares/api-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/api-check-user-auth'));

router.get('/', require('./home'));

module.exports = router;
