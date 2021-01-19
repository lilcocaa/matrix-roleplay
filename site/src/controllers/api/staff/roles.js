const knex = require('../../../database/connection');
const utf8 = require('utf8');
const { intToHex } = require('../../../helpers/helpers');

module.exports = async (req, res) => {
    try {
        const { member_id } = req.params;

        const ret = req.ret;

        const query = `
            SELECT r.role_id, r.position, r.name, r.color
            FROM discord_member_roles mr
            INNER JOIN discord_roles r ON (mr.guild_id = r.guild_id AND mr.role_id = r.role_id)
            WHERE mr.guild_id = ?
            AND mr.member_id = ?
            ORDER BY r.position DESC
        `;

        const args = [
            process.env.GUILD_ID,
            member_id,
        ];

        let roles = ((await knex.raw(query, args))[0])
            .map(role => {
                return {
                    "id": role.role_id,
                    "position": parseInt(role.position),
                    "name": utf8.decode(role.name),
                    "color": '#' + intToHex(parseInt(role.color)),
                };
            });

        ret.addContent('roles', roles);

        return res.status(ret.getCode()).json(ret.generate());
    } catch (err) {
        const ret = require('../../../helpers/error-handler')(err, req.ret);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
