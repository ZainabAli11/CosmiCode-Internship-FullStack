const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const privateRoutes = require('./routes/private') 

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/private', privateRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.listen(5000, () => console.log('Server running on port 5000'))
