import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import PennyDimeLogo from '../../layouts/PennyDimeLogo';

export default function AuthPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is returning from a mobile redirect
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully logged in via redirect. 
          // App.jsx's onAuthStateChanged will handle the rest.
          console.log("Logged in via redirect");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to complete sign-in. Please try again.');
      }
    };
    checkRedirectResult();
  }, []);

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);

    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        // Mobile browsers block popups, so we use redirect
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Desktop uses the standard popup
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setErrorMessage('Popup blocked by your browser. Please allow popups for this site.');
      } else {
        setErrorMessage('Failed to sign in with Google. Please ensure Google Auth is enabled in Firebase.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fcf9f4] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(3,36,26,0.03)_100%)] pointer-events-none" />
      
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl overflow-hidden border border-[#eae6df] relative z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#03241a] via-[#1b3a2f] to-[#fd8048]" />
        
        <div className="p-8 md:p-10 flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <PennyDimeLogo size={40} />
          </div>
          
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-widest text-[#727974] uppercase block mb-2">THE MINDFUL LEDGER</span>
            <h1 className="font-serif text-[32px] font-bold text-[#03241a] leading-tight mb-3">Welcome to PennyDime</h1>
            <p className="text-[14px] text-[#414845] leading-relaxed max-w-[280px] mx-auto">
              A mindful, double-entry financial ledger designed for clarity and precision.
            </p>
          </div>

          {errorMessage && (
            <div className="w-full mb-6 p-3.5 rounded-xl bg-[#fcedea] text-[#ba1a1a] text-[12px] font-medium flex items-center justify-center gap-2">
              <AlertCircle size={15} /> {errorMessage}
            </div>
          )}

          <button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#c1c8c3] py-3.5 rounded-full text-[14px] font-bold text-[#1c1c19] hover:bg-[#f6f3ee] hover:border-[#727974] transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#03241a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-4 my-8 w-full">
            <span className="h-px bg-[#eae6df] flex-1" />
            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#727974] uppercase">
              <Lock size={12} /> Secure OAuth 2.0
            </span>
            <span className="h-px bg-[#eae6df] flex-1" />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eaf5f0] text-[#456558] flex items-center justify-center shrink-0"><Sparkles size={16} /></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[#1c1c19]">Instant Setup</span>
                <span className="text-[11px] text-[#727974] leading-snug">Your secure ledger is created automatically upon first login</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-[440px] mt-6 text-[11px] text-[#727974] font-medium relative z-10 px-4">
        <div className="flex items-center gap-1.5"><Shield size={12} className="text-[#03241a]" /><span>Bank-grade encryption</span></div>
        <div>Version 2.4 Edition</div>
      </div>
    </div>
  );
}