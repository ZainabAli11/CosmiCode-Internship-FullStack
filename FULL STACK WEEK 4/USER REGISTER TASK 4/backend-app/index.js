const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

//  Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//  User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { type: String, required: true, minlength: 6 }
});

const User = mongoose.model('User', userSchema);

// POST /register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ error: 'Email already registered' });

  const user = new User({ name, email, password });
  await user.save();

  res.status(201).json({ 
    message: 'User registered successfully', 
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

app.get('/', (req, res) => {
  res.send(' API is working!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
