require('dotenv').config(); // Corrected the environment variable loading

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Added for password hashing
const jwt = require('jsonwebtoken'); // Added for authentication

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'default_secret_key'; // Secret key for JWT

const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// User signup route
app.post('/api/users', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert([
      { username, email, password: hashedPassword },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: 'User signed up successfully!', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User sign-in route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the hashed password
    const isValidPassword = await bcrypt.compare(password, data.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: data.id, email: data.email }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ message: 'User signed in successfully!', token });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5000; // Ensure the port matches the React API calls
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
