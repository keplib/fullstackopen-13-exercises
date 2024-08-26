const router = require('express').Router();
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../util/config');

const { User } = require('../models');
const { Blog } = require('../models');
const ReadingList = require('../models/');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'id'] },
      include: {
        model: Blog,
        attributes: ['author', 'url', 'likes', 'title'],
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    attributes: ['name', 'username'],
    where: { id: id },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username: username, name: name, password: passwordHash });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    return res.status(400).send({ error: 'The user with this username cannot be found' });
  }
});

module.exports = router;
