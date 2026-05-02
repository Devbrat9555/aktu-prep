import React from 'react';
import { motion } from 'framer-motion';
import type { Tab } from './Sidebar.js';
import { useLocation } from 'react-router-dom';

type MobileDockProp = {
    tabs: Tab[];
    handleTabClick: (path: string) => void;
};

const MobileDock = ({ tabs, handleTabClick }: MobileDockProp) => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-2xl z-50 flex justify-around items-center py-4 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:hidden overflow-hidden">
            {/* Animated Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
            
            {tabs.map((tab: Tab) => {
                const isActive = location.pathname.startsWith(tab.path);
                const IconComponent = isActive ? tab.activeIcon : tab.icon;
                return (
                    <motion.button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.path)}
                        className="relative flex flex-col items-center justify-center px-4 py-1 focus:outline-none transition-all group"
                        whileTap={{ scale: 0.9 }}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="mobile-dock-active"
                                className="absolute -inset-2 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            <motion.div
                                variants={tab.animation}
                                animate={isActive ? 'active' : 'inactive'}
                            >
                                {IconComponent}
                            </motion.div>
                        </span>
                        <span className={`relative z-10 text-[10px] font-black uppercase tracking-widest mt-1 transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                            {tab.name.split(' ')[0]}
                        </span>
                    </motion.button>
                );
            })}
        </nav>
    );
};

export default MobileDock;
