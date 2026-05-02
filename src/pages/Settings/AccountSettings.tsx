import { useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../helper.ts';
import { User, IdentificationCard, GraduationCap, FloppyDisk, CircleNotch, BookOpen, Hash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { toast } from 'sonner';

const AccountSettings = () => {
    const user = getUserProfile();
    const [name, setName] = useState(user?.name || '');
    const [college, setCollege] = useState(user?.college || 'Prasad Institute of Technology (PIT)');
    const [rollNo, setRollNo] = useState(user?.rollNo || '');
    const [branch, setBranch] = useState(user?.branch || 'Computer Science');
    const [year, setYear] = useState(user?.year || '3rd Year');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveButton = async () => {
        setIsSaving(true);
        try {
            const updated = { ...user, name, college, rollNo, branch, year };
            updateUserProfile(updated);
            localStorage.setItem('student_identity', JSON.stringify(updated));
            toast.success('Academic ID Updated! 🎓');
        } catch (err) {
            toast.error('Unable to sync ID card.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Identity Card Header */}
            <div className="relative group overflow-hidden p-8 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-black rounded-[3rem] border border-indigo-500/10 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.2)]">
                <div className="absolute top-0 right-0 p-8">
                    <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-2xl rotate-12 absolute -top-4 -right-4" />
                    <IdentificationCard size={80} weight="thin" className="text-indigo-500/10" />
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-indigo-600/10 border-2 border-indigo-500/20 p-1">
                            <div className="h-full w-full rounded-[2.2rem] overflow-hidden bg-slate-950 flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user?.avatar} alt="Student" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} weight="duotone" className="text-indigo-400" />
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-3">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1 block">Student Identity</span>
                            <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">
                                {name || 'UNREGISTERED'}
                            </h3>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">PIT-OS v2.4</span>
                            <span className="px-4 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">{branch}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4 flex items-center">
                        <User size={14} className="mr-2 text-indigo-500" /> Full Name
                    </Label>
                    <Input
                        className="h-16 bg-slate-950/50 border-white/5 rounded-2xl text-sm font-bold text-white px-6 focus:border-indigo-500/50 transition-all"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4 flex items-center">
                        <Hash size={14} className="mr-2 text-rose-500" /> Roll Number
                    </Label>
                    <Input
                        className="h-16 bg-slate-950/50 border-white/5 rounded-2xl text-sm font-bold text-white px-6 focus:border-rose-500/50 transition-all"
                        placeholder="AKTU Roll No"
                        onChange={(e) => setRollNo(e.target.value)}
                        value={rollNo}
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4 flex items-center">
                        <BookOpen size={14} className="mr-2 text-emerald-500" /> Academic Branch
                    </Label>
                    <select 
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full h-16 bg-slate-950/50 border border-white/5 rounded-2xl text-sm font-bold text-white px-6 outline-none focus:border-emerald-500/50 transition-all appearance-none"
                    >
                        {['Computer Science', 'Information Technology', 'Mechanical Eng', 'Civil Eng', 'Electrical Eng', 'Electronics Eng'].map(b => (
                            <option key={b} value={b} className="bg-slate-950">{b}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4 flex items-center">
                        <GraduationCap size={14} className="mr-2 text-amber-500" /> Academic Year
                    </Label>
                    <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-16 bg-slate-950/50 border border-white/5 rounded-2xl text-sm font-bold text-white px-6 outline-none focus:border-amber-500/50 transition-all appearance-none"
                    >
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                            <option key={y} value={y} className="bg-slate-950">{y}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">College / University</Label>
                    <Input
                        className="h-16 bg-slate-950/50 border-white/5 rounded-2xl text-sm font-bold text-white px-6 focus:border-indigo-500/50 transition-all"
                        placeholder="University Name"
                        onChange={(e) => setCollege(e.target.value)}
                        value={college}
                    />
                </div>
            </div>

            <Button
                onClick={handleSaveButton}
                className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                disabled={isSaving}
            >
                {isSaving ? (
                    <CircleNotch className="animate-spin" size={24} />
                ) : (
                    <div className="flex items-center gap-3">
                        <FloppyDisk size={24} weight="fill" />
                        <span>Sync Student ID Card</span>
                    </div>
                )}
            </Button>
        </div>
    );
};

export default AccountSettings;
