const knex = require('../../../database/connection');
const utf8 = require('utf8');
const { intToHex, number_format } = require('../../../helpers/helpers');

module.exports = async (req, res) => {
    try {
        const ret = req.ret;

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
                , GROUP_CONCAT(CONCAT(r.role_id, ';;', r.position, ';;', r.name, ';;', r.color) SEPARATOR '||') AS roles
                , IF (e.entered_at IS NOT NULL, 1, 0) AS  online
                , w.player_id AS id
            FROM discord_hierarchy_groups hg
            INNER JOIN discord_hierarchy_squads hs ON (hg.guild_id = hs.guild_id AND hg.group_id = hs.group_id)
            INNER JOIN discord_hierarchy_squad_levels hsl ON (hs.guild_id = hsl.guild_id AND hs.squad_id = hsl.squad_id)
            INNER JOIN discord_hierarchy_levels hl ON (hsl.guild_id = hl.guild_id AND hsl.level_id = hl.level_id)
            INNER JOIN discord_hierarchy_squad_members hsm ON (hs.guild_id = hsm.guild_id AND hs.squad_id = hsm.squad_id AND hl.level_id = hsm.level_id)
            INNER JOIN discord_members m ON (hsm.guild_id = m.guild_id AND hsm.member_id = m.member_id)
            INNER JOIN discord_member_roles mr ON (m.guild_id = mr.guild_id AND m.member_id = mr.member_id)
            INNER JOIN discord_roles r ON (mr.role_id = r.role_id)
            INNER JOIN discord_whitelist w ON (m.guild_id = w.guild_id AND m.member_id = w.member_id)
            LEFT JOIN discord_expedient e ON (m.guild_id = e.guild_id AND m.member_id = e.member_id AND e.channel_id = ? AND e.left_at IS NULL)
            WHERE hg.guild_id = ?
            GROUP BY m.member_id
            ORDER BY
                hg.order
                , hl.order
                , hs.order
                , m.member_id
            ;
        `;

        const args = [process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO, process.env.GUILD_ID];

        const staffList = ((await knex.raw(query, args))[0]).map(user => {
            user.member_username = utf8.decode(user.member_username);
            user.member_nick = utf8.decode(user.member_nick);
            user.member_fullname = utf8.decode(user.member_fullname);
            user.level_salary_formatted = number_format(user.level_salary, 0, ',', '.');

            user.roles = user.roles.split('||')
                .map(role => {
                    role = role.split(';;');

                    return {
                        "id": role[0],
                        "position": parseInt(role[1]),
                        "name": utf8.decode(role[2]),
                        "color": '#' + intToHex(parseInt(role[3])),
                    };
                })
                .sort((a, b) => {
                    if (a.position > b.position) return -1;
                    if (a.position < b.position) return 1;
                    return 0;
                });

            user.advs = user.roles.filter(role => {
                return role.id == process.env.DS_ROLE_ADV_VERBAL
                    || role.id == process.env.DS_ROLE_ADV_1
                    || role.id == process.env.DS_ROLE_ADV_2
                    || role.id == process.env.DS_ROLE_ADV_3
                    ;
            }).length;

            user.advs_staff = user.roles.filter(role => {
                return role.id == process.env.DS_ROLE_ADV_1_STAFF
                    || role.id == process.env.DS_ROLE_ADV_2_STAFF
                    || role.id == process.env.DS_ROLE_ADV_3_STAFF
                    ;
            }).length;

            return user;
        });

        ret.addContent('staff', staffList);

        res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};
