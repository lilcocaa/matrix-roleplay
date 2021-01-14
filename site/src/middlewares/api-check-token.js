module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        const ret = req.ret;

        ret.setError(true);
        ret.setCode(401);
        ret.addMessage('Usuário não encontrado.');

        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
