const express = require('express');
const router = express.Router();

const axios = require('axios');

const discordApiUsersMe = async (token) => {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/users/@me`;

        const headers = {
            'authorization': `${token.token_type} ${token.access_token}`,
        };

        axios.get(url, { headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

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

router.get('/', async (req, res) => {
    console.log('req.cookies.token', req.cookies.token);
    // res.send('/app');

    const me = await discordApiUsersMe(req.cookies.token);
    const meJson = JSON.stringify(me);
    console.log('meJson', meJson);

    res.json({
        me,
        meJson,
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/app');
});

module.exports = router;
