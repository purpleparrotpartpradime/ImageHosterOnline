const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

const upload = multer({ dest: process.env.UPLOAD_DIR });
const router = express.Router();
const uri = process.env.MONGODB_URI;

router.use((req, res, next) => {
  const blocklist = [/\b(racist|sexist|homophobic)\b/i];
  const content = JSON.stringify(req.body) + (req.file?.originalname || '');
  if (blocklist.some(rx => rx.test(content))) {
    return res.status(400).json({ error: 'Content violates community rules.' });
  }
  next();
});

router.post('/', upload.single('file'), async (req, res) => {
  const client = await MongoClient.connect(uri);
  const db = client.db();
  const posts = db.collection('posts');
  const post = {
    title: req.body.title,
    body: req.body.body,
    file: req.file.filename,
    type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    createdAt: new Date(),
    likes: 0,
    views: 0,
    comments: []
  };
  const result = await posts.insertOne(post);
  res.json({ id: result.insertedId });
});

router.get('/:id', async (req, res) => {
  const client = await MongoClient.connect(uri);
  const post = await client.db().collection('posts').findOne({ _id: new ObjectId(req.params.id) });
  res.json(post);
});

module.exports = router;
