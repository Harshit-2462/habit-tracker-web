import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BatKittyLogo } from '../components/common/BatKittyLogo';
import { GlassCard } from '../components/common/GlassCard';
import { NeonButton } from '../components/common/NeonButton';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const AuthPage: React.FC = () => {
  const { user, signInWithEmail, signUpWithEmail, signInAsGuest, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerifyNotice, setEmailVerifyNotice] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailVerifyNotice(false);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error, needsEmailVerification } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
        } else if (needsEmailVerification) {
          setEmailVerifyNotice(true);
        } else {
          navigate('/');
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            setErrorMsg('Your email address has not been verified yet. Please check your inbox and click the verification link!');
          } else {
            setErrorMsg(error.message);
          }
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate('/');
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await resetPassword(forgotEmail);
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gotham-skyline relative">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BatKittyLogo size="xl" showText={false} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] font-mono">
            BATKITTY HABITS
          </h1>
          <p className="text-xs text-slate-400">
            Gotham Dark Knight Discipline Meets Hello Kitty Paws 🦇🎀
          </p>
        </div>

        {/* Card Form */}
        <GlassCard glowColor="pink" className="p-6 space-y-5">
          {emailVerifyNotice ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FF69B4]/20 border border-[#FF69B4]/40 flex items-center justify-center mx-auto text-[#FF69B4]">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">
                📩 Verify Your Email Address
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A verification link has been sent to <strong className="text-[#F4D03F]">{email}</strong>.
                <br />
                Please open your email inbox and click the verification link before signing in to BatKitty Habits!
              </p>
              <NeonButton
                variant="pink"
                size="md"
                onClick={() => {
                  setEmailVerifyNotice(false);
                  setIsSignUp(false);
                }}
              >
                Back to Sign In
              </NeonButton>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-around border-b border-white/10 pb-3">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg('');
                  }}
                  className={`text-sm font-extrabold font-mono transition-colors cursor-pointer ${
                    !isSignUp ? 'text-[#FF69B4] border-b-2 border-[#FF69B4] pb-1' : 'text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg('');
                  }}
                  className={`text-sm font-extrabold font-mono transition-colors cursor-pointer ${
                    isSignUp ? 'text-[#FF69B4] border-b-2 border-[#FF69B4] pb-1' : 'text-slate-400'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Gotham Wayne"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-[#FF69B4]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="hero@batkitty.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-[#FF69B4]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(true)}
                        className="text-[10px] text-[#F4D03F] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-[#FF69B4]"
                    />
                  </div>
                </div>

                <NeonButton
                  type="submit"
                  variant="pink"
                  size="lg"
                  className="w-full mt-2"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {loading ? 'Processing...' : isSignUp ? 'Create BatKitty Account' : 'Sign In to Gotham'}
                </NeonButton>
              </form>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#121319] text-[10px] uppercase text-slate-500 font-mono">
                  Or quick access
                </span>
              </div>

              <div>
                <button
                  onClick={handleGuestLogin}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#F4D03F]/10 hover:bg-[#F4D03F]/20 border border-[#F4D03F]/30 text-[#F4D03F] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                >
                  <span>🦇 Demo Hero 1-Click Entry</span>
                </button>
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {/* Forgot Password Modal */}
      <Modal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} title="🔑 Reset Bat Password" maxWidth="sm">
        {forgotSent ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-emerald-400 font-bold">
              Password reset link sent to your email! Please check your inbox.
            </p>
            <NeonButton variant="pink" size="sm" onClick={() => setIsForgotOpen(false)}>
              Back to Sign In
            </NeonButton>
          </div>
        ) : (
          <form onSubmit={handleForgotReset} className="space-y-4 py-2">
            <p className="text-xs text-slate-300">
              Enter your account email to receive a password reset link.
            </p>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              placeholder="hero@batkitty.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-[#FF69B4]"
            />
            <NeonButton type="submit" variant="pink" size="md" className="w-full">
              Send Reset Link
            </NeonButton>
          </form>
        )}
      </Modal>
    </div>
  );
};
