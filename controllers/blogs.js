const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.destroy();
    res.json(blog);
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
