const axios = require('axios');
const knex = require('../../database/connection');

const discordApiOauth2Token = async (code) => {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/oauth2/token`;

        const data = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.CLIENT_REDIRECT_URI,
            code: code,
            scope: 'identify email guilds',
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        axios.post(url, data, { headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

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

module.exports = async (req, res) => {
    const ret = req.ret;

    if (!req.query.code) {
        return res.send('Falta code');
    }

    try {
        const token = await discordApiOauth2Token(req.query.code);
        const me = await discordApiUsersMe(token);

        await knex('discord_api_token')
            .insert({
                guild_id: process.env.GUILD_ID,
                member_id: me.id,
                token: JSON.stringify(token),
            });

        res.cookie('token', token);

        // return res.json({
        //     token,
        // });

        return res.redirect('/app');
    } catch (error) {
        ret.setCode(500);
        ret.setError(true);
        ret.addContent('error', error);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
