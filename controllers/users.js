const router = require('express').Router();
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../util/config');

const { User } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'id'] },
    });
    res.json(users);
  } catch (error) {
    next(error);
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
