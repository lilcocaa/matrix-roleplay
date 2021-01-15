module.exports = async (req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = req.get('host');
    res.locals.protocol = req.protocol;

    const menu = [];

    // Home
    menu.push({
        label: 'Home',
        icon: 'fa fa-home',
        path: '/app',
        selected: res.locals.url == '/app',
    });

    // Staff
    menu.push({
        label: 'Staff',
        icon: 'fa fa-users',
        path: '/app/staff',
        selected: res.locals.url == '/app/staff',
    });

    res.locals.menu = menu;

    next();
};