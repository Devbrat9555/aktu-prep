import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SidebarItem } from './SidebarItem';
import { Button } from '@/components/ui/button';
import { CaretLeft, Coffee, GraduationCap } from '@phosphor-icons/react';
import { Text, Title } from '../ui/typography';
import type { Tab } from './Sidebar';
import Changelog from './Changelog';
import { useLocation } from 'react-router-dom';

type SidebarDesktopProps = {
    showSidebar: boolean;
    tabs: Tab[];
    locationPath: any;
    navigate: (path: string) => void;
};

export const SidebarDesktop = ({
    showSidebar,
    tabs,
    locationPath,
    navigate,
}: SidebarDesktopProps) => {
    const location = useLocation();
    const isTopicTestAttempt = /^\/topic-test\/[^/]+\/attempt$/.test(location.pathname);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const prevRef = useRef(false);

    useEffect(() => {
        if (isTopicTestAttempt && !prevRef.current) {
            setIsCollapsed(true);
        }
        prevRef.current = isTopicTestAttempt;
    }, [isTopicTestAttempt]);

    return (
        <motion.div
            className="h-full z-10 flex justify-between flex-col border-r border-white/5 bg-[#0f172a] shadow-sm overflow-x-hidden"
            initial={{ x: '-100%' }}
            animate={{
                x: showSidebar ? 0 : '-100%',
                width: isCollapsed ? '5rem' : '16rem',
            }}
            transition={{ duration: 0.2 }}
        >
            <div>
                {/* Branding */}
                <div className="py-8 border-b border-white/5">
                    <motion.div
                        className="flex items-center justify-center text-2xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GraduationCap 
                            size={32} 
                            className={`text-indigo-500 ${isCollapsed ? 'mr-0' : 'mr-3'} flex-shrink-0`} 
                        />
                        <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
                            <Title className="bg-gradient-to-br from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                                AKTU
                                <span className="text-white">Prep</span>
                            </Title>
                            <Text className="text-[10px] text-slate-500 font-black mt-[-5px] text-right w-full tracking-widest">
                                GOOD LUCK
                            </Text>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {tabs.map((tab, idx) => (
                        <SidebarItem
                            key={tab.id}
                            index={idx}
                            name={tab.name}
                            icon={tab.icon}
                            activeIcon={tab.activeIcon}
                            isActive={locationPath.pathname.startsWith(tab.path)}
                            isCollapsed={isCollapsed}
                            animation={tab.animation}
                            onClick={() => navigate(tab.path)}
                        />
                    ))}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                    <div className={`flex items-center ${isCollapsed ? 'flex-col gap-6' : 'space-x-2'}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 border-b border-indigo-500"
                            aria-label="Support"
                            onClick={() => navigate('/donate')}
                        >
                            <Coffee size={20} />
                        </Button>
                        <Changelog />
                    </div>

                    <motion.button
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="p-2 hover:bg-white/5 text-slate-400 rounded-xl"
                        onClick={handleCollapse}
                    >
                        <CaretLeft size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default SidebarDesktop;
