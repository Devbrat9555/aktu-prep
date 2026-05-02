import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '../utils/motionVariants.ts';
import { useDonations } from '../hooks/useDonations.ts';
import { toast } from 'sonner';
import DonationBox from '../components/Donation/DonationBox.tsx';
import DonorList from '../components/Donation/DonorList.tsx';
import UpiQRCode from '../components/Donation/UpiQRCode.tsx';
import { getUserProfile } from '../helper.ts';
import { Text, Title } from '@/components/ui/typography.tsx';
import { GraduationCap } from '@phosphor-icons/react';

const Donations: React.FC = () => {
    const [amount, setAmount] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const [utr, setUtr] = useState<string>('');
    const [step, setStep] = useState<'form' | 'generateQR' | 'utr' | 'thankYou'>('form');
    const [showQR, setShowQR] = useState<boolean>(false);

    const userProfile = getUserProfile();
    const userId = userProfile ? (userProfile.id != '1' ? userProfile.id : null) : null;

    const { donations, loading, addDonation, loadDonations } = useDonations();

    useEffect(() => {
        loadDonations();
    }, [loadDonations]);

    const handleUTRSubmit = async () => {
        if (!utr) return toast.warning('Enter Transaction ID');
        try {
            await addDonation({ userId, amount: amount!, message, anonymous, utr });
            setStep('thankYou');
            setMessage('');
            setAnonymous(false);
            setAmount(null);
            setUtr('');
            toast.success('Thank you for your support! ❤️');
        } catch (err) {
            toast.error('Error submitting donation');
        }
    };

    const maxAmount = Math.max(...donations.map((d) => d.actual_amount));
    const topDonor = donations.filter((d) => d.actual_amount === maxAmount);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 overflow-y-auto">
            {/* Header Card */}
            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="max-w-5xl mx-auto flex flex-col items-center mb-12 glass p-10 rounded-[3rem] border border-white/10 premium-shadow text-center"
            >
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border-4 border-indigo-500/10">
                    <GraduationCap size={48} className="text-indigo-400" />
                </div>
                <Title className="text-4xl font-black italic mb-4">
                    SUPPORT <span className="text-indigo-500">AKTU PREP</span>
                </Title>
                <Text className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                    We are dedicated to providing the best exam resources for AKTU students. 
                    Your contributions help us maintain the servers and add more study materials!
                </Text>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto pb-20"
            >
                {/* Donation Form */}
                <div className="flex-1 glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 h-fit">
                    {step === 'form' && (
                        <DonationBox
                            setStep={setStep}
                            amount={amount}
                            message={message}
                            anonymous={anonymous}
                            setMessage={setMessage}
                            setAmount={setAmount}
                            setAnonymous={setAnonymous}
                            setShowQR={setShowQR}
                        />
                    )}

                    {step === 'utr' && showQR && (
                        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
                            <UpiQRCode amount={amount} />
                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-sm text-slate-400 font-medium">
                                After payment, enter your **Transaction ID** below to verify. 
                                It helps us update your name in the supporter list.
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Transaction ID (UTR)"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                className="w-full h-14 bg-slate-900 border border-white/10 rounded-xl px-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <button
                                onClick={handleUTRSubmit}
                                className="w-full h-16 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-600/20"
                            >
                                PAYMENT DONE
                            </button>
                        </div>
                    )}

                    {step === 'thankYou' && (
                        <div className="text-center space-y-6 py-10">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GraduationCap size={40} />
                            </div>
                            <h3 className="text-3xl font-black italic">YOU ARE AWESOME!</h3>
                            <p className="text-slate-400 font-medium">
                                Your contribution has been received. It will be verified and added to the list within 24 hours.
                            </p>
                            <button
                                onClick={() => setStep('form')}
                                className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all"
                            >
                                DONATE AGAIN
                            </button>
                        </div>
                    )}
                </div>

                {/* Donor List */}
                <div className="lg:w-[400px]">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/10">
                        {donations.length > 0 && !loading ? (
                            <div className="space-y-8">
                                <h3 className="text-xl font-black italic text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-4">
                                    🌟 Supporters
                                </h3>
                                {topDonor && topDonor.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Top Supporter</h4>
                                        <DonorList donations={topDonor} />
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Recent Support</h4>
                                    <DonorList donations={donations} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 space-y-4">
                                <div className="text-slate-600 italic font-medium">
                                    No supporters yet — be the first to support AKTU Prep! 💫
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Donations;
