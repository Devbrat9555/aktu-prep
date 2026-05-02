import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, PaperPlaneTilt, CheckCircle, Smiley, SmileySad, SmileyNervous } from '@phosphor-icons/react';
import { toast } from 'sonner';

type FeedbackModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please tap a star to rate!');
            return;
        }
        if (!message.trim()) {
            toast.error('Please tell us why!');
            return;
        }

        setIsSubmitting(true);
        // Simulate perfect submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSuccess(true);
        
        setTimeout(() => {
            onClose();
            // Reset after modal closes
            setTimeout(() => {
                setIsSuccess(false);
                setRating(0);
                setMessage('');
            }, 500);
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
                    {/* Dark Backdrop - Ultra High Z-Index */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl bg-[#020617] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_150px_-20px_rgba(79,70,229,0.4)] mt-10 md:mt-0"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all z-20"
                        >
                            <X size={24} weight="bold" className="text-slate-500" />
                        </button>

                        <div className="p-8 md:p-12">
                            {!isSuccess ? (
                                <div className="space-y-12">
                                    {/* Header */}
                                    <div className="text-center space-y-3">
                                        <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">
                                            User Sentiment Engine
                                        </div>
                                        <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                                            How's The <span className="text-indigo-500">Vibe?</span>
                                        </h2>
                                    </div>

                                    {/* MESSAGE AREA */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Detailed Signal</p>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="What's working? What's broken?"
                                            className="w-full h-32 bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 text-white text-sm font-medium focus:border-indigo-500/50 transition-all outline-none resize-none placeholder:text-slate-800"
                                        />
                                    </div>

                                    {/* EMOJI REACTION BAR */}
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 text-center">Final Rating</p>
                                        <div className="grid grid-cols-5 gap-3 md:gap-4">
                                            {[
                                                { r: 1, e: '😠', l: 'Poor', c: 'hover:bg-red-500/20 border-red-500/20 text-red-500', ac: 'bg-red-500/20 border-red-500' },
                                                { r: 2, e: '🙁', l: 'Fair', c: 'hover:bg-orange-500/20 border-orange-500/20 text-orange-500', ac: 'bg-orange-500/20 border-orange-500' },
                                                { r: 3, e: '🙂', l: 'Good', c: 'hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-500', ac: 'bg-yellow-500/20 border-yellow-500' },
                                                { r: 4, e: '😍', l: 'Great', c: 'hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-500', ac: 'bg-emerald-500/20 border-emerald-500' },
                                                { r: 5, e: '👑', l: 'Elite', c: 'hover:bg-indigo-500/20 border-indigo-500/20 text-indigo-500', ac: 'bg-indigo-500/20 border-indigo-500' },
                                            ].map((item) => (
                                                <button
                                                    key={item.r}
                                                    type="button"
                                                    onClick={() => {
                                                        console.log("Rating selected:", item.r);
                                                        setRating(item.r);
                                                    }}
                                                    className={`flex flex-col items-center gap-3 p-4 md:p-6 rounded-3xl border transition-all active:scale-90 ${rating === item.r ? item.ac : 'bg-white/5 border-white/5 text-slate-500'} ${item.c}`}
                                                >
                                                    <span className="text-3xl md:text-5xl pointer-events-none">{item.e}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest pointer-events-none">{item.l}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full h-20 bg-white text-black hover:bg-slate-200 rounded-[2.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-white/5 disabled:opacity-50 group"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                SEND SIGNAL <PaperPlaneTilt size={24} weight="fill" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="py-10 flex flex-col items-center text-center space-y-8"
                                >
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20">
                                        <CheckCircle size={64} weight="fill" className="text-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">Received!</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Thank you for improving the OS.</p>
                                    </div>
                                    <button 
                                        onClick={onClose}
                                        className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Back to Dashboard
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
