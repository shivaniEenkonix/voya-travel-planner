import { useCallback, useState } from "react";
import { BottomNavbar, OTP_UI } from "../../components";

function Home() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Handle Verification Submission
  const handleVerify = useCallback((otp: string) => {
    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      // TEST: Entering '000000' simulates an incorrect code error
      if (otp === "000000") {
        setError("Invalid OTP code. Please try again or click Resend.");
      } else {
        setIsSuccess(true);
      }
    }, 1200);
  }, []);

  // 2. Handle Resend Request
  const handleResend = useCallback(() => {
    setError(null);
    console.log("A new OTP code has been sent!");
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-primary">
      <section className="flex-1 rounded-b-[20px] bg-white">
        <div className="flex flex-col gap-6 p-4">
          {/* Developer Quick Controls (Optional for easy manual testing) */}
          <div className="flex gap-2 p-2 bg-gray-100 rounded text-xs text-black justify-center">
            <button
              type="button"
              onClick={() => {
                setError("Invalid OTP code. Please try again or click Resend.");
                setIsSuccess(false);
              }}
              className="px-2 py-1 bg-red-500 text-white rounded font-medium cursor-pointer"
            >
              Force Error State
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(true);
                setError(null);
              }}
              className="px-2 py-1 bg-green-500 text-white rounded font-medium cursor-pointer"
            >
              Force Success State
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsSuccess(false);
              }}
              className="px-2 py-1 bg-gray-500 text-white rounded font-medium cursor-pointer"
            >
              Reset State
            </button>
          </div>

          <OTP_UI
            length={6}
            isLoading={isVerifying}
            errorMessage={error}
            isSuccess={isSuccess}
            onVerify={handleVerify}
            onResend={handleResend}
            resendCooldown={30}
          />
        </div>
      </section>

      <div className="xl:hidden">
        <BottomNavbar />
      </div>
    </main>
  );
}

export default Home;