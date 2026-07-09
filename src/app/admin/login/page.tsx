'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Lock, Mail, Building2, ArrowRight, KeyRound } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // handle login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Invalid credentials. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  // auto fill demo credentials
  function fillDemo() {
    setEmail('demo@estatemanager.com')
    setPassword('Demo@1234')
  }

  return (
    <div className="min-h-screen flex">

      {/* left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F1C2E] overflow-hidden">

        {/* bg pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1A3C5E]/30 rounded-full translate-y-1/3 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#C9A84C]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#C9A84C]/5 rounded-full" />
        </div>

        {/* grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">

          {/* logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C9A84C] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">Estate Manager</h2>
              <p className="text-[#C9A84C] text-xs font-medium">Property Management</p>
            </div>
          </div>

          {/* center text */}
          <div>
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Manage Your
              <br />
              <span className="text-[#C9A84C]">Properties</span>
              <br />
              With Ease.
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Add, edit, and manage your entire property portfolio from one powerful dashboard.
            </p>
          </div>

          {/* bottom stats */}
          <div className="flex items-center gap-12">
            <div>
              <p className="text-3xl font-black text-[#C9A84C]">150+</p>
              <p className="text-gray-500 text-sm">Properties Listed</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-3xl font-black text-[#C9A84C]">12</p>
              <p className="text-gray-500 text-sm">Cities Covered</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-3xl font-black text-[#C9A84C]">98%</p>
              <p className="text-gray-500 text-sm">Client Satisfaction</p>
            </div>
          </div>

        </div>
      </div>

      {/* right side — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F1C2E]">Estate Manager</span>
          </div>

          {/* heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#0F1C2E] mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to access your admin dashboard</p>
          </div>

          {/* demo credentials */}
          <div className="relative bg-gradient-to-r from-[#0F1C2E] to-[#1A3C5E] rounded-2xl p-5 mb-8 overflow-hidden">

            {/* bg accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/10 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <KeyRound className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Demo Access</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Email:</span>{' '}
                    <span className="font-medium text-white">demo@estatemanager.com</span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-500">Pass:</span>{' '}
                    <span className="font-medium text-white">Demo@1234</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fillDemo}
                  className="bg-[#C9A84C] hover:bg-[#B8943F] text-[#0F1C2E] text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/20 whitespace-nowrap"
                >
                  Auto Fill
                </button>
              </div>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* email */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 group-focus-within:bg-[#1A3C5E]/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#1A3C5E] transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#1A3C5E] focus:ring-2 focus:ring-[#1A3C5E]/10 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-semibold text-[#0F1C2E] mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 group-focus-within:bg-[#1A3C5E]/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-[#1A3C5E] transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-14 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F1C2E] placeholder-gray-400 focus:outline-none focus:border-[#1A3C5E] focus:ring-2 focus:ring-[#1A3C5E]/10 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4 text-gray-500" />
                    : <Eye className="w-4 h-4 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-[#0F1C2E] hover:bg-[#1A3C5E] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0F1C2E]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

          </form>

          {/* divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">ADMIN ACCESS ONLY</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* security note */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-[#0F1C2E] text-sm font-semibold">Secured Access</p>
              <p className="text-gray-400 text-xs">This area is protected with end-to-end encryption</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}