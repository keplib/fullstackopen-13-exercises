const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

app.use(express.json());

app.use('/api/blogs', blogsRouter);

const errorHandler = (error, request, response, next) => {
  console.log('error ------>', error);

  if (error.type === 'notNull Violation') {
    return response.status(400).send({ error: 'Some fields are missing!' });
  }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
