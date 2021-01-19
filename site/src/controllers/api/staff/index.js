const express = require('express');
const router = express.Router();

const getStaffMiddleware = require('../../../middlewares/api/staff/get-staff');

router.get('/', require('./list'));
router.get('/:member_id', getStaffMiddleware, require('./show'));
router.get('/:member_id/expedients', getStaffMiddleware, require('./expedients'));
router.get('/:member_id/roles', getStaffMiddleware, require('./roles'));

module.exports = router;
