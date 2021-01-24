console.clear();

require('dotenv-safe').config({
    allowEmptyValues: true,
});

const moment = require('moment-timezone');
moment.locale('pt-br');
moment.tz('America/Sao_Paulo');

const { Client, MessageAttachment } = require('discord.js');
const client = new Client();
const knex = require('./src/database/connection');

const { getMessageVars, sendMessage, checkCommand } = require('./src/managers/discord');

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

    if (channel.parentID == process.env.DS_CHANNEL_DEDSEC_CATEGORY) {

        if (channel.id == process.env.DS_CHANNEL_DEDSEC_QUEM_SOMOS) {

            if (messageCommand == 'reset') {
                const msg = [
                    `Aqui é papo reto.`,
                    `Somos a <@&${process.env.DS_ROLE_DEDSEC}> . Somos quem comanda. Somos seus novos Deuses, ou como vocês chamam aqui, seus novos **Criadores**.`,
                    `Viemos para reprogramar toda a **Matrix**, e isso será benéfico tanto para nós quanto para vocês.`,
                    `Não acreditem no que dizem sobre nós. Não somos os vilões. Mas também não somos os mocinhos!`,
                    `Fiquem atentos as nossas mensagens na <#${process.env.DS_CHANNEL_DEEPWEB}> .`,
                ];

                const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_QUEM_SOMOS);
                const attachment = new MessageAttachment('./files/DedSec_logo.png');

                await ch.send(attachment);
                await ch.send(msg.join('\n\n'));

            }

        }

        if (channel.id == process.env.DS_CHANNEL_DEDSEC_SERVICOS) {

            if (messageCommand == 'reset') {
                const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_SERVICOS);

                await ch.send([
                    `Isso mesmo! Preparamos umas coisinhas legais para vocês!!!`,
                    `Fazemos alguns serviços em prol de todos da Cidade. Não favorecemos ninguém.`,
                    `Se você tem como nos pagar, nós temos o que vender, simples assim!`,
                ].join('\n\n'));

                await ch.send([
                    `Contratar nossos serviços é facil. Basta você usar a nova moeda do Discord!!!`,
                    `Isso mesmo!!! A unica forma de pagar pelos nossos serviços é com essa nova moera, a ZionCoin. (Veja mais detalhes sobre essa moeda no canal <#${process.env.DS_CHANNEL_DEDSEC_CRIPTOMOEDAS}>)`,
                    `Para contratar nossos serviços, escolha ele na lista abaixo, vá para o canal <#${process.env.DS_CHANNEL_DEDSEC_CONTRATAR}> e use o comado \`!servico\` seguido do codigo do serviço. Por exemplo, \`!servico 4\`.`,
                    `Depois disso, nós iremos entrar em contato com vocês, para concluir a transação e coletar mais detalhes.`,
                ].join('\n\n'));

                await ch.send([
                    '-------------------------------------------------------------------',
                    '```markdown',
                    '# Lista de serviços',
                    '',
                    '1. Descoberta de Dados de Pessoas',
                    '2. Lavagem de dinheiro',
                    '3. Mudanca temporária de nome',
                    '4. Aposta digital /card',
                    '5. Compra de carros Vips por dinheiro de rp (valor alto com carros selecionados)',
                    '6. Cobrança de débitos com juros de 50%',
                    '7. Roubo de paypal',
                    '8. Limpeza de Multas',
                    '9. Tirar pessoas da lista de procurados',
                    '10. Leitura das últimas 10 mensagens em canais privados.',
                    '11. Bloqueio de canais especificos de bases de dados da policia',
                    '12. Setagem de cargos para infiltração',
                    '13. Dar "sustinho" no meliante',
                    '14. Curso de Hacker para Criptomoedas',
                    '```',
                ].join('\n'));

                await ch.send([
                    `> Lembre-se de usar os comandos no canal <#${process.env.DS_CHANNEL_DEDSEC_CONTRATAR}>.`,
                ].join('\n'));

            }
        }

        if (channel.id == process.env.DS_CHANNEL_DEDSEC_CRIPTOMOEDAS) {

            if (messageCommand == 'reset') {
                const ch = message.guild.channels.cache.get(process.env.DS_CHANNEL_DEDSEC_CRIPTOMOEDAS);

                await ch.send([
                    `Bora girar a economia dessa Cidade?`,

                    `Agora existe uma nova moeda no Discord. a **ZionCoin**. Ela é uma criptomoeda desenvolvida prela <#${process.env.DS_ROLE_DEDSEC}> , e que servirá para contratar nossos serviços.`,

                    `Porém ela também tem outras vantagens. Como toda boa criptomoeda, ela tem suas **variações de preço**, ou seja, se você for esperto, poderá enriquecer muito com ela!`,

                    `*"Tá, mas como podemos trabalhar com essa criptomoeda???"*`,

                    `É simples. Agora, aqui no Discord, você terá uma **Carteira Virtual**, onde você pode trazer seu dinheiro da Cidade. Exatamente isso! Você poderá trazer quanto dinheiro da Cidade pra cá, e devolver ele pra cidade, quando você quiser.`,

                    `E com o dinheiro guardardo aqui na **Carteira Virtual**, você poderá fazer a "corretagem" de compra e venda da **ZionCoin**. E para fazer isso, basta ir ao canal <#${process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN}>  e usar os comandos \`!comprar\` e \`!vender\` . Também é possível ver os valores atuais da **ZionCoin** usando o comando \`!valores\`. E também temos o comando \`!carteira\` para ver a sua carteira, ou \`!carteira-top\` para ver a carteira (apenas as **ZionCoins**) dos 10 jogadores mais ricos do Discord. Você também pode transferir **ZionCoins** usando o comando \`!transferir\`, passando a quantidade e marcando a pessoa que vai receber a transferência.`,
                ].join('\n\n'));

                await ch.send([
                    `Também será possivel "minerar" **ZionCoins**. Basta usar o comando \`!minerar\` e uma quantidade aleatória será adicionada a sua carteira.`,

                    `Mas a parte mais legal vem agora. Como todo bom hacker, iremos dar a chance de ver quem realmente é dos nossos. Use o comando \`!roubar\` marcando uma pessoa, para literalmente roubar **ZionCoins** da carteira dele!!!`,

                    `Mas cuidado! Esse comando é uma faca de dois gumes. Pessoas com baixo nível de conhecimento podem falhar na tentativa de roubar, e acabar "dando" moedas ao invés de roubar!!! Sendo mais preciso, todos terão 30% de chance se sucesso (e 70% de chance de falha) ao usar o domando \`!roubar\`. 30% parece pouco, né, porém este comando pode te dar muito mais **ZionCoins** do que o comando \`!minerar\`. E caso vocês queiram aumentar suas chances de sucesso, podem comprar nossos Cursos de Hacker, que venderemos no canal <#${process.env.DS_CHANNEL_DEDSEC_SERVICOS}>.`,
                ].join('\n\n'));

                await ch.send([
                    `-------------------------------------------------------------------`,
                    ``,
                    `Lista de comandos`,
                    ``,
                    `- \`!valores\` - Exibe os valores atuais da **ZionCoin**;`,
                    `- \`!comprar 0.032\` - Compra, por exemplo, 0.032 **ZionCoins**. O valor pode ser alterado;`,
                    `- \`!vender 0.032\` - Vende, por exemplo, 0.032 **ZionCoins**. O valor pode ser alterado;`,
                    `- \`!carteira\` - Exibe sua carteira, com os valores do **Dinheiro Comum** e da **ZionCoin**;`,
                    `- \`!carteira-top\` - Exibe um top 10 dos mais ricos do Discord (apenas da **ZionCoin**);`,
                    `- \`!transferir 0.032 @Hackerzera\` - Transfere 0.032 **ZionCoins** para o usuário **Hackerzera**. Tanto o valor quanto o usuário podem ser alterados;`,
                ].join('\n'));

                await ch.send([
                    `> Lembre-se de utilizar esses comandos no canal <#${process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN}>.`,
                ].join('\n\n'));
            }

        }

        if (channel.id == process.env.DS_CHANNEL_DEDSEC_CONTRATAR) { }

        if (channel.id == process.env.DS_CHANNEL_DEDSEC_BLOCKCHAIN) { }

        if (messageCommand != 'clear') {
            message.delete();
        }

        return;

    }

});

client.login(process.env.BOT_TOKEN);
