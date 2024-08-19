const Sequelize = require('sequelize');
const { PROJECT_URL } = require('./config');

const sequelize = new Sequelize(PROJECT_URL);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');
    } catch (error) {
        console.log('Failed to connect to the database')
        return process.exit(1);
    };
};

module.exports = { connectToDatabase, sequelize };