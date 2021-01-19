const express = require('express');
const router = express.Router();

router.get('/login', require('./login'));

router.use(require('../../middlewares/app-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/app-check-user-auth'));
router.use(require('../../middlewares/app-menu'));

router.get('/', require('./home'));
router.get('/logout', require('./logout'));

router.use('/staff', require('./staff'));

// Erro 404 do app
router.use(require('./error-404'));

// Erro 500 do app
router.use(require('./error-500'));

module.exports = router;
