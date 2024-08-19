const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models');

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

    const userForToken = {
      username: user.username,
      name: user.name,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
