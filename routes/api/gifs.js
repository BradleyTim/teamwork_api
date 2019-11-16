const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");

const db = require('../../db/index');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "teamwork",
	format: 'gif',
	transformation: [{ width: 300, height: 300, crop: "limit" }],
});

const parser = multer({ storage: storage });

router.post('/gifs', parser.single('image'), (req, res) => {
	db.postGif(req, res);
});

router.get('/gifs', (req, res) => {
	res.status(200).json({ message: 'Here are the gifs!'});
  //db.getGif(req, res);
});

router.get('/gifs/:gifId', (req, res) => {
  db.getGif(req, res);
});

router.delete('/gifs/:gifId', (req, res) => {
  db.deleteGif(req, res);
});

module.exports = router;
