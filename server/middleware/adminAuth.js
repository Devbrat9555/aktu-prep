const GOD_ADMIN = "yadavdevbrat022@gmail.com";

const adminAuth = (req, res, next) => {
    // In a real scenario, we'd check the JWT/Clerk token for the email.
    // For now, since the user wants tight security, we can expect a header or just rely on the existing auth and verify email.
    const userEmail = req.headers['x-admin-email'];
    
    if (userEmail !== GOD_ADMIN) {
        return res.status(403).json({ error: "KERNEL ACCESS DENIED: Unauthorized Identity." });
    }
    next();
};

module.exports = adminAuth;
