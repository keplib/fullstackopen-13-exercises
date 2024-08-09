require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PROJECT_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const notes = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    notes.forEach((note) => {
      console.log(`${note.author}: '${note.content}', ${note.likes} likes`);
    });
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
