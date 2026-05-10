import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Robot, 
    PaperPlaneRight, 
    Image as ImageIcon, 
    CaretLeft, 
    Sparkle,
    Brain,
    MagicWand,
    WarningCircle,
    X
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

// Initialize Gemini (User will need to provide VITE_GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    image?: string;
}

const AIExpertPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !image) return;
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            toast.error("Gemini API Key missing! Add VITE_GEMINI_API_KEY to your .env");
            return;
        }

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
            image: image || undefined
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        const currentImage = image;
        setInput('');
        setImage(null);
        setIsLoading(true);

        try {
            // 1. Try Backend Cache First (Only for text queries)
            if (!currentImage) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/ai/query`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: currentInput })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setMessages(prev => [...prev, { 
                            role: 'assistant', 
                            content: data.answer,
                            timestamp: new Date()
                        }]);
                        setIsLoading(false);
                        return; // Exit if found in cache
                    }
                } catch (cacheErr) {
                    console.warn("Backend cache failed, falling back to direct AI:", cacheErr);
                }
            }

            // 2. If image or cache miss, use direct Gemini SDK
            const modelsToTry = ["models/gemini-1.5-flash", "models/gemini-2.5-flash", "models/gemini-2.0-flash", "models/gemini-pro"];
            let success = false;
            let finalResponse = "";
            let lastError = null;

            for (const modelName of modelsToTry) {
                if (success) break;
                try {
                    if (lastError && (lastError as any).status === 429) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    const currentModel = genAI.getGenerativeModel({ model: modelName });
                    let result;

                    if (currentImage) {
                        if (modelName.includes("gemini-pro") && !modelName.includes("1.5")) continue; 
                        const base64Data = currentImage.split(',')[1];
                        result = await currentModel.generateContent([
                            currentInput || "Explain this image in the context of AKTU Engineering subjects.",
                            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
                        ]);
                    } else {
                        result = await currentModel.generateContent(currentInput);
                    }

                    finalResponse = result.response.text();
                    success = true;
                } catch (err) {
                    lastError = err;
                    console.warn(`Model ${modelName} failed, trying next...`, err);
                }
            }

            if (success) {
                const assistantMsg: Message = {
                    role: 'assistant',
                    content: finalResponse,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMsg]);
            } else {
                console.error("All models failed. Last error:", lastError);
                toast.error("Neural link failed: Quota Exceeded or Invalid Key.");
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: `I couldn't connect to any neural models. This is usually because your API Key has reached its daily limit (429 Quota Exceeded) or the key is invalid.`,
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error("Critical AI Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#020617] text-white font-outfit overflow-hidden">
            {/* Neural Backdrop */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-600/5 blur-[150px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-2xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all border border-white/5"
                    >
                        <CaretLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                            <Robot size={24} weight="duotone" className="text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-tighter italic">Neural <span className="text-indigo-500">Expert</span></h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AKTU Knowledge KERNEL</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-sm shadow-emerald-500/5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Kernel Sync Active</span>
                </div>
            </header>

            {/* Chat Area */}
            <main 
                ref={scrollRef}
                className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-60">
                        <div className="p-8 bg-indigo-500/5 rounded-[3rem] border border-white/5">
                            <Brain size={80} weight="duotone" className="text-indigo-500 mb-6 mx-auto animate-pulse" />
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Neural Connection <br />Ready</h2>
                            <p className="text-slate-400 max-w-sm mx-auto font-medium">
                                Ask me anything about Engineering, AKTU syllabus, or upload a photo of a question paper to get instant solutions.
                            </p>
                        </div>

                        {/* Contribution Banner */}
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl max-w-lg w-full">
                            <p className="text-xs font-bold text-emerald-400 italic">
                                "You can also add your own notes and lecture videos here. Share your materials to help others and grow our library."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                            {[
                                "Explain Fourier Transform simply",
                                "Solve: d²y/dx² + 4y = 0",
                                "Important topics for OS Unit 3",
                                "Explain 8085 Microprocessor architecture"
                            ].map((suggestion, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setInput(suggestion)}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-bold text-slate-400 transition-all text-left flex items-center gap-3"
                                >
                                    <MagicWand size={16} className="text-indigo-500" />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                                <div className={`p-5 rounded-[2rem] border ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-xl shadow-indigo-600/20' 
                                    : 'bg-white/5 border-white/10 text-slate-200 rounded-tl-none backdrop-blur-3xl'
                                }`}>
                                    {msg.image && (
                                        <img 
                                            src={msg.image} 
                                            alt="Uploaded context" 
                                            className="rounded-xl mb-4 max-h-60 w-full object-cover border border-white/10"
                                        />
                                    )}
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <p className={`text-[10px] font-black uppercase tracking-widest text-slate-500 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {msg.role === 'user' ? 'You' : 'Neural Expert'} &bull; {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3">
                            <Sparkle size={20} className="text-indigo-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Processing Logic...</span>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Input Area */}
            <footer className="relative z-10 p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5">
                <div className="max-w-5xl mx-auto space-y-4">
                    {image && (
                        <div className="relative inline-block">
                            <img src={image} className="h-20 w-20 object-cover rounded-xl border border-indigo-500" />
                            <button 
                                onClick={() => setImage(null)}
                                className="absolute -top-2 -right-2 p-1 bg-rose-500 rounded-full border-2 border-black"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}
                    
                    <div className="relative flex items-center gap-3">
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 transition-all"
                        >
                            <ImageIcon size={24} weight="duotone" />
                        </button>
                        
                        <div className="flex-1 relative">
                            <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask about units, topics, or papers..."
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none h-14 pr-16"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !image)}
                                className="absolute right-2 top-2 p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:grayscale transition-all"
                            >
                                <PaperPlaneRight size={20} weight="fill" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 opacity-30">
                        <WarningCircle size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Neural hallucination possible. Verify with textbook.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AIExpertPage;
