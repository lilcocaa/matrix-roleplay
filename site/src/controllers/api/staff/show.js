module.exports = async (req, res) => {
    try {
        const ret = req.ret;
        const staff = req.staff;

        ret.addContent('staff', staff);

        return res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
