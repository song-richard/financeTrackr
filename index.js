const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/connection');
const User = require('./models/User')
const withAuth = require('./utils/auth');
const RegisterRoute = require('./controllers/routes/RegisterRoute');
const Expense = require('./models/Expense');


const PORT = process.env.PORT || 3001;

const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Handlebars Config
const hbs = exphbs.create({
  partialsDir: 'views/partials/',
});

//Establish connection with DB
async function startApp() {
  try {
    // Create the database and synchronize models with the database
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized.');

    app.use(express.static(__dirname));

    //Moved authRoutes to app.js to debug - fixed the bug
    // app.use(authRoutes);

    // Configure Handlebars
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');

    // Set the path to your views directory
    app.set('views', './views')

    // Define routes
    app.get('/login', (req, res) => {
      res.render('partials/login');
    });

    app.get('/dashboard', withAuth, async (req, res) => {
      try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
          include: [{ model: Expense }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
          ...user,
          logged_in: true
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });

    app.get('/login', (req, res) => {
      // If the user is already logged in, redirect the request to another route
      if (req.session.logged_in) {
        res.redirect('dashboard');
        return;
      }

      res.render('login');
    });


    //Had to move the route below from authRoutes to fix 'cannot read props of undefined (reading 'create)
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;

      try {
        const newUser = await User.create({
          username: username,
          password: password,
        });

        res.status(201).json(newUser);
        console.log("New user added successfully!");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      };
    });

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      try {
        const userData = await User.findOne({
          where: {
            username: req.body.username
          }
        });

        if (!userData) {
          console.error('user not found');
          res.status(400).json({ message: 'User not found' });
        } else {
          const validatePassword = bcrypt.compareSync(password, userData.password);
          if (!validatePassword) {
            console.error('incorrect password');
            res.status(400).json({ message: 'Incorrect password' });
          } else {
            console.log("Successfully signed in");
            res.render('dashboard', { isAuthenticated: true });
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/dashboard', (req, res) => {
      res.render('dashboard', { isAuthenticated: false });
    });

    // Start the server

    app.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the app:', error);
  };
};

startApp();

