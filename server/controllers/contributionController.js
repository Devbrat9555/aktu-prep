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

const Subject = require('../models/Subject');
const StudyMaterial = require('../models/StudyMaterial');

// Admin: Approve a contribution
exports.approveContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const contribution = await Contribution.findById(id);
        if (!contribution) return res.status(404).json({ error: "Contribution not found." });

        // Find the matching subject in the database
        // We match by name, course and semester (converted to numbers)
        const numericYear = contribution.semester ? parseInt(contribution.semester.replace(/[^0-9]/g, '')) : 1;
        const actualSemester = contribution.semester ? parseInt(contribution.semester.replace(/[^0-9]/g, '')) : 1;
        
        const subject = await Subject.findOne({ 
            name: contribution.subject,
            course: contribution.course,
            semester: actualSemester
        });

        if (!subject) {
            return res.status(404).json({ 
                error: "Target subject not found in database. Please add the subject first or check for name mismatch." 
            });
        }

        // Create new study material entry
        const newMaterial = new StudyMaterial({
            subjectId: subject._id,
            title: `[Community] ${contribution.type === 'note' ? 'Notes' : 'Lecture'} by ${contribution.studentName}`,
            type: contribution.type === 'note' ? 'notes' : 'video',
            url: contribution.content,
            description: `Contributed by ${contribution.studentName} (${contribution.studentEmail})`
        });

        await newMaterial.save();

        // Update contribution status
        contribution.status = 'approved';
        await contribution.save();
        
        res.json({ message: "Contribution approved and deployed to subject page!" });
    } catch (error) {
        console.error("Approval Error:", error);
        res.status(500).json({ error: "Failed to approve contribution.", details: error.message });
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
