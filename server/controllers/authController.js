const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.syncUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });
        
        if (!user) {
            const bcrypt = require('bcryptjs');
            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = new User({ name, email, password: tempPassword });
            await user.save();
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, name, college, rollNo, branch, year } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.college = college || user.college;
        user.rollNo = rollNo || user.rollNo;
        user.branch = branch || user.branch;
        user.year = year || user.year;

        // Reward system: Give points if all fields are filled
        if (user.college && user.rollNo && user.branch && user.year && !user.isVerified) {
            user.points += 100;
            user.isVerified = true;
        }

        await user.save();
        res.json({ message: 'Profile synced successfully', user, rewarded: user.isVerified });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
