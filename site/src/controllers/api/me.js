module.exports = async (req, res) => {
    try {
        res.json({
            user: res.locals.user,
        });
    } catch (err) {
        const ret = require('../../helpers/error-handler')(err, req.ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};
