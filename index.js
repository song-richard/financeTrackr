const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('./config/connection');
const bodyParser = require('body-parser');
const User = require('./models/User')

const exphbs = require('express-handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//Handlebars Config
const hbs = exphbs.create({
    extname: '.handlebars',
    layoutsDir: 'views/',
    partialsDir: 'views/partials/', 
    defaultLayout: 'main',
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
        app.set('views', path.join(__dirname, 'views'));

        // Define routes
        app.get('/login', (req, res) => {
            res.render('partials/login');
        });

        //Had to move the route below from authRoutes to fix 'cannot read props of undefined (reading 'create)
        app.post('/login', async (req, res) => {
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
            }
          });

        app.get('/dashboard', (req, res) => {
            res.render('dashboard', { isAuthenticated: false });
        });

        // Start the server
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`LISTENING ON PORT ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the app:', error);
    }
}

startApp();

