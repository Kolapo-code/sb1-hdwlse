import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateOTP, sendOTP, verifyOTP } from '../services/otp';

interface OTPVerificationProps {
  onVerificationComplete: () => void;
  phoneNumber: string;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  onVerificationComplete,
  phoneNumber,
}) => {
  const [otp, setOTP] = useState('');
  const [storedOTP, setStoredOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOTP = async () => {
    const newOTP = generateOTP();
    setStoredOTP(newOTP);
    
    const sent = await sendOTP(phoneNumber, newOTP);
    if (sent) {
      toast.success('OTP sent successfully');
    } else {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = () => {
    setIsVerifying(true);
    
    if (verifyOTP(otp, storedOTP)) {
      toast.success('OTP verified successfully');
      onVerificationComplete();
    } else {
      toast.error('Invalid OTP');
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enter OTP
        </label>
        <div className="mt-1">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSendOTP}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send OTP
        </button>
        <button
          onClick={handleVerifyOTP}
          disabled={isVerifying || otp.length !== 6}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};