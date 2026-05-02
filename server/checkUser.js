const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aktu-prep';

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        const user = await User.findOne({ email: 'yadavdevbrat022@gmail.com' });
        
        if (user) {
            console.log('--- USER FOUND ---');
            console.log('Name:', user.name);
            console.log('Email:', user.email);
            console.log('Registered At:', user.createdAt);
        } else {
            console.log('--- USER NOT FOUND IN MONGODB ---');
            console.log('Reason: The user might be registered in Clerk but hasn\'t synced to MongoDB yet.');
        }
        
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
};

check();
