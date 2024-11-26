import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import CryptoJS from 'crypto-js';

const sns = new SNSClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phoneNumber: string, otp: string) => {
  try {
    const params = {
      Message: `Your NatWest verification code is: ${otp}`,
      PhoneNumber: phoneNumber,
    };

    await sns.send(new PublishCommand(params));
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export const verifyOTP = (userOTP: string, storedOTP: string): boolean => {
  const hashedUserOTP = CryptoJS.SHA256(userOTP).toString();
  const hashedStoredOTP = CryptoJS.SHA256(storedOTP).toString();
  return hashedUserOTP === hashedStoredOTP;
};