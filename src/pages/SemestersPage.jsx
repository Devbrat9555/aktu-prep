import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSemesters } from '../services/api';
import { BookBookmark, ArrowLeft, House, CaretRight, BookOpen } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const SemestersPage = () => {
    const { course, year } = useParams();
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getSemesters(course, year)
            .then((res) => {
                setSemesters(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [course, year]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
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
                    <span className="text-indigo-400">YEAR {year}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-indigo-500">
                            <BookOpen size={32} weight="duotone" />
                            <span className="h-[2px] w-12 bg-indigo-500/30"></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                            SELECT <br />
                            <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">SEMESTER</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 font-medium max-w-md">
                        Drill down into specific semester subjects. We've organized everything so you can find your study material in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {semesters.map((sem, idx) => (
                        <motion.div 
                            key={sem}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/subjects/${course}/${year}/${sem}`)}
                            className="group relative glass p-10 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer overflow-hidden flex items-center justify-between"
                        >
                            <div className="relative z-10 space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Semester {sem}</h2>
                                <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                    VIEW SUBJECTS <CaretRight weight="bold" className="inline ml-1" />
                                </p>
                            </div>

                            <div className="relative z-10 w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-2xl shadow-indigo-500/0 group-hover:shadow-indigo-500/40">
                                <BookBookmark size={40} weight="duotone" />
                            </div>

                            {/* Background decorative text */}
                            <div className="absolute -left-4 -bottom-10 text-[10rem] font-black text-white/5 italic select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors">
                                0{sem}
                            </div>
                        </motion.div>
                    ))}
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

export default SemestersPage;
