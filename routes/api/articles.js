const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../../db/index');


router.get('/articles', (req, res) => {
  db.getArticles(req, res);
});

router.post('/articles', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.postArticle(req, res);
});

router.post('/articles/:articleId/comments', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.postArticleComment(req, res);
});

router.get('/articles/:articleId', (req, res) => {
  db.getArticle(req, res);
});

router.patch('/articles/:articleId', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.patchArticle(req, res);
});

router.delete('/articles/:articleId', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.deleteArticle(req, res);
});

module.exports = router;
