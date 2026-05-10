import React, { type JSX } from 'react';
import { type Variants } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartPieSlice, BookOpen, Gear, Info, PlusCircle, Terminal } from '@phosphor-icons/react';
import useWindowSize from '../../hooks/useWindowSize.js';
import MobileDock from './MobileDock.js';
import { SidebarDesktop } from './SidebarDesktop.js';
import ModernLoader from '../ui/ModernLoader.js';
import { useUser } from '@clerk/clerk-react';

type SidebarProp = {
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    hideMobileNavigation: boolean;
};

export type Tab = {
    id: number;
    name: string;
    icon: JSX.Element;
    activeIcon: JSX.Element;
    path: string;
    animation: Variants;
};

const Sidebar = ({ showSidebar, setShowSidebar, hideMobileNavigation }: SidebarProp) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    const isAdmin = user?.primaryEmailAddress?.emailAddress === "vrat1087@gmail.com";

    const { width } = useWindowSize();

    // Icon animations
    const iconAnimations = {
        dashboard: {
            inactive: { rotate: 0, scale: 1 },
            active: {
                rotate: -45,
                scale: 1.1,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
            },
        },
        practice: {
            inactive: { rotateY: 0, transition: { duration: 0.3 } },
            active: {
                rotateY: 360,
                transition: { duration: 0.7, ease: 'easeInOut' },
            },
        },
        settings: {
            inactive: { rotate: 0, transition: { duration: 0.4 } },
            active: {
                rotate: 360,
                transition: { duration: 0.6, ease: 'linear' },
            },
        },
        about: {
            inactive: { rotateY: 0, transition: { duration: 0.3 } },
            active: {
                rotateY: 360,
                transition: { duration: 0.5, ease: 'easeInOut' },
            },
        },
        aktu: {
            inactive: { scale: 1 },
            active: { scale: 1.1, transition: { yoyo: Infinity } }
        },
        admin: {
            inactive: { rotate: 0 },
            active: { rotate: 180, transition: { duration: 0.5 } }
        },
        coding: {
            inactive: { scale: 1, opacity: 0.8 },
            active: { 
                scale: 1.2, 
                opacity: 1,
                transition: { type: 'spring', stiffness: 400, damping: 10 } 
            }
        }
    };

    // Tabs data
    const tabs = [
        {
            id: 1,
            name: 'AKTU Prep',
            icon: <BookOpen size={20} weight="duotone" />,
            activeIcon: <BookOpen size={20} weight="fill" />,
            path: '/courses',
            animation: iconAnimations.aktu,
        },
        {
            id: 4,
            name: 'Coding',
            icon: <Terminal size={20} weight="duotone" />,
            activeIcon: <Terminal size={20} weight="fill" />,
            path: '/coding',
            animation: iconAnimations.coding,
        },
        ...(isAdmin ? [{
            id: 6,
            name: 'Admin Panel',
            icon: <PlusCircle size={20} weight="duotone" />,
            activeIcon: <PlusCircle size={20} weight="fill" />,
            path: '/admin',
            animation: iconAnimations.admin,
        }] : []),
        {
            id: 2,
            name: 'Settings',
            icon: <Gear size={20} weight="duotone" />,
            activeIcon: <Gear size={20} weight="fill" />,
            path: '/settings',
            animation: iconAnimations.settings,
        },
        {
            id: 3,
            name: 'About',
            icon: <Info size={20} weight="duotone" />,
            activeIcon: <Info size={20} weight="fill" />,
            path: '/about',
            animation: iconAnimations.about,
        },
    ];

    // Handle tab click with navigation
    const handleTabClick = (path: string) => {
        navigate(path);
        if (showSidebar) {
            setShowSidebar(false);
        }
    };

    // Mobile: bottom navbar, Desktop: sidebar
    const isMobile: boolean = width !== undefined ? width < 1024 : false;

    if (isMobile) {
        if (hideMobileNavigation) return null;

        // Bottom dock for mobile
        return <MobileDock tabs={tabs} handleTabClick={handleTabClick} />;
    }

    // Desktop sidebar
    return (
        <SidebarDesktop
            showSidebar={showSidebar}
            tabs={tabs}
            locationPath={location}
            navigate={navigate}
        />
    );
};

export default Sidebar;
