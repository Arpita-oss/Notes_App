import express from 'express';
import User from '../models/User.js';  // ✅ Import the User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;  // ✅ Change 'name' to 'name'

        console.log("Received Data:", req.body); // Debugging Step

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let existingUser = await User.findOne({  // ✅ Now 'findOne' will work
            $or: [{ email }, { name }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,  // ✅ Use 'username' instead of 'name'
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET
            ,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            userId: user._id
        });

    } catch (error) {
        console.error("Error in /register:", error);  // 🔴 This will print error in the console
        res.status(500).json({
            message: 'Signup failed',
            error: error.message
        });
    }
});

router.post('/login', async(req,res)=>{
    try {
        const { email, password } = req.body;
    
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ 
            message: 'Invalid login credentials' 
          });
        }
    
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ 
            message: 'Invalid login credentials' 
          });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );
    
        res.json({ 
          token, 
          userId: user._id 
        });
      } catch (error) {
        res.status(500).json({ 
          message: 'Login failed', 
          error: error.message 
        });
      }

    })


export default router;
