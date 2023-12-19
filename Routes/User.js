const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");

// User registration route
router.post('/register',async(req,res)=>{
  const {
    name,
    email,
    password,
    deviceID,
    latitude,
    longitude,
    industryId,
    registrationId
  } = req.body;



  try {
    const newUser = new User({
      name,
      email,
      password,
      deviceID,
      latitude,
      longitude,
      industryId,
      registrationId
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user:newUser });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error});
}
}
);



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
    // const isPasswordValid = await bcrypt.compare(assword, user.Password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // Generate a JSON Web Token (JWT) for authentication
    // const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Return the token in the response
    res.status(200).json({ message:"Login Successfully", user:user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get-all-by-Role', async (req, res) => {
  try {
    const Role = req.body.Role;

    // Validate the Role against predefined Roles to prevent injection
    const allowedRoles = ['worker', 'manager', 'user', 'technician'];
    console.log(Role)
    if (!allowedRoles.includes(Role)) {
      return res.status(400).json({ error: 'Invalid Role' });
    }

    // Query the database for users with the specified Role
    const users = await User.find({ Role });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:industryId', async (req, res) => {
  try {
    const industryId = req.params.industryId;
    // Query the database for users with the specified Role
    const users = await User.find({ industryId });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', async (req, res) => {
  try {
 
      const U = await User.find()
      res.json({Users:U})
  
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE route
router.patch("/update", async (req, res) => {
  const { name, email, role, deviceID, skills, latitude, longitude, industryId, registrationId,Id,gender } = req.body;

  // Check if required fields are missing


  // Validate email
  // if (!validator.isEmail(Email)) {
  //   return res.status(400).json({ error: "Invalid email address" });
  // }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      Id,
      {
        name, email, role, deviceID, skills, latitude, longitude, industryId, registrationId,Id,gender 
      },
      { new: true }
    );

    if (updatedUser) {
      res.json({message:"user updated", user:updatedUser});
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.json(error)
    // Check if the error is due to validation failure
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: validationErrors });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
