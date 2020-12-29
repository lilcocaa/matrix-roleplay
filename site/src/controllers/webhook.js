const knex = require('../database/connection');

module.exports = async function (req, res) {
    const { query, body } = req;

    const insertedRow = await knex('discord_webhook').insert({
        query: JSON.stringify(query),
        body: JSON.stringify(body),
    });

    res.json({
        query,
        body,
        insertedRow,
    });
};
