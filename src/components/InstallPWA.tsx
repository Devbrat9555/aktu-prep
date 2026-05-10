import React, { useState, useEffect } from 'react';
import { DownloadSimple, X, Sparkle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('PWA: Checking install criteria...');
        
        // For testing: Show button regardless, but it will only trigger install if event exists
        setIsVisible(true);

        const handler = (e: any) => {
            console.log('PWA: beforeinstallprompt event fired! App is installable.');
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Show the install button
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('PWA: App is already running in standalone mode.');
            setIsVisible(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
        } else {
            console.log('User dismissed the PWA install prompt');
        }

        // We've used the prompt, and can't use it again, so clear it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-20 left-6 right-6 md:left-auto md:right-12 md:w-[400px] z-[100]"
            >
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    
                    <div className="relative bg-[#020617]/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                <Sparkle size={24} weight="fill" className="animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-0.5">Experience the Best</p>
                                <h3 className="text-sm font-black italic text-white uppercase">Install AKTU Prep</h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleInstallClick}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                            >
                                <DownloadSimple size={16} weight="bold" /> Install
                            </button>
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPWA;
