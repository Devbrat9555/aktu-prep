import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Faders } from '@phosphor-icons/react';

import Login from '../../components/Login.jsx';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { itemVariants } from '../../utils/motionVariants.ts';
import useAuth from '../../hooks/useAuth.ts';
import PageHeader from '@/components/ui/PageHeader.tsx';
import AnimatedTabs from '@/components/ui/AnimatedTabs.tsx';

const Settings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab: string = location.pathname.split('/')[2] || 'account';
    const { showLogin, setShowLogin } = useAuth();

    // Tab Reference
    const tabRefs = useRef<Record<string, HTMLButtonElement>>({});

    // This brings the active tab in view
    useEffect(() => {
        const activeEl = tabRefs.current[activeTab];
        if (activeEl) {
            activeEl.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    }, [activeTab]);

    // Tabs
    const tabs = [
        {
            id: 'account',
            label: 'Academic ID',
            icon: <User size={20} weight="duotone" />,
            activeIcon: <User size={20} weight="fill" />,
        },
        {
            id: 'privacy',
            label: 'OS Configuration',
            icon: <ShieldCheck size={20} weight="duotone" />,
            activeIcon: <ShieldCheck size={20} weight="fill" />,
        },
        {
            id: 'app-settings',
            label: 'System Prefs',
            icon: <Faders size={20} weight="duotone" />,
            activeIcon: <Faders size={20} weight="fill" />,
        },
    ];

    return (
        <div className="relative pb-10 bg-[#0f172a] min-h-screen text-white">
            {showLogin && (
                <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Login onClose={() => setShowLogin(false)} />
                </div>
            )}
            <div
                className={`p-6 md:p-12 transition-all duration-500 ${showLogin ? 'blur-2xl scale-95 opacity-50' : ''}`}
            >
                {/* Header Section */}
                <div className="mb-12">
                    <PageHeader
                        primaryTitle="PREFERENCES &"
                        secondaryTitle="SETTINGS"
                        caption="Customize your AKTU Prep experience"
                    />
                </div>

                {/* Settings Tabs Navigation */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-2xl mb-10">
                        <AnimatedTabs tabs={tabs} activeTab={activeTab} onChange={(id) => navigate(`/settings/${id}`)} />
                    </div>

                    {/* Content Area */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={itemVariants}
                        className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 premium-shadow"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
