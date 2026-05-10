import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar.tsx';
import Navbar from './Navbar.tsx';

const Layout = () => {
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 1024;
            setShowSidebar(isDesktop);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-dvh bg-[#0f172a] text-white">
            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                hideMobileNavigation={false}
            />
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0f172a]">
                    <div className="min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
        </div>
    );
};

export default Layout;
