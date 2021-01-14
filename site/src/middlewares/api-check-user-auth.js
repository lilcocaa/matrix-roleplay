module.exports = async (req, res, next) => {
    if (!res.locals.user) {
        const ret = req.ret;

        ret.setError(true);
        ret.setCode(401);
        ret.addMessage('Usuário não encontrado.');

        return res.status(ret.getCode()).json(ret.generate());
    }

    if (
        !res.locals.user.isDirector
        && !res.locals.user.isManager
    ) {
        const ret = req.ret;

        ret.setError(true);
        ret.setCode(401);
        ret.addMessage('Usuário sem permissão.');

        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
