const express = require('express');
const router = express.Router();

app.post('/signup', async (req, res) => {
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

module.exports = router;