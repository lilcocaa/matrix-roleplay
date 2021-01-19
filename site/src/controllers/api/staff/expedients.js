const knex = require('../../../database/connection');

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
            SELECT e.expedient_id, e.entered_at, IFNULL(e.left_at, '') AS left_at
            FROM discord_expedient e
            WHERE e.guild_id = ?
            AND e.channel_id = ?
            AND e.member_id = ?
            ORDER BY e.entered_at DESC
        `;

        const args = [
            process.env.GUILD_ID,
            process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO,
            member_id,
        ];

        let expedients = ((await knex.raw(query, args))[0])
            .map(expedient => {
                const diff = dateDiff(
                    expedient.entered_at,
                    expedient.left_at ? expedient.left_at : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                );

                if (expedient.entered_at) expedient.entered_at = moment(expedient.entered_at).format('DD/MM/YYYY HH:mm:ss');
                if (expedient.left_at) expedient.left_at = moment(expedient.left_at).format('DD/MM/YYYY HH:mm:ss');

                return {
                    "id": parseInt(expedient.expedient_id),
                    "entered_at": expedient.entered_at,
                    "left_at": expedient.left_at,
                    "diff": diff,
                };
            });

        ret.addContent('expedients', expedients);

        return res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
