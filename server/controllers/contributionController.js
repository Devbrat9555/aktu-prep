const Contribution = require('../models/Contribution');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Student: Submit a contribution
exports.submitContribution = async (req, res) => {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            console.error("CRITICAL: Cloudinary is not configured in .env");
            return res.status(500).json({ error: "Server storage not configured. Please contact admin." });
        }

        const { studentName, studentEmail, course, semester, subject, type, content } = req.body;
        
        let finalContent = content;

        // If a file was uploaded, send it to Cloudinary
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'aktu_prep_contributions',
                    resource_type: 'auto'
                });
                finalContent = result.secure_url;
                
                // Delete local temp file after cloud upload
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ 
                    message: "Failed to upload file to cloud.", 
                    error: uploadError.message 
                });
            }
        }

        const newContribution = new Contribution({
            studentName,
            studentEmail,
            course,
            semester,
            subject,
            type,
            content: finalContent
        });

        await newContribution.save();
        res.status(201).json({ message: "Contribution submitted for approval! Thank you." });
    } catch (error) {
        console.error('Submit Contribution Error:', error);
        res.status(500).json({ 
            error: "Failed to submit contribution.", 
            details: error.message 
        });
    }
};

// Admin: Get all pending contributions
exports.getPendingContributions = async (req, res) => {
    try {
        const pending = await Contribution.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pending contributions." });
    }
};

// Admin: Approve a contribution
exports.approveContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const contribution = await Contribution.findById(id);
        if (!contribution) return res.status(404).json({ error: "Contribution not found." });

        contribution.status = 'approved';
        await contribution.save();
        
        // Note: In a real app, you might want to automatically add this to the Subjects/Materials table here.
        
        res.json({ message: "Contribution approved and live!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve contribution." });
    }
};

// Admin: Delete/Reject a contribution
exports.deleteContribution = async (req, res) => {
    try {
        const { id } = req.params;
        await Contribution.findByIdAndDelete(id);
        res.json({ message: "Contribution deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete contribution." });
    }
};

// Public: Get all approved contributions (Optional: for a community page)
exports.getApprovedContributions = async (req, res) => {
    try {
        const approved = await Contribution.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(approved);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch contributions." });
    }
};
