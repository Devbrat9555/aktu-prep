import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Brain,
    ChartPieSlice,
    Lightning,
    GraduationCap,
    Video,
    BookOpen,
    IdentificationCard,
    Robot,
    Broadcast,
    ArchiveBox,
    Sparkle
} from '@phosphor-icons/react';
import useSettings from '../hooks/useSettings.ts';
import About from './About.tsx';
import { Button } from '@/components/ui/button.tsx';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const coreSystems = [
    {
        icon: Robot,
        title: 'Neural AI Buddy',
        desc: 'Advanced AI personas designed to solve complex GATE and AKTU problems with step-by-step logic.',
        color: 'text-indigo-500'
    },
    {
        icon: Broadcast,
        title: 'Campus Pulse',
        desc: 'A live global wall to vent, target faculty, or request subjects across the university network.',
        color: 'text-rose-500'
    },
    {
        icon: IdentificationCard,
        title: 'Academic ID Hub',
        desc: 'Your digital identity. Manage Roll Numbers, Year, and Branch in a premium interface.',
        color: 'text-amber-500'
    },
    {
        icon: ArchiveBox,
        title: 'Study Vault',
        desc: '10 Years of PYQs, Lab Manuals, and Unit Notes organized in a distraction-free environment.',
        color: 'text-emerald-500'
    },
    {
        icon: ChartPieSlice,
        title: 'Performance Radar',
        desc: 'Track attendance, unit progress, and CGPA targets with real-time neural diagnostics.',
        color: 'text-sky-500'
    },
    {
        icon: Brain,
        title: 'Cognitive Mode',
        desc: 'Built-in Pomodoro timers and breathing exercises to keep your brain in peak performance.',
        color: 'text-purple-500'
    },
];

const LandingPage = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();

    return (
        <div className="relative w-full bg-[#020617] text-white overflow-x-hidden min-h-screen font-outfit">
            {/* Neural Backdrop */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-600/5 blur-[150px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Navigation */}
            <header className="fixed top-0 z-[100] w-full flex items-center justify-between px-6 md:px-20 py-8 bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Lightning size={32} weight="fill" className="text-indigo-500" />
                    </div>
                    <span className="text-2xl font-black italic uppercase tracking-tighter">AKTU <span className="text-indigo-500">PREP</span></span>
                </div>
                
                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/settings')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all">Settings</button>
                        <button onClick={() => navigate('/about')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all">About</button>
                    </div>

                    <div className="flex items-center gap-6">
                        <SignedIn>
                            <Button onClick={() => navigate('/dashboard')} className="bg-white text-black hover:bg-slate-200 rounded-2xl font-black px-8 py-6 text-xs tracking-widest shadow-2xl shadow-white/5">
                                ENTER PORTAL
                            </Button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black px-8 py-6 text-xs tracking-widest shadow-2xl shadow-indigo-600/20">
                                    GET STARTED
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </header>

            <main className="relative pt-48 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                            <Sparkle size={16} weight="fill" className="text-indigo-500 animate-spin-slow" />
                            Designed for AKTU Students
                        </div>
                        <h1 className="text-7xl md:text-[10rem] font-black italic leading-[0.8] tracking-tighter text-white">
                            THE ULTIMATE <br />
                            <span className="text-indigo-500 underline decoration-indigo-500/20">STUDENT HUB</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed italic">
                            The ultimate digital companion for AKTU students. Organized resources, 
                            campus-wide networking, and a full academic library in one sleek interface.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                    >
                        <Button
                            size="lg"
                            onClick={() => navigate('/courses')}
                            className="h-24 px-16 bg-white text-slate-950 hover:bg-slate-200 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-white/5 w-full sm:w-auto transition-all hover:scale-105 italic"
                        >
                            EXPLORE RESOURCES <ArrowRight weight="bold" className="ml-3" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/community')}
                            className="h-24 px-16 border-white/10 hover:bg-white/5 rounded-[2.5rem] font-black text-2xl w-full sm:w-auto transition-all italic tracking-tighter uppercase"
                        >
                            COMMUNITY WALL
                        </Button>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto mt-60 space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Core <span className="text-indigo-500">Features</span></h2>
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Everything an AKTU Student Needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coreSystems.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-slate-950/40 p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden backdrop-blur-3xl"
                            >
                                <div className={`w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center ${f.color} mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                    <f.icon size={44} weight="duotone" />
                                </div>
                                <h3 className="text-2xl font-black italic mb-4 uppercase text-white tracking-tight leading-none">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed italic">{f.desc}</p>
                                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Industrial Banner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="max-w-7xl mx-auto mt-60 py-40 bg-indigo-600 rounded-[6rem] text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)]"
                >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    <div className="relative z-10 space-y-10">
                        <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20">
                            <GraduationCap size={56} weight="fill" className="text-white animate-pulse" />
                        </div>
                        <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter uppercase text-white leading-none">AKTU <span className="text-slate-900/40">READY</span></h2>
                        <p className="text-white font-black text-xl uppercase tracking-[0.5em] opacity-80">Empowering the Students of AKTU.</p>
                    </div>
                </motion.div>
            </main>

            <About landing={true} />

            <footer className="py-20 text-center border-t border-white/5 bg-slate-950/50 backdrop-blur-3xl">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Lightning size={32} weight="fill" className="text-indigo-500" />
                    <span className="text-2xl font-black italic uppercase tracking-tighter text-white">AKTU <span className="text-indigo-500">PREP</span></span>
                </div>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
                    &copy; {new Date().getFullYear()} AKTU Prep &bull; Built for Students
                </p>
            </footer>
        </div>
    );
}

export default LandingPage;
