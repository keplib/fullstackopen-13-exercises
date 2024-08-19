require('dotenv').config();

module.exports = {
  PROJECT_URL: process.env.PROJECT_URL,
  PORT: process.env.PORT || 3001,
  SALT_ROUNDS: 10,
};
