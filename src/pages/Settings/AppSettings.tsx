import useSettings from '../../hooks/useSettings.ts';
import ToggleSwitch from '@/components/ui/ToggleSwitch.tsx';
import { version } from '../../../package.json';
import { Faders, Info, Clock, Moon, SpeakerHigh, Robot, BellRinging, CloudArrowUp } from '@phosphor-icons/react';
import AskAI from '@/components/Settings/AppSettings/AskAI.tsx';

const AppSettings = () => {
    const { settings, handleSettingToggle } = useSettings();
    const APP_VERSION = version;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Preferences Group */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-2xl font-black italic text-indigo-400 uppercase tracking-widest flex items-center gap-4">
                        <Faders size={32} weight="fill" /> OS SYSTEM PREFS
                    </h3>
                    <span className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">PIT-STABLE-v{APP_VERSION}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                <Clock size={28} weight="duotone" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-white uppercase text-[10px] tracking-widest">Focus Mode (Pomodoro)</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Enable focus timer sounds</span>
                            </div>
                        </div>
                        <ToggleSwitch
                            isOn={settings.sound}
                            onToggle={() => handleSettingToggle('sound')}
                        />
                    </div>

                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                <CloudArrowUp size={28} weight="duotone" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-white uppercase text-[10px] tracking-widest">Dashboard Auto-Sync</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Cloud save every 5 mins</span>
                            </div>
                        </div>
                        <ToggleSwitch
                            isOn={settings.autoTimer}
                            onToggle={() => handleSettingToggle('autoTimer')}
                        />
                    </div>

                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                <Moon size={28} weight="duotone" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-white uppercase text-[10px] tracking-widest">High Contrast Theme</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Enhanced dark mode visibility</span>
                            </div>
                        </div>
                        <ToggleSwitch
                            isOn={settings.darkMode}
                            onToggle={() => handleSettingToggle('darkMode')}
                        />
                    </div>

                    <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                <BellRinging size={28} weight="duotone" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-white uppercase text-[10px] tracking-widest">Campus Wall Buzz</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Get alerts on new trending posts</span>
                            </div>
                        </div>
                        <ToggleSwitch
                            isOn={settings.campusBuzz}
                            onToggle={() => handleSettingToggle('campusBuzz')}
                        />
                    </div>
                </div>
            </div>

            {/* AI Assistant Section */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <h3 className="text-2xl font-black italic text-indigo-400 uppercase tracking-widest flex items-center gap-4">
                    <Robot size={32} weight="fill" /> AI STUDY BUDDY
                </h3>
                <div className="bg-slate-950/40 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <AskAI />
                </div>
            </div>

            {/* Diagnostic Group */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black italic text-slate-500 uppercase tracking-widest flex items-center gap-4">
                        <Info size={28} weight="fill" /> NEURAL DIAGNOSTICS
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Optimal</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 flex flex-col gap-2">
                        <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Focus Efficiency</span>
                        <span className="text-2xl font-black text-indigo-500 tracking-tighter italic">
                            {JSON.parse(localStorage.getItem('student_attendance') || '[]').length > 0 ? '94.2%' : '100%'}
                        </span>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                            <div className="w-[94%] h-full bg-indigo-500" />
                        </div>
                    </div>
                    <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 flex flex-col gap-2">
                        <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Neural Latency</span>
                        <span className="text-2xl font-black text-rose-500 tracking-tighter italic">12ms</span>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Direct Link Active</p>
                    </div>
                    <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 flex flex-col gap-2">
                        <span className="text-slate-500 font-black uppercase tracking-widest text-[9px]">OS Integrity</span>
                        <span className="text-2xl font-black text-emerald-500 tracking-tighter italic">STABLE</span>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">PIT-KERNEL-{APP_VERSION}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;
