const express = require('express');
const router = express.Router();

const db = require('../../db/index');


router.get('/articles', (req, res) => {
  db.getArticles(req, res);
});

router.post('/articles', (req, res) => {
  db.postArticle(req, res);
});

router.get('/article/:articleId', (req, res) => {
  db.getArtcile(req, res);
});

router.delete('/article/:articleId', (req, res) => {
  db.deleteArtcile(req, res);
});

module.exports = router;
