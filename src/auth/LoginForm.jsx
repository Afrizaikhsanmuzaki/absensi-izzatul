import React, { memo } from 'react';
import { User, Lock, Eye, EyeOff, RefreshCw, ArrowRight } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

// Komponen InputField dipindah ke sini karena murni hanya melayani Form Login
const InputField = memo(({ icon: Icon, label, type, placeholder, value, onChange, isPassword, showPassword, togglePassword, maxLength }) => (
  <div>
    <label className="block text-[11px] font-bold text-emerald-200/70 mb-2 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group/input">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
      </div>
      <style>{`input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none; }`}</style>
      <input 
        type={isPassword ? (showPassword ? "text" : "password") : type} 
        value={value} 
        onChange={onChange} 
        maxLength={maxLength} 
        className="w-full pl-12 pr-14 py-4 bg-slate-800/50 border border-slate-700/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600 shadow-inner" 
        placeholder={placeholder} 
        required 
      />
      {isPassword && (
        <button 
          type="button" 
          onClick={togglePassword} 
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  </div>
));

export default function LoginForm({
  nip, 
  setNip,
  password, 
  setPassword,
  showPassword, 
  setShowPassword,
  isLoading,
  handleLogin,
  setTurnstileToken,
  setErrorMsg
}) {
  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <InputField 
        icon={User} 
        label="NIP " 
        type="text" 
        placeholder="Masukan NIP Anda" 
        value={nip} 
        onChange={(e) => setNip(e.target.value)} 
      />
      <InputField 
        icon={Lock} 
        label="Kata Sandi" 
        type="password" 
        placeholder="Masukan Sandi Anda" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        isPassword={true} 
        showPassword={showPassword} 
        togglePassword={() => setShowPassword(!showPassword)} 
      />
      <div className="flex justify-center my-4">
        <Turnstile 
          siteKey="0x4AAAAAAFfg_zNgnPTzAL59" 
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setErrorMsg("Verifikasi keamanan gagal dimuat. Cek koneksi internet Anda.")}
          options={{ theme: 'dark' }} 
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full py-4 mt-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
      >
        {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Masuk <ArrowRight className="h-5 w-5" /></>}
      </button>
    </form>
  );
}