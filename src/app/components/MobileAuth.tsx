import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Phone, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface MobileAuthProps {
  onAuthSuccess: (isNewUser: boolean, mobile: string) => void;
}

export function MobileAuth({ onAuthSuccess }: MobileAuthProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔒 Guard to prevent multiple success calls
  const authCompletedRef = useRef(false);

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(generatedOtp);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');

      toast.success(`Demo OTP: ${generatedOtp}`, {
        duration: 10000,
        description: 'Demo purpose only',
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    // 🚫 Prevent double click / double verify
    if (authCompletedRef.current) return;

    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    if (otp !== demoOtp) {
      toast.error('Invalid OTP');
      return;
    }

    authCompletedRef.current = true;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success('OTP verified successfully');

      // ✅ ALWAYS treat as new user here
      // Parent decides final routing
      onAuthSuccess(true, mobile);
    }, 800);
  };

  return (
    <div className="size-full bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div className="bg-orange-100 p-4 rounded-2xl mb-4">
              <Phone className="w-8 h-8 text-orange-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'phone' ? 'Welcome to BRIGX' : 'Verify OTP'}
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              {step === 'phone'
                ? 'Enter your mobile number to continue'
                : `Code sent to +91 ${mobile}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div key="phone">
                <Label>Mobile Number</Label>
                <div className="flex gap-2 mt-2">
                  <div className="px-3 bg-gray-100 border rounded-lg flex items-center">
                    +91
                  </div>
                  <Input
                    value={mobile}
                    onChange={(e) =>
                      setMobile(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  />
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading || mobile.length !== 10}
                  className="w-full mt-4"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="otp">
                <div className="mb-4 bg-orange-50 border rounded-xl p-3 flex gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-orange-700">
                    Use demo OTP shown in notification
                  </p>
                </div>

                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full mt-4"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <button
                  onClick={() => {
                    authCompletedRef.current = false;
                    setOtp('');
                    setStep('phone');
                  }}
                  className="w-full text-sm text-gray-500 mt-3"
                >
                  Change mobile number
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
