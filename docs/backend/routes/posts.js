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
    return res.status(400).json({ error: 'Content violates rules.' });
  }
  next();
});

router.get('/', async (req, res) => {
  const client = await MongoClient.connect(uri);
  const posts = await client.db().collection('posts').find(
    req.query.q ? { $text: { $search: req.query.q } } : {}
  ).sort({ createdAt: -1 }).toArray();
  res.json(posts);
});

router.post('/', upload.single('file'), async (req, res) => {
  const client = await MongoClient.connect(uri);
  const post = {
    title: req.body.title,
    body: req.body.body,
    file: req.file.filename,
    type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    createdAt: new Date()
  };
  const result = await client.db().collection('posts').insertOne(post);
  res.json({ id: result.insertedId });
});

module.exports = router;