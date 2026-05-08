import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../services/api';
import { 
    GraduationCap, 
    BookOpen, 
    Briefcase, 
    Pill, 
    Lightning, 
    ArrowRight, 
    Certificate,
    Sparkle,
    Stack
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showColdStartMessage, setShowColdStartMessage] = useState(false);

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                setShowColdStartMessage(true);
            }, 5000);
        }

        getCourses()
            .then((res) => {
                setCourses(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch courses. Please make sure the backend is running.');
                setLoading(false);
            });

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loading]);

    const getCourseIcon = (name) => {
        if (name.includes('B.Tech')) return <GraduationCap size={32} weight="duotone" />;
        if (name.includes('MBA')) return <Briefcase size={32} weight="duotone" />;
        if (name.includes('B.Pharma')) return <Pill size={32} weight="duotone" />;
        return <Certificate size={32} weight="duotone" />;
    };

    const getCourseDetails = (name) => {
        if (name.includes('B.Tech')) return { years: 4, semesters: 8, color: 'indigo' };
        if (name.includes('MBA')) return { years: 2, semesters: 4, color: 'purple' };
        if (name.includes('B.Pharma')) return { years: 4, semesters: 8, color: 'emerald' };
        return { years: 0, semesters: 0, color: 'slate' };
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden pb-20">
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
                <header className="text-center mb-24 space-y-8">
                    <div className="h-8 w-48 bg-indigo-500/10 rounded-full mx-auto animate-pulse"></div>
                    <div className="h-20 w-3/4 bg-white/5 rounded-3xl mx-auto animate-pulse"></div>
                    {showColdStartMessage && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-indigo-400 font-bold animate-bounce"
                        >
                            🚀 Waking up the server... Please wait (Cold start)
                        </motion.p>
                    )}
                    <div className="h-6 w-1/2 bg-white/5 rounded-xl mx-auto animate-pulse"></div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass rounded-[3rem] p-10 border border-white/5 animate-pulse">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-20 h-20 rounded-3xl bg-white/5"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-white/5 rounded"></div>
                                    <div className="h-6 w-20 bg-white/5 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-10 w-3/4 bg-white/5 rounded-xl"></div>
                                <div className="flex gap-4">
                                    <div className="h-4 w-24 bg-white/5 rounded"></div>
                                    <div className="h-4 w-24 bg-white/5 rounded"></div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                                <div className="h-4 w-24 bg-white/5 rounded"></div>
                                <div className="w-12 h-12 rounded-2xl bg-white/5"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="text-red-400 font-bold glass p-10 rounded-[2.5rem] border border-red-500/20">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden pb-20">
            {/* Premium Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
                <header className="text-center mb-24 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]"
                    >
                        <Sparkle size={16} weight="fill" className="animate-pulse" />
                        AKTU Student Resource Portal
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                            Master Your <br />
                            <span className="text-indigo-500">Exams</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Access 10 years of previous year papers, model solutions, and semester-wise notes for all AKTU courses.
                        </p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {courses.map((course, idx) => {
                        const details = getCourseDetails(course.name);
                        return (
                            <motion.div 
                                key={course._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => navigate(`/years/${course.name}`)}
                                className="group relative glass rounded-[3rem] p-10 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
                                
                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500`}>
                                            {getCourseIcon(course.name)}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Duration</p>
                                            <p className="text-lg font-black italic text-white leading-none">{details.years} Years</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-3 group-hover:text-indigo-400 transition-colors leading-none">{course.name}</h2>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                <BookOpen size={14} className="mr-2 text-indigo-500" />
                                                10 Years Papers
                                            </div>
                                            <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                <Stack size={14} className="mr-2 text-indigo-500" />
                                                {details.semesters} Semesters
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">Enter Course</span>
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                <ArrowRight size={20} weight="bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Good Luck Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 text-center py-20 glass rounded-[4rem] border border-indigo-500/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 space-y-6">
                        <Lightning size={60} weight="duotone" className="mx-auto text-indigo-500" />
                        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">GOOD <span className="text-indigo-500">LUCK</span></h2>
                        <p className="text-slate-400 font-medium text-lg uppercase tracking-widest">Preparation is the key to success.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CoursesPage;
