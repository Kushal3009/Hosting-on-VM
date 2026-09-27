const { sequelize } = require('../config/database');
const Item = require('./item.model');

const db = {
  sequelize,
  Item,
};

const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database synchronized successfully.');
  } catch (error) {
    console.error('✗ Failed to synchronize database:', error.message);
    throw error;
  }
};

module.exports = {
  ...db,
  syncDatabase,
};
