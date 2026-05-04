import { Robot, GraduationCap, Lightning, Brain, Sparkle, Globe, ChatCircleText } from '@phosphor-icons/react';
import { PROVIDERS } from '@/data/ai_providers.ts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import type { AIProvider } from '@/types/Settings.ts';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import useSettings from '@/hooks/useSettings';
import { useState } from 'react';

const STUDY_PERSONAS = [
    { id: 'tutor', label: 'Friendly Tutor', icon: <GraduationCap />, desc: 'Simple explanations for beginners' },
    { id: 'expert', label: 'Exam Master', icon: <Lightning />, desc: 'Deep-dives into GATE/AKTU logic' },
    { id: 'summary', label: 'Concept Mapper', icon: <Brain />, desc: 'Quick bullets and formula sheets' },
];

const AskAI = () => {
    const { settings, handleSettingToggle } = useSettings();

    return (
        <div className="space-y-10">
            {/* AI Provider Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1 flex items-center gap-2">
                            <Globe size={16} weight="fill" /> AI Brain Core
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Select your preferred intelligence engine</p>
                    </div>
                </div>

                <RadioGroup
                    value={settings.aiProvider ?? 'chatgpt'}
                    onValueChange={(value) => handleSettingToggle('aiProvider', value as AIProvider)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {PROVIDERS.map((p) => {
                        const isActive = (settings.aiProvider ?? 'chatgpt') === p.id;
                        return (
                            <Label
                                key={p.id}
                                className={`flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-5 transition-all
                                ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}
                            >
                                <RadioGroupItem value={p.id} className="sr-only" />
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                                    <Robot size={28} weight={isActive ? 'fill' : 'thin'} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-white leading-none mb-1">
                                        {p.label}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {p.desc}
                                    </p>
                                </div>
                            </Label>
                        );
                    })}
                </RadioGroup>
            </div>

            {/* Persona Section */}
            <div className="pt-10 border-t border-white/5">
                <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-1 flex items-center gap-2">
                        <Sparkle size={16} weight="fill" /> Study Persona
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Personalize how the AI explains concepts to you</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STUDY_PERSONAS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleSettingToggle('studyPersona', p.id as any)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all text-center
                            ${settings.studyPersona === p.id ? 'bg-rose-600/10 border-rose-500 text-rose-400 shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                        >
                            <div className="text-2xl">{p.icon}</div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest">{p.label}</p>
                                <p className="text-[8px] font-bold uppercase opacity-60 leading-tight">{p.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Smart Preset Status */}
            <div className="flex items-center gap-4 p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                <ChatCircleText size={24} weight="fill" className="text-indigo-400" />
                <div>
                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Smart-Prompt Active</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">AI instructions are automatically optimized for B.Tech subjects.</p>
                </div>
            </div>
        </div>
    );
};

export default AskAI;

