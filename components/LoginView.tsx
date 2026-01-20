
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => boolean;
  onGmailLogin: () => void;
  onCancel: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onGmailLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#f8fafc] overflow-y-auto">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#097c7c] p-2 rounded-lg shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl">analytics</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Message Analyzer</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#e0f2f1] text-[#00695c] px-4 py-1.5 rounded-full text-xs font-bold border border-[#b2dfdb]">
            <span className="material-symbols-outlined text-sm">lock</span>
            SECURE ENVIRONMENT
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500 w-full"></div>
          
          <div className="p-10 flex flex-col items-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm mb-10">Please enter your details to access the dashboard.</p>

            {/* Social Login */}
            <button 
              onClick={onGmailLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 mb-8"
            >
              <div className="bg-sky-50 text-sky-600 p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              Continue with Gmail
            </button>

            <div className="w-full flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with email</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">mail</span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#097c7c] transition-all text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-800">Password</label>
                  <button type="button" className="text-xs font-bold text-[#097c7c] hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#097c7c] transition-all text-slate-700 placeholder:text-slate-300"
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#097c7c] hover:bg-[#075e5e] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-700/20 active:scale-[0.98]"
              >
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>

          <div className="bg-slate-50 py-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Don't have an account? <button className="font-bold text-[#097c7c] hover:underline">Create free account</button>
            </p>
          </div>
        </div>

        {/* Cancel/Guest button */}
        <button 
          onClick={onCancel}
          className="mt-6 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
        >
          Skip and continue as guest
        </button>

        {/* Footer Logos */}
        <div className="mt-16 flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center gap-10 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-black text-slate-900 text-xl">
              <span className="material-symbols-outlined">diamond</span> Acme
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 text-xl">
              <span className="material-symbols-outlined">all_inclusive</span> Infinity
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 text-xl">
              <span className="material-symbols-outlined">bolt</span> Voltic
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 text-xl">
              <span className="material-symbols-outlined">pentagon</span> Global
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-[10px] text-slate-400 font-medium">
          <p>© 2024 Message Analyzer Inc. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-2">
            <button className="hover:text-slate-600">Privacy Policy</button>
            <button className="hover:text-slate-600">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
