console.clear();

require('dotenv-safe').config({
    allowEmptyValues: true,
});

const moment = require('moment-timezone');
moment.locale('pt-br');
moment.tz('America/Sao_Paulo');

const { Client } = require('discord.js');
const client = new Client();
const knex = require('./src/database/connection');

const { getMessageVars, sendMessage, sendEmbedMessage, saveMessage, checkCommand } = require('./src/managers/discord');
const { releaseWhitelist } = require('./src/managers/whitelist');
const { showItemsChest, addItemChest, removeItemChest, clearChest } = require('./src/managers/chest');
const { expedientEnter, expedientLeft, expedientActive } = require('./src/managers/expedient');

client.on('ready', async () => {


    // const initialDate = '2021-01-10 11:00:00';
    // const finalDate = '2021-01-10 13:00:00';
    // const increment = [10, 'minutes'];

    // let initialMoment = moment(new Date(initialDate));
    // let finalMoment = moment(new Date(finalDate));

    // const columns = [];
    // const columnsSum = [];
    // do {
    //     let a = initialMoment;
    //     let b = moment(a).add(increment[0], increment[1]).subtract(1, 'seconds');
    //     if (moment(b).isAfter(finalMoment)) b = moment(finalMoment);

    //     let column = 'column_' + a.format('YYYYMMDD_HHmmss') + '_' + b.format('YYYYMMDD_HHmmss');

    //     a = a.format('YYYY-MM-DD HH:mm:00');
    //     b = b.format('YYYY-MM-DD HH:mm:59');

    //     columns.push(`COUNT(DISTINCT(IF (left_at >= '${a}' AND entered_at <= '${b}', member_id, NULL))) AS ${column}`);
    //     columnsSum.push(`SUM(${column}) AS ${column}_sum`);

    //     initialMoment.add(increment[0], increment[1]);

    // } while (!moment(initialMoment).isAfter(finalMoment));

    // const query = `
    //     SELECT
    //         guild_id,
    //         channel_id,
    //         ${columnsSum.join(', ')}
    //     FROM (

    //         SELECT
    //             guild_id,
    //             channel_id,
    //             member_id,
    //             COUNT(1) AS total,
    //             ${columns.join(', ')}
    //         FROM discord_expedient
    //         WHERE deleted_at IS NULL

    //         # AND guild_id = '765235242600103936'
    //         # AND channel_id = '780243556509286430'

    //         AND left_at >= '${initialDate}'
    //         AND entered_at <= '${finalDate}'

    //         GROUP BY guild_id, channel_id, member_id
    //         ORDER BY entered_at

    //     ) AS T
    //     GROUP BY guild_id, channel_id
    //     ;
    // `;
    // // console.log('query', query);

    // const test = (await knex.raw(query))[0];

    // console.log('test', test);
    // console.log(`----------------------`);




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
                    `Ol??! Seja bem vindo ao nosso servidor.`,
                    `Por enquanto nossa whitelist est?? bem simplificada, ent??o precisaremos apenas de seu ID de Jogador, que aparece no FIVEM no momento que voc?? tenta se conectar.`,
                    `Quando estiver com este ID em m??os, basta mandar aqui neste canal a mensagem \`!liberar <id>\`.`,
                    `Por exemplo \`!liberar 123\``,
                ];
                sendMessage(message.channel, '', msg.join('\n\n'), 0x00ff00);
            }, 2000);
        }

        return;
    }

    if (channel.id == process.env.DS_CHANNEL_WHITELIST) {
        if (checkCommand(message, 'WHITELIST_RELEASE')) {
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
            '`!bau-ajuda` = Lista todos os comandos de ba??.',

            '`!bau` = Lista todos os itens do ba??.',

            '`!bau-adicionar` = Adiciona item no ba??. Deve inserir a quantidade antes do nome do item. Pode informar mais de um item, separando por "virgula" ou "ponto e virgula"',

            '`!bau-remover` = Remove item do ba??. Deve inserir a quantidade antes do nome do item. Pode informar mais de um item, separando por "virgula" ou "ponto e virgula"',

            '`!bau-limpar` = Remove TODOS os itens do ba??!',
        ];

        sendEmbedMessage(channel, 'COMANDOS DE BA??', msg.join('\n\n'), 0x202225);

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

    if (
        channel.id == process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO
        || channel.id == process.env.DS_CHANNEL_BOT_CONFIG
    ) {
        if (checkCommand(message, 'EXPEDIENT_ENTER')) {
            console.log('=> COMMAND: !entrar');
            console.log('-----------------------');

            expedientEnter(message);
        }

        if (checkCommand(message, 'EXPEDIENT_EXIT')) {
            console.log('=> COMMAND: !sair');
            console.log('-----------------------');

            expedientLeft(message);
        }

        if (checkCommand(message, 'EXPEDIENT_ACTIVE')) {
            console.log('=> COMMAND: !ativos');
            console.log('-----------------------');

            expedientActive(message);
        }
    }

    if (
        channel.id == process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO
    ) {
        message.delete();
        return;
    }

});

client.login(process.env.BOT_TOKEN);
