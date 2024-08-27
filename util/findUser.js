const { User } = require('../models');
const jwt = require('jsonwebtoken');
const validateSession = require('../util/validateSession');

const getToken = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const findUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.user = await User.findByPk(decodedToken.id);
    const id = req.user.id;
    const validSession = await validateSession({ id, token });
    if (!decodedToken.id || !validSession) {
      throw Error('Session not valid!');
    }
    if (req.user.disabled) {
      throw Error('User disabled!');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = findUser;
