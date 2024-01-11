const express = require('express');
const router = express.Router();

app.post('/register', async (req, res) => {
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

module.exports = router;