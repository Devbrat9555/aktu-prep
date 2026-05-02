const User = require('../models/User');

exports.addBookmark = async (req, res) => {
    try {
        const { questionId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.bookmarks.includes(questionId)) {
            user.bookmarks.push(questionId);
            await user.save();
        }
        res.json({ message: 'Bookmarked successfully', bookmarks: user.bookmarks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookmarks');
        res.json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
