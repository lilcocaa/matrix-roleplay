module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect('/app/login');
        return;
    }

    next();
};
