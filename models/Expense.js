const { DataTypes } = require('sequelize');
const User = require('./User');
const sequelize = require('../config/connection');

const Expense = sequelize.define('Expense', {
    amount: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
  });