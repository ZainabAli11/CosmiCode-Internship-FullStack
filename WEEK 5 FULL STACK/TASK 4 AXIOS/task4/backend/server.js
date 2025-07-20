const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Needed to read JSON body

// In-memory users array (acts like a mini database)
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// GET users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST add user
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid name' });
  }

  const newUser = { id: Date.now(), name };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
