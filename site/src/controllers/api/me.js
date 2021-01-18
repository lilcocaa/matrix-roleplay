module.exports = (req, res) => {
    res.json({
        user: res.locals.user,
    });
};
