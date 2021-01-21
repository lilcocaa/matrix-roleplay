const knex = require('../../../database/connection');
const utf8 = require('utf8');
const { intToHex, number_format } = require('../../../helpers/helpers');

async function getMembers() {
    const query = `
        SELECT
            hg.group_id
            , hs.squad_id
            , hl.level_id
            , m.member_id
            , hg.name AS group_name
            , hs.name AS squad_name
            , hl.name AS level_name
            , IFNULL(hl.salary, 0) AS level_salary
            , m.username AS member_username
            , m.nick AS member_nick
            , IFNULL(m.nick, m.username) AS member_fullname
            , m.avatar AS member_avatar
            , GROUP_CONCAT(CONCAT(r.role_id, ';;', r.position, ';;', r.name, ';;', r.color) SEPARATOR '||') AS roles
            , IF (e.entered_at IS NOT NULL, 1, 0) AS  online
            , w.player_id AS id
        FROM discord_hierarchy_groups hg
        INNER JOIN discord_hierarchy_squads hs ON (hg.guild_id = hs.guild_id AND hg.group_id = hs.group_id)
        INNER JOIN discord_hierarchy_squad_levels hsl ON (hs.guild_id = hsl.guild_id AND hs.squad_id = hsl.squad_id)
        INNER JOIN discord_hierarchy_levels hl ON (hsl.guild_id = hl.guild_id AND hsl.level_id = hl.level_id)
        INNER JOIN discord_hierarchy_squad_members hsm ON (hs.guild_id = hsm.guild_id AND hs.squad_id = hsm.squad_id AND hl.level_id = hsm.level_id)
        INNER JOIN discord_members m ON (hsm.guild_id = m.guild_id AND hsm.member_id = m.member_id)
        INNER JOIN discord_member_roles mr ON (m.guild_id = mr.guild_id AND m.member_id = mr.member_id)
        INNER JOIN discord_roles r ON (mr.role_id = r.role_id)
        INNER JOIN discord_whitelist w ON (m.guild_id = w.guild_id AND m.member_id = w.member_id)
        LEFT JOIN discord_expedient e ON (m.guild_id = e.guild_id AND m.member_id = e.member_id AND e.channel_id = ? AND e.left_at IS NULL)
        WHERE hg.guild_id = ?
        GROUP BY m.member_id
        ORDER BY
            hg.order
            , hl.order
            , hs.order
            , m.member_id
        ;
    `;

    const args = [process.env.DS_CHANNEL_ADMINISTRACAO_BATER_PONTO, process.env.GUILD_ID];

    const members = ((await knex.raw(query, args))[0]).map(user => {
        user.member_username = utf8.decode(user.member_username);
        user.member_nick = utf8.decode(user.member_nick);
        user.member_fullname = utf8.decode(user.member_fullname);
        user.level_salary_formatted = number_format(user.level_salary, 0, ',', '.');

        user.roles = user.roles.split('||')
            .map(role => {
                role = role.split(';;');

                return {
                    "id": role[0],
                    "position": parseInt(role[1]),
                    "name": utf8.decode(role[2]),
                    "color": '#' + intToHex(parseInt(role[3])),
                };
            })
            .sort((a, b) => {
                if (a.position > b.position) return -1;
                if (a.position < b.position) return 1;
                return 0;
            });

        user.advs = user.roles.filter(role => {
            return role.id == process.env.DS_ROLE_ADV_VERBAL
                || role.id == process.env.DS_ROLE_ADV_1
                || role.id == process.env.DS_ROLE_ADV_2
                || role.id == process.env.DS_ROLE_ADV_3
                ;
        }).length;

        user.advs_staff = user.roles.filter(role => {
            return role.id == process.env.DS_ROLE_ADV_1_STAFF
                || role.id == process.env.DS_ROLE_ADV_2_STAFF
                || role.id == process.env.DS_ROLE_ADV_3_STAFF
                ;
        }).length;

        return user;
    });

    return members;
}

async function getCoins() {
    const query = `
        SELECT coin_id, name, buy, sell, base, use_base, can_rob, can_vary
        FROM discord_coins
        WHERE guild_id = ?
        ORDER BY name;
    `;

    const args = [process.env.GUILD_ID];

    const coins = ((await knex.raw(query, args))[0]).map(coin => {
        coin.buyFormatted = number_format(coin.buy, 6, ',', '.');
        coin.sellFormatted = number_format(coin.sell, 6, ',', '.');
        return coin;
    });

    return coins;
}

async function getMemberCoins() {
    const query = `
        SELECT
            c.coin_id
            , mc.member_id
            , mc.value
        FROM discord_coins c
        LEFT JOIN discord_member_coins mc ON (c.guild_id = mc.guild_id AND c.coin_id = mc.coin_id)
        WHERE c.guild_id = ?
        ORDER BY c.name, mc.member_id
        ;
    `;

    const args = [process.env.GUILD_ID];

    const memberCoins = ((await knex.raw(query, args))[0]).reduce((a, c) => {
        if (typeof a[c.member_id] === 'undefined') {
            a[c.member_id] = {
                coins: {},
            };
        }

        if (typeof a[c.member_id].coins[c.coin_id] === 'undefined') {
            a[c.member_id].coins[c.coin_id] = {
                value: c.value,
                valueFormatted: number_format(c.value, 6, ',', '.'),
            };
        }

        return a;
    }, {});

    return memberCoins;
}

module.exports = async (req, res) => {
    try {
        const ret = req.ret;

        const members = await getMembers();
        const coins = await getCoins();
        const memberCoins = await getMemberCoins();

        const coinAttr = {};
        for (let i in coins) {
            coinAttr[coins[i].coin_id] = {
                value: 0,
                valueFormatted: '0',
            };
        }

        const staffs = [];
        for (let i in members) {
            const member = members[i];

            member.coins = JSON.parse(JSON.stringify(coinAttr));

            if (memberCoins[member.member_id]) {
                for (let coin_id in memberCoins[member.member_id].coins) {
                    const coin = memberCoins[member.member_id].coins[coin_id];
                    member.coins[coin_id] = JSON.parse(JSON.stringify(coin));
                }
            }

            // delete member.roles;

            staffs.push(member);
        }

        ret.addContent('coins', coins);
        ret.addContent('staffs', staffs);

        res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};
