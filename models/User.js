const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  username: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
});

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;