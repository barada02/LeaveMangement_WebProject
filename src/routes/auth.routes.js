const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        const user = await User.findOne({ employeeId });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                employeeId: user.employeeId,
                name: user.name,
                role: user.role,
                department: user.department,
                leaveBalance: user.leaveBalance
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Register route (admin only)
router.post('/register', async (req, res) => {
    try {
        const { employeeId, name, email, password, role, department } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ employeeId }, { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this employee ID or email already exists' 
            });
        }

        const user = new User({
            employeeId,
            name,
            email,
            password,
            role,
            department
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
