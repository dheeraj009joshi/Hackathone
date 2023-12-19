const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration route
router.post('/register', async (req, res) => {
  try {
    // Extract user input from request body
    const { Name, Email, Password, role, DeviceID, Skills, Latitude, Longitude,IndustryId,RegistrationId } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' , user :existingUser });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new user instance
    const newUser = new User({
      Name,
      Email,
      Password: hashedPassword,
      role,
      DeviceID,
      Skills,
      Latitude,
      Longitude,
      RegistrationId,
      IndustryId
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' , user: newUser});
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate key error (e.g., duplicate email)
      return res.status(400).json({ error: 'Duplicate key error', details: 'Email is already registered' });
    }

    // Generic server error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    // Extract user input from request body
    const { Email, Password } = req.body;

    // Check if the email is registered
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Return the token in the response
    res.status(200).json({ token:token, user:user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
