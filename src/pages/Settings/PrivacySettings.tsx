import useAuth from '../../hooks/useAuth.ts';
import useSettings from '../../hooks/useSettings.ts';
import ToggleSwitch from '../../components/ui/ToggleSwitch.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SignOutIcon, SignInIcon, Broom, ShieldCheck, Database, Export, FileText } from '@phosphor-icons/react';
import { getUserProfile } from '@/helper.ts';
import { toast } from 'sonner';

const PrivacySettings = () => {
    const { logout, setShowLogin } = useAuth();
    const { settings, handleSettingToggle } = useSettings();
    const user = getUserProfile();

    const handleClearStudyData = () => {
        localStorage.removeItem('student_attendance');
        localStorage.removeItem('student_projects');
        localStorage.removeItem('student_notes');
        localStorage.removeItem('student_units');
        localStorage.removeItem('student_assignments');
        toast.success("Study Dashboard data wiped clean! 🧹");
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleExportNotes = () => {
        const notes = localStorage.getItem('student_notes') || "No notes found.";
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'My_Academic_Scribes.txt';
        a.click();
        toast.success("Academic Scribes exported to .txt!");
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Privacy Controls */}
            <div className="space-y-8">
                <h3 className="text-2xl font-black italic text-indigo-400 uppercase tracking-widest flex items-center gap-4">
                    <ShieldCheck size={32} weight="fill" /> OS DATA SECURITY
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex flex-col">
                            <span className="font-black text-white uppercase text-[10px] tracking-widest">Global Anonymity</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Always post as anonymous by default</span>
                        </div>
                        <ToggleSwitch
                            isOn={settings.dataCollection}
                            onToggle={() => handleSettingToggle('dataCollection')}
                        />
                    </div>

                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex flex-col">
                            <span className="font-black text-white uppercase text-[10px] tracking-widest">Share Rank Score</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Make your CGPA target public on wall</span>
                        </div>
                        <ToggleSwitch
                            isOn={settings.shareProgress}
                            onToggle={() => handleSettingToggle('shareProgress')}
                        />
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <h3 className="text-2xl font-black italic text-indigo-400 uppercase tracking-widest flex items-center gap-4">
                    <Database size={32} weight="fill" /> KERNEL STORAGE
                </h3>
                
                <div className="flex flex-col md:flex-row gap-6">
                    <Button onClick={handleExportNotes} className="flex-1 h-20 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all">
                        <Export className="mr-3" size={24} weight="bold" />
                        Export Academic Scribes (.txt)
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex-1 h-20 bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all">
                                <Broom className="mr-3" size={24} weight="bold" />
                                Wipe Local OS Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#020617] border-white/10 text-white rounded-[3rem] p-10">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Initiate OS Wipe?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400 font-bold uppercase text-xs tracking-wider leading-relaxed">
                                    Warning: This will permanently delete your attendance, project progress, syllabus units, and scribbles. Your account will remain, but your student dashboard will be reset.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 gap-4">
                                <AlertDialogCancel className="h-14 px-8 bg-slate-900 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">Abort Wipe</AlertDialogCancel>
                                <AlertDialogAction
                                    className="h-14 px-8 bg-rose-600 hover:bg-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-rose-600/30"
                                    onClick={handleClearStudyData}
                                >
                                    Confirm Kernel Reset
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Session Management */}
            <div className="pt-12 border-t border-white/5">
                {user ? (
                    <Button
                        className="w-full h-16 bg-slate-900 border border-white/5 text-slate-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                        onClick={() => logout()}
                    >
                        <SignOutIcon className="mr-3" size={20} weight="bold" />
                        Terminate Active Session
                    </Button>
                ) : (
                    <Button 
                        className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all"
                        onClick={() => setShowLogin(true)}
                    >
                        <SignInIcon className="mr-3" size={24} weight="bold" />
                        Initialize Login
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PrivacySettings;
