import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { 
    Terminal, 
    Code, 
    Globe, 
    Cpu, 
    BracketsAngle, 
    TrendUp, 
    PlayCircle, 
    BookOpen, 
    Lightning,
    ArrowRight,
    ArrowLeft,
    Folder,
    MonitorPlay,
    MagnifyingGlass,
    ArrowClockwise
} from '@phosphor-icons/react';

const CodingPage = () => {
    const { user } = useUser();
    const [groupedResources, setGroupedResources] = useState({});
    const [activeBatch, setActiveBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeVideo, setActiveVideo] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [videoStatus, setVideoStatus] = useState('idle');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/coding');
            if (response.data.success) {
                const data = response.data.data;
                setIsSyncing(Boolean(response.data.syncing));
                
                // Sort each batch strictly by Telegram Message ID to match the sequence
                const sortedData = {};
                Object.keys(data).forEach(batch => {
                    sortedData[batch] = [...data[batch]].sort((a, b) => {
                        const idA = parseInt(a.url?.split('/').pop() || 0);
                        const idB = parseInt(b.url?.split('/').pop() || 0);
                        return idA - idB;
                    });
                });

                setGroupedResources(sortedData);
                
                // Auto-select first batch
                const batches = Object.keys(sortedData);
                if (batches.length > 0 && !activeBatch) {
                    const priority = ['PW Web Dev', 'Rohit Negi Web Dev', 'Dot Web Dev', 'Supreme DSA'];
                    const first = priority.find(b => sortedData[b]) || batches[0];
                    setActiveBatch(first);
                }
            }
        } catch (err) {
            console.error('Error fetching coding resources:', err);
            setIsSyncing(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        if (!isSyncing) return;
        const interval = setInterval(() => {
            fetchResources();
        }, 4000);
        return () => clearInterval(interval);
    }, [isSyncing]);

    const batchOrder = ['PW Web Dev', 'Rohit Negi Web Dev', 'Dot Web Dev', 'Supreme DSA'];
    const allBatches = Object.keys(groupedResources).sort((a, b) => {
        const ai = batchOrder.indexOf(a);
        const bi = batchOrder.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
    const currentBatchData = activeBatch ? groupedResources[activeBatch] : [];
    
    // Filter out Cheat Sheets for separate display
    const cheatSheets = currentBatchData.filter(v => (v.title || '').toLowerCase().includes('cheat sheet'));
    const regularVideos = currentBatchData.filter(v => !(v.title || '').toLowerCase().includes('cheat sheet') && (v.title || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const warmVideoStream = async (video) => {
        if (video.type !== 'video') return;
        const msgId = video.url.split('/').pop();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        try {
            await fetch(`/api/coding/stream/${msgId}`, {
                method: 'GET',
                headers: { Range: 'bytes=0-262143' },
                signal: controller.signal,
            });
        } catch (_) {
            // Warmup is best-effort only.
        } finally {
            clearTimeout(timeout);
        }
    };

    const handleVideoSelect = async (video) => {
        setVideoStatus('loading');
        await warmVideoStream(video);
        setActiveVideo(video);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const VideoCard = ({ item, idx, isCompact = false }) => {
        const [isVideoLoading, setIsVideoLoading] = useState(false);
        const isActive = activeVideo?._id === item._id;
        const isZip = (item.title || '').toLowerCase().includes('.zip');
        
        const handleClick = async () => {
            if (isZip) {
                // Direct download for ZIP files
                window.open(`/api/coding/stream/${item.url.split('/').pop()}`, '_blank');
            } else {
                await handleVideoSelect(item);
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleClick}
                className={`group glass rounded-[2rem] overflow-hidden border transition-all cursor-pointer ${
                    isActive ? 'border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10' : 'border-white/5 hover:border-emerald-500/30 bg-white/[0.01]'
                } ${isCompact ? 'p-4' : 'p-6'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
                    }`}>
                        {isZip ? <Folder size={24} weight="fill" /> : (item.type === 'notes' ? <BookOpen size={24} weight="fill" /> : <PlayCircle size={24} weight="fill" />)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-base font-bold italic uppercase tracking-tight truncate ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {isZip ? 'ZIP Archive' : `Resource ${idx + 1}`}
                            </span>
                            {isActive && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">• Playing</span>}
                        </div>
                    </div>
                    {!isCompact && !activeVideo && (
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                            {isZip ? <ArrowRight size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 overflow-x-hidden font-sans scroll-smooth">
            {/* Animated Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
                {/* Hero Header - Hidden when video is active to save space */}
                {!activeVideo && (
                    <header className="mb-20 text-center lg:text-left flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-md"
                            >
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">Mega Deep Sync Active</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl lg:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9]"
                            >
                                Coding <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Repository</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed italic"
                            >
                                Optimized for {activeBatch || 'your batches'}. Select a lecture to start learning.
                            </motion.p>
                        </div>

                        {/* Search & Refresh */}
                        <div className="flex flex-col gap-4 min-w-[320px]">
                            <div className="relative group">
                                <MagnifyingGlass size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search lectures..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-14 pr-8 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600 font-bold italic"
                                />
                            </div>
                            <button 
                                onClick={fetchResources}
                                className="flex items-center justify-center gap-3 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                            >
                                <ArrowClockwise size={18} className={loading ? 'animate-spin' : ''} />
                                Refresh Library
                            </button>
                        </div>
                    </header>
                )}

                {/* Main Player & Playlist Grid */}
                <div className={`grid grid-cols-1 ${activeVideo ? 'lg:grid-cols-3' : ''} gap-10`}>
                    
                    {/* Left Side: Player (If Active) */}
                    {activeVideo && (
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-video w-full rounded-[3rem] overflow-hidden bg-black border border-white/10 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]"
                            >
                                {activeVideo.type === 'video' ? (
                                    <video 
                                        key={activeVideo._id}
                                        src={`/api/coding/stream/${activeVideo.url.split('/').pop()}`}
                                        className="absolute inset-0 w-full h-full"
                                        controls
                                        autoPlay
                                        preload="auto"
                                        playsInline
                                        onLoadedData={() => setVideoStatus('ready')}
                                        onWaiting={() => setVideoStatus('buffering')}
                                        onPlaying={() => setVideoStatus('ready')}
                                    />
                                ) : (
                                    <iframe 
                                        src={`${activeVideo.url}?embed=1`}
                                        className="absolute inset-0 w-full h-full border-none"
                                        title={activeVideo.title}
                                    />
                                )}
                            </motion.div>
                            
                            <div className="flex items-center justify-between px-4">
                                <div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tight text-white mb-2">{activeVideo.title}</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                            {activeBatch}
                                        </span>
                                        {activeVideo.type === 'video' && (
                                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                                {videoStatus === 'loading' ? 'Starting...' : videoStatus === 'buffering' ? 'Buffering...' : 'Playing'}
                                            </span>
                                        )}
                                        <button 
                                            onClick={() => setActiveVideo(null)}
                                            className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <ArrowLeft size={14} weight="bold" /> Close Player
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Consolidated Cheat Sheets Card */}
                            {cheatSheets.length > 0 && (
                                <div className="glass p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/[0.02] flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <Lightning size={32} weight="fill" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Mega Cheat Sheet</h3>
                                            <p className="text-slate-400 text-sm italic font-medium">All Git & VS Code shortcuts consolidated here.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {cheatSheets.map((sheet, i) => (
                                            <a 
                                                key={sheet._id}
                                                href={`/api/coding/stream/${sheet.url.split('/').pop()}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-6 py-3 bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                Part {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right Side: Batch Selector & List */}
                    <div className="space-y-8">
                        {/* Compact Batch Selector */}
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                            {allBatches.map(batchName => (
                                <button
                                    key={batchName}
                                    onClick={() => setActiveBatch(batchName)}
                                    className={`shrink-0 px-6 py-4 rounded-[1.5rem] border transition-all ${
                                        activeBatch === batchName 
                                        ? 'bg-emerald-600 border-emerald-500 text-white' 
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                                    }`}
                                >
                                    <span className="text-xs font-black italic uppercase">{batchName}</span>
                                </button>
                            ))}
                        </div>

                        {/* Video List */}
                        <div className={`space-y-4 ${activeVideo ? 'max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar' : 'grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0'}`}>
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4 lg:col-span-2">
                                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-emerald-500 font-black uppercase tracking-widest text-xs">Loading Lectures...</p>
                                </div>
                            ) : isSyncing && regularVideos.length === 0 ? (
                                <div className="py-20 text-center glass rounded-[3rem] border border-emerald-500/20 bg-emerald-500/[0.02] lg:col-span-2">
                                    <ArrowClockwise size={40} className="mx-auto text-emerald-400 mb-4 animate-spin" />
                                    <p className="text-emerald-400 font-black italic uppercase">Sync in progress</p>
                                    <p className="text-slate-400 text-sm mt-2">Batch data aa raha hai... auto refresh chalu hai.</p>
                                </div>
                            ) : regularVideos.length > 0 ? (
                                regularVideos.map((item, idx) => (
                                    <VideoCard 
                                        key={item._id} 
                                        item={item} 
                                        idx={idx} 
                                        isCompact={!!activeVideo}
                                    />
                                ))
                            ) : (
                                <div className="py-20 text-center glass rounded-[3rem] border border-white/5 lg:col-span-2">
                                    <BracketsAngle size={48} className="mx-auto text-slate-700 mb-4" />
                                    <p className="text-slate-500 font-black italic uppercase">No results found</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Styles */}
            <style>
                {`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass { backdrop-filter: blur(24px); }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.4); }
                `}
            </style>
        </div>
    );
};

export default CodingPage;
