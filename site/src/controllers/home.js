const htmlencode = require('htmlencode');

module.exports = function (req, res) {
    const categories = require('../database/products').categories.map(category => {
        category.items = category.items.map(item => {
            item.description = item.description
                .split('\n')
                .map(row => {
                    row = row.trim();
                    return row;
                })
                .filter(row => row.length)
                .join(' ');

            item.description = htmlencode.htmlEncode(item.description);
            return item;
        });
        return category;
    });

    const categoriesJson = JSON.stringify(categories);

    res.render('home', {
        categoriesJson,
    });
};
