const express = require('express');
const router = express.Router();
const { getNews, createNews, getNewsById } = require('../controllers/newsController');

router.route('/')
  .get(getNews)
  .post(createNews);

router.route('/:id')
  .get(getNewsById);

module.exports = router;
