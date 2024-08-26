const readingListsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const { ReadingList } = require('../models');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

readingListsRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body;
  const readingList = await ReadingList.create({ blogId, userId });
  res.json(readingList);
});

readingListsRouter.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const readingList = await ReadingList.findByPk(id);

  if (readingList && req.body.read) {
    const updatedReadingList = await readingList.update({
      read: req.body.read,
    });
    res.json(updatedReadingList);
  } else if (readingList) {
    res.status(400).json({ error: 'missing read boolean' });
  } else {
    res.status(404).end();
  }
});

module.exports = readingListsRouter;
