const axios = require('axios');

const discordApiOauth2Token = async (code) => {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/oauth2/token`;
        // console.log('url', url);

        const data = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.CLIENT_REDIRECT_URI,
            code: code,
            scope: 'identify email guilds',
        });
        // console.log('data', data);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        // console.log('headers', headers);

        axios.post(url, data, { headers })
            .then(response => {
                // console.log('then', response.data);
                resolve(response.data);
            })
            .catch(error => {
                // console.log('catch', error.response.data);
                reject(error.response.data);
            });

        // resolve('ok');
    });
};

module.exports = async (req, res) => {
    const ret = req.ret;
    if (!req.query.code) {
        return res.send('Falta code');
    }

    try {
        const token = await discordApiOauth2Token(req.query.code);
        // globalToken = JSON.parse(JSON.stringify(token));

        // return res.json({
        //     token,
        //     // globalToken,
        // });

        res.cookie('token', token);

        return res.redirect('/app');
    } catch (error) {
        ret.setCode(500);
        ret.setError(true);
        ret.addContent('error', error);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
