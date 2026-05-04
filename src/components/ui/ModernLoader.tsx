import { DiscordLogoIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export default function ModernLoader() {
    return (
        <div
            className="w-full h-lvh flex flex-col items-center justify-center bg-white dark:bg-zinc-900"
            role="status"
            aria-busy="true"
        >
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Glowing Pulse Dot */}
                <motion.div
                    className="absolute w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                    animate={{
                        scale: [1, 1.8, 1],
                        opacity: [1, 0.4, 1],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Ring Spinner */}
                <motion.div
                    className="absolute w-full h-full border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: 'linear',
                    }}
                />

                {/* Inner Glow Ring */}
                <div className="w-16 h-16 rounded-full bg-indigo-500/5 backdrop-blur-xl border border-white/5"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/50 animate-pulse"
            >
                Kernel Syncing...
            </motion.div>
        </div>
    );
}
