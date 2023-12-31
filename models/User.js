const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

const User = sequelize.define('User', {
  username: {
    allowNull: false,
    type: 'STRING',
  },
  password: {
    allowNull: false,
    type: 'STRING',
  },
});

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;