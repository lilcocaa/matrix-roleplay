const axios = require('axios');
const knex = require('../../database/connection');
const Discord = require('../../helpers/discord');

module.exports = async (req, res) => {
    const ret = req.ret;

    if (!req.query.code) {
        return res.send('Falta code');
    }

    try {
        const token = await Discord.postOauth2Token(req.query.code);
        const me = await Discord.getUsersMe(token);

        await knex('discord_api_token')
            .insert({
                guild_id: process.env.GUILD_ID,
                member_id: me.id,
                token: JSON.stringify(token),
            });

        res.cookie('token', token);

        return res.redirect('/app');
    } catch (error) {
        ret.setCode(500);
        ret.setError(true);
        ret.addContent('error', error);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
