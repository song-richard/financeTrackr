const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/connection');
const User = require('./models/User')
const withAuth = require('./utils/auth');
const RegisterRoute = require('./controllers/routes/RegisterRoute');
const Expense = require('./models/Expense');
const crypto = require('crypto');


const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();


const PORT = process.env.PORT || 3001;

const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

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

    // Configure Handlebars
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');

    app.set('views', './views')

    app.get('/login', (req, res) => {
      res.render('partials/login');
    });

    app.get('/dashboard', withAuth, async (req, res) => {
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

    app.get('/login', (req, res) => {
      if (req.session.logged_in) {
        res.redirect('dashboard');
        return;
      }

      res.render('login');
    });

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
            username: req.body.username,
          },
        });
    
        if (!userData) {
          console.error('User not found');
          res.status(400).json({ message: 'User not found' });
          return;
        }
    
        const validatePassword = bcrypt.compareSync(password, userData.password);
    
        if (!validatePassword) {
          console.error('Incorrect password');
          res.status(400).json({ message: 'Incorrect password' });
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

    app.post('/expenses', async (req, res) => {
      console.log('Hit /expenses route'); // Add this line
      try {
        // Get expense data from the request body
        const { description, spending, date_created, name } = req.body;
    
        // Use the user_id from the session
        const user_id = req.session.user_id;
    
        // Create a new expense
        const newExpense = await Expense.create({
          name, // Add the name attribute
          description,
          spending,
          date_created,
          user_id,
      });
    
        // Respond with the newly created expense
        res.status(201).json(newExpense);
      } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    

    app.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the app:', error);
  };
};

startApp();

