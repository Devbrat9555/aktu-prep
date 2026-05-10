import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Robot, X, PaperPlaneRight, Sparkle } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingAIBuddy = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on the main AI Expert page
    if (location.pathname === '/ai-expert') return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-500/20"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                                <Robot size={24} weight="duotone" className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-tighter italic">Neural Buddy</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Always Active</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-300 font-medium italic mb-6 leading-relaxed">
                            Need quick help with a formula or concept while studying?
                        </p>

                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/ai-expert');
                                }}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <Sparkle size={16} weight="fill" />
                                START NEURAL CHAT
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5"
                            >
                                DISMISS
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-5 rounded-full shadow-2xl transition-all ${
                    isOpen 
                    ? 'bg-rose-500 shadow-rose-500/20' 
                    : 'bg-indigo-600 shadow-indigo-500/20'
                } text-white border-2 border-white/10`}
            >
                {isOpen ? <X size={28} weight="bold" /> : <Robot size={28} weight="duotone" />}
            </motion.button>
        </div>
    );
};

export default FloatingAIBuddy;
