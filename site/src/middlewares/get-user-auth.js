const utf8 = require('utf8');
const Discord = require('../helpers/discord');
const knex = require('../database/connection');
const { intToHex } = require('../helpers/helpers');

module.exports = async (req, res, next) => {
    res.locals.me = await Discord.getUsersMe(req.cookies.token);

    const query = `
        SELECT
            g.guild_id
            , g.name AS guild_name
            , m.member_id
            , m.username AS member_username
            , m.nick AS member_nick
            , m.discriminator AS member_discriminator
            , m.avatar AS member_avatar
            , r.role_id
            , r.name AS role_name
            , r.position AS role_position
            , r.color AS role_color
        FROM discord_guilds g
        INNER JOIN discord_members m ON (g.guild_id = m.guild_id)
        INNER JOIN discord_member_roles mr ON (g.guild_id = mr.guild_id AND m.member_id = mr.member_id)
        INNER JOIN discord_roles r ON (g.guild_id = r.guild_id AND mr.role_id = r.role_id)
        WHERE g.guild_id = ?
        AND m.member_id = ?
        ORDER BY r.position DESC;
    `;

    const args = [
        process.env.GUILD_ID,
        res.locals.me.id,
    ];

    const userData = (await knex.raw(query, args))[0];

    let user = null;

    if (userData.length) {
        user = {
            member_id: userData[0].member_id,
            username: utf8.decode(userData[0].member_username),
            nick: utf8.decode(userData[0].member_nick),
            discriminator: userData[0].member_discriminator,
            avatar: userData[0].member_avatar,
            isDirector: false,
            isManager: false,
            roles: [],
        };

        user.fullName = user.nick ? user.nick : user.username;

        for (let i in userData) {
            if (userData[i].role_id == process.env.DS_ROLE_DIRETOR) user.isDirector = true;
            if (userData[i].role_id == process.env.DS_ROLE_GERENTE) user.isManager = true;

            const role = {
                role_id: userData[i].role_id,
                name: utf8.decode(userData[i].role_name),
                position: userData[i].role_position,
                color: '#' + intToHex(userData[i].role_color),
            };

            user.roles.push(role);
        }
    }

    res.locals.user = user;

    next();
};
