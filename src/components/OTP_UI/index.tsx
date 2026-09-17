// components/otpui/index.tsx
import React, { useState, useRef, ReactNode, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import appLogoLight from '../../assets/app-logos/app-logo-light.png'
export interface OtpUIProps {
  logo?: string | ReactNode;
  tagline?: string;
  subTagline?: string;
  title?: string;
  subtitle?: string;
  length?: number;
  isLoading?: boolean;
  onComplete?: (otp: string) => void;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  resendCooldown?: number; // In seconds
}

const OtpUI: React.FC<OtpUIProps> = ({
  logo = appLogoLight, // Fallback or imported logo asset
  tagline = '"Refresh Your Password, Refresh Your Peace Of Mind."',
  subTagline = '"...Let\'s Get You Back To Your Journey"',
  title = 'Verify Account',
  subtitle = 'Verification',
  length = 6,
  isLoading = false,
  onComplete,
  onVerify,
  onResend,
  resendCooldown = 30,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [timer, setTimer] = useState<number>(resendCooldown);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow numbers only

    const newOtp = [...otp];
    // Take the last entered character if multiple typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join('');

    // Move to next input field if typed
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete when all digits are entered
    if (combinedOtp.length === length && onComplete) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on Backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (!/^\d+$/.test(pastedData)) return; // Only process if digits

    const digits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);

    // Focus last filled or next input
    const nextFocusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();

    if (newOtp.join('').length === length && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedOtp = otp.join('');
    if (combinedOtp.length === length && onVerify) {
      onVerify(combinedOtp);
    }
  };

  const handleResendClick = () => {
    if (canResend && onResend) {
      onResend();
      setTimer(resendCooldown);
      setCanResend(false);
    }
  };
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `(${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')})`;
  };

  return (
    <div className="min-h-screen w-full bg-primary text-white flex flex-col items-center py-10 px-4 sm:px-6">
      {/* Top Section: Branding & Tagline */}
      <div className="flex flex-col items-center text-center my-6  max-w-md w-full">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          {typeof logo === 'string' ? (
            <img src={logo} alt="VOYA Logo" className="h-16 w-auto object-contain" />
          ) : (
            logo
          )}
        </div>

        {/* Quotes */}
        <p className="text-xs sm:text-sm text-white font-bold tracking-wide">
          {tagline}
        </p>
        <p className="text-xs sm:text-sm text-white font-bold mt-1">
          {subTagline}
        </p>  
      </div>

      {/* Middle Section: Verification Card */}
      <div className="w-full ticket-card-cutout  bg-white p-5 sm:p-8 text-black transition-all">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-center text-gray-500 mt-1 mb-6">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {/* OTP Input Fields */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none transition-colors disabled:bg-gray-100"
              />
            ))}
          </div>

          {/* Resend Link with Timer */}
          <div className="text-xs sm:text-sm text-gray-500 mb-6 text-center">
            Didn't Receive OTP?{' '}
            <button
              type="button"
              onClick={handleResendClick}
              disabled={!canResend || isLoading}
              className={`font-medium underline transition-colors ${canResend && !isLoading
                ? 'text-[#42ADE2] hover:opacity-80 cursor-pointer'
                : 'text-[#42ADE2] cursor-not-allowed'
                }`}
            >
              Resend
            </button>{' '}
            <span className="text-gray-400 font-normal">
              {formatTimer(timer)}
            </span>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otp.join('').length < length || isLoading}
            className="w-full bg-gradient-to-r from-red-700 to-purple-700 hover:brightness-110 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-100 disabled:cursor-not-allowed shadow-lg text-lg">            {isLoading ? 'Verifying...' : 'Verify'}
            {!isLoading && <span className="text-lg">→</span>}
          </button>
        </form>
      </div>

      {/* Empty spacer for flex layout centering on mobile */}
      <div className="hidden sm:block h-4" />
    </div>
  );
};

export default OtpUI;