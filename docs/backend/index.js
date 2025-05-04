const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'docs')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
