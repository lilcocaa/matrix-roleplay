const knex = require('../../../database/connection');
const utf8 = require('utf8');
const { number_format } = require('../../../helpers/helpers');

module.exports = async (req, res, next) => {
    try {
        const { member_id } = req.params;

        const query = `
            SELECT
                hg.group_id
                , hs.squad_id
                , hl.level_id
                , m.member_id
                , hg.name AS group_name
                , hs.name AS squad_name
                , hl.name AS level_name
                , IFNULL(hl.salary, 0) AS level_salary
                , m.username AS member_username
                , m.nick AS member_nick
                , IFNULL(m.nick, m.username) AS member_fullname
                , m.avatar AS member_avatar
            FROM discord_hierarchy_groups hg
            INNER JOIN discord_hierarchy_squads hs ON (hg.guild_id = hs.guild_id AND hg.group_id = hs.group_id)
            INNER JOIN discord_hierarchy_squad_levels hsl ON (hs.guild_id = hsl.guild_id AND hs.squad_id = hsl.squad_id)
            INNER JOIN discord_hierarchy_levels hl ON (hsl.guild_id = hl.guild_id AND hsl.level_id = hl.level_id)
            INNER JOIN discord_hierarchy_squad_members hsm ON (hs.guild_id = hsm.guild_id AND hs.squad_id = hsm.squad_id AND hl.level_id = hsm.level_id)
            INNER JOIN discord_members m ON (hsm.guild_id = m.guild_id AND hsm.member_id = m.member_id)
            WHERE hg.guild_id = ?
            AND m.member_id = ?
            GROUP BY m.member_id
            ORDER BY
                hg.order
                , hl.order
                , hs.order
                , m.member_id
            ;
        `;

        const args = [
            process.env.GUILD_ID,
            member_id,
        ];

        const staff = ((await knex.raw(query, args))[0]).map(user => {
            user.member_username = utf8.decode(user.member_username);
            user.member_nick = utf8.decode(user.member_nick);
            user.member_fullname = utf8.decode(user.member_fullname);
            user.level_salary_formatted = number_format(user.level_salary, 0, ',', '.');
            return user;
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
