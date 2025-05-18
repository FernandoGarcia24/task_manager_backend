'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'),
      defaultValue: 'pendiente'
    },
    due_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {});

  Task.associate = models => {
    Task.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Task;
};