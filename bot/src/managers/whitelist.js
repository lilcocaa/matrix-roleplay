const knex = require('../database/connection');
const { getMessageVars, sendMessage } = require('./discord');
const { MessageEmbed } = require('discord.js');

function log(message, title, msg, color) {
    const channelLog = message.guild.channels.cache.get(process.env.DS_CHANNEL_WHITELIST_LOG)
    if (channelLog) {
        const sendedMessage = new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(msg.join('\n'));

        channelLog.send(sendedMessage);
    }
}

async function releaseWhitelist(message) {
    const {
        author,
        messageArgs,
    } = getMessageVars(message);

    // quantidade errada de argumentos
    if (messageArgs.length != 1) {
        log(message, 'WL Inválida', [
            `O usuário informou o comando sem o ID.`,
            '',
            `Usuário: ${author}`,
        ], 0xff0000);

        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que você não informou o comando correto.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    const playerId = messageArgs[0];
    const playerIdInt = parseInt(playerId);

    // se for um ID inválido
    if (playerId != playerIdInt) {
        log(message, 'WL Inválida', [
            `O usuário informou um ID inválido.`,
            '',
            `Usuário: ${author}`,
            `ID: ${playerId}`,
        ], 0xff0000);

        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que o ID "${playerId}" é inválido.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    // busco no banco o ID da player
    const player = await knex('vrp_users')
        .where('vrp_users.id', playerId)
        .select('id', 'whitelisted')
        .first();

    // se o ID não existir
    if (!player) {
        log(message, 'WL Inválida', [
            `O usuário informou um ID de um usuário que não existe no jogo.`,
            '',
            `Usuário: ${author}`,
            `ID: ${playerId}`,
        ], 0xff0000);

        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que o ID "${playerId}" não foi encontrado.`,
            `Verifique se o ID está correto. Precisa ser o ID que aparece na tela do FIVEM quando você se conecta.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    // inserimos ou editamos a whitelist do usuario
    const whitelistExists = await knex('discord_whitelist')
        .where('deleted_at', null)
        .where('player_id', player.id)
        .where('guild_id', process.env.DS_GUILD)
        .select('member_id', 'player_id', 'finished_at')
        .first();

    if (whitelistExists) {
        if (whitelistExists.member_id != author.id) {
            log(message, 'WL Inválida', [
                `O usuário informou um ID de um usuário que já tem WL feita, e não é dele.`,
                '',
                `Usuário: ${author}`,
                `ID: ${playerId}`,
            ], 0xff0000);

            const msg = [
                `Olá ${author.username}!`,
                `Recebemos sua Whitelist, porém parece que o ID "${playerId}" já está liberado.`,
                `Verifique se o ID está correto. Precisa ser o ID que aparece na tela do FIVEM quando você se conecta.`,
                `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
                `Por exemplo \`!liberar 123\``,
            ];
            sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
            return;
        }
    }

    // se tudo deu certo, colocamos a role "whitelist" no usuário
    message.member.roles.add(process.env.DS_ROLE_WHITELIST);

    // e adicionamos o ID no nickname dele

    // primeiro decidimos se vamos usar o USERNAME ou o NICKNAME
    const nickname = message.member.nickname || '';
    const username = message.member.user.username || '';
    let newNickname = nickname ? nickname.trim() : username.trim();

    // limpamos qualquer ID que ja tenha no apelido
    const regexp = /(\s?\|\s[0-9]+\s?)+$/g;
    const ids = regexp.exec(newNickname);
    if (ids) {
        const index = ids.index;
        newNickname = newNickname.substr(0, index).trim();
    }

    // monta a string com o ID
    const idString = ` | ${playerId}`;

    // limite de chars do nick
    const nickLimit = 32;

    // reduzo o apelido para caber o ID, caso necessario
    if ((newNickname.length + idString.length) > nickLimit) {
        const exclude = newNickname.length + idString.length - nickLimit;
        newNickname = newNickname.substr(0, newNickname.length - exclude).trim();
    }

    newNickname = `${newNickname}${idString}`;
    message.member.setNickname(newNickname);

    // inserimos ou editamos a whitelist do usuario
    if (!whitelistExists) {
        await knex('discord_whitelist').insert({
            member_id: author.id,
            guild_id: process.env.DS_GUILD,
            player_id: player.id,
            finished_at: knex.fn.now(),
        });
    } else if (!whitelistExists.finished_at) {
        await knex('discord_whitelist')
            .where('deleted_at', null)
            .where('guild_id', process.env.DS_GUILD)
            .where('member_id', author.id)
            .update({
                player_id: player.id,
                finished_at: knex.fn.now(),
            });
    }

    // libero o ID no banco
    await knex('vrp_users')
        .where('vrp_users.id', playerId)
        .update({
            whitelisted: 1,
        });

    // salvo o log da whitelist
    log(message, 'WL Realiada', [
        `Usuário: ${author}`,
        `nick: ${newNickname}`,
        `ID: ${playerId}`,
    ], 0x00ff00);

    // e avisamos o usuário
    const msg = [
        `Olá ${author.username}!`,
        `Recebemos sua Whitelist, e liberamos o ID "${playerId}".`,
        `Agradecemos por você escolher nossa Cidade!!!`,
        `Agora você pode visualizar nossos canais. Aproveite para solicitar um emprego ou fazer alguma sugestão nos canais indicados.`,
        `Esperamos que você se divirta muito! E caso precise, pode chamar alguem da nossa Staff para te ajudar.`,
        // `Temos um grupo exclusivo no Whatsapp. Fique à vontade para entrar nele e conversar com todos os demais jogadores.`,
        `Temos um site onde você pode encontrar os melhores carros, e temos também os Planos VIPS!`,
        `Lembre-se de ler as nossas regras, e respeitar todo mundo, tanto na Cidade quanto no Discord =)`,
        // `Link para o grupo do Whatsapp: https://chat.whatsapp.com/FBUINItGvG62n4Ral6pzaD`,
        `Link para o Site: http://matrixroleplay.com.br/`,
        `Link para as Regras: http://matrixroleplay.com.br/regras`,
    ];
    sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
    return;
}

module.exports = {
    releaseWhitelist,
};