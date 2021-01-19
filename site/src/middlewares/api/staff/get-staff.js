const knex = require('../../../database/connection');
const utf8 = require('utf8');

module.exports = async (req, res, next) => {
    try {
        const { member_id } = req.params;

        const query = `
            SELECT
                m.guild_id
                , m.member_id
                , m.username
                , m.nick
                , m.discriminator
                , m.avatar
                , s.name AS squad_name
                , IFNULL(sl.name, '') AS level_name
                , IFNULL(sl.salary, '') AS level_salary
            FROM discord_members m
            INNER JOIN discord_member_roles mr ON (m.guild_id = mr.guild_id AND m.member_id = mr.member_id AND mr.role_id = ?)
            LEFT JOIN discord_squad_members sm ON (m.member_id = sm.member_id)
            LEFT JOIN discord_squads s ON (sm.squad_id = s.squad_id)
            LEFT JOIN discord_squad_level sl ON (sm.level_id = sl.level_id)
            WHERE m.guild_id = ?
            AND m.member_id = ?
        `;

        const args = [
            process.env.DS_ROLE_STAFF,
            process.env.GUILD_ID,
            member_id,
        ];

        const staff = ((await knex.raw(query, args))[0]).map(member => {
            member.username = utf8.decode(member.username);
            member.nick = utf8.decode(member.nick);
            return member;
        });

        if (!staff.length) throw new Error();

        req.staff = staff[0];

        next();
    } catch (error) {
        const ret = req.ret;
        ret.setError(true);
        ret.setCode('404');
        ret.addMessage('Staff não encontrado.');
        return res.status(ret.getCode()).json(ret.generate());
    }
};
