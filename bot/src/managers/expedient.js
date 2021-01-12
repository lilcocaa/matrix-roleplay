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
            , gc.name AS channel_name
            , gm.username AS member_username
            , gm.nick AS member_nickname
            , gm.avatar AS member_avatar
        FROM discord_expedient e
        LEFT JOIN discord_guilds g ON (e.guild_id = g.guild_id)
        LEFT JOIN discord_channels gc ON (e.guild_id = gc.guild_id AND e.channel_id = gc.channel_id)
        LEFT JOIN discord_members gm ON (e.guild_id = gm.guild_id AND e.member_id = gm.member_id)
        WHERE e.deleted_at IS NULL
        AND e.guild_id = ?
        AND e.channel_id = ?
        AND e.left_at IS NULL
        GROUP BY e.member_id;
    `;

    const args = [guild.id, channel.id];

    const expedientActive = (await knex.raw(query, args))[0];

    let msg = null;
    let total = expedientActive.length;
    if (!expedientActive.length) {
        msg = ['Nenhum usuário ativo'];
    } else {
        msg = expedientActive.map(user => {
            return '-> ' + utf8.decode(user.member_nickname ? user.member_nickname : user.member_username);
        });
    }

    sendEmbedMessage(channel, `Usuários ativos (${total})`, msg.join('\n'), 0x202225);
}

module.exports = {
    expedientEnter,
    expedientLeft,
    expedientActive,
};