/**
 * @file AppRoutes.jsx
 * @description Main routing for AKTU Prep.
 */

import ModernLoader from '../components/ui/ModernLoader.js';
import Layout from '../components/Layout.jsx';
import SettingsRoutes from './SettingsRoutes.js';
import About from '../pages/About.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuth from '../hooks/useAuth.ts';
import CoursesPage from '../pages/CoursesPage.jsx';
import YearsPage from '../pages/YearsPage.jsx';
import SemestersPage from '../pages/SemestersPage.jsx';
import SubjectsPage from '../pages/SubjectsPage.jsx';
import QuestionsPage from '../pages/QuestionsPage.jsx';
import AdminPage from '../pages/AdminPage.jsx';

import CommunityPage from '../pages/CommunityPage.jsx';
import CodingPage from '../pages/CodingPage.jsx';

export default function AppRoutes() {
    const { isLogin, loading } = useAuth();

    return (
        <Routes>
            {loading ? (
                <Route path="*" element={<ModernLoader />} />
            ) : (
                <>
                    <Route path="/" element={<Navigate to="/courses" replace />} />
                    
                    <Route element={<Layout />}>
                        <Route path="courses" element={<CoursesPage />} />
                        <Route path="coding" element={<CodingPage />} />
                        <Route path="years/:course" element={<YearsPage />} />
                        <Route path="semesters/:course/:year" element={<SemestersPage />} />
                        <Route path="subjects/:course/:year/:semester" element={<SubjectsPage />} />
                        <Route path="questions/:subjectId" element={<QuestionsPage />} />
                        <Route path="community" element={<CommunityPage />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="settings/*" element={<SettingsRoutes />} />
                        <Route path="about" element={<About landing={false} />} />
                        <Route path="*" element={<Navigate to="/courses" replace />} />
                    </Route>
                </>
            )}
        </Routes>
    );
}
