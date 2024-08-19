const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Blog } = require('../models');
const { User } = require('../models');

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

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: ['name', 'username'],
      },
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  const user = await User.findByPk(req.decodedToken.id);
  if (blog) {
    if (user && blog.userId === user.id) {
      blog.destroy();
      res.json(blog);
    } else {
      return res.status(400).send({ error: 'No permission to delete this blog' });
    }
  } else {
    return res.status(400).send({ error: 'The item with this id cannot be found' });
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes += 1;
    await blog.save();
    res.json(blog);
  } else {
    return res.status(400).send({ error: 'The item with this id cannot be found' });
  }
});

module.exports = router;
