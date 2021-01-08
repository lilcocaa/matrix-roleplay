console.clear();

require('dotenv-safe').config({
    allowEmptyValues: true,
});

const moment = require('moment');

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const { getMessageVars, sendMessage, sendEmbedMessage, saveMessage, checkCommand } = require('./src/managers/discord');
const { releaseWhitelist } = require('./src/managers/whitelist');
const { showItemsChest, addItemChest, removeItemChest, clearChest } = require('./src/managers/chest');

client.on('ready', async () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');

    console.log(`=> Bot iniciado em ${date}`);
    console.log(` - TAG: ${client.user.tag}`);
    console.log(` - ID: ${client.user.id}`);
    console.log(` - USERNAME: ${client.user.username}`);
    console.log(`----------------------`);
});

client.on('message', async message => {
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

    if (isBot) return;

    if (isDm) return;

    if (guild.id != process.env.DS_GUILD) return;

    // salvar todas as mensagens para log futuro
    if (process.env.ACTION_SAVE_MESSAGE_ACTIVED == 1) {
        saveMessage(message);
    }

    if (checkCommand(message, 'DEBUG')) {
        console.log('=> COMMAND: !debug');
        console.log(' - author:', author.id, author.username);
        console.log(' - channel:', channel.id, channel.name);
        console.log(' - channel parentID:', channel.parentID);
        console.log(' - messageContent:', messageContent);
        console.log(' - isCommand:', isCommand);
        console.log(' - messageCommand:', messageCommand);
        console.log(' - messageArgs:', messageArgs);
        console.log(' - messageMentions:', messageMentions);
        console.log('-----------------------');
        message.delete();
        return;
    }

    if (checkCommand(message, 'JOBS')) {
        console.log('=> COMMAND: !jobs');

        (new Promise((resolve) => {
            let ret = [];

            const size = message.channel.guild.roles.cache.size;
            let count = 0;

            message.channel.guild.roles.cache.map(role => {
                ret.push(role);
                count++;

                if (size == count) return resolve(ret);
            });

        })).then(roles => {
            roles.sort((a, b) => {
                if (a.rawPosition < b.rawPosition) return 1;
                if (a.rawPosition > b.rawPosition) return -1;
                return 0;
            });

            for (let i in roles) {
                const role = roles[i];
                console.log(' -', role.id, role.name);
            }

            console.log('-----------------------');
        });

        message.delete();
        return;
    }

    if (checkCommand(message, 'CLEAR')) {
        console.log('=> COMMAND: !clear');
        console.log('-----------------------');
        fetched = await message.channel.messages.fetch({ limit: 100 });
        message.channel.bulkDelete(fetched);

        if (channel.id == process.env.DS_CHANNEL_WHITELIST) {
            setTimeout(function () {
                const msg = [
                    `Olá! Seja bem vindo ao nosso servidor.`,
                    `Por enquanto nossa whitelist está bem simplificada, então precisaremos apenas de seu ID de Jogador, que aparece no FIVEM no momento que você tenta se conectar.`,
                    `Quando estiver com este ID em mãos, basta mandar aqui neste canal a mensagem \`!liberar <id>\`.`,
                    `Por exemplo \`!liberar 123\``,
                ];
                sendMessage(message.channel, '', msg.join('\n\n'), 0x00ff00);
            }, 2000);
        }

        return;
    }

    if (channel.id == process.env.DS_CHANNEL_WHITELIST) {
        if (checkCommand(message, 'WHITELIST')) {
            console.log('=> COMMAND: !liberar');
            console.log('-----------------------');

            releaseWhitelist(message);
        }

        message.delete();
        return;
    }

    if (checkCommand(message, 'CHEST_HELP')) {
        console.log('=> COMMAND: !bau-ajuda');
        console.log('-----------------------');

        const msg = [
            '`!bau-ajuda` = Lista todos os comandos de baú.',

            '`!bau` = Lista todos os itens do baú.',

            '`!bau-adicionar` = Adiciona item no baú. Deve inserir a quantidade antes do nome do item. Pode informar mais de um item, separando por "virgula" ou "ponto e virgula"',

            '`!bau-remover` = Remove item do baú. Deve inserir a quantidade antes do nome do item. Pode informar mais de um item, separando por "virgula" ou "ponto e virgula"',

            '`!bau-limpar` = Remove TODOS os itens do baú!',
        ];

        sendEmbedMessage(channel, 'COMANDOS DE BAÚ', msg.join('\n\n'), 0x202225);

        // message.delete();

        return;
    }

    if (checkCommand(message, 'CHEST_LIST')) {
        console.log('=> COMMAND: !bau');
        console.log('-----------------------');

        showItemsChest(message);

        // message.delete();

        return;
    }

    if (checkCommand(message, 'CHEST_ADD')) {
        console.log('=> COMMAND: !bau-adicionar');
        console.log('-----------------------');

        addItemChest(message);

        // message.delete();

        return;
    }

    if (checkCommand(message, 'CHEST_REMOVE')) {
        console.log('=> COMMAND: !bau-remover');
        console.log('-----------------------');

        removeItemChest(message);

        // message.delete();

        return;
    }

    if (checkCommand(message, 'CHEST_CLEAR')) {
        console.log('=> COMMAND: !bau-limpar');
        console.log('-----------------------');

        clearChest(message);

        // message.delete();

        return;
    }

    /*
    !bau-ajuda
    !bau-adicionar 1 algema;1 colete balistico;1 combustivel 4500;11907 dinheiro sujo;1 galao de gasolina;4 glock;4 imbel;84 municao de glock;806 municao de imbel;300 municao de mp5;300 municao de uzi;11 paraquedas;4 radio;3 roupa;1 sig sauer
    !bau-adicionar 1 mp5
    !bau-adicionar 200 municao de mp5
    !bau
    */

});

client.login(process.env.BOT_TOKEN);
