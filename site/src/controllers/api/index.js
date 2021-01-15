const express = require('express');
const router = express.Router();

router.use(require('../../middlewares/api-check-token'));
router.use(require('../../middlewares/get-user-auth'));
router.use(require('../../middlewares/api-check-user-auth'));

router.get('/', require('./home'));
router.get('/me', require('./me'));
router.get('/staff', require('./staff/list'));

router.use(require('../../middlewares/api-error-404'));
router.use(require('../../middlewares/api-error-500'));

module.exports = router;
