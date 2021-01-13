const moment = require('moment');
moment.locale('pt-br');
moment.tz('America/Sao_Paulo');

const utf8 = require('utf8');

const knex = require('../database/connection');
const { getMessageVars, sendEmbedMessage } = require('./discord');
const { MessageEmbed } = require('discord.js');

function generateUserAvatar(user) {
    let avatarUrl = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
    if (user.avatar) avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`;

    return avatarUrl;
};

function sendMessage(message, type, error, time) {
    const {
        member,
        channel,
    } = getMessageVars(message);

    let formattedTime = moment(new Date(time)).format('LLL');

    const fullUsername = '@' + member.user.username + '#' + member.user.discriminator;
    const memberName = member.nickname ? member.nickname : fullUsername;

    if (error) {
        let msg = '';
        if (type == 'entered') msg = `${memberName} já está em expediente!`
        if (type == 'left') msg = `${memberName} não está em expediente!`

        sendEmbedMessage(channel, '', msg, 0x202225);
    } else {
        const avatarUrl = generateUserAvatar(member.user);

        let title = '';
        let color = '';
        if (type == 'entered') {
            title = `Acabou de entrar.`
            color = 0x00ff00;
        }
        if (type == 'left') {
            title = `Acabou de sair.`
            color = 0xff0000;
        }

        const sendedMessage = new MessageEmbed()
            .setColor(color)
            .setAuthor(memberName, avatarUrl)
            .setTitle(title)
            .setDescription(formattedTime);

        channel.send(sendedMessage);
    }
}

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

async function expedientEnter(message) {
    const {
        member,
        channel,
        guild,
    } = getMessageVars(message);

    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    const expedientActived = await knex('discord_expedient')
        .where('guild_id', guild.id)
        .where('channel_id', channel.id)
        .where('member_id', member.id)
        .whereNull('deleted_at')
        .whereNull('left_at')
        .select('expedient_id', 'entered_at', 'left_at', 'created_at')
        .first();

    if (expedientActived) {
        sendMessage(message, 'entered', true, time);
        return;
    }

    const inserted = await knex('discord_expedient')
        .insert({
            guild_id: guild.id,
            channel_id: channel.id,
            member_id: member.id,
            entered_at: time,
        });

    sendMessage(message, 'entered', false, time);
    return;
}

async function expedientLeft(message) {
    const {
        member,
        channel,
        guild,
    } = getMessageVars(message);

    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    const expedientActived = await knex('discord_expedient')
        .where('guild_id', guild.id)
        .where('channel_id', channel.id)
        .where('member_id', member.id)
        .whereNull('deleted_at')
        .whereNull('left_at')
        .select('expedient_id', 'entered_at', 'left_at', 'created_at')
        .first();

    if (!expedientActived) {
        sendMessage(message, 'left', true, time);
        return;
    }

    const updated = await knex('discord_expedient')
        .where('expedient_id', expedientActived.expedient_id)
        .update({
            left_at: time,
        });

    sendMessage(message, 'left', false, time);
    return;
}

async function expedientActive(message) {
    const {
        member,
        channel,
        guild,
    } = getMessageVars(message);

    const query = `
        SELECT
            e.guild_id
            , e.channel_id
            , e.member_id
            , g.name
            , c.name AS channel_name
            , m.username AS member_username
            , m.nick AS member_nickname
            , e.entered_at
            , GROUP_CONCAT(CONCAT(r.role_id, ';;', r.position, ';;', r.name) SEPARATOR '||') AS roles
        FROM discord_expedient e
        INNER JOIN discord_guilds g ON (e.guild_id = g.guild_id)
        INNER JOIN discord_channels c ON (e.guild_id = c.guild_id AND e.channel_id = c.channel_id)
        INNER JOIN discord_members m ON (e.guild_id = m.guild_id AND e.member_id = m.member_id)
        INNER JOIN discord_member_roles mr ON (m.guild_id = mr.guild_id AND m.member_id = mr.member_id)
        INNER JOIN discord_roles r ON (mr.guild_id = r.guild_id AND mr.role_id = r.role_id)
        WHERE e.deleted_at IS NULL
        AND e.guild_id = ?
        AND e.channel_id = ?
        AND e.left_at IS NULL
        GROUP BY e.member_id;
    `;

    const args = [guild.id, channel.id];

    const expedientActive = ((await knex.raw(query, args))[0]).map(row => {
        row.roles = row.roles
            .split('||')
            .map(role => {
                const r = role.split(';;');
                r[2] = utf8.decode(r[2]);
                return r;
            })
            .sort(function (a, b) {
                if (a[1] > b[1]) return -1;
                if (a[1] < b[1]) return 1;
                return 0;
            });

        row.member_username = utf8.decode(row.member_username);
        row.member_nickname = utf8.decode(row.member_nickname);

        row.role = row.roles.shift();

        return row;
    });

    const sortedUsers = expedientActive.sort(function (a, b) {
        if (a.role[1] > b.role[1]) return -1;
        if (a.role[1] < b.role[1]) return 1;

        if (a.member_nickname > b.member_nickname) return -1;
        if (a.member_nickname < b.member_nickname) return 1;
        return 0;
    });

    let msg = null;
    let total = sortedUsers.length;
    if (!sortedUsers.length) {
        msg = ['Nenhum usuário ativo'];
    } else {
        msg = sortedUsers.map(user => {
            var diff = dateDiff(user.entered_at, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
            console.log('diff', diff);
            return '-> ' + (user.member_nickname ? user.member_nickname : user.member_username) + ' \`há ' + diff + '\`';
        });
    }

    sendEmbedMessage(channel, `Usuários ativos (${total})`, msg.join('\n'), 0x202225);
}

module.exports = {
    expedientEnter,
    expedientLeft,
    expedientActive,
};