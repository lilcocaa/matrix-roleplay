module.exports = async (req, res) => {
    res.send(`<h1>Login</h1> <p><a href="${process.env.CLIENT_LOGIN_URI}">Login aqui</a></p>`);
};
