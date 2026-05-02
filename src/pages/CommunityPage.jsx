import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lightning, 
    ChatTeardropDots, 
    Plus, 
    Sparkle, 
    Warning, 
    Eye, 
    EyeSlash,
    ArrowLeft,
    PaperPlaneTilt,
    MegaphoneSimple,
    Ghost
} from '@phosphor-icons/react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import FeedbackModal from '../components/FeedbackModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CommunityPage = () => {
    const { user, isSignedIn } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState('new');
    const [activeTab, setActiveTab] = useState('all'); 
    const [activeTag, setActiveTag] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [vibe, setVibe] = useState('😤 Stressed');
    const [viewMode, setViewMode] = useState('wall'); // 'wall' or 'dashboard'
    const [showFeedback, setShowFeedback] = useState(false);
    
    // Feature States
    const [timer, setTimer] = useState(1500); // 25 mins
    const [timerActive, setTimerActive] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [cgpa, setCgpa] = useState(() => JSON.parse(localStorage.getItem('student_cgpa')) || { sgpa: 8.5, target: 9.0 });
    const [tipIdx, setTipIdx] = useState(0);
    const [targetDate, setTargetDate] = useState(() => localStorage.getItem('student_countdown') || '2026-05-15');
    const [dailyGoal, setDailyGoal] = useState(() => localStorage.getItem('student_goal') || 'Complete Unit 1');

    // Dashboard Data (Persistent)
    const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem('student_attendance')) || [
        { id: 1, name: 'Data Structures', attended: 20, total: 25 },
        { id: 2, name: 'COA', attended: 15, total: 20 },
        { id: 3, name: 'Maths IV', attended: 18, total: 22 }
    ]);
    const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('student_projects')) || [
        { id: 1, name: 'AKTU Prep Project', progress: 65 }
    ]);
    const [quickNotes, setQuickNotes] = useState(() => localStorage.getItem('student_notes') || '');
    const [unitStatus, setUnitStatus] = useState(() => JSON.parse(localStorage.getItem('student_units')) || {
        'Syllabus': [true, true, false, false, false],
    });
    const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem('student_assignments')) || [
        { id: 1, task: 'DS Lab Assignment 3', deadline: '2026-05-10', status: 'pending' },
        { id: 2, task: 'Maths Unit 2 Problems', deadline: '2026-05-05', status: 'completed' }
    ]);

    // Persistence
    useEffect(() => {
        localStorage.setItem('student_cgpa', JSON.stringify(cgpa));
        localStorage.setItem('student_countdown', targetDate);
        localStorage.setItem('student_goal', dailyGoal);
        localStorage.setItem('student_attendance', JSON.stringify(attendance));
        localStorage.setItem('student_projects', JSON.stringify(projects));
        localStorage.setItem('student_notes', quickNotes);
        localStorage.setItem('student_units', JSON.stringify(unitStatus));
        localStorage.setItem('student_assignments', JSON.stringify(assignments));
    }, [cgpa, targetDate, dailyGoal, attendance, projects, quickNotes, unitStatus, assignments]);

    const daysRemaining = Math.max(0, Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)));

    const TIPS = [
        "Always use === instead of == in JS!",
        "Clean code is better than clever code.",
        "Use console.table() to debug arrays.",
        "CSS Grid is powerful for layouts.",
        "Commit often, push once a day.",
        "Learn Regex, it saves hours!"
    ];

    const [newPost, setNewPost] = useState({ 
        content: '', 
        type: 'request', 
        isAnonymous: true, 
        tags: [],
        targetCollege: '',
        targetTeacher: ''
    });

    const PREDEFINED_TAGS = ['Resource', 'Career', 'Tech', 'Subjects', 'ExamPrep', 'Internship', 'Placement', 'Event', 'Project', 'Research', 'Collaboration'];
    
    // Pomodoro Logic
    useEffect(() => {
        let interval = null;
        if (timerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setTimerActive(false);
            clearInterval(interval);
            toast.success("Focus session complete! Take a break.");
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    useEffect(() => {
        fetchPosts();
        setTipIdx(Math.floor(Math.random() * TIPS.length));
    }, [sortBy]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/community/feedback?sortBy=${sortBy}`);
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load community wall");
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!isSignedIn) {
            toast.error("Please login to react");
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/feedback/${postId}/like`, { userId: user.id });
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
        } catch (err) {
            toast.error("Failed to update reaction");
        }
    };

    const toggleTag = (tag) => {
        const tags = [...newPost.tags];
        if (tags.includes(tag)) {
            setNewPost({ ...newPost, tags: tags.filter(t => t !== tag) });
        } else {
            setNewPost({ ...newPost, tags: [...tags, tag] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignedIn) {
            toast.error("Please login to post");
            return;
        }
        if (newPost.content.trim().length < 5) {
            toast.error("Post is too short!");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/feedback`, {
                ...newPost,
                userId: user.id,
                userName: user.fullName || user.username,
                userEmail: user.primaryEmailAddress.emailAddress
            });
            toast.success("Message posted to the wall!");
            setNewPost({ content: '', type: 'request', isAnonymous: true, tags: [], targetCollege: '', targetTeacher: '' });
            setShowModal(false);
            fetchPosts();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to post message";
            toast.error(errorMsg);
        }
    };

    const filteredPosts = posts.filter(p => {
        const categoryMatch = activeTab === 'all' || p.type === activeTab;
        const tagMatch = activeTag === 'All' || (p.tags && p.tags.includes(activeTag));
        const searchMatch = p.content.toLowerCase().includes(searchQuery.toLowerCase()) || (p.targetTeacher && p.targetTeacher.toLowerCase().includes(searchQuery.toLowerCase()));
        return categoryMatch && tagMatch && searchMatch;
    });

    const spotlightPost = posts.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, {});

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pb-40 relative overflow-x-hidden font-outfit">

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
                <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-all font-black uppercase tracking-[0.3em] text-[10px] group">
                            <ArrowLeft size={16} weight="bold" /> Back to Home
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                            {viewMode === 'wall' ? 'Global' : 'Academic'}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">{viewMode === 'wall' ? 'Hub' : 'Space'}</span>
                        </h1>
                        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
                            <button onClick={() => setViewMode('wall')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'wall' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}>🌐 Network Wall</button>
                            <button onClick={() => setViewMode('dashboard')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'dashboard' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>📊 Research Dashboard</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Focus Intensity</span>
                            <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="bg-transparent text-xs font-black text-indigo-500 uppercase outline-none cursor-pointer">
                                <option value="High">⚡ High</option>
                                <option value="Medium">🌊 Deep Work</option>
                                <option value="Low">☕ Collaborative</option>
                            </select>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">My Countdown</span>
                            <div className="relative cursor-pointer">
                                <input 
                                    type="date" 
                                    value={targetDate} 
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <span className="text-xl font-black text-white italic group-hover:text-indigo-400 transition-colors uppercase tracking-tighter">{daysRemaining} DAYS</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Compact Sidebar */}
                    <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
                        <div className="sticky top-20 space-y-4">
                            <div className="glass p-6 rounded-[2.5rem] border border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Productivity Hub</h3>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {/* My Daily Mission */}
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 transition-all">
                                        <div className="flex items-center justify-between mb-3 text-white font-black text-[9px] uppercase tracking-widest">
                                            <span>My Mission</span>
                                            <Sparkle size={12} weight="fill" className="text-indigo-500" />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={dailyGoal} 
                                            onChange={(e) => setDailyGoal(e.target.value)}
                                            placeholder="Set a goal..."
                                            className="w-full bg-transparent text-[10px] font-bold text-slate-400 outline-none border-b border-white/5 focus:border-indigo-500/30 pb-1"
                                        />
                                    </div>
                                    {/* CGPA Tracker */}
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 transition-all">
                                        <div className="flex items-center justify-between mb-3 text-white font-black text-[9px] uppercase tracking-widest">
                                            <span>CGPA Tracker</span>
                                            <span className="text-indigo-400">{cgpa.sgpa} / 10</span>
                                        </div>
                                        <input type="range" min="0" max="10" step="0.1" value={cgpa.sgpa} onChange={(e) => setCgpa({...cgpa, sgpa: parseFloat(e.target.value)})} className="w-full accent-indigo-500 h-1 rounded-full mb-2" />
                                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Target: {cgpa.target} GPA</p>
                                    </div>

                                    {/* Pomodoro Timer */}
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-black text-[9px] uppercase tracking-widest">Focus Session</span>
                                            <span className="text-rose-500 font-black text-sm tabular-nums">{formatTime(timer)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setTimerActive(!timerActive)} className="flex-1 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] font-black uppercase rounded-lg hover:bg-rose-500/20 transition-all">{timerActive ? 'Pause' : 'Start'}</button>
                                            <button onClick={() => {setTimer(1500); setTimerActive(false);}} className="px-3 py-2 bg-slate-900 border border-white/5 text-slate-500 text-[8px] font-black uppercase rounded-lg hover:text-white transition-all">Reset</button>
                                        </div>
                                    </div>

                                    {/* Stress Buster */}
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 transition-all text-center">
                                        <motion.div animate={{ scale: isBreathing ? 1.5 : 1 }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }} className="w-12 h-12 bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-3">
                                            <Ghost size={24} weight="fill" className="text-emerald-500" />
                                        </motion.div>
                                        <button onClick={() => setIsBreathing(!isBreathing)} className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">{isBreathing ? 'Stop Breathing' : 'Tap to Relax'}</button>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-2">
                                    <a href="https://erp.aktu.ac.in" target="_blank" className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-white/5 hover:border-white/10 transition-all text-[9px] font-black uppercase tracking-widest text-slate-500">AKTU ERP <ArrowLeft size={12} className="rotate-180" /></a>
                                    <a href="https://oneview.aktu.ac.in" target="_blank" className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-white/5 hover:border-white/10 transition-all text-[9px] font-black uppercase tracking-widest text-slate-500">OneView <ArrowLeft size={12} className="rotate-180" /></a>
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/10">
                                <span className="block text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-2 italic">Dev Tip</span>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic break-all">"{TIPS[tipIdx]}"</p>
                            </div>
                        </div>
                    </aside>

                    {/* Feed Area */}
                    <main className="lg:col-span-9 space-y-8 order-1 lg:order-2">
                        {viewMode === 'wall' ? (
                            <>
                                {/* Compact Spotlight */}
                                {spotlightPost._id && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-rose-600/5 blur-3xl opacity-50"></div>
                                        <div className="relative glass p-6 md:p-8 rounded-[3rem] border border-white/10 flex flex-col md:flex-row gap-8 items-center">
                                            <div className="space-y-3 flex-1 w-full">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest">🔥 Top Pulse</span>
                                                    {spotlightPost.targetTeacher && <span className="text-rose-400 text-[8px] font-black uppercase tracking-widest">Target: {spotlightPost.targetTeacher}</span>}
                                                </div>
                                                <h2 className="text-lg md:text-xl font-black text-white italic leading-tight break-all">"{spotlightPost.content}"</h2>
                                                <button onClick={() => handleLike(spotlightPost._id)} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                                                    <Sparkle size={16} weight="fill" /> Agree ({spotlightPost.likes || 0})
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Search & Filters */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <Plus size={18} className="absolute left-5 top-1/2 -translate-y-1/2 rotate-45 text-slate-700" />
                                        <input type="text" placeholder="Search rants, faculty, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-6 text-white text-xs font-black placeholder:text-slate-800 outline-none focus:border-indigo-500/30 transition-all" />
                                    </div>
                                    <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 shrink-0">
                                        {['all', 'vent', 'request'].map(tab => (
                                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}>{tab}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Compact Wall */}
                                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                    {loading ? (
                                        <div className="col-span-full py-40 text-center text-slate-700 font-black uppercase tracking-widest text-[10px]">Syncing Campus Pulse...</div>
                                    ) : filteredPosts.length > 0 ? filteredPosts.map((post, idx) => (
                                        <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className={`break-inside-avoid glass p-6 rounded-[2.5rem] border transition-all duration-300 hover:border-white/20 group ${post.type === 'vent' ? 'border-rose-500/5' : 'border-emerald-500/5'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${post.type === 'vent' ? 'text-rose-500' : 'text-emerald-500'}`}>{post.type}</span>
                                                <span className="text-[8px] text-slate-800 font-black uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {post.targetTeacher && <div className="mb-3 p-2 bg-rose-500/5 rounded-xl border border-rose-500/10 text-[8px] font-black text-rose-500/80 uppercase">Faculty: {post.targetTeacher}</div>}
                                            <p className="text-sm md:text-base text-white font-medium leading-relaxed mb-6 break-all whitespace-pre-wrap opacity-90 italic">"{post.content}"</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center text-[10px] font-black text-slate-700">{post.userName.charAt(0)}</div>
                                                    <span className="text-[8px] font-black uppercase text-slate-700 italic">{post.userName}</span>
                                                </div>
                                                <button onClick={() => handleLike(post._id)} className={`px-4 py-1.5 rounded-xl border text-[9px] font-black transition-all ${post.likes > 0 ? 'bg-white text-slate-950' : 'bg-slate-950 text-slate-700 border-white/5'}`}>🔥 {post.likes || 0}</button>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-40 text-center text-slate-800 font-black uppercase tracking-widest text-[10px]">No buzz found.</div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                                {/* Personal Dashboard Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Attendance Subject-wise */}
                                    <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Subject Attendance</h3>
                                            <Lightning size={20} className="text-indigo-500" />
                                        </div>
                                        <div className="space-y-4">
                                            {attendance.map(sub => {
                                                const perc = Math.round((sub.attended / sub.total) * 100);
                                                return (
                                                    <div key={sub.id} className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                            <span>{sub.name}</span>
                                                            <span className={perc < 75 ? 'text-rose-500' : 'text-emerald-500'}>{perc}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${perc}%` }} className={`h-full ${perc < 75 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setAttendance(attendance.map(s => s.id === sub.id ? {...s, attended: s.attended + 1, total: s.total + 1} : s))} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase hover:bg-white/10 transition-all">Present</button>
                                                            <button onClick={() => setAttendance(attendance.map(s => s.id === sub.id ? {...s, total: s.total + 1} : s))} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase hover:bg-white/10 transition-all">Absent</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Unit-wise Tracker */}
                                    <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400">Syllabus Progress (Units)</h3>
                                        <div className="space-y-4">
                                            {Object.entries(unitStatus).map(([name, units]) => (
                                                <div key={name} className="space-y-3">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{name}</span>
                                                    <div className="flex gap-2">
                                                        {units.map((status, i) => (
                                                            <button key={i} onClick={() => {
                                                                const newUnits = [...units];
                                                                newUnits[i] = !newUnits[i];
                                                                setUnitStatus({...unitStatus, [name]: newUnits});
                                                            }} className={`flex-1 h-10 rounded-xl border transition-all text-[10px] font-black ${status ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-slate-950 border-white/5 text-slate-800'}`}>Unit {i+1}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Quick Notes */}
                                    <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Quick Scribes</h3>
                                        <textarea value={quickNotes} onChange={(e) => setQuickNotes(e.target.value)} placeholder="Type formulas, project ideas, or task lists here..." className="w-full h-40 bg-transparent text-sm text-slate-400 font-medium italic outline-none resize-none placeholder:text-slate-800" />
                                    </div>
                                    
                                    {/* Assignment Vault */}
                                    <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400">Assignment Vault</h3>
                                            <MegaphoneSimple size={18} className="text-rose-500" />
                                        </div>
                                        <div className="space-y-3">
                                            {assignments.map(ass => (
                                                <div key={ass.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
                                                    <div>
                                                        <p className="text-[10px] font-black text-white">{ass.task}</p>
                                                        <p className="text-[8px] font-bold text-slate-600">Due: {ass.deadline}</p>
                                                    </div>
                                                    <button onClick={() => setAssignments(assignments.map(a => a.id === ass.id ? {...a, status: a.status === 'completed' ? 'pending' : 'completed'} : a))} className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${ass.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-white/10 text-slate-800'}`}>
                                                        <Sparkle size={12} weight="fill" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => {
                                                const task = prompt("Enter Assignment Name:");
                                                const date = prompt("Enter Deadline (YYYY-MM-DD):");
                                                if(task && date) setAssignments([...assignments, { id: Date.now(), task, deadline: date, status: 'pending' }]);
                                            }} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all">+ Add Assignment</button>
                                        </div>
                                    </div>

                                    {/* B.Tech Study Library */}
                                    <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Study Library</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { n: 'PYQ Bank', l: '#' },
                                                { n: 'Lab Manuals', l: '#' },
                                                { n: 'Unit Notes', l: '#' },
                                                { n: 'Scientific Calc', l: 'https://www.desmos.com/scientific' },
                                                { n: 'AKTU Syllabus', l: '#' },
                                                { n: 'Gate Prep', l: '#' }
                                            ].map(res => (
                                                <a key={res.n} href={res.l} target="_blank" className="p-3 bg-slate-950/30 rounded-xl border border-white/5 hover:border-emerald-500/20 hover:scale-105 transition-all text-center">
                                                    <p className="text-[9px] font-black uppercase text-slate-500 hover:text-emerald-400">{res.n}</p>
                                                </a>
                                            ))}
                                        </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </main>
                </div>
            </div>

            {/* Post FAB */}
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => setShowModal(true)} className="fixed bottom-12 right-12 w-20 h-20 bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_80px_-15px_rgba(99,102,241,0.5)] z-50 group">
                <Plus size={32} weight="bold" />
            </motion.button>

            {/* Post Modal Upgrade */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl my-auto"
                        >
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                <div className="space-y-4 text-center">
                                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Share Your <span className="text-indigo-500 underline decoration-indigo-500/20">Voice</span></h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target a teacher, request a subject, or just vent.</p>
                                </div>

                                <div className="flex p-1.5 bg-slate-900/50 rounded-3xl border border-white/5">
                                    <button type="button" onClick={() => setNewPost({...newPost, type: 'request'})} className={`flex-1 py-4 rounded-[1.25rem] font-black text-xs uppercase transition-all ${newPost.type === 'request' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500'}`}>Subject Request</button>
                                    <button type="button" onClick={() => setNewPost({...newPost, type: 'vent'})} className={`flex-1 py-4 rounded-[1.25rem] font-black text-xs uppercase transition-all ${newPost.type === 'vent' ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-500'}`}>Campus Vent</button>
                                </div>

                                {/* Flexible Targeting */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Institution / College</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. PIT, AKTU, IET..."
                                            value={newPost.targetCollege}
                                            onChange={(e) => setNewPost({...newPost, targetCollege: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500/50"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mention Faculty (Optional)</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Dr. Vishal Kundu..."
                                            value={newPost.targetTeacher}
                                            onChange={(e) => setNewPost({...newPost, targetTeacher: e.target.value})}
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Categorize (Optional)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {PREDEFINED_TAGS.map(tag => (
                                            <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${newPost.tags.includes(tag) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}>#{tag}</button>
                                        ))}
                                    </div>
                                </div>

                                <textarea required value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} placeholder="What's happening on campus?" className="w-full h-40 bg-slate-950 border border-white/5 rounded-[2rem] p-8 text-white focus:border-indigo-500/50 outline-none resize-none" />

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <button type="button" onClick={() => setNewPost({...newPost, isAnonymous: !newPost.isAnonymous})} className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border transition-all ${newPost.isAnonymous ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'}`}>
                                        {newPost.isAnonymous ? <EyeSlash size={24} /> : <Eye size={24} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{newPost.isAnonymous ? 'Anonymous' : 'Public'}</span>
                                    </button>
                                    <button type="submit" className="flex-1 h-20 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all active:scale-95">SUBMIT TO WALL</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Footer Vibe Check */}
            <footer className="mt-20 py-12 border-t border-white/5 bg-slate-950/20 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black italic uppercase text-slate-500 tracking-tighter">System Vibe Check</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">How's your experience today?</p>
                    </div>
                    
                    <div className="flex justify-center gap-4 md:gap-8">
                        {[
                            { e: '😠', l: 'Poor', c: 'hover:text-red-500' },
                            { e: '🙁', l: 'Fair', c: 'hover:text-orange-500' },
                            { e: '🙂', l: 'Good', c: 'hover:text-yellow-500' },
                            { e: '😍', l: 'Great', c: 'hover:text-emerald-500' },
                            { e: '👑', l: 'Elite', c: 'hover:text-indigo-500' },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    toast.success(`Vibe Check: ${item.l} Recorded! ❤️`);
                                    console.log("Quick Vibe:", item.l);
                                }}
                                className={`flex flex-col items-center gap-2 group transition-all hover:scale-125 ${item.c}`}
                            >
                                <span className="text-3xl md:text-4xl grayscale group-hover:grayscale-0 transition-all">{item.e}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 group-hover:text-inherit">{item.l}</span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <button 
                            onClick={() => setShowFeedback(true)}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all group"
                        >
                            Want to say more? <span className="text-indigo-400 group-hover:underline">Submit Detailed Feedback</span>
                        </button>
                    </div>
                </div>
            </footer>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>
    );
};

export default CommunityPage;
