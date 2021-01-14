const express = require('express');
const router = express.Router();

router.get('/login', require('./login'));

router.use(require('../../middlewares/app-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/app-check-user-auth'));

router.get('/', require('./home'));
router.get('/logout', require('./logout'));

module.exports = router;
