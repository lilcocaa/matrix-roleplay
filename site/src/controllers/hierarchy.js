const knex = require('../database/connection');
const utf8 = require('utf8');

async function getSquads() {
    const query = `
    SELECT
        s.squad_id
    , sn.level_id
    , s.name AS 'squad_name'
    , sn.name AS 'level_name'
    , GROUP_CONCAT(CONCAT(m.member_id, ';;', m.nick) SEPARATOR '||') AS 'members'
    FROM discord_squads s
    CROSS JOIN discord_squad_level sn
    LEFT JOIN discord_squad_members sm ON (s.squad_id = sm.squad_id AND sn.level_id = sm.level_id)
    LEFT JOIN discord_members m ON (sm.member_id = m.member_id)
    WHERE s.guild_id = ?
    GROUP BY s.name, sn.level_id
    ORDER BY s.name, sn.level_id;
    `;

    const args = ['765235242600103936'];

    const queryData = (await knex.raw(query, args))[0];

    const { squads, levels } = queryData.reduce((a, c) => {
        const {
            squad_id,
            level_id,
            squad_name,
            level_name,
            members,
        } = c;

        if (typeof a.levels[level_id] === 'undefined') {
            a.levels[level_id] = {
                id: level_id,
                name: level_name,
            };
        }

        if (typeof a.squads[squad_id] === 'undefined') {
            a.squads[squad_id] = {
                id: squad_id,
                name: squad_name,
                levels: {},
            };
        }

        if (typeof a.squads[squad_id].levels[level_id] === 'undefined') {
            a.squads[squad_id].levels[level_id] = {
                id: level_id,
                name: level_name,
                members: [],
            };
        }

        if (members) {
            const membersSplit = members.split('||').map(member => {
                const m = member.split(';;')
                m[1] = utf8.decode(m[1]);
                return m;
            });
            a.squads[squad_id].levels[level_id].members = membersSplit;
        }

        return a;
    }, {
        squads: {},
        levels: {},
    });

    return {
        squads,
        levels,
    };
}

async function getDirectors() {
    const query = `
    SELECT m.member_id, m.nick
    FROM discord_guilds g
    INNER JOIN discord_roles r ON (g.guild_id = r.guild_id AND r.role_id = ?)
    INNER JOIN discord_member_roles mr ON (g.guild_id = mr.guild_id AND r.role_id = mr.role_id)
    INNER JOIN discord_members m ON (g.guild_id = m.guild_id AND mr.member_id = m.member_id)
    WHERE g.guild_id = ?;
    `;

    const args = ['765343048401682442', '765235242600103936'];

    const queryData = (await knex.raw(query, args))[0];

    const members = queryData.reduce((a, c) => {
        const {
            member_id,
            nick
        } = c;

        if (typeof a[member_id] === 'undefined') {
            a[member_id] = {
                id: member_id,
                nick: utf8.decode(nick),
            };
        }

        return a;
    }, {});

    return members;
}

module.exports = async (req, res) => {

    const { squads, levels } = await getSquads();
    const members = await getDirectors();

    res.render('hierarchy', {
        squads,
        levels,
        members,
    });
};
