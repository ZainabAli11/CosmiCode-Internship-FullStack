const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

//  Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/booksdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB (local)'))
.catch(err => console.error('❌ Connection error:', err));

//  Define Schema and Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String
});

const Book = mongoose.model('Book', bookSchema);

//  Routes

// Root test
app.get('/', (req, res) => {
  res.send('✅ MongoDB API is working!');
});

//  POST - Create a new book
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save book' });
  }
});

// GET - All books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// GET - Book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

//  PUT - Update book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID or update data' });
  }
});

//  DELETE - Remove book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

//  Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
