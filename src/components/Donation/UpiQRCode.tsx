import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// IMPORTANT: Update these with your own payment details
const upiId = 'YOUR_UPI_ID@okaxis'; 
const name = 'AKTU Prep';

type UpiQRCodeProps = {
    amount: number | null;
};

const UpiQRCode: React.FC<UpiQRCodeProps> = ({ amount }) => {
    // Custom upiUrl
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6">
            <h2 className="text-indigo-400 text-xl font-black italic uppercase tracking-widest text-center">
                Scan to Pay ₹{amount}
            </h2>
            <div className="p-4 bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/10 border-8 border-indigo-500/5">
                <QRCodeSVG
                    value={upiUrl}
                    size={220}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                UPI ID: {upiId}
            </div>
        </div>
    );
};

export default UpiQRCode;
