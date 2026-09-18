// components/otpui/index.tsx
import React, { useState, useRef, ReactNode, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect, useCallback, memo } from 'react';
import appLogoLight from '../../assets/app-logos/app-logo-light.png';
import rightArrowWhite from '../../assets/icons/rightArrowWhite.svg';


export interface OtpUIProps {
  logo?: string | ReactNode;
  tagline?: string;
  subTagline?: string;
  title?: string;
  subtitle?: string;
  length?: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  isSuccess?: boolean;
  successMessage?: string;
  onComplete?: (otp: string) => void;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  resendCooldown?: number; // In seconds
}

const OtpUI: React.FC<OtpUIProps> = memo(({
  logo = appLogoLight,
  tagline = '"Refresh Your Password, Refresh Your Peace Of Mind."',
  subTagline = '"...Let\'s Get You Back To Your Journey"',
  title = 'Verify Account',
  subtitle = 'Verification',
  length = 6,
  isLoading = false,
  errorMessage = null,
  isSuccess = false,
  successMessage = 'Verification Successful',
  onComplete,
  onVerify,
  onResend,
  resendCooldown = 30,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [timer, setTimer] = useState<number>(resendCooldown);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(errorMessage);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync prop error message to internal state
  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);



  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value.substring(value.length - 1);
      const combinedOtp = newOtp.join('');

      if (combinedOtp.length === length && onComplete) {
        onComplete(combinedOtp);
      }
      return newOtp;
    });

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [length, onComplete]);
  // Auto-focus on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Inside OtpUI component:

  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true); // Enable resend when timer reaches 0
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Updated Resend Click Handler
  const handleResendClick = useCallback(() => {
    // Allow resend if timer is up OR if there's an active error
    if ((canResend || error) && !isLoading && onResend) {
      onResend();
      setOtp(Array(length).fill('')); // Clear inputs
      setError(null);                  // Clear error message
      setTimer(resendCooldown);        // Reset timer back to initial duration
      setCanResend(false);            // Disable resend until timer runs down again
      inputRefs.current[0]?.focus();   // Focus first input box
    }
  }, [canResend, error, isLoading, onResend, length, resendCooldown]);
  // Enhanced keyboard navigation inside handleKeyDown
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, length]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      digits.forEach((digit, idx) => {
        newOtp[idx] = digit;
      });

      if (newOtp.join('').length === length && onComplete) {
        onComplete(newOtp.join(''));
      }
      return newOtp;
    });

    const nextFocusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  }, [length, onComplete]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const combinedOtp = otp.join('');
    if (combinedOtp.length === length && onVerify && !error) {
      onVerify(combinedOtp);
    }
  }, [otp, length, onVerify, error]);

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `(${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')})`;
  }, []);

  return (
    <div className="min-h-screen w-full bg-primary text-white flex flex-col items-center py-10 px-4 sm:px-6">
      {/* Top Section: Branding & Tagline */}
      <div className="flex flex-col items-center text-center my-6 max-w-md w-full">
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
      <div className="w-full ticket-card-cutout bg-white p-5 sm:p-8 text-black transition-all">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-center text-gray-500 mt-1 mb-6">
          {subtitle}
        </p>

        {isSuccess ? (
          <div className="py-8 text-center text-green-600 font-bold text-xl sm:text-2xl">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* OTP Input Fields */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full mb-4">
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

            {/* Error Message Display */}
            {error && (
              <p className="text-red-600 text-xs sm:text-sm font-semibold mb-4 text-center">
                {error}
              </p>
            )}
            {/* Resend Link with Timer */}
            <div className="text-xs sm:text-sm text-gray-500 mb-6 text-center">
              Didn't Receive OTP?{' '}
              <button
                type="button"
                onClick={handleResendClick}
                disabled={(!canResend && !error) || isLoading}
                className={`font-medium underline transition-colors ${(canResend || error) && !isLoading
                  ? 'text-[#42ADE2] hover:opacity-80 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                Resend
              </button>{' '}

              {/* Show timer only while counting down */}
              {timer > 0 && (
                <span className="text-gray-400 font-normal">
                  {formatTimer(timer)}
                </span>
              )}
            </div>
            {/* Verify Button */}
            <button
              type="submit"
              disabled={otp.join('').length < length || !!error || isLoading}
              className="w-full bg-gradient-to-r from-red-700 to-purple-700 hover:brightness-110 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              {/* Display 'Verifying...' ONLY when input is complete and submit is triggered */}
              {isLoading && otp.join('').length === length ? 'Verifying...' : 'Verify'}
              {(!isLoading || otp.join('').length < length) && <img src={rightArrowWhite} alt="Arrow" className="w-5 h-5" />}
            </button>
          </form>
        )}
      </div>

      {/* Empty spacer for flex layout centering on mobile */}
      <div className="hidden sm:block h-4" />
    </div>
  );
});

OtpUI.displayName = 'OtpUI';

export default OtpUI;