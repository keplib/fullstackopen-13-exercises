const router = require('express').Router();
const { Session } = require('../models');
const findUser = require('../util/findUser');

router.delete('/', findUser, async (req, res, next) => {
  try {
    if (!req.user) {
      throw Error('No user found!');
    }
    const id = req.user.id;
    await Session.destroy({ where: { userId: id } });
    return res.status(200).json({ message: 'Successfully logged out!' });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
