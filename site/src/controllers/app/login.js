module.exports = async (req, res) => {
    res.render('app/login', {
        layout: false,
        clientLoginUri: process.env.CLIENT_LOGIN_URI,
    });
};
