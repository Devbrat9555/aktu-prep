import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSubjects } from '../services/api';
import { BookOpenText, ArrowLeft, House, CaretRight, Notebook, ArrowSquareOut } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const SubjectsPage = () => {
    const { course, year, semester } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getSubjects(course, year, semester)
            .then((res) => {
                setSubjects(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [course, year, semester]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-10 text-slate-500 text-xs font-black uppercase tracking-widest">
                    <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                        <House weight="fill" /> HOME
                    </Link>
                    <CaretRight weight="bold" />
                    <Link to={`/years/${course}`} className="hover:text-white transition-colors">{course}</Link>
                    <CaretRight weight="bold" />
                    <Link to={`/semesters/${course}/${year}`} className="hover:text-white transition-colors">YEAR {year}</Link>
                    <CaretRight weight="bold" />
                    <span className="text-indigo-400">SEM {semester}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-indigo-500">
                            <Notebook size={32} weight="duotone" />
                            <span className="h-[2px] w-12 bg-indigo-500/30"></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                            AVAILABLE <br />
                            <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">SUBJECTS</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 font-medium max-w-md">
                        Explore the curriculum for Semester {semester}. Each subject contains hand-picked papers, detailed solutions, and comprehensive notes.
                    </p>
                </div>

                <div className="space-y-4">
                    {subjects.length > 0 ? subjects.map((subject, idx) => (
                        <motion.div 
                            key={subject._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(`/questions/${subject._id}`)}
                            className="group relative glass p-6 md:p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl">
                                    <BookOpenText size={32} weight="duotone" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{subject.name}</h2>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Study Hub &bull; PYQs &bull; Notes</p>
                                </div>
                            </div>

                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                                <ArrowSquareOut size={24} weight="bold" />
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-32 glass rounded-[3rem] border border-dashed border-white/10">
                            <h2 className="text-2xl font-bold text-slate-500 italic">No subjects found for this selection.</h2>
                            <p className="text-slate-600 mt-2 font-medium">Check back later as we update the curriculum.</p>
                        </div>
                    )}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all"
                    >
                        <ArrowLeft weight="bold" /> GO BACK
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default SubjectsPage;
