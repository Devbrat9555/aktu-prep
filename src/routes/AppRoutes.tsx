/**
 * @file AppRoutes.jsx
 * @description Main routing for AKTU Prep.
 */

import { lazy, Suspense } from 'react';
import Layout from '../components/Layout.tsx';
import { Navigate, Route, Routes } from 'react-router-dom';

// Lazy load components
const SettingsRoutes = lazy(() => import('./SettingsRoutes.js'));
const About = lazy(() => import('../pages/About.jsx'));
const CoursesPage = lazy(() => import('../pages/CoursesPage.jsx'));
const YearsPage = lazy(() => import('../pages/YearsPage.jsx'));
const SemestersPage = lazy(() => import('../pages/SemestersPage.jsx'));
const SubjectsPage = lazy(() => import('../pages/SubjectsPage.jsx'));
const QuestionsPage = lazy(() => import('../pages/QuestionsPage.jsx'));
const AdminPage = lazy(() => import('../pages/AdminPage.jsx'));
const CommunityPage = lazy(() => import('../pages/CommunityPage.jsx'));
const CodingPage = lazy(() => import('../pages/CodingPage.jsx'));
const Donations = lazy(() => import('../pages/Donations.tsx'));
const AIExpertPage = lazy(() => import('../pages/AIExpertPage.tsx'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
            <Routes>
                <Route path="/" element={<Navigate to="/courses" replace />} />
                
                {/* Immersive Pages (No Global Navbar/Sidebar) */}
                <Route path="ai-expert" element={<AIExpertPage />} />

                <Route element={<Layout />}>
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="coding" element={<CodingPage />} />
                    <Route path="donate" element={<Donations />} />
                    <Route path="years/:course" element={<YearsPage />} />
                    <Route path="semesters/:course/:year" element={<SemestersPage />} />
                    <Route path="subjects/:course/:year/:semester" element={<SubjectsPage />} />
                    <Route path="questions/:subjectId" element={<QuestionsPage />} />
                    <Route path="community" element={<CommunityPage />} />
                    <Route path="admin" element={<AdminPage />} />
                    <Route path="settings/*" element={<SettingsRoutes />} />
                    <Route path="about" element={<About landing={false} />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

const NotFoundPage = () => {
    const isFile = window.location.pathname.startsWith('/notes') || window.location.pathname.startsWith('/uploads');
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
            <div className="glass p-12 rounded-[3rem] border border-white/5 max-w-md">
                <h1 className="text-6xl font-black text-indigo-500 mb-6 italic uppercase tracking-tighter">404</h1>
                <h2 className="text-2xl font-black text-white mb-4 uppercase italic">
                    {isFile ? 'File Not Found' : 'Sector Missing'}
                </h2>
                <p className="text-slate-400 font-medium mb-8">
                    {isFile 
                        ? "The requested study material is not available on the server. Please upload it via the Admin Panel." 
                        : "The coordinate you're looking for doesn't exist in the AKTU Prep matrix."}
                </p>
                <a href="/" className="inline-flex px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all">
                    Return to Kernel
                </a>
            </div>
        </div>
    );
};
