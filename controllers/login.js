const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User, Session } = require('../models');

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    }

    if (user.disabled) {
      return res.status(401).json({
        error: 'User disabled!',
      });
    }

    const userForToken = {
      username: user.username,
      name: user.name,
      id: user.id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    await Session.destroy({
      where: {
        userId: user.id,
      },
    });

    await Session.create({ userId: user.id, token: token });

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
