const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory "database"
let books = [];

// Home route
app.get('/', (req, res) => {
  res.send('📚 Simple Book API is running!');
});

//  Create a new book (POST)
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const newBook = {
    id: Date.now().toString(),
    title,
    author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Get all books (GET)
app.get('/books', (req, res) => {
  res.json(books);
});

// Get a book by ID (GET)
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// Update a book by ID (PUT)
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// Delete a book by ID (DELETE)
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  books.splice(index, 1);
  res.json({ message: 'Book deleted successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
