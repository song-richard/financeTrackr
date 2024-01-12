const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const crypto = require('crypto');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const controllers = require('./controllers');

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = crypto.randomBytes(32).toString('hex');
const hbs = exphbs.create({
  partialsDir: 'views/partials/',
});

// Session configuration
const sessionConfig = {
  secret: secretKey,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // EXPIRES IN 1 DAY
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Use session middleware
app.use(session(sessionConfig));

// Static files
app.use(express.static(__dirname));

// View engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.use('/', controllers);

// Database synchronization and server start
async function startApp() {
  try {
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}

// Initiate the application
startApp();
