import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Notification, GraduationCap, Star, Lightning, List, X } from '@phosphor-icons/react';
import NotificationDialog from './NotificationDialog.js';
import useWindowSize from '../hooks/useWindowSize.ts';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import FeedbackModal from './FeedbackModal';

const Navbar = () => {
    const { user } = useUser();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);

    const { width } = useWindowSize();
    const navigate = useNavigate();

    const isAdmin = user?.primaryEmailAddress?.emailAddress === "vrat1087@gmail.com";

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setShowNotifications(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
            setIsMobileMenuOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    if (width === undefined) return null;
    const isMobile: boolean = width < 768;

    return (
        <motion.div
            className="py-4 px-6 flex justify-between items-center border-b border-white/5 bg-slate-900/50 backdrop-blur-md text-white sticky top-0 z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/')}
            >
                <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-all">
                    <Lightning size={28} weight="fill" className="text-indigo-500" />
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase italic">
                    <span className="text-indigo-500">AKTU</span> <span className="opacity-50">PREP</span>
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-8" ref={notificationRef}>
                <div className="hidden lg:flex items-center gap-6 border-r border-white/5 pr-8">
                    {isAdmin && (
                        <button 
                            onClick={() => navigate('/admin')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors"
                        >
                            Admin Panel
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/settings')}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        Settings
                    </button>
                    <button 
                        onClick={() => navigate('/community')}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        Community
                    </button>
                    <button 
                        onClick={() => navigate('/about')}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        About
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center" ref={mobileMenuRef}>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
                    </button>

                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute top-20 right-6 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-[60]"
                        >
                            <div className="flex flex-col gap-4">
                                {isAdmin && (
                                    <button 
                                        onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                                        className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors py-2"
                                    >
                                        Admin Panel
                                    </button>
                                )}
                                <button 
                                    onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}
                                    className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors py-2"
                                >
                                    Settings
                                </button>
                                <button 
                                    onClick={() => { navigate('/community'); setIsMobileMenuOpen(false); }}
                                    className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors py-2"
                                >
                                    Community
                                </button>
                                <button 
                                    onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                                    className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors py-2"
                                >
                                    About
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>


                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20">
                                LOGIN
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border-2 border-indigo-500/30"
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                <motion.button
                    aria-label="Notifications"
                    className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <Notification size={24} weight={showNotifications ? "fill" : "duotone"} />
                    {unreadNotifications && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                    )}
                </motion.button>

                <NotificationDialog
                    isOpen={showNotifications}
                    setUnreadNotifications={setUnreadNotifications}
                />
            </div>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </motion.div>
    );
};

export default Navbar;
