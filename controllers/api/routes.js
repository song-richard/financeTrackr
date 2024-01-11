const router = require('express').Router();
const { User, Expense } = require('../../models');
const withAuth = require('../../utils/auth');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }

    res.render('/login');
  });

  router.get('/', (req, res) => {
    res.redirect('/signup');
  })

router.get('/signup', (req, res) => {
    res.render('partials/login');
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Expense }],
      });
  
      if (!userData) {
        res.redirect('/login'); 
        return;
      }
  
      const user = userData.get({ plain: true });
  
      console.log('User Data:', user);
  
      res.render('dashboard', {
        username: user.username,
        expenses: user.expenses,
        isAuthenticated: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const newUser = await User.create({
        username: username,
        password: password,
      });
  
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
  
      res.status(201).json(newUser);
      console.log("New user added successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    };
  });

  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const userData = await User.findOne({
        where: {
          username: req.body.username,
        },
      });
  
      if (!userData) {
        res.redirect('/signup')
        return;
      }
  
      const validatePassword = bcrypt.compareSync(password, userData.password);
  
      if (!validatePassword) {
        return;
      }
  
      console.log('Successfully signed in');
      req.session.user_id = userData.id;
      req.session.logged_in = true;
  
      req.session.save(() => {
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/expenses', async (req, res) => {
    console.log('Hit /expenses route'); // Add this line
    try {
      const { description, spending, date_created, name } = req.body;
      const user_id = req.session.user_id;
      const newExpense = await Expense.create({
        name,
        description,
        spending,
        date_created,
        user_id,
    });
  
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;