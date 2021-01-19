const express = require('express');
const router = express.Router();

router.use(require('../../middlewares/api-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/api-check-user-auth'));

router.get('/', require('./home'));
router.get('/me', require('./me'));

router.use('/staff', require('./staff'));

// Erro 404 da aí
router.use(require('./error-404'));

// Erro 500 da aí
router.use(require('./error-500'));

module.exports = router;
