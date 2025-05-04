const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');

const app = express();
app.use(bodyParser.json());
app.use('/api/posts', postRoutes);

// Endpoint to list posts
app.get('/api/posts', async (req, res) => {
  const client = await require('mongodb').MongoClient.connect(process.env.MONGODB_URI);
  const posts = await client.db().collection('posts').find().sort({createdAt:-1}).toArray();
  res.json(posts);
});

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
