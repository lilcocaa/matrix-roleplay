module.exports = async (req, res) => {
    res.json({
        user: res.locals.user,
    });
};
