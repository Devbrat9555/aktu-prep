import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CloudArrowUp, Link, BookOpen, PaperPlaneRight, CaretDown } from '@phosphor-icons/react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { getSubjects } from '../services/api';

interface ContributionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContributionModal: React.FC<ContributionModalProps> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        course: 'B.Tech',
        semester: '1st Sem',
        subject: '',
        type: 'note' as 'note' | 'lecture',
        content: ''
    });
    
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [method, setMethod] = useState<'link' | 'file'>('link');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fetch subjects when course or semester changes
    useEffect(() => {
        if (!isOpen) return;

        const fetchSubjectList = async () => {
            setLoadingSubjects(true);
            try {
                // Determine Year based on Semester
                let year = '1st Year';
                if (formData.semester.includes('3') || formData.semester.includes('4')) year = '2nd Year';
                if (formData.semester.includes('5') || formData.semester.includes('6')) year = '3rd Year';
                if (formData.semester.includes('7') || formData.semester.includes('8')) year = '4th Year';

                const response = await getSubjects(formData.course, year, formData.semester);
                setSubjects(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, subject: response.data[0].name }));
                } else {
                    setFormData(prev => ({ ...prev, subject: '' }));
                }
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
                setSubjects([]);
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchSubjectList();
    }, [formData.course, formData.semester, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to contribute!");
            return;
        }

        if (!formData.subject && !loadingSubjects) {
            toast.error("Please select a subject!");
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        data.append('studentName', user.fullName || user.username || "Student");
        data.append('studentEmail', user.primaryEmailAddress?.emailAddress || "no-email@aktu.ac.in");
        data.append('course', formData.course);
        data.append('semester', formData.semester);
        data.append('subject', formData.subject);
        data.append('type', formData.type);
        
        if (formData.type === 'note' && method === 'file' && file) {
            // Check if file is > 10MB (Cloudinary Free Limit)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File is too large! Maximum limit is 10MB. Please use a Google Drive link instead.");
                setIsSubmitting(false);
                return;
            }
            data.append('file', file);
            data.append('content', 'FILE_UPLOAD'); 
        } else {
            data.append('content', formData.content);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/contributions/submit`, {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                toast.success("Submitted! Admin will review and approve soon.");
                onClose();
                setFormData({ course: 'B.Tech', semester: '1st Sem', subject: '', type: 'note', content: '' });
                setFile(null);
            } else {
                const errorData = await response.json();
                toast.error(`ERROR: ${errorData.error || errorData.message || "Failed to submit"}`);
            }
        } catch (error) {
            toast.error("Network error. Try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                    <CloudArrowUp size={28} weight="duotone" className="text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tighter leading-tight">Contribution <span className="text-indigo-500">Vault</span></h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Add study material to the database</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Course</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer text-white"
                                            value={formData.course}
                                            onChange={e => setFormData({...formData, course: e.target.value})}
                                        >
                                            <option value="B.Tech" className="bg-slate-900 text-white">B.TECH (Engineering)</option>
                                            <option value="MBA" className="bg-slate-900 text-white">MBA (Management)</option>
                                            <option value="B.Pharma" className="bg-slate-900 text-white">B.PHARMA (Medical)</option>
                                        </select>
                                        <CaretDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Semester</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer text-white"
                                            value={formData.semester}
                                            onChange={e => setFormData({...formData, semester: e.target.value})}
                                        >
                                            {[1,2,3,4,5,6,7,8].map(s => (
                                                <option key={s} value={`${s}${s===1?'st':s===2?'nd':s===3?'rd':'th'} Sem`} className="bg-slate-900 text-white">
                                                    {s}{s===1?'ST':s===2?'ND':s===3?'RD':'TH'} SEMESTER
                                                </option>
                                            ))}
                                        </select>
                                        <CaretDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Subject</label>
                                <div className="relative">
                                    <select 
                                        disabled={loadingSubjects}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer text-white disabled:opacity-50"
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                    >
                                        {loadingSubjects ? (
                                            <option>Loading Subjects...</option>
                                        ) : subjects.length > 0 ? (
                                            subjects.map(sub => (
                                                <option key={sub._id} value={sub.name} className="bg-slate-900 text-white">
                                                    {sub.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No subjects found for this semester</option>
                                        )}
                                    </select>
                                    <CaretDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Material Type</label>
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'note'})}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'note' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            Study Note
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'lecture'})}
                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${formData.type === 'lecture' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            Lecture
                                        </button>
                                    </div>
                                </div>

                                {formData.type === 'note' && (
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setMethod('link')}
                                            className={`flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${method === 'link' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                                        >
                                            <Link size={16} /> Link
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setMethod('file')}
                                            className={`flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${method === 'file' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                                        >
                                            <CloudArrowUp size={16} /> Upload PDF
                                        </button>
                                    </div>
                                )}

                                {formData.type === 'lecture' || method === 'link' ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                            {formData.type === 'note' ? 'Google Drive / Resource Link' : 'YouTube / Lecture Link'}
                                        </label>
                                        <div className="relative">
                                            <input 
                                                required
                                                type="url"
                                                placeholder="https://..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all pl-12 text-white"
                                                value={formData.content}
                                                onChange={e => setFormData({...formData, content: e.target.value})}
                                            />
                                            <Link size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Upload PDF File</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                <CloudArrowUp size={32} className={`mb-2 ${file ? 'text-emerald-500' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate max-w-full">
                                                    {file ? file.name : 'Click to select PDF'}
                                                </p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting || loadingSubjects}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 group"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit for Approval
                                        <PaperPlaneRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContributionModal;
