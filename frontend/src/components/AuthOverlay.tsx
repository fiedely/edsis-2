import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  type User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, googleProvider, db } from '../firebase';
import { Lock, Mail, AlertCircle, CheckCircle, Fingerprint, User as UserIcon } from 'lucide-react';

// IMPORT UI COMPONENTS
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function AuthOverlay() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLogin, setIsLogin] = useState(true); 
  const [isReset, setIsReset] = useState(false); 
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [loadingMethod, setLoadingMethod] = useState<'email' | 'google' | null>(null);

  const resetAll = () => {
    setError('');
    setMessage('');
    setName(''); 
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const clearErrors = () => {
    setError('');
    setMessage('');
  };

  const createUserProfile = async (user: User, customName?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const displayName = customName || user.displayName || 'Unknown User';
        await setDoc(userRef, {
          uid: user.uid,
          name: displayName,
          email: user.email,
          role: 'viewer', 
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }
    } catch (e: any) {
      console.error("Error writing user profile:", e);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors(); 
    setLoadingMethod('email');

    try {
      if (isReset) {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent! Check your inbox.');
        setLoadingMethod(null);
        return;
      }

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user);
      } else {
        if (password !== confirmPassword) throw new Error('Firebase: Passwords do not match.');
        if (!name.trim()) throw new Error('Firebase: Please enter your full name.');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user, name);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoadingMethod(null);
    }
  };

  const handleGoogle = async () => {
    clearErrors();
    setLoadingMethod('google');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
    } catch (err: any) {
      setError('Google Sign-In failed.');
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-md" />

      <div className="relative w-full max-w-md bg-white shadow-2xl p-8 border border-gray-100 flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          {/* USAGE: Using .h1 class from Design System */}
          <h1 className="h1">EDSIS</h1>
          {/* USAGE: Using .muted class */}
          <p className="muted uppercase tracking-widest font-semibold">
            Elementi Domus Smart Inventory System
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 p-3 text-sm flex items-center gap-2 border border-green-100">
            <CheckCircle className="w-4 h-4" /> {message}
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {!isLogin && !isReset && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              {/* USAGE: Using .label-text class */}
              <label className="label-text">Full Name</label>
              <Input 
                icon={UserIcon}
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="label-text">Email Address</label>
            <Input 
              icon={Mail}
              type="email"
              placeholder="name@elementidomus.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isReset && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="label-text">Password</label>
              <Input 
                icon={Lock}
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {!isLogin && !isReset && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="label-text">Confirm Password</label>
              <Input 
                icon={Lock}
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== '' && password !== confirmPassword}
              />
              {confirmPassword && password !== confirmPassword && (
                 <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            isLoading={loadingMethod === 'email'} 
            className="w-full mt-2"
          >
            {isReset ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* SOCIAL LOGIN / ALTERNATIVES */}
        {!isReset && (
          <>
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase">Or</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleGoogle} 
                variant="outline"
                isLoading={loadingMethod === 'google'}
                type="button"
                className="w-full gap-2"
              >
                 {!loadingMethod && <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/></svg>}
                 Google
              </Button>
              
              <Button 
                variant="outline"
                disabled
                type="button"
                className="w-full gap-2 text-gray-400 cursor-not-allowed bg-gray-50 hover:bg-gray-50"
              >
                <Fingerprint className="w-4 h-4" />
                Biometric
              </Button>
            </div>
          </>
        )}

        {/* FOOTER TOGGLES */}
        <div className="text-center text-sm space-y-1 mt-2">
          {isReset ? (
            <button onClick={() => { setIsReset(false); setIsLogin(true); resetAll(); }} className="link">
              Back to Sign In
            </button>
          ) : (
            <>
              <button onClick={() => { setIsReset(true); resetAll(); }} className="text-gray-500 hover:text-gray-800 block w-full mb-2">
                Forgot Password?
              </button>
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setIsLogin(!isLogin); resetAll(); }} className="link">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}