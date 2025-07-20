const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Mongoose model
const Post = mongoose.model('Post', new mongoose.Schema({
  title: String,
  content: String,
  image: String // <-- added image field
}));

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// GET all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST create a new post with optional image
app.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, content, image });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT update an existing post
app.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = { title, content };
    if (image) updateData.image = image;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});

// DELETE a post
app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).send('Delete failed');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
