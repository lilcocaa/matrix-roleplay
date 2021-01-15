const express = require('express');
const router = express.Router();

router.get('/login', require('./login'));

router.use(require('../../middlewares/app-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/app-check-user-auth'));
router.use(require('../../middlewares/app-menu'));

router.get('/', require('./home'));
router.get('/staff', require('./staff/list'));
router.get('/logout', require('./logout'));

router.use(require('./error-404'));
router.use(require('./error-500'));

module.exports = router;
