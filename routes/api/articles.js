const express = require('express');
const router = express.Router();

const db = require('../../db/index');


router.get('/articles', (req, res) => {
  db.getArticles(req, res);
});

router.post('/articles', (req, res) => {
  db.postArticle(req, res);
});

router.get('/articles/:articleId', (req, res) => {
  db.getArticle(req, res);
});

router.patch('/articles/:articleId', (req, res) => {
  db.patchArticle(req, res);
});

router.delete('/articles/:articleId', (req, res) => {
  db.deleteArticle(req, res);
});

module.exports = router;
