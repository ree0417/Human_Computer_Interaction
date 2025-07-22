// server.js - Node.js/Express backend for MongoDB registration/login
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace with your actual MongoDB connection string from MongoDB Atlas
// Example: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
// If your password contains special characters, they must be URL-encoded (e.g., @ becomes %40)
const mongoUri = 'mongodb+srv://satyapp:%40Mapindani12@wsu-sports.8zkfc.mongodb.net/wsu-sports?retryWrites=true&w=majority';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  studentNumber: String,
  contactNumber: String,
  email: { type: String, unique: true },
  password: String
});

const Student = mongoose.model('Student', studentSchema);

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, studentNumber, contactNumber, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.create({ firstName, lastName, studentNumber, contactNumber, email, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful!' });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
