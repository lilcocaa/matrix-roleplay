module.exports = (req, res) => {
    const { member_id } = req.params;

    res.render('app/staff/show', {
        member_id,
    });
};
