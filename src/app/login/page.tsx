'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, CheckCircle2, Eye } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      
      {/* Main Card */}
      <div 
        className="w-full max-w-[380px] rounded-2xl p-8 flex flex-col items-center border border-blue-50/50"
        style={{
          background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 40%, #ffffff 60%, #f4fbff 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04), 0 0 40px rgba(14, 165, 233, 0.05)'
        }}
      >
        
        {/* Logo & Title */}
        <div className="flex items-center gap-2 mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#0ea5e9" strokeWidth="2.5" />
            <path d="M12 3L12 21" stroke="#0ea5e9" strokeWidth="2.5" />
            <path d="M15 8.5C13.5 7.5 11 7.5 9.5 8.5C7.5 10 7.5 14 9.5 15.5C11 16.5 13.5 16.5 15 15.5" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">
            CashPanel
          </h1>
        </div>
        
        <h2 className="text-[20px] font-normal text-slate-800 mb-5">
          Welcome Back
        </h2>

        {/* Badges */}
        <div className="flex items-center justify-center gap-3 mb-6 w-full">
          <div className="flex items-center gap-1.5 bg-[#e3f4e9] text-[#1a8b42] px-3 py-1 rounded-full text-[13px] font-medium">
            <div className="w-2 h-2 rounded-full bg-[#1a8b42]"></div>
            Connected
          </div>
          <div className="flex items-center gap-1 bg-[#e3f4e9] text-[#1a8b42] px-3 py-1 rounded-full text-[13px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            verified
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </div>
            <input 
              type="email" 
              required 
              defaultValue="test_admin@fin-tech.com"
              style={{ paddingLeft: '2.5rem', height: '42px' }}
              className="w-full pr-4 bg-[#eef2f7] border border-blue-200/50 rounded-[8px] text-slate-800 text-[14px] placeholder-slate-400 outline-none focus:border-blue-400 transition-colors"
              placeholder="Email Address" 
            />
          </div>
          
          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </div>
            <input 
              type="password" 
              required 
              defaultValue="12345678"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '42px' }}
              className="w-full bg-[#eef2f7] border border-blue-200/50 rounded-[8px] text-slate-800 text-[20px] tracking-widest placeholder-slate-400 outline-none focus:border-blue-400 transition-colors"
              placeholder="" 
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          
          {/* Forgot Password */}
          <div className="flex justify-end mt-[-2px]">
            <Link href="/forgot-password" className="text-[13px] font-medium text-[#145391] hover:text-blue-800 transition-colors">
              Forgot Password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 mt-1 bg-[#144f8a] hover:bg-[#0f3d6c] text-white rounded-[8px] font-medium text-[14.5px] transition-colors flex justify-center items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Connect Securely
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </>
            )}
          </button>
        </form>
        
        {/* Sign up */}
        <div className="mt-5 text-center">
          <Link href="/signup" className="text-[13px] font-medium text-[#145391] hover:text-blue-800 transition-colors">
            Sign up now
          </Link>
        </div>

      </div>
    </div>
  );
}
