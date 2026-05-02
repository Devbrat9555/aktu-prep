import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestions, getStudyMaterial, getSubject, addBookmark } from '../services/api';
import { 
    Bookmark, 
    CheckCircle, 
    CaretDown, 
    CaretUp, 
    Clock, 
    Question, 
    ArrowLeft, 
    ShareNetwork, 
    Video, 
    BookOpen, 
    FilePdf, 
    PlayCircle,
    Eye,
    DownloadSimple,
    Copy,
    Lightning,
    Certificate
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionsPage = () => {
    const { subjectId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [activeTab, setActiveTab] = useState('papers'); // 'papers', 'notes', or 'videos'
    
    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [activeUnit, setActiveUnit] = useState('All');

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const [qRes, mRes, sRes] = await Promise.all([
                    getQuestions(subjectId),
                    getStudyMaterial(subjectId),
                    getSubject(subjectId)
                ]);
                setQuestions(qRes.data);
                setMaterials(mRes.data);
                setSubject(sRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const SERVER_URL = API_BASE_URL.replace('/api', '');

    const handleBookmark = (id) => {
        addBookmark(id)
            .then(() => alert('Question bookmarked!'))
            .catch(() => alert('Please login to bookmark questions.'));
    };

    const handleShare = (q) => {
        const shareText = `Check out this question for ${subject?.name || 'Subject'}: \n\n${q.question}\n\nStudy more on AKTU Prep!`;
        navigator.clipboard.writeText(shareText);
        alert('Question copied to clipboard! You can now share it.');
    };

    const copySolution = (solution) => {
        navigator.clipboard.writeText(solution);
        alert('Solution copied!');
    };

    // --- SMART SORTING & FILTERING ---
    const getUnitNumber = (m) => {
        if (m.unit) return m.unit;
        const match = m.title.match(/(?:Unit|Unit-)\s*(\d+)/i);
        return match ? parseInt(match[1]) : 999;
    };

    const filteredMaterials = materials
        .filter(m => {
            if (activeTab === 'notes' && m.type !== 'notes') return false;
            if (activeTab === 'videos' && m.type !== 'video') return false;
            
            const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            const mUnit = getUnitNumber(m);
            const matchesUnit = activeUnit === 'All' || 
                               (activeUnit === 'Revision' && m.title.toLowerCase().includes('revision')) ||
                               (activeUnit === 'Quantum' && m.title.toLowerCase().includes('quantum')) ||
                               (mUnit.toString() === activeUnit);
                               
            return matchesSearch && matchesUnit;
        })
        .sort((a, b) => {
            const unitA = getUnitNumber(a);
            const unitB = getUnitNumber(b);
            if (unitA !== unitB) return unitA - unitB;
            return a.title.localeCompare(b.title);
        });

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 overflow-x-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Header section */}
            <div className="relative z-10 bg-slate-900/50 border-b border-white/5 py-10 mb-8 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6">
                    <Link to={-1} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-8 text-xs font-black uppercase tracking-[0.2em]">
                        <ArrowLeft size={14} weight="bold" className="mr-2" /> Back to Subjects
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Certificate size={24} weight="duotone" className="text-indigo-500" />
                                <span className="h-[1px] w-8 bg-indigo-500/30"></span>
                                <span className="text-indigo-500 text-xs font-black uppercase tracking-widest">
                                    {subject?.course || 'AKTU Prep'} &bull; {subject?.year || '1st'} Year
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                {subject?.name || 'SUBJECT'} <br />
                                <span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">REPOSITORY</span>
                            </h1>
                        </div>
                        
                        {/* Tabs Switcher */}
                        <div className="flex flex-wrap bg-slate-800/30 p-1.5 rounded-[2rem] border border-white/5 shadow-2xl gap-1">
                            <button 
                                onClick={() => setActiveTab('papers')}
                                className={`flex items-center px-6 py-4 rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'papers' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}
                            >
                                <BookOpen size={18} weight="duotone" className="mr-2" /> Papers
                            </button>
                            <button 
                                onClick={() => setActiveTab('notes')}
                                className={`flex items-center px-6 py-4 rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}
                            >
                                <FilePdf size={18} weight="duotone" className="mr-2" /> Notes
                            </button>
                            <button 
                                onClick={() => setActiveTab('videos')}
                                className={`flex items-center px-6 py-4 rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'videos' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}
                            >
                                <Video size={18} weight="duotone" className="mr-2" /> Lectures
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {activeTab === 'papers' ? (
                    <div className="space-y-8">
                        {questions.length > 0 ? questions.map((q, idx) => (
                            <motion.div 
                                key={q._id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-500 ${expandedId === q._id ? 'ring-2 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10' : ''}`}
                            >
                                <div className="p-8 md:p-10 cursor-pointer flex items-start gap-8" onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}>
                                    <div className="hidden md:flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xl italic group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">{idx + 1}</div>
                                        <div className={`w-[2px] h-full my-4 transition-colors duration-500 ${expandedId === q._id ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{q.difficulty}</span>
                                            <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest gap-2">
                                                <Clock size={14} weight="duotone" className="text-indigo-500" /> {q.year} EXAMINATION
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight italic tracking-tight">{q.question}</h3>
                                        
                                        <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleBookmark(q._id); }} 
                                                className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors"
                                            >
                                                <Bookmark size={18} weight="duotone" className="mr-2" /> Bookmark
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleShare(q); }} 
                                                className="flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors"
                                            >
                                                <ShareNetwork size={18} weight="duotone" className="mr-2" /> Share
                                            </button>
                                            <button className="flex items-center text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
                                                {expandedId === q._id ? 'Hide Solution' : 'View Expert Solution'} 
                                                {expandedId === q._id ? <CaretUp size={16} weight="bold" className="ml-2" /> : <CaretDown size={16} weight="bold" className="ml-2" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {expandedId === q._id && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-8 pb-10 pt-4 bg-indigo-500/5 border-t border-white/5"
                                        >
                                            <div className="relative group/sol p-8 bg-slate-900/80 rounded-[2rem] border border-white/5 text-slate-300 leading-relaxed font-medium">
                                                <div className="flex items-center gap-2 text-indigo-400 mb-6">
                                                    <Lightning size={20} weight="fill" />
                                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Expert Verified Answer</span>
                                                </div>
                                                <div className="text-lg mb-8 whitespace-pre-wrap">{q.solution}</div>
                                                
                                                <button 
                                                    onClick={() => copySolution(q.solution)}
                                                    className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                                                >
                                                    <Copy size={16} className="mr-2" /> Copy Solution
                                                </button>
                                            </div>

                                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                                                {q.fileUrl ? (
                                                    <a href={`${SERVER_URL}${q.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/40 w-full sm:w-auto">
                                                        <FilePdf size={20} weight="fill" className="mr-3" /> View Full Year Paper
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center gap-3 px-8 py-5 bg-white/5 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest border border-dashed border-white/10 w-full sm:w-auto">
                                                        <Clock size={20} weight="duotone" className="text-indigo-500" /> Full Paper Coming Soon
                                                    </div>
                                                )}
                                                
                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">ID: {q._id}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )) : <EmptyState message="No previous papers found" icon={BookOpen} />}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Search & Quick Filters */}
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative flex-1 w-full">
                                <Lightning size={20} weight="duotone" className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" />
                                <input 
                                    type="text" 
                                    placeholder={activeTab === 'notes' ? "Search notes, quantum, or units..." : "Search video lectures or topics..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-slate-800/30 border border-white/5 rounded-3xl text-white font-medium focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-3 w-full md:w-auto no-scrollbar">
                                {['All', '1', '2', '3', '4', '5', 'Quantum', 'Revision'].map((unit) => (
                                    <button
                                        key={unit}
                                        onClick={() => setActiveUnit(unit)}
                                        className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border whitespace-nowrap ${activeUnit === unit ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        {unit === 'All' || unit === 'Revision' || unit === 'Quantum' ? unit : `Unit ${unit}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredMaterials.length > 0 ? filteredMaterials.map((m, idx) => (
                                <motion.div 
                                    key={m._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass rounded-[2.5rem] p-10 border border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                                >
                                    {/* Decor */}
                                    <div className="absolute -right-8 -top-8 text-8xl font-black text-white/5 italic select-none group-hover:text-indigo-500/10 transition-colors">
                                        {getUnitNumber(m) === 999 ? '?' : `0${getUnitNumber(m)}`}
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between mb-8">
                                        <div className={`p-5 rounded-3xl ${m.type === 'video' ? 'bg-red-500/10 text-red-400 shadow-xl shadow-red-500/10' : 'bg-blue-500/10 text-blue-400 shadow-xl shadow-blue-500/10'}`}>
                                            {m.type === 'video' ? <Video size={32} weight="duotone" /> : <BookOpen size={32} weight="duotone" />}
                                        </div>
                                        {m.title.toLowerCase().includes('unit') && (
                                            <span className="px-4 py-1.5 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-indigo-500/20">Unit Focused</span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight">{m.title}</h3>
                                    <p className="text-slate-400 font-medium text-sm mb-10 line-clamp-2 leading-relaxed">{m.description || 'Access high-quality study material for this topic.'}</p>
                                    
                                    {m.type === 'video' ? (
                                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-2xl shadow-red-600/40">
                                            <PlayCircle size={20} weight="fill" className="mr-2" /> WATCH ON YOUTUBE
                                        </a>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <a href={`${SERVER_URL}${m.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-2xl shadow-indigo-600/40">
                                                <Eye size={20} weight="bold" className="mr-2" /> VIEW
                                            </a>
                                            <a href={`${SERVER_URL}${m.url}`} download className="flex items-center justify-center py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all">
                                                <DownloadSimple size={20} weight="bold" className="mr-2" /> DOWNLOAD
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-dashed border-white/10">
                                    <h3 className="text-xl font-bold text-slate-500 italic uppercase">No {activeTab} found</h3>
                                    <p className="text-slate-600 mt-2 font-medium">Try a different search term or unit filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ message, icon: Icon = Question }) => (
    <div className="text-center py-32 glass rounded-[4rem] border border-dashed border-white/10">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon size={48} weight="duotone" className="text-slate-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-400 italic uppercase tracking-tighter mb-4">{message}</h2>
        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Our content team is working around the clock to bring you the best study resources. Check back soon!</p>
    </div>
);

export default QuestionsPage;
