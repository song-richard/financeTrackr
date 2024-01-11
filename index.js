const express = require('express');
const bcrypt = require('bcrypt');
const sequelize = require('./config/connection');
const User = require('./models/User');
const withAuth = require('./utils/auth');
const Expense = require('./models/Expense');
const crypto = require('crypto');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');

// Use path.join for controllers import
const controllers = require('./controllers');

const app = express();

const PORT = process.env.PORT || 3000;

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
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // EXPIRES IN 1 DAY
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

const hbs = exphbs.create({
  partialsDir: 'views/partials/',
});

app.use(express.static(__dirname));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', './views')

app.use('/', controllers);

async function startApp() {
  try {
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized.');



    app.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the app:', error);
  };
};

startApp();

