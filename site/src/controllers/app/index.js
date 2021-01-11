const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.send(`<h1>Login</h1> <p><a href="${process.env.CLIENT_LOGIN_URI}">Login aqui</a></p>`);
});

router.use((req, res, next) => {
    if (!req.cookies.token) {
        res.redirect('/app/login');
        return;
    }

    next();
});

router.get('/', (req, res) => {
    console.log('req.cookies.token', req.cookies.token);
    res.send('/app');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/app');
});

module.exports = router;
