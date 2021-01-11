require('dotenv-safe').config({
    allowEmptyValues: true,
});

const axios = require('axios');
const utf8 = require('utf8');

const moment = require('moment-timezone');
moment.locale('pt-br');
moment.tz('America/Sao_Paulo');

const knex = require('./connection');

function displaymessagelog(message) {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${time}]: ${message}`);
}

async function discordApiGuild() {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/guilds/${process.env.GUILD_ID}`;

        const headers = {
            'authorization': `Bot ${process.env.BOT_TOKEN}`,
        };

        axios.get(url, { headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

async function discordApiGuildChannels() {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/guilds/${process.env.GUILD_ID}/channels`;

        const headers = {
            'authorization': `Bot ${process.env.BOT_TOKEN}`,
        };

        axios.get(url, { headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

async function discordApiGuildMembers(after, limit) {
    return new Promise((resolve, reject) => {
        const url = `https://discord.com/api/guilds/${process.env.GUILD_ID}/members`;

        const params = {
            limit,
            after,
        };

        const headers = {
            'authorization': `Bot ${process.env.BOT_TOKEN}`,
        };

        axios.get(url, { params, headers })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

function generateUserAvatar(user) {
    let avatarUrl = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
    if (user.avatar) avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`;

    return avatarUrl;
};

async function init() {
    try {
        displaymessagelog('INICIANDO JOB');

        // ------------------------------

        // const query = `
        //     SELECT token
        //     FROM discord_api_token
        //     WHERE deleted_at IS NULL
        //     AND guild_id = ?
        //     AND member_id = ?
        //     ORDER BY created_at DESC
        //     LIMIT 1;
        // `;

        // const args = [
        //     process.env.GUILD_ID,
        //     process.env.CLIENT_ID,
        // ];

        // const currentToken = (await knex.raw(query, args))[0];

        // if (!currentToken.length) {
        //     throw new Error('Nenhum token encontrado');
        // }

        // const token = JSON.parse(currentToken[0].token);

        // ------------------------------

        displaymessagelog('BUSCANDO DADOS DA GUILDA');

        const guild = await discordApiGuild();

        displaymessagelog(' - INSERINDO DADOS DA GUILDA');

        await knex('discord_guilds')
            .where('guild_id', guild.id)
            .delete();

        await knex('discord_guilds')
            .insert({
                guild_id: guild.id,
                name: guild.name,
            });

        displaymessagelog(' - DADOS INSERIDOS COM SUCESSO');

        // ------------------------------

        displaymessagelog('BUSCANDO DADOS DOS CARGOS');

        const roles = guild.roles;

        const sortedRoles = roles.sort((a, b) => {
            if (a.position < b.position) return 1;
            if (a.position > b.position) return -1;
            return 0;
        });

        const clearedRoles = roles.map(role => {
            return {
                guild_id: process.env.GUILD_ID,
                role_id: role.id,
                name: utf8.encode(role.name),
                permissions: role.permissions,
                position: role.position,
                color: role.color,
            };
        });

        displaymessagelog(' - INSERINDO DADOS DOS CARGOS');

        await knex('discord_roles')
            .where('guild_id', guild.id)
            .delete();

        await knex('discord_roles')
            .insert(clearedRoles);

        displaymessagelog(' - DADOS INSERIDOS COM SUCESSO');

        // ------------------------------

        displaymessagelog('BUSCANDO DADOS DOS CANAIS');

        const channels = await discordApiGuildChannels();

        const clearedChannels = channels.map(channel => {
            return {
                guild_id: process.env.GUILD_ID,
                channel_id: channel.id,
                parent_channel_id: channel.parent_id,
                type: channel.type,
                position: channel.position,
                name: utf8.encode(channel.name),
            };
        });

        displaymessagelog(' - INSERINDO DADOS DOS CANAIS');

        await knex('discord_channels')
            .where('guild_id', process.env.GUILD_ID)
            .delete();

        await knex('discord_channels')
            .insert(clearedChannels);

        displaymessagelog(' - DADOS INSERIDOS COM SUCESSO');

        // ------------------------------

        displaymessagelog('BUSCANDO DADOS DOS MEMBROS');

        const chunckedMembers = [];

        let after = 0;
        let limit = 100;
        let members = [];
        let clearedMembers = [];
        let membersRoles = [];

        do {
            members = await discordApiGuildMembers(after, limit);

            clearedMembers = members.map(member => {
                after = member.user.id;

                if (member.roles.length) {
                    member.roles.map(role_id => {
                        membersRoles.push({
                            guild_id: process.env.GUILD_ID,
                            member_id: member.user.id,
                            role_id,
                        });
                    })
                }

                return {
                    guild_id: process.env.GUILD_ID,
                    member_id: member.user.id,
                    username: utf8.encode(member.user.username),
                    avatar: generateUserAvatar(member.user),
                    discriminator: member.user.discriminator,
                    nick: member.nick ? utf8.encode(member.nick) : '',
                };
            });

            chunckedMembers.push(clearedMembers);
        } while (members.length == limit);

        clearedMembers = chunckedMembers.reduce((a, c) => {
            for (let i in c) {
                a.push(c[i]);
            }
            return a;
        }, []);

        displaymessagelog(' - INSERINDO DADOS DOS MEMBROS');

        await knex('discord_members')
            .where('guild_id', process.env.GUILD_ID)
            .delete();

        await knex('discord_members')
            .insert(clearedMembers);

        displaymessagelog(' - DADOS INSERIDOS COM SUCESSO');

        // ------------------------------

        displaymessagelog('BUSCANDO DADOS DOS CARGOS DOS MEMBROS');

        displaymessagelog(' - INSERINDO DADOS DOS CARGOS DOS MEMBROS');

        await knex('discord_member_roles')
            .where('guild_id', process.env.GUILD_ID)
            .delete();

        await knex('discord_member_roles')
            .insert(membersRoles);

        displaymessagelog(' - DADOS INSERIDOS COM SUCESSO');

        // ------------------------------

        displaymessagelog('FINALIZANDO JOB');
        displaymessagelog('----------');

        process.exit();
    } catch (error) {
        console.log('error', error);
        displaymessagelog(error.message);
    }
}

init();

