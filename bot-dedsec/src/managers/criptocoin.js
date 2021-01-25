const { MessageEmbed } = require('discord.js');
const { getMessageVars } = require('../managers/discord');
const number_format = require('../helpers/number-format');
const knex = require('../database/connection');

function commandError(message, error) {
    const {
        isBot,
        isDm,
        isTextChannel,
        isCommand,
        author,
        member,
        channel,
        guild,
        messageContent,
        messageMentions,
        messageCommand,
        messageArgs,
    } = getMessageVars(message);

    const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN);
    const msg = [
        `<@${author.id}>, você informou o comando errado.`,
        ``,
        error,
        ``,
        `Você precisa inserir o comando \`!comprar\` seguido da quantidade que deseja, sempre incrementando de 0,5 em 0,5. Por exemplo: `,
        ``,
        `\`!comprar 0,5\`, ou \`!comprar 1,0\`, ou \`!comprar 1,5\`, ou \`!comprar 2,0\`, e por assim vai.`,
    ];

    const response = new MessageEmbed()
        .setTitle('Comprar Moeda - Erro')
        .setColor(0xff0000)
        .setDescription(msg.join('\n'));

    ch.send(response);
    return;
}

async function displayValues(message) {
    const {
        author,
    } = getMessageVars(message);

    const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN);

    const query = `
        SELECT coin_id, name, buy, sell
        FROM discord_coins
        WHERE guild_id = ?
        AND base != 1
        ORDER BY name;
    `;

    const args = [
        process.env.GUILD_ID,
    ];

    const data = (await knex.raw(query, args))[0];

    if (!data.length) {
        message.reply('não temos nenhuma moeda ativa no momento.');
        return;
    }

    const msg = [
        `<@${author.id}>, essas são as moedas ativas.`,
        ``,
    ];

    for (let i in data) {
        msg.push(`${parseInt(i) + 1}. **${data[i].name}**: $ ${number_format(data[i].buy, 0, ',', '.')}`);
    }

    const response = new MessageEmbed()
        .setTitle('Criptomoedas')
        .setColor(0x0000ff)
        .setDescription(msg.join('\n'));

    ch.send(response);
    return;
}

async function buy(message) {
    const {
        messageArgs,
    } = getMessageVars(message);

    const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN);

    if (messageArgs.length != 1) {
        commandError(message, `Verifique a quantidade de argumentos do comando.`);
        return;
    }

    const value = messageArgs[0];
    const valueCleared = messageArgs[0].replace(',', '.');
    const valueNumber = parseFloat(valueCleared);

    if (valueCleared != valueNumber) {
        commandError(message, `Parece que a quantidade não é um numero válido (${params.value}).`);
        return;
    }

    const valueMod = valueNumber % 0.5;

    if (valueMod) {
        commandError(message, `Parece que a quantidade não segue o incremento de 0,5 em 0,5 (${value}).`);
        return;
    }

    return;

}

module.exports = {
    displayValues,
    buy,
};
