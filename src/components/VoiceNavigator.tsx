import React, { useState, useEffect } from 'react';
import { Microphone, X, Sparkle, Lightning } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCourses, getSubjects } from '../services/api';
import { toast } from 'sonner';

const VoiceNavigator = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const navigate = useNavigate();

    // Fetch all subjects once for matching
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const coursesRes = await getCourses();
                const subjectsPromises = coursesRes.data.map((c: any) => 
                    getSubjects(c.name, 1, 1).then(res => res.data) // Simplified for matching
                );
                // This is a simplified fetch, ideally we'd have a search endpoint
                // For now, let's just use the current subjects in the system
            } catch (err) {
                console.error('Failed to load subjects for voice search', err);
            }
        };
        fetchAll();
    }, []);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Your browser doesn't support voice commands. Try Chrome!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('Listening...');
        };

        recognition.onresult = async (event: any) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setTranscript(command);
            
            // Logic to handle command
            handleVoiceCommand(command);
        };

        recognition.onerror = () => {
            setIsListening(false);
            setTranscript('Failed to hear. Try again.');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleVoiceCommand = async (command: string) => {
        toast.info(`Searching for: "${command}"`);
        
        // Example: "Math 2 notes" or "Chemistry papers"
        // We'll search for the subject name in the command
        try {
            // Fetch subjects based on a broad search or common ones
            // For a production app, we'd call a search API
            const searchTerms = command.replace('notes', '').replace('papers', '').replace('ka', '').replace('dikhao', '').trim();
            
            // Navigate to search results with the term
            // This is the most reliable way: use the existing search infrastructure
            if (searchTerms.length > 1) {
                // If it contains "math 2", let's try to be smart
                // For now, let's redirect to a general search or try to find a direct match
                navigate(`/courses?search=${encodeURIComponent(searchTerms)}`);
                toast.success(`Opening ${searchTerms}...`);
            }
        } catch (err) {
            toast.error("Couldn't find that subject.");
        }
    };

    return (
        <>
            <div className="fixed bottom-32 left-8 z-[100] md:bottom-8 md:left-32">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startListening}
                    className={`p-5 rounded-full shadow-2xl border-2 border-white/10 transition-all ${
                        isListening ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'
                    } text-white`}
                >
                    {isListening ? <Sparkle size={28} weight="fill" className="animate-spin-slow" /> : <Microphone size={28} weight="duotone" />}
                </motion.button>

                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            className="absolute left-20 bottom-0 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-64 shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Lightning size={20} weight="fill" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Voice Command Active</p>
                            </div>
                            <p className="mt-3 text-sm text-white font-medium italic">"{transcript}"</p>
                            <p className="mt-2 text-[8px] text-slate-500 uppercase font-bold tracking-widest">Say subject name...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default VoiceNavigator;
