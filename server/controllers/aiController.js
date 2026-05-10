const AICache = require('../models/AICache');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini on backend for secure fallback
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

exports.queryAI = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ error: "Question is required" });

        const normalizedQuestion = question.toLowerCase().trim();

        // 1. Check Cache
        let cachedResponse = await AICache.findOne({ question: normalizedQuestion });
        if (cachedResponse) {
            console.log('--- AI CACHE HIT ---');
            cachedResponse.askedCount += 1;
            cachedResponse.lastAskedAt = Date.now();
            await cachedResponse.save();
            return res.json({ 
                answer: cachedResponse.answer, 
                cached: true 
            });
        }

        // 2. If not in cache, let the frontend know so it can call AI (or we call it here)
        // For security and quota management, calling it here is better
        console.log('--- AI CACHE MISS - CALLING GEMINI ---');
        
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-pro"];
        let answer = "";
        let success = false;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(question);
                const response = await result.response;
                answer = response.text();
                success = true;
                if (success) break;
            } catch (err) {
                console.warn(`Backend Fallback ${modelName} failed:`, err.message);
            }
        }

        if (!success) {
            return res.status(503).json({ error: "AI service currently unavailable" });
        }

        // 3. Store in Cache
        const newCache = new AICache({
            question: normalizedQuestion,
            answer: answer
        });
        await newCache.save();

        res.json({ 
            answer: answer, 
            cached: false 
        });

    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({ error: "Internal Server Error during AI processing" });
    }
};
