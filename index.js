const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/connection');
const User = require('./models/User')

const RegisterRoute = require('./controllers/RegisterRoute');


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

    app.use('/financeTrackr/public', express.static(path.join(__dirname, 'public')));

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
        console.log(userData);
        if (!userData) {
          console.error('incorrect user credentials')
          res.status(400).json({ message: 'No data found' })
        } else {
          const validatePassword = bcrypt.compareSync(password, userData.password);
          if (!validatePassword) {
            res.status(400).json({ message: 'Not Authorized' })
          }
          else{
          console.log("Succesfully signed in");
          res.status(200).json({ message: 'Sucessfully logged in' })
        }}
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

