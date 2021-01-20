const knex = require('../database/connection');
const utf8 = require('utf8');
const { number_format } = require('../helpers/helpers');

module.exports = async (req, res) => {

    try {
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
                , m.avatar AS member_avatar
            FROM discord_hierarchy_groups hg
            INNER JOIN discord_hierarchy_squads hs ON (hg.guild_id = hs.guild_id AND hg.group_id = hs.group_id)
            INNER JOIN discord_hierarchy_squad_levels hsl ON (hs.guild_id = hsl.guild_id AND hs.squad_id = hsl.squad_id)
            INNER JOIN discord_hierarchy_levels hl ON (hsl.guild_id = hl.guild_id AND hsl.level_id = hl.level_id)
            LEFT JOIN discord_hierarchy_squad_members hsm ON (hs.guild_id = hsm.guild_id AND hs.squad_id = hsm.squad_id AND hl.level_id = hsm.level_id)
            LEFT JOIN discord_members m ON (hsm.guild_id = m.guild_id AND hsm.member_id = m.member_id)
            WHERE hg.guild_id = ?
            ORDER BY
                hg.order
                , hl.order
                , hs.order
                , m.member_id
            ;
        `;

        const args = [process.env.GUILD_ID];

        const queryData = (await knex.raw(query, args))[0];

        const groups = {};

        for (let i in queryData) {
            const group_id = queryData[i].group_id;
            const squad_id = queryData[i].squad_id;
            const level_id = queryData[i].level_id;
            const member_id = queryData[i].member_id;
            const group_name = queryData[i].group_name;
            const squad_name = queryData[i].squad_name;
            const level_name = queryData[i].level_name;
            const level_salary = queryData[i].level_salary;
            const member_username = utf8.decode(queryData[i].member_username || '');
            const member_nick = utf8.decode(queryData[i].member_nick || '');
            const member_fullname = member_nick ? member_nick : member_username;
            const member_avatar = queryData[i].member_avatar;

            if (typeof groups[group_id] === 'undefined') {
                groups[group_id] = {
                    id: group_id,
                    name: group_name,
                    levels: {},
                    squads: {},
                };
            }

            if (typeof groups[group_id].levels[level_id] === 'undefined') {
                groups[group_id].levels[level_id] = {
                    id: level_id,
                    name: level_name,
                    salary: level_salary,
                    salaryFormatted: number_format(level_salary, 0, ',', '.'),
                };
            }

            if (typeof groups[group_id].squads[squad_id] === 'undefined') {
                groups[group_id].squads[squad_id] = {
                    id: squad_id,
                    name: squad_name,
                    levels: {},
                };
            }

            if (member_id) {
                if (typeof groups[group_id].squads[squad_id].levels[level_id] === 'undefined') {
                    groups[group_id].squads[squad_id].levels[level_id] = {
                        members: {},
                    };
                }

                if (typeof groups[group_id].squads[squad_id].levels[level_id].members[member_id] === 'undefined') {
                    groups[group_id].squads[squad_id].levels[level_id].members[member_id] = {
                        id: member_id,
                        username: member_username,
                        nick: member_nick,
                        fullname: member_fullname,
                        avatar: member_avatar,
                    };
                }
            }
        }

        res.render('hierarchy', {
            groups,
        });

    } catch (error) { }

};
