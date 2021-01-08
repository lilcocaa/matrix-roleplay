const knex = require('../database/connection');
const { getMessageVars, sendMessage, sendEmbedMessage } = require('./discord');

function generateItens(content) {
    const errors = [];
    const items = content
        .trim()
        .replace(/,/g, ';')
        .split(';')
        .map(item => item.trim())
        .filter(item => item.length)
        .map(item => {
            var check = item.match(/^([\d]+)\s(.*)$/i)

            if (!check) {
                errors.push(item);
                return 'erro';
            }

            return [parseInt(check[1]), check[2]];
        })
        .filter(item => item.length);

    return { items, errors };
}

async function getChannelContent(guild, channel) {
    const dbContent = await knex('discord_chest')
        .where('guild_id', guild.id)
        .where('channel_id', channel.id)
        .select('content')
        .first();

    if (!dbContent) {
        await knex('discord_chest')
            .insert({
                guild_id: guild.id,
                channel_id: channel.id,
                content: '{}',
            });
    }

    const channelContent = dbContent ? JSON.parse(dbContent.content) : {};

    return channelContent;
}

async function saveChannelContent(guild, channel, channelContent) {
    await knex('discord_chest')
        .where('guild_id', guild.id)
        .where('channel_id', channel.id)
        .update({
            content: JSON.stringify(channelContent),
        });
}

function addChannelContent(channelContent, items) {
    const obj = JSON.parse(JSON.stringify(channelContent));

    for (let i in items) {
        const item = items[i];

        if (typeof obj[item[1]] == 'undefined') obj[item[1]] = item[0];
        else obj[item[1]] += item[0];
    }

    return obj;
}

function removeChannelContent(channelContent, items) {
    const obj = JSON.parse(JSON.stringify(channelContent));

    for (let i in items) {
        const item = items[i];

        if (typeof obj[item[1]] !== 'undefined') {
            obj[item[1]] -= item[0];

            if (obj[item[1]] <= 0) delete obj[item[1]];
        }
    }

    return obj;
}

function convertChannelContentToArray(channelContent) {
    const list = [];

    for (let i in channelContent) {
        list.push({
            description: i,
            amount: channelContent[i],
        });
    }

    list.sort((a, b) => {
        if (a.description > b.description) return 1;
        if (a.description < b.description) return -1;
        return 0;
    });

    return list;
}

function convertChannelContentToObj(channelContentArray) {
    const obj = {};

    for (let i in channelContentArray) {
        obj[channelContentArray[i].description] = channelContentArray[i].amount;
    }

    return obj;
}

async function showItemsChest(message, channelContentArray) {
    const {
        channel,
        guild,
    } = getMessageVars(message);

    if (typeof channelContentArray == 'undefined') {
        const channelContent = await getChannelContent(guild, channel);
        channelContentArray = convertChannelContentToArray(channelContent);
    }

    const msg = [
        `BAÚ`,
        channelContentArray.length ? channelContentArray.map(item => `- ${item.description}: **${item.amount}**`).join('\n') : `**Baú Vazio**`,
    ];

    sendEmbedMessage(channel, '', msg.join('\n\n'), 0x0000ff);
}

async function addItemChest(message) {
    const {
        channel,
        guild,
        messageContent,
        messageArgs,
    } = getMessageVars(message);

    const { items, errors } = generateItens(messageArgs.join(' '));

    if (!items.length) {
        const msg = [
            `Informe pelo menos um item para adicionar`,
            `Ex.: \`!bau-adicionar 1 Colete\``,
        ];
        sendEmbedMessage(channel, 'Comando Incorreto!', msg.join('\n\n'), 0xff0000);
        return;
    }

    if (errors.length) {
        const msg = [
            errors.length == 1 ? `O seguinte item está errado:` : `Os seguintes itens estão errados:`,
            errors.map(item => `- ${item}`).join('\n'),
        ];
        sendEmbedMessage(channel, 'Comando Incorreto!', msg.join('\n\n'), 0xff0000);
        return;
    }

    const channelContent = await getChannelContent(guild, channel);
    const mergedChannelContent = addChannelContent(channelContent, items);
    const channelContentArray = convertChannelContentToArray(mergedChannelContent);

    showItemsChest(message, channelContentArray);

    const channelContentObj = convertChannelContentToObj(channelContentArray);
    await saveChannelContent(guild, channel, channelContentObj);
}

async function removeItemChest(message) {
    const {
        channel,
        guild,
        messageArgs,
    } = getMessageVars(message);

    const { items, errors } = generateItens(messageArgs.join(' '));

    if (!items.length) {
        const msg = [
            `Informe pelo menos um item para remover`,
            `Ex.: \`!bau-remover 1 Colete\``,
        ];
        sendEmbedMessage(channel, 'Comando Incorreto!', msg.join('\n\n'), 0xff0000);
        return;
    }

    if (errors.length) {
        const msg = [
            errors.length == 1 ? `O seguinte item está errado:` : `Os seguintes itens estão errados:`,
            errors.map(item => `- ${item}`).join('\n'),
        ];
        sendEmbedMessage(channel, 'Comando Incorreto!', msg.join('\n\n'), 0xff0000);
        return;
    }

    const channelContent = await getChannelContent(guild, channel);
    const mergedChannelContent = removeChannelContent(channelContent, items);
    const channelContentArray = convertChannelContentToArray(mergedChannelContent);

    await showItemsChest(message, channelContentArray);

    const channelContentObj = convertChannelContentToObj(channelContentArray);
    await saveChannelContent(guild, channel, channelContentObj);
}

async function clearChest(message) {
    const {
        channel,
        guild,
    } = getMessageVars(message);

    await saveChannelContent(guild, channel, {});

    const msg = [
        'Baú limpo com sucesso!',
    ];

    sendEmbedMessage(channel, '', msg.join('\n\n'), 0x00ff00);
    await showItemsChest(message);
}

module.exports = {
    showItemsChest,
    addItemChest,
    removeItemChest,
    clearChest,
};
