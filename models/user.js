'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {});

  User.associate = models => {
    User.hasMany(models.Task, { foreignKey: 'user_id' });
  };

  return User;
};