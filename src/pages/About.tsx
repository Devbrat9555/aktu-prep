import { motion } from 'framer-motion';
import { Heart, GraduationCap, Sparkle } from '@phosphor-icons/react';
import { fadeInUp, stagger } from '../utils/motionVariants.js';
import { useNavigate } from 'react-router-dom';
import { Text, Title } from '@/components/ui/typography.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import animatedLogo from '/animated_logo.svg';

const About = ({ landing = false }) => {
    const navigate = useNavigate();

    return (
        <div className={`mx-auto p-6 sm:p-12 pb-40 text-slate-200 bg-[#0f172a] ${landing ? '' : 'min-h-screen overflow-y-auto'}`}>
            {/* Header Section */}
            <motion.header
                initial="initial"
                animate="animate"
                variants={stagger}
                className="text-center my-12 sm:my-32"
            >
                <motion.div variants={fadeInUp} className="w-full flex flex-col items-center mb-8">
                    <div className="p-6 bg-indigo-500/10 rounded-[2.5rem] mb-10 border border-indigo-500/20">
                        <GraduationCap size={80} weight="duotone" className="text-indigo-500" />
                    </div>
                    <Title className="text-6xl sm:text-8xl font-black italic tracking-tighter mb-6 uppercase text-white leading-none">
                        About <span className="text-indigo-500">AKTU</span> Prep
                    </Title>
                    <div className="h-[2px] w-24 bg-indigo-500/30 rounded-full mb-8 mx-auto"></div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                    <Text className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        The ultimate destination for AKTU students to find high-quality resources, 
                        organized specifically for B.Tech, MBA, and B.Pharma excellence.
                    </Text>
                </motion.div>
            </motion.header>

            <motion.section
                initial="initial"
                whileInView="animate"
                variants={stagger}
                viewport={{ once: true, amount: 0.4 }}
                className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 my-32"
            >
                <motion.div variants={fadeInUp}>
                    <Card className="glass rounded-[3rem] border border-white/5 h-full p-6 hover:border-indigo-500/30 transition-all duration-500 group">
                        <CardHeader className="flex items-center space-y-0 gap-6 pb-8">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <GraduationCap size={36} weight="duotone" />
                            </div>
                            <CardTitle className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Why Us?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text className="text-slate-400 text-lg leading-relaxed font-medium">
                                We believe students deserve better than outdated portals. 
                                Our platform is engineered for speed and focus, delivering 
                                10 years of PYQs, expert solutions, and hand-picked video lectures 
                                in a premium, distraction-free environment.
                            </Text>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={fadeInUp}>
                    <Card className="glass rounded-[3rem] border border-white/5 p-6 hover:border-red-500/20 transition-all duration-500 group">
                        <CardHeader className="flex items-center space-y-0 gap-6 pb-8">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <Heart size={36} weight="duotone" />
                            </div>
                            <CardTitle className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text className="text-slate-400 text-lg mb-10 font-medium leading-relaxed">
                                Empowering the next generation of engineers and professionals with 
                                organized knowledge. From first year to final year, we are your 
                                partner in academic success.
                            </Text>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={() => navigate('/courses')} className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black px-10 py-6 text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-2xl shadow-indigo-600/20 h-auto">
                                    Start Learning
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.section>

            <section className="my-40 text-center space-y-10">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkle size={40} weight="fill" className="text-indigo-500 animate-pulse" />
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Ready to Start?</h2>
                <Button onClick={() => navigate('/courses')} className="h-20 px-16 bg-white text-slate-950 hover:bg-slate-200 rounded-[2.5rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-white/10 transition-all hover:scale-105">
                    Explore Courses
                </Button>
            </section>

            {/* Changelog Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="max-w-4xl mx-auto my-40 p-12 bg-slate-950/40 rounded-[3rem] border border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkle size={120} weight="fill" className="text-indigo-500" />
                </div>
                <div className="space-y-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Version 1.0.0</h3>
                            <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Official Production Release &bull; 2026-04-26</p>
                        </div>
                        <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            STABLE RELEASE
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {[
                            "Official Launch of AKTU Prep!",
                            "Dedicated support for B.Tech, MBA, and B.Pharma.",
                            "80+ subjects with real AKTU names.",
                            "Learning Hub: Video Lectures & PDF Notes.",
                            "Premium Dark Theme with Glassmorphism.",
                            "Zero Legacy GATE Branding.",
                            "Admin Panel for Material Management.",
                            "Fully Responsive UI (Mobile/Tablet/Desktop)."
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_#6366f1]" />
                                <span className="text-slate-400 text-sm font-medium leading-tight">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default About;
