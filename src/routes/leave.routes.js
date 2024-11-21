const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Submit leave request
router.post('/', verifyToken, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        
        // Create new leave request
        const leave = new Leave({
            user: req.user.userId,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await leave.save();
        res.status(201).json({ message: 'Leave request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's leave requests
router.get('/my-leaves', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all leave requests (admin only)
router.get('/all', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const leaves = await Leave.find()
            .populate('user', 'name employeeId department')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve/Reject leave request (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const { status, comments } = req.body;
        const leave = await Leave.findById(req.params.id);
        
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Update leave status
        leave.status = status;
        leave.approvedBy = req.user.userId;
        leave.approvalDate = new Date();
        leave.comments = comments;

        // Update leave balance if approved
        if (status === 'approved') {
            const user = await User.findById(leave.user);
            const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24));
            user.leaveBalance[leave.leaveType] -= days;
            await user.save();
        }

        await leave.save();
        res.json({ message: 'Leave request updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
