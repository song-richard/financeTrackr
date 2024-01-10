const router = require(‘express’).Router();
const { User, Expense } = require(‘../models’);

router.get('/dashboard', async, (res, req) => {
    try {
        const userData = await User.findByPk(
            req.session.user_id
        );
        const user = userData.get({ plain: true });
        res.render('dashboard', { user });

    } catch (error) {
        res.status(500).json(error)
    }
});