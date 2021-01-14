module.exports = async (req, res, next) => {
    if (!res.locals.user) {
        return res.send('Usuário não encontrado.');
    }

    if (
        !res.locals.user.isDirector
        && !res.locals.user.isManager
    ) {
        return res.send('Usuário sem permissão.');
    }

    next();
};
