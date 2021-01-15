module.exports = async (req, res) => {
    try {
        res.json({
            status: 'ok',
        });
    } catch (err) {
        const ret = require('../../helpers/error-handler')(err, req.ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};
