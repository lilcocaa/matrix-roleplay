const knex = require('../../../database/connection');
const utf8 = require('utf8');
const { intToHex } = require('../../../helpers/helpers');

const moment = require('moment-timezone');
moment.locale('pt-br');
moment.tz('America/Sao_Paulo');

function dateDiff(initialDate, finalDate) {
    if (initialDate > finalDate) {
        var c = initialDate;
        initialDate = finalDate;
        finalDate = c;
    }

    const a = moment(initialDate);
    const b = moment(finalDate);

    let seconds = b.diff(a) / 1000;

    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;

    let days = Math.floor(hours / 24);
    hours -= days * 24;

    const times = [];

    times.push(`${seconds} segundo${seconds != 1 ? 's' : ''}`);

    if (minutes) times.push(`${minutes} minuto${minutes != 1 ? 's' : ''}`);
    if (hours) times.push(`${hours} hora${hours != 1 ? 's' : ''}`);
    if (days) times.push(`${days} dia${days != 1 ? 's' : ''}`);

    let ret = '';

    if (times.length == 1) {
        ret = times.join();
    } else {
        const reversedRet = times.reverse();
        const last = reversedRet.pop();

        ret = reversedRet.join(', ') + ' e ' + last;
    }

    return ret;
}

module.exports = async (req, res) => {
    try {
        const { member_id } = req.params;

        const ret = req.ret;
        const query = `
            SELECT
                mrp.guild_id
                , mrp.member_id
                , mrp.username
                , mrp.nick
                , mrp.player_id
                , mrp.discriminator
                , mrp.avatar
                , r.role_id
                , r.name AS role_name
                , r.color AS role_color
                , GROUP_CONCAT(CONCAT(r2.role_id, ';;', r2.position, ';;', r2.name, ';;', r2.color) SEPARATOR '||') AS roles
                , GROUP_CONCAT(CONCAT(e.expedient_id, ';;', e.entered_at, ';;', IFNULL(e.left_at, '')) SEPARATOR '||') AS expedient
            FROM (

                SELECT
                    m.guild_id
                    , m.member_id
                    , m.username
                    , m.nick
                    , m.discriminator
                    , m.avatar
                    , MAX(r2.position) AS max_position
                    , CAST(TRIM(REVERSE(SUBSTR(REVERSE(m.nick), 1, LOCATE('|', REVERSE(m.nick)) - 1))) AS UNSIGNED) AS player_id
                FROM discord_members m
                INNER JOIN discord_member_roles mr ON (m.guild_id = mr.guild_id AND m.member_id = mr.member_id AND mr.role_id = ?)
                INNER JOIN discord_member_roles mr2 ON (m.guild_id = mr2.guild_id AND m.member_id = mr2.member_id)
                INNER JOIN discord_roles r2 ON (m.guild_id = r2.guild_id AND mr2.role_id = r2.role_id)
                WHERE m.guild_id = ?
                AND m.member_id = ?
                GROUP BY m.member_id

            ) AS mrp
            INNER JOIN discord_roles r ON (mrp.guild_id = r.guild_id AND mrp.max_position = r.position)
            INNER JOIN discord_member_roles mr ON (mrp.guild_id = mr.guild_id AND mrp.member_id = mr.member_id)
            INNER JOIN discord_roles r2 ON (mrp.guild_id = r2.guild_id AND mr.role_id = r2.role_id)
            LEFT JOIN discord_expedient e ON (mrp.guild_id = e.guild_id AND mrp.member_id = e.member_id AND e.channel_id = ?)
            GROUP BY mrp.member_id
            ORDER BY mrp.max_position DESC, mrp.player_id
        `;

        const args = [
            process.env.DS_ROLE_STAFF,
            process.env.GUILD_ID,
            member_id,
            process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO,
        ];

        const staffList = ((await knex.raw(query, args))[0]).map(user => {
            user.username = utf8.decode(user.username);
            user.nick = utf8.decode(user.nick);
            user.role_name = utf8.decode(user.role_name);
            user.role_color = '#' + intToHex(user.role_color);

            delete user.roles;
            // user.roles = user.roles.split('||')
            //     .map(role => {
            //         role = role.split(';;');

            //         return {
            //             "id": role[0],
            //             "position": parseInt(role[1]),
            //             "name": utf8.decode(role[2]),
            //             "color": '#' + intToHex(parseInt(role[3])),
            //         };
            //     })
            //     .sort((a, b) => {
            //         if (a.position > b.position) return -1;
            //         if (a.position < b.position) return 1;
            //         return 0;
            //     });

            user.expedient = user.expedient.split('||')
                .reduce((a, c) => {
                    if (a.indexOf(c) === -1) a.push(c);
                    return a;
                }, [])
                .map(item => {
                    item = item.split(';;');

                    const diff = dateDiff(
                        item[1],
                        item[2] ? item[2] : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    );

                    if (item[1]) item[1] = moment(item[1]).format('DD/MM/YYYY HH:mm:ss');
                    if (item[2]) item[2] = moment(item[2]).format('DD/MM/YYYY HH:mm:ss');

                    return {
                        "id": item[0],
                        "entered_at": item[1],
                        "left_at": item[2],
                        "diff": diff,
                    };
                })
                .sort((a, b) => {
                    if (a.id > b.id) return -1;
                    if (a.id < b.id) return 1;
                    return 0;
                });

            return user;
        });

        ret.addContent('staff', staffList);

        res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};
