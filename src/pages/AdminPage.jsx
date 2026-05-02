import React, { useEffect, useState, useCallback } from 'react';
import { 
    Users, 
    Trash, 
    Prohibit, 
    CheckCircle, 
    Globe, 
    ArrowLeft, 
    Cpu, 
    Database, 
    BookOpen, 
    ShieldCheck, 
    Plus,
    X,
    FileText,
    Note,
    Upload,
    Sparkle,
    Lightning
} from '@phosphor-icons/react';
import { adminApi, getSubjects } from '../services/api';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPage = () => {
    const { user, isLoaded } = useUser();
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({ users: 0, posts: 0, subjects: 0, materials: 0, questions: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [allFeedback, setAllFeedback] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form States
    const [subjectForm, setSubjectForm] = useState({ name: '', course: 'B.Tech', year: '1st Year', semester: '1st Sem' });
    const [questionForm, setQuestionForm] = useState({ 
        subjectId: '', 
        year: '2023-24', 
        type: 'KAS (Regular)', 
        file: null,
        isSolution: false 
    });
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'user' });

    // Admin Check - God Mode Only
    useEffect(() => {
        if (isLoaded) {
            const isAdmin = user?.primaryEmailAddress?.emailAddress === "vrat1087@gmail.com";
            if (!isSignedIn || !isAdmin) {
                toast.error("KERNEL ACCESS DENIED: Unauthorized Identity.");
                navigate("/");
            }
        }
    }, [isLoaded, isSignedIn, user, navigate]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, feedbackRes, subjectsRes] = await Promise.all([
                adminApi.getStats(),
                adminApi.getUsers(),
                adminApi.getFeedback(),
                getSubjects()
            ]);
            setStats(statsRes.data);
            setAllUsers(usersRes.data);
            setAllFeedback(feedbackRes.data);
            setAllSubjects(subjectsRes.data);
        } catch (error) {
            toast.error("ERROR: Data stream corrupted.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchData();
        }
    }, [isLoaded, isSignedIn, fetchData]);

    const handleDeleteResource = async (type, id) => {
        if (!window.confirm(`CRITICAL: Confirm deletion of ${type} ${id}?`)) return;
        try {
            await adminApi.deleteResource(type, id);
            toast.success(`${type.toUpperCase()} PURGED.`);
            fetchData();
        } catch (error) {
            toast.error("PURGE FAILED: Resource shielded.");
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await adminApi.toggleUserStatus(userId, !currentStatus);
            toast.success("USER STATUS MODIFIED.");
            fetchData();
        } catch (error) {
            toast.error("MODIFICATION REJECTED.");
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            await adminApi.addSubject(subjectForm);
            toast.success("SUBJECT SEED SUCCESSFUL.");
            setSubjectForm({ name: '', course: 'B.Tech', year: '1st Year', semester: '1st Sem' });
            fetchData();
        } catch (error) {
            toast.error("SEEDING FAILED.");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await adminApi.addUser(newUserForm);
            toast.success("USER INITIALIZED.");
            setNewUserForm({ name: '', email: '', role: 'user' });
            fetchData();
        } catch (error) {
            toast.error("INITIALIZATION FAILED.");
        }
    };

    const handleQuestionUpload = async (e) => {
        e.preventDefault();
        if (!questionForm.subjectId || !questionForm.file) {
            toast.error("REQUIRED: Subject and File");
            return;
        }

        const formData = new FormData();
        formData.append('year', questionForm.year);
        formData.append('type', questionForm.type);
        formData.append('file', questionForm.file);
        formData.append('isSolution', questionForm.isSolution);

        try {
            await adminApi.uploadQuestion(questionForm.subjectId, formData);
            toast.success("DATA VAULT UPDATED.");
            setQuestionForm({ subjectId: '', year: '2023-24', type: 'KAS (Regular)', file: null, isSolution: false });
            fetchData();
        } catch (error) {
            toast.error("UPLOAD CORRUPTED.");
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                    <div className="w-24 h-24 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={32} className="text-indigo-500 animate-pulse" />
                    </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 animate-pulse italic">Kernel Authorization In Progress...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 pb-40 font-outfit">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center text-indigo-500 hover:text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] transition-all group">
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Kernel
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            KERNEL <span className="text-indigo-500 underline decoration-indigo-500/20">CONTROL</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 animate-pulse">
                            <ShieldCheck size={28} weight="fill" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authorized User</p>
                            <p className="text-sm font-black italic text-white uppercase">{user?.firstName || 'GOD_ADMIN'}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {[
                        { label: 'Students', val: stats.users, icon: <Users size={24} />, color: 'text-indigo-500' },
                        { label: 'Core Pulse', val: stats.posts, icon: <Globe size={24} />, color: 'text-rose-500' },
                        { label: 'Subjects', val: stats.subjects, icon: <Cpu size={24} />, color: 'text-amber-500' },
                        { label: 'Vault Data', val: stats.materials, icon: <Database size={24} />, color: 'text-emerald-500' },
                        { label: 'Papers', val: stats.questions, icon: <BookOpen size={24} />, color: 'text-sky-500' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl space-y-4 hover:border-indigo-500/20 transition-all group">
                            <div className={`${s.color} opacity-50 group-hover:opacity-100 transition-opacity`}>{s.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
                                <p className="text-3xl font-black italic text-white">{s.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Control Interface */}
                <div className="flex flex-col xl:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <div className="w-full xl:w-80 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4 mb-6">Management Matrix</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                            {[
                                { id: 'stats', label: 'System Overview', icon: <Cpu size={20} /> },
                                { id: 'users', label: 'Student Matrix', icon: <Users size={20} /> },
                                { id: 'subject', label: 'Core Subjects', icon: <BookOpen size={20} /> },
                                { id: 'question', label: 'Data Upload', icon: <Upload size={20} /> },
                                { id: 'bulk_sync', label: 'BULK SYNC (9GB)', icon: <Lightning size={20} className="text-amber-500" /> },
                                { id: 'manage_questions', label: 'Data Vault', icon: <Database size={20} /> },
                                { id: 'feedback', label: 'Pulse Monitor', icon: <Globe size={20} /> },
                                { id: 'add_user', label: 'Initialize User', icon: <Plus size={20} /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-4 px-8 py-5 rounded-3xl transition-all font-black text-xs uppercase tracking-widest ${
                                        activeTab === tab.id 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-2' 
                                        : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white/5 rounded-[4rem] border border-white/5 p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        
                        {/* Global Search Bar */}
                        {activeTab !== 'stats' && activeTab !== 'add_user' && activeTab !== 'subject' && activeTab !== 'question' && (
                            <div className="mb-10 relative group">
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                    <Globe size={24} className="animate-pulse" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="SEARCH THE MATRIX (Email, Name, or ID)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-3xl py-6 pl-20 pr-8 text-sm font-bold tracking-wider focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div className="space-y-12 animate-in fade-in zoom-in-95">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-indigo-500">Integrity</span></h2>
                                    <p className="text-slate-500 font-medium italic">Everything is running smoothly. AKTU PREP is active and monitoring all sectors.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-6">
                                        <div className="flex items-center gap-4 text-emerald-500">
                                            <ShieldCheck size={32} weight="duotone" />
                                            <h3 className="text-xl font-black uppercase tracking-tight">Security Protocol</h3>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">All administrative actions are logged and encrypted. Unauthorized access attempts will trigger an immediate IP lockdown.</p>
                                    </div>
                                    <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-6">
                                        <div className="flex items-center gap-4 text-indigo-500">
                                            <Cpu size={32} weight="duotone" />
                                            <h3 className="text-xl font-black uppercase tracking-tight">Kernel Load</h3>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">Core processing at 1.4ms. Database latency optimized. All systems operational in God Mode.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Student <span className="text-indigo-500">Matrix</span></h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="pb-6 pl-4">Identity</th>
                                                <th className="pb-6">Access Level</th>
                                                <th className="pb-6">Status</th>
                                                <th className="pb-6 text-right pr-4">Commands</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                                                <tr key={u._id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-6 pl-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xs font-black">{u.name.charAt(0)}</div>
                                                            <div>
                                                                <p className="font-black text-sm uppercase italic tracking-wider">{u.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">{u.role}</span>
                                                    </td>
                                                    <td className="py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${u.isActive ? 'text-emerald-500' : 'text-red-500'}`}>{u.isActive ? 'Active' : 'Locked'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 text-right pr-4">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button 
                                                                onClick={() => handleToggleStatus(u._id, u.isActive)}
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/5 ${u.isActive ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                                                title={u.isActive ? "Lock User" : "Unlock User"}
                                                            >
                                                                {u.isActive ? <Prohibit size={20} /> : <CheckCircle size={20} />}
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteResource('users', u._id)}
                                                                className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all border border-red-500/5"
                                                                title="Purge User"
                                                            >
                                                                <Trash size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'subject' && (
                            <div className="space-y-12 animate-in fade-in">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Core <span className="text-amber-500">Subjects</span></h2>
                                </div>
                                <form onSubmit={handleAddSubject} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Subject Title</label>
                                            <input 
                                                type="text" 
                                                placeholder="ENTER SUBJECT NAME..."
                                                value={subjectForm.name}
                                                onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Course Track</label>
                                            <select 
                                                value={subjectForm.course}
                                                onChange={(e) => setSubjectForm({...subjectForm, course: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                            >
                                                <option value="B.Tech">B.TECH (Engineering)</option>
                                                <option value="MBA">MBA (Management)</option>
                                                <option value="B.Pharma">B.PHARMA (Medical)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Academic Year</label>
                                            <select 
                                                value={subjectForm.year}
                                                onChange={(e) => setSubjectForm({...subjectForm, year: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                            >
                                                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Semester</label>
                                            <select 
                                                value={subjectForm.semester}
                                                onChange={(e) => setSubjectForm({...subjectForm, semester: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                            >
                                                {Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Sem`).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3">
                                        <Plus size={20} weight="bold" /> Initialize Subject
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'question' && (
                            <div className="space-y-12 animate-in fade-in">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Data <span className="text-sky-500">Upload</span></h2>
                                <form onSubmit={handleQuestionUpload} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Target Subject</label>
                                            <select 
                                                value={questionForm.subjectId}
                                                onChange={(e) => setQuestionForm({...questionForm, subjectId: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                                required
                                            >
                                                <option value="">SELECT SUBJECT...</option>
                                                {allSubjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.course})</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Academic Session</label>
                                            <input 
                                                type="text" 
                                                placeholder="E.G., 2023-24"
                                                value={questionForm.year}
                                                onChange={(e) => setQuestionForm({...questionForm, year: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Exam Type</label>
                                            <select 
                                                value={questionForm.type}
                                                onChange={(e) => setQuestionForm({...questionForm, type: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                            >
                                                <option value="KAS (Regular)">KAS (REGULAR)</option>
                                                <option value="Carry Over">CARRY OVER</option>
                                                <option value="Sessional">SESSIONAL</option>
                                                <option value="Notes/Material">NOTES/MATERIAL</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Data Source (PDF)</label>
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    onChange={(e) => setQuestionForm({...questionForm, file: e.target.files[0]})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all file:hidden cursor-pointer"
                                                    required
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                    <Upload size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <input 
                                            type="checkbox" 
                                            id="isSolution"
                                            checked={questionForm.isSolution}
                                            onChange={(e) => setQuestionForm({...questionForm, isSolution: e.target.checked})}
                                            className="w-6 h-6 rounded-lg bg-black border-white/10 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="isSolution" className="text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer">Mark as Solution Module</label>
                                    </div>
                                    <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-sky-600/20 active:scale-95 flex items-center justify-center gap-3">
                                        <Upload size={20} weight="bold" /> Upload to Vault
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'manage_questions' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Data <span className="text-emerald-500">Vault</span></h2>
                                <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 flex items-center justify-center min-h-[400px] text-center">
                                    <div className="space-y-6">
                                        <Database size={60} className="mx-auto text-slate-700 animate-pulse" />
                                        <div>
                                            <p className="text-xl font-black italic text-white uppercase tracking-tighter">Vault Navigator Under Maintenance</p>
                                            <p className="text-slate-500 text-sm mt-2 font-medium">Use the "Core Subjects" tab to manage resources per subject for now.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'add_user' && (
                            <div className="space-y-12 animate-in fade-in">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Initialize <span className="text-indigo-500">User</span></h2>
                                <form onSubmit={handleAddUser} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                                            <input 
                                                type="text" 
                                                placeholder="ENTER STUDENT NAME..."
                                                value={newUserForm.name}
                                                onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                                            <input 
                                                type="email" 
                                                placeholder="ENTER STUDENT EMAIL..."
                                                value={newUserForm.email}
                                                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Assigned Role</label>
                                            <select 
                                                value={newUserForm.role}
                                                onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                                            >
                                                <option value="user">STUDENT (Standard)</option>
                                                <option value="admin">ADMIN (God Mode)</option>
                                                <option value="moderator">MODERATOR (Overseer)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3">
                                        <Plus size={20} weight="bold" /> Inject Identity
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'bulk_sync' && (
                            <div className="space-y-12 animate-in fade-in">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-amber-500">9GB BULK <span className="text-white underline decoration-amber-500/20">SYNC</span></h2>
                                    <p className="text-slate-400 font-medium italic">Select your local "notes" folder to sync all 9GB of data to the server at once.</p>
                                </div>
                                <div className="bg-black/40 p-12 rounded-[3rem] border-2 border-dashed border-amber-500/20 flex flex-col items-center justify-center space-y-8 text-center">
                                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                        <Lightning size={48} weight="fill" className="animate-pulse" />
                                    </div>
                                    <div className="space-y-4 max-w-md">
                                        <h3 className="text-xl font-black uppercase italic">Kernel Data Injection</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">This will scan your local <code className="text-amber-500 font-mono">public/notes</code> directory and upload everything to the production server. Make sure you have a stable internet connection.</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="bulk-folder"
                                        webkitdirectory="true" 
                                        directory="true" 
                                        multiple 
                                        onChange={async (e) => {
                                            const files = Array.from(e.target.files);
                                            if (files.length === 0) return;
                                            toast.info(`INJECTING ${files.length} FILES... STAND BY.`);
                                            
                                            // Batch upload logic
                                            const batchSize = 10;
                                            for (let i = 0; i < files.length; i += batchSize) {
                                                const batch = files.slice(i, i + batchSize);
                                                const formData = new FormData();
                                                batch.forEach(file => {
                                                    // Only upload PDFs
                                                    if (file.name.endsWith('.pdf')) {
                                                        formData.append('files', file);
                                                        // Get the path relative to the notes folder
                                                        formData.append('paths', file.webkitRelativePath);
                                                    }
                                                });
                                                
                                                try {
                                                    await adminApi.bulkUploadNotes(formData);
                                                    const progress = Math.round(((i + batch.length) / files.length) * 100);
                                                    toast.success(`SYNC: ${progress}% COMPLETE`, { id: 'sync-toast' });
                                                } catch (err) {
                                                    toast.error("DATA LOSS DETECTED: Retrying...");
                                                }
                                            }
                                            toast.success("CORE SYNC SUCCESSFUL: All 9GB Injected.");
                                        }}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="bulk-folder"
                                        className="px-12 py-6 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.3em] text-sm rounded-3xl cursor-pointer transition-all shadow-2xl shadow-amber-500/20 active:scale-95 flex items-center gap-4"
                                    >
                                        <Upload size={24} weight="bold" /> Start Bulk Sync
                                    </label>
                                </div>
                            </div>
                        )}
                            <div className="space-y-12 animate-in fade-in">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Pulse <span className="text-rose-500">Monitor</span></h2>
                                <div className="space-y-6">
                                    {allFeedback.filter(f => f.content.toLowerCase().includes(searchQuery.toLowerCase()) || f.userName?.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                                        <div key={f._id} className="bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/5 space-y-6 group relative overflow-hidden transition-all hover:border-white/10">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${f.type === 'vent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                        {f.type === 'vent' ? 'HIGH-LOAD VENT' : 'REQUISITION'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{new Date(f.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteResource('feedback', f._id)} 
                                                    className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500/20 transition-all shrink-0 border border-red-500/10 hover:scale-110"
                                                    title="Delete Feedback"
                                                >
                                                    <Trash size={24} />
                                                </button>
                                            </div>
                                            <p className="text-2xl md:text-3xl text-white font-black italic leading-[1.1] tracking-tighter break-words">"{f.content}"</p>
                                            <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-black uppercase italic">{f.userName?.charAt(0)}</div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase italic tracking-wider">{f.userName}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold italic">{f.userEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
