import React, { useState, useEffect, memo } from "react";
import { Turnstile } from '@marsidev/react-turnstile';
import {
  Activity, RefreshCw, Calendar, Clock, User, Lock, ShieldCheck,
  MapPin, CheckCircle, AlertTriangle, LogOut, X, Menu, FileText,
  Users, UserCheck, Eye, EyeOff, LayoutDashboard, BookOpen,
  ClipboardCheck, Clock4, ChevronRight, ChevronLeft, GraduationCap, ArrowRight,
  Plus, Search, Edit2, Trash2, Save, Download, Settings, LogIn,
  LogOut as LogOutIcon, Info, Filter, MoreHorizontal, CheckSquare, XCircle, Check, Printer, BarChart3, Ticket,
} from "lucide-react";

import { supabase } from './lib/supabase.js';
import RunningText from './auth/RunningText';
import LoginForm from './auth/LoginForm';


// ============================================================================
// --- KONFIGURASI LOKASI SEKOLAH (Geofencing) ---
// ============================================================================
const SCHOOL_LOCATION = {
  latitude: -6.3403,
  longitude: 107.3551,
  radiusAllowedMeters: 25,
};

// --- KONFIGURASI AKURASI GPS ---
const gpsOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================================================
// --- FUNGSI FORMAT TANGGAL & WAKTU MANUAL (ANTI-CRASH 100%) ---
// ============================================================================
const getTodayDateString = () => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  return `${d}/${m}/${y}`;
};

const getCurrentTimeString = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// ============================================================================
// --- KOMPONEN GLOBAL ---
// ============================================================================
const LiveClockWidget = ({ compact = false, variant = "vertical" }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  const formatDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (compact) {
    return (
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold text-slate-800 tracking-wider font-mono">
          {formatTime(time)}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {formatDate(time)}
        </span>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm mb-6 w-full animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex-shrink-0">
            <Calendar className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
              Tanggal Hari Ini
            </p>
            <p className="text-base font-bold text-slate-800">
              {formatDate(time)}
            </p>
          </div>
        </div>
        
        <div className="hidden md:block h-12 w-px bg-slate-200 mx-4"></div>
        
        <div className="flex items-center gap-4 w-full md:w-auto md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right flex-1 md:flex-none">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
              Waktu Server
            </p>
            <div className="flex items-baseline gap-1.5 justify-start md:justify-end">
              <p className="text-2xl font-mono font-bold text-emerald-600 tracking-wider">
                {formatTime(time)}
              </p>
              <span className="text-sm font-bold text-slate-400">
                WIB
              </span>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex-shrink-0">
            <Clock className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm mb-6 w-full animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex-shrink-0">
          <Calendar className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
            Tanggal Hari Ini
          </p>
          <p className="text-sm font-bold text-slate-800 truncate">
            {formatDate(time)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex-shrink-0">
          <Clock className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">
            Waktu Server
          </p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl font-mono font-bold text-emerald-600 tracking-wider">
              {formatTime(time)}
            </p>
            <span className="text-xs font-bold text-slate-400">
              WIB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginLiveClock = memo(() => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="mt-5 flex justify-center">
      <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-xl shadow-inner">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Calendar className="h-4 w-4" />
          <span className="text-[11px] font-medium text-slate-300">
            {formatDate(time)}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-600"></div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Clock className="h-4 w-4" />
          <span className="text-[11px] font-mono font-bold text-white tracking-wider">
            {formatTime(time)} WIB
          </span>
        </div>
      </div>
    </div>
  );
});

// KOMPONEN INPUTFIELD


// ============================================================================
// --- LOGIN SCREEN ---
// ============================================================================
const LoginScreen = ({ onLoginSuccess }) => {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 // State baru untuk menyimpan token validasi dari Cloudflare
 const [turnstileToken, setTurnstileToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // Validasi Keamanan Modern (Turnstile)
    if (!turnstileToken) {
      setErrorMsg("Sistem mendeteksi anomali. Harap tunggu verifikasi keamanan selesai.");
      setIsLoading(false);
      return;
    }

    try {
      const { data: pegawai, error: pegError } = await supabase
        .from("pegawai")
        .select("*")
        .eq("username", nip)
        .single();
        
      if (pegError || !pegawai) throw new Error("NIP tidak terdaftar dalam sistem.");

      const { error: authError } = await supabase.auth.signInWithPassword({ 
        email: `${nip}@izzatulislam.com`, 
        password: password 
      });
      
      if (authError) throw new Error("Kata Sandi salah atau Akun belum aktif.");

      onLoginSuccess(pegawai);
    } catch (error) {
      setErrorMsg(`Login Gagal! ${error.message}`);
      // generateCaptcha() dihapus dari sini
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-900/40 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
      
      <div className="w-full max-w-md relative z-10 mt-8">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 opacity-80"></div>
          
          <div className="text-center mb-8">
          <RunningText/>
            

            {/* LOGO SEKOLAH UNTUK HALAMAN LOGIN */}
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 shadow-inner border border-white/10 p-3">
              <img 
                src="/Logo fix.png" 
                alt="Logo SDIT Izzatul Islam" 
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://ui-avatars.com/api/?name=SDIT+Izzatul+Islam&background=10b981&color=fff&size=256&rounded=true&font-size=0.33";
                }}
              />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">SDIT Izzatul Islam </h1>
            <p className="text-amber-200/80 text-xs font-bold uppercase tracking-[0.25em]">Portal Presensi</p>
            
            <LoginLiveClock />
          </div>
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{errorMsg}</p>
            </div>
          )}
          
          <LoginForm 
            nip={nip}
            setNip={setNip}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            handleLogin={handleLogin}
            setTurnstileToken={setTurnstileToken}
            setErrorMsg={setErrorMsg}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// --- SIDEBAR NAVIGASI ---
// ============================================================================
const Sidebar = ({ user, activeMenu, setActiveMenu, onLogout, isMobileOpen, setIsMobileOpen }) => {
  // CARI BLOK INI LALU UBAH MENJADI:
const menus = user?.is_admin
? [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
    { id: "pegawai", label: "Kelola Pegawai", icon: Users },
    { id: "acara", label: "Agenda Acara", icon: MapPin }, // <--- TAMBAHKAN BARIS INI
    { id: "jadwaladmin", label: "Kelola Jadwal", icon: Calendar },
    { id: "perizinan", label: "Kelola Perizinan", icon: CheckSquare },
    { id: "rekap", label: "Rekap Absensi", icon: ClipboardCheck },
    { id: "pengaturan", label: "Pengaturan Sistem", icon: Settings },
  ]
: [
        { id: "dashboard", label: "Dashboard Guru", icon: LayoutDashboard },
        { id: "absen", label: "Modul Presensi", icon: MapPin },
        { id: "acara_guru", label: "Presensi Acara", icon: Ticket },
        { id: "jadwal", label: "Jadwal Mengajar", icon: BookOpen },
        { id: "riwayat", label: "Riwayat Kehadiran", icon: FileText },
      ];

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)}></div>}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col shadow-2xl`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900/50">
          
          {/* LOGO SEKOLAH UNTUK SIDEBAR ADMIN/GURU */}
          <div className="bg-white p-1 rounded-xl mr-3 h-10 w-10 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="/Logo fix.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://ui-avatars.com/api/?name=II&background=10b981&color=fff&size=128";
              }}
            />
          </div>
          
          <div>
            <h2 className="font-serif font-bold text-white text-lg leading-tight">Absensi SDIT Izzatul Islam</h2>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Portal Presensi</p>
          </div>
          <button className="ml-auto lg:hidden text-slate-400" onClick={() => setIsMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <div className="h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-amber-400 font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu Navigasi</p>
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveMenu(item.id); if (window.innerWidth < 1024) setIsMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive ? "bg-emerald-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all">
            <LogOut className="h-4 w-4" /> Keluar Sistem
          </button>
        </div>
      </aside>
    </>
  );
};

// ============================================================================
// --- KOMPONEN GURU: PRESENSI ACARA KHUSUS (MASUK & PULANG) ---
// ============================================================================
const PresensiAcara = ({ user }) => {
  const [acaraList, setAcaraList] = useState([]);
  const [riwayatAbsen, setRiwayatAbsen] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAcara, setSelectedAcara] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [pesan, setPesan] = useState({ error: "", success: "" });

  const today = new Date();
  const currentMonthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [filterBulan, setFilterBulan] = useState(currentMonthValue);

  const fetchData = async () => {
    setLoading(true);
    const { data: events } = await supabase.from("agenda_acara").select("*").order("tanggal", { ascending: true });
    
    // PERBAIKAN: Ambil juga 'id' dan 'waktu_pulang' untuk eksekusi update nantinya
    const { data: attendances } = await supabase
      .from("absensi")
      .select("id, tanggal, jenis_absen, waktu_absen, waktu_pulang")
      .eq("nip_guru", user.username)
      .ilike("jenis_absen", "%Acara%");

    setAcaraList(events || []);
    setRiwayatAbsen(attendances || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredEvents = acaraList.filter((item) => {
    if (!filterBulan) return true;
    const parts = item.tanggal ? item.tanggal.split("/") : [];
    if (parts.length === 3) return `${parts[2]}-${parts[1]}` === filterBulan;
    return false;
  });

  const cekDataAbsen = (acara) => {
    return riwayatAbsen.find(a => a.tanggal === acara.tanggal && a.jenis_absen.includes(acara.nama_acara));
  };

  const hariIniStr = getTodayDateString();

  const openModal = (acara) => {
    setSelectedAcara(acara);
    setPesan({ error: "", success: "" });
  };

  const closeModal = () => {
    if (!isLocating) {
      setSelectedAcara(null);
      setPesan({ error: "", success: "" });
    }
  };

  // LOGIKA BARU: Mode "masuk" (Insert) & Mode "pulang" (Update)
  const eksekusiAbsenAcara = async (jarakMeter = 0, isBypass = false, mode = "masuk") => {
    const waktuStr = getCurrentTimeString();
    const tglStr = getTodayDateString();
    const dataAbsenSaatIni = cekDataAbsen(selectedAcara);
    
    if (mode === "masuk") {
      // PROSES ABSEN MASUK
      const { data: insertedData, error } = await supabase.from("absensi").insert([{
        nip_guru: user.username,
        nama_guru: user.name,
        tanggal: tglStr,
        waktu_absen: waktuStr,
        status: "Tepat Waktu",
        jarak: isBypass ? "Bebas Lokasi" : `${jarakMeter} Meter`,
        jenis_absen: `Hadir Acara - ${selectedAcara.nama_acara}`
      }]).select().single(); // Pakai .select().single() agar ID yang baru dibuat langsung ditarik

      if (error) {
        setPesan({ error: error.message, success: "" });
      } else {
        setPesan({ error: "", success: `Kehadiran Acara tercatat pukul ${waktuStr} WIB.` });
        setRiwayatAbsen([...riwayatAbsen, insertedData]); // Update state instan
      }

    } else if (mode === "pulang") {
      // PROSES ABSEN PULANG
      const { error } = await supabase.from("absensi").update({ waktu_pulang: waktuStr }).eq("id", dataAbsenSaatIni.id);

      if (error) {
        setPesan({ error: error.message, success: "" });
      } else {
        setPesan({ error: "", success: `Waktu Pulang Acara berhasil tercatat pukul ${waktuStr} WIB.` });
        // Update state lokal secara instan
        const updatedRiwayat = riwayatAbsen.map(a => a.id === dataAbsenSaatIni.id ? { ...a, waktu_pulang: waktuStr } : a);
        setRiwayatAbsen(updatedRiwayat);
      }
    }
    
    setIsLocating(false);
  };

  const handleAbsenAcara = (mode) => {
    if (selectedAcara.tanggal !== hariIniStr) {
      setPesan({ error: "Akses Ditolak: Presensi hanya bisa dilakukan pada hari pelaksanaan acara.", success: "" });
      return;
    }

    setIsLocating(true);
    setPesan({ error: "", success: "" });

    if (!selectedAcara.wajib_gps) {
      eksekusiAbsenAcara(0, true, mode);
    } else {
      if (!navigator.geolocation) {
        setPesan({ error: "Browser tidak mendukung GPS.", success: "" });
        setIsLocating(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const jarak = Math.round(calculateDistance(pos.coords.latitude, pos.coords.longitude, selectedAcara.lat, selectedAcara.long));
          if (jarak <= selectedAcara.radius) {
            eksekusiAbsenAcara(jarak, false, mode);
          } else {
            setPesan({ error: `AKSES DITOLAK: Jarak Anda: ${jarak}m (Toleransi Maksimal: ${selectedAcara.radius}m).`, success: "" });
            setIsLocating(false);
          }
        },
        () => {
          setPesan({ error: "Gagal memindai GPS. Pastikan izin lokasi aktif.", success: "" });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-md"><Ticket className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Agenda & Presensi Acara</h2>
            <p className="text-sm text-slate-500 mt-1">Pantau jadwal kegiatan bulan ini dan catat kehadiran Anda.</p>
          </div>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-indigo-300 w-full sm:w-auto transition-colors">
          <div className="px-3 text-indigo-600"><Filter className="h-5 w-5" /></div>
          <input
            type="month"
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none pr-3 w-full cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <RefreshCw className="h-10 w-10 animate-spin mx-auto text-indigo-500 mb-3" /> 
          <p className="font-bold text-slate-500">Memuat Kalender Acara...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
          <Calendar className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Agenda Bulan Ini Kosong</h3>
          <p className="text-slate-500 mt-2 max-w-md text-sm">Tidak ada jadwal kegiatan luar di bulan ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((acara) => {
            const dataAbsen = cekDataAbsen(acara);
            const isHariIni = acara.tanggal === hariIniStr;

            return (
              <div 
                key={acara.id} 
                onClick={() => openModal(acara)}
                className={`group cursor-pointer bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl ${isHariIni ? 'border-indigo-300 shadow-md ring-2 ring-indigo-50' : 'border-slate-200 shadow-sm'}`}
              >
                <div className={`p-5 border-b flex justify-between items-start ${isHariIni ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div className={`p-2.5 rounded-xl ${isHariIni ? 'bg-indigo-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-500'}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  {isHariIni && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">Hari Ini</span>}
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{acara.nama_acara}</h3>
                    <p className="text-sm font-bold text-slate-500 mb-4">{acara.tanggal}</p>
                  </div>
                  
                  {/* Status Tampilan Kotak */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {dataAbsen && dataAbsen.waktu_pulang ? (
                      <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl text-[11px] font-bold border border-emerald-100">
                        <span><MapPin className="h-3 w-3 inline mb-0.5" /> {dataAbsen.waktu_absen}</span>
                        <span><LogOutIcon className="h-3 w-3 inline mb-0.5" /> {dataAbsen.waktu_pulang}</span>
                      </div>
                    ) : dataAbsen && !dataAbsen.waktu_pulang ? (
                      <div className="flex items-center justify-between text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl text-[11px] font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <span><MapPin className="h-3 w-3 inline mb-0.5" /> {dataAbsen.waktu_absen}</span>
                        <span>Berlangsung...</span>
                      </div>
                    ) : isHariIni ? (
                      <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl text-xs font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <MapPin className="h-4 w-4" /> Klik untuk Absen Masuk
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-2 rounded-xl text-xs font-bold border border-slate-100">
                        <Clock4 className="h-4 w-4" /> Lihat Detail Acara
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedAcara && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
          
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-indigo-50 to-white p-6 border-b border-indigo-100 flex justify-between items-start">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 border border-indigo-200">Formulir Kehadiran</span>
                <h3 className="text-2xl font-bold text-slate-800 leading-tight">{selectedAcara.nama_acara}</h3>
                <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Jadwal: {selectedAcara.tanggal}</p>
              </div>
              <button onClick={closeModal} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Status Pelacakan Lokasi</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedAcara.wajib_gps ? `Diwajibkan berada di area lokasi acara (Radius toleransi ${selectedAcara.radius} meter).` : "Bebas Lokasi. Anda dapat mencatat kehadiran dari mana saja tanpa sensor satelit."}
                  </p>
                </div>
              </div>

              {pesan.error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex gap-3 shadow-sm font-medium animate-in slide-in-from-top-2"><AlertTriangle className="h-5 w-5 shrink-0" /> {pesan.error}</div>}
              {pesan.success && <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm flex gap-3 shadow-sm font-bold animate-in slide-in-from-top-2"><CheckCircle className="h-5 w-5 shrink-0" /> {pesan.success}</div>}

              {/* LOGIKA TOMBOL MASUK DAN PULANG */}
              {(() => {
                const dataAbsen = cekDataAbsen(selectedAcara);
                
                // 1. Kondisi: Sudah Absen Pulang (Selesai)
                if (dataAbsen && dataAbsen.waktu_pulang) {
                  return (
                    <div className="w-full bg-emerald-50 text-emerald-600 font-bold py-4 rounded-2xl flex justify-between items-center px-6 border border-emerald-200 shadow-inner">
                      <span className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Acara Selesai</span>
                      <span className="font-mono text-xs">{dataAbsen.waktu_absen} - {dataAbsen.waktu_pulang}</span>
                    </div>
                  );
                } 
                
                // 2. Kondisi: Sudah Absen Masuk, Belum Pulang
                if (dataAbsen && !dataAbsen.waktu_pulang) {
                  return (
                    <button 
                      onClick={() => handleAbsenAcara("pulang")} 
                      disabled={isLocating}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                      {isLocating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <LogOutIcon className="h-5 w-5" />}
                      {isLocating ? "Memverifikasi Kepulangan..." : "Catat Waktu Pulang Acara"}
                    </button>
                  );
                }

                // 3. Kondisi: Belum Hari H
                if (selectedAcara.tanggal !== hariIniStr) {
                  return (
                    <div className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl flex justify-center items-center gap-2 border border-slate-200 cursor-not-allowed">
                      <Clock4 className="h-5 w-5" /> Absen Terkunci (Bukan Hari H)
                    </div>
                  );
                }

                // 4. Kondisi: Hari H & Belum Absen Sama Sekali
                return (
                  <button 
                    onClick={() => handleAbsenAcara("masuk")} 
                    disabled={isLocating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                  >
                    {isLocating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                    {isLocating ? "Memverifikasi Kedatangan..." : "Catat Kehadiran Masuk"}
                  </button>
                );
              })()}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN: MODUL PRESENSI ---
// ============================================================================
const AbsenScreen = ({ user }) => {
  const [activeTab, setActiveTab] = useState("masuk");
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [jenisIzin, setJenisIzin] = useState("Sakit");
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [todayRecord, setTodayRecord] = useState(null);

  const fetchTodayRecord = async () => {
    if (!user || !user.username) return; 
    try {
      const tanggalStr = getTodayDateString(); 
      const { data, error } = await supabase
        .from("absensi")
        .select("*")
        .eq("nip_guru", user.username)
        .eq("tanggal", tanggalStr)
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching record:", error);
        setTodayRecord(null);
      } else if (data && data.length > 0) {
        setTodayRecord(data[0]); 
      } else {
        setTodayRecord(null);
      }
    } catch (err) {
      console.error("Catch error:", err);
      setTodayRecord(null);
    }
  };

  useEffect(() => {
    fetchTodayRecord();
  }, [activeTab]);

  const handleAbsenGPS = async (mode) => {
    setIsLocating(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!navigator.geolocation) {
      setErrorMsg("Browser Anda tidak mendukung GPS.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const jarakMeter = Math.round(
            calculateDistance(position.coords.latitude, position.coords.longitude, SCHOOL_LOCATION.latitude, SCHOOL_LOCATION.longitude)
          );

          if (jarakMeter > SCHOOL_LOCATION.radiusAllowedMeters) {
            setErrorMsg(`AKSES DITOLAK: Anda berada di luar radius sekolah. Jarak Anda: ${jarakMeter} meter (Maksimal: 25m).`);
            setIsLocating(false);
            return;
          }

          const now = new Date();
          const tanggalStr = getTodayDateString();
          const waktuStr = getCurrentTimeString();

          if (mode === "masuk") {
            if (todayRecord) {
              setSuccessMsg(`Anda sudah mencatat kehadiran hari ini pada ${todayRecord.waktu_absen || "-"} WIB.`);
              setIsLocating(false);
              return;
            }

            let batasJam = 6, batasMenit = 50;
            const { data: config } = await supabase.from("pengaturan").select("waktu_batas").eq("id", 1).single();
            if (config && config.waktu_batas) {
              const p = config.waktu_batas.split(":");
              batasJam = parseInt(p[0]);
              batasMenit = parseInt(p[1]);
            }

            const jamMaksimal = new Date();
            jamMaksimal.setHours(batasJam, batasMenit, 0, 0);
            const statusAbsen = now <= jamMaksimal ? "Tepat Waktu" : "Terlambat";

            const { error } = await supabase.from("absensi").insert([{
              nip_guru: user.username,
              nama_guru: user.name,
              tanggal: tanggalStr,
              waktu_absen: waktuStr,
              status: statusAbsen,
              jarak: `${jarakMeter} Meter`,
              jenis_absen: "Hadir",
            }]);

            if (error) throw error;
            setSuccessMsg(`BERHASIL: Tercatat pukul ${waktuStr} WIB. Jarak Anda: ${jarakMeter}m.`);
            fetchTodayRecord();
            
          } else if (mode === "pulang") {
            if (!todayRecord) {
              setErrorMsg("Gagal: Anda belum melakukan Absen Masuk hari ini!");
              setIsLocating(false);
              return;
            }
            if (todayRecord.waktu_pulang) {
              setSuccessMsg(`Anda sudah Absen Pulang hari ini pada ${todayRecord.waktu_pulang} WIB, :).`);
              setIsLocating(false);
              return;
            }

            if (now.getHours() < 16) {
              setErrorMsg("Sesuai SOP Sekolah, mohon lakukan absensi pulang tepat pada atau setelah pukul 16.00.");
              setIsLocating(false);
              return;
            }

            const { error } = await supabase.from("absensi").update({ waktu_pulang: waktuStr }).eq("id", todayRecord.id);
            if (error) throw error;
            
            setSuccessMsg(`ABSEN PULANG BERHASIL! Tercatat pada ${waktuStr} WIB.`);
            fetchTodayRecord();
          }
        } catch (err) {
          setErrorMsg(`Gagal: ${err.message}`);
        }
        setIsLocating(false);
      },
      (error) => {
        setErrorMsg("Gagal memindai GPS. Pastikan izin lokasi perangkat aktif.");
        setIsLocating(false);
      },
      gpsOptions
    );
  };

  const handleAjukanIzin = async (e) => {
    e.preventDefault();
    setIsLocating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const tgl = getTodayDateString();
      const wkt = getCurrentTimeString();
      if (todayRecord) {
        setErrorMsg(
          "Anda sudah memiliki rekam kehadiran hari ini. Tidak bisa mengajukan izin."
        );
        setIsLocating(false);
        return;
      }
      const { error } = await supabase.from("absensi").insert([
        {
          nip_guru: user.username,
          nama_guru: user.name,
          tanggal: tgl,
          waktu_absen: wkt,
          status: "Menunggu Validasi",
          jarak: "Luar Area",
          jenis_absen: jenisIzin,
          keterangan: keteranganIzin,
        },
      ]);
      if (error) throw error;
      setSuccessMsg(`Pengajuan ${jenisIzin} berhasil dikirim ke Admin.`);
      fetchTodayRecord();
    } catch (err) {
      setErrorMsg(`Gagal mengajukan: ${err.message}`);
    }
    setIsLocating(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => {
            setActiveTab("masuk");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "masuk"
              ? "border-emerald-500 text-emerald-700 bg-white"
              : "border-transparent text-slate-500"
          }`}
        >
          <LogIn className="h-4 w-4" /> Absen Masuk
        </button>
        <button
          onClick={() => {
            setActiveTab("pulang");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "pulang"
              ? "border-indigo-500 text-indigo-700 bg-white"
              : "border-transparent text-slate-500"
          }`}
        >
          <LogOutIcon className="h-4 w-4" /> Absen Pulang
        </button>
        <button
          onClick={() => {
            setActiveTab("izin");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === "izin"
              ? "border-amber-500 text-amber-700 bg-white"
              : "border-transparent text-slate-500"
          }`}
        >
          <FileText className="h-4 w-4" /> Izin / Sakit
        </button>
      </div>

      <div className="p-6 md:p-8 text-center relative overflow-hidden">
      {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-left">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-left">
            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-800 font-medium">{successMsg}</p>
          </div>
        )}

        {/* LOGIKA PENGUNCI EXPERT: JIKA SUDAH ABSEN ACARA, KUNCI SEMUA MODUL REGULER */}
        {todayRecord && todayRecord.jenis_absen?.includes("Acara") ? (
          <div className="animate-in zoom-in-95 duration-300 py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-5 border-2 border-indigo-100 shadow-inner">
              <Ticket className="h-8 w-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 font-serif">Modul Absensi Reguler Terkunci</h2>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mt-4 max-w-md mx-auto text-left flex items-start gap-3 shadow-sm">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                Sistem mendeteksi Anda telah mencatat kehadiran untuk kegiatan <strong className="text-indigo-900 border-b border-indigo-300">{todayRecord.jenis_absen}</strong> hari ini.
                <br className="mb-3"/>
                <span className="text-xs text-indigo-600 opacity-90 block mt-2">Seluruh proses presensi kepulangan dikelola khusus melalui menu <b>Presensi Acara</b>. Anda tidak dapat mengisi absen reguler atau izin di halaman ini.</span>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* TAMPILAN NORMAL JIKA BUKAN HARI ACARA */}
            {activeTab === "masuk" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-5 border-2 border-emerald-100">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 font-serif">Pindai Lokasi Masuk Anda</h2>
                <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">Pastikan Anda berada di dalam area sekolah.</p>
                <button onClick={() => handleAbsenGPS("masuk")} disabled={isLocating} className="w-full max-w-sm mx-auto py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                  {isLocating ? "Memindai..." : "Catat Kehadiran Masuk"}
                </button>
              </div>
            )}

            {activeTab === "pulang" && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-5 border-2 border-indigo-100">
                  <LogOutIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 font-serif">Pindai Lokasi Pulang Anda</h2>
                <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">Akhiri jam kerja Anda hari ini. Sistem akan memperbarui rekam jejak kepulangan.</p>
                <button onClick={() => handleAbsenGPS("pulang")} disabled={isLocating} className="w-full max-w-sm mx-auto py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                  {isLocating ? "Memindai..." : "Catat Waktu Pulang"}
                </button>
              </div>
            )}

            {activeTab === "izin" && (
              <div className="animate-in slide-in-from-right-4 duration-300 text-left max-w-sm mx-auto">
                {todayRecord && todayRecord.jenis_absen !== "Hadir" ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="h-8 w-8 text-amber-600" /></div>
                    <h3 className="font-bold text-lg mb-1">Status Pengajuan</h3>
                    <p className="text-sm text-slate-500 mb-4">Anda telah mengajukan form {todayRecord.jenis_absen} hari ini.</p>
                    <div className={`py-2 px-4 rounded-xl font-bold text-sm ${todayRecord.status === "Menunggu Validasi" ? "bg-amber-100 text-amber-700" : todayRecord.status === "Diizinkan" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      Status: {todayRecord.status}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAjukanIzin} className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-amber-100 p-2.5 rounded-xl"><FileText className="h-6 w-6 text-amber-600" /></div>
                      <div><h2 className="font-bold text-lg text-slate-800">Form Pengajuan</h2><p className="text-xs text-slate-500">Izin tidak hadir / Sakit</p></div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kategori</label>
                      <select value={jenisIzin} onChange={(e) => setJenisIzin(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white">
                        <option value="Sakit">Kondisi Sakit</option>
                        <option value="Izin">Izin Keperluan Lain</option>
                        <option value="Dinas Luar">Tugas Dinas Luar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Alasan Lengkap</label>
                      <textarea required value={keteranganIzin} onChange={(e) => setKeteranganIzin(e.target.value)} placeholder="Tuliskan alasan..." rows="3" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={isLocating} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all mt-2">
                      {isLocating ? "Memproses..." : "Kirim Pengajuan"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// --- KOMPONEN GURU: JADWAL MENGAJAR (JadwalScreen) ---
// ============================================================================
const JadwalScreen = ({ user }) => {
  const [jadwalList, setJadwalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJadwal = async () => {
      setIsLoading(true);
      // Mengambil data jadwal mengajar khusus untuk guru yang sedang login (Super Cepat)
      const { data } = await supabase.from("jadwal").select("*").eq("nip_guru", user.username).order("hari");
      setJadwalList(data || []);
      setIsLoading(false);
    };
    fetchJadwal();
  }, [user.username]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div className="bg-emerald-100 p-3 rounded-2xl">
          <BookOpen className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Jadwal Mengajar Mingguan</h2>
          <p className="text-sm text-slate-500 mt-1">Daftar lengkap sesi akademik Anda.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center text-slate-500">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p>Memuat jadwal...</p>
        </div>
      ) : jadwalList.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="font-medium text-slate-600">Belum ada jadwal akademik ditugaskan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((hari) => {
            const jadwalHari = jadwalList.filter((j) => j.hari === hari);
            if (jadwalHari.length === 0) return null;
            return (
              <div key={hari} className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md"><Calendar className="h-5 w-5" /></div>
                  <h3 className="font-bold text-xl text-slate-800 font-serif tracking-wide">{hari}</h3>
                </div>
                <div className="space-y-4">
                  {jadwalHari.map((item) => (
                    <div key={item.id} className="relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden hover:-translate-y-0.5 transition-transform">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600"></div>
                      <div className="pl-2">
                        <span className="bg-slate-50 text-slate-600 font-mono text-sm font-bold px-3 py-1.5 rounded-lg border border-slate-200">
                          <Clock4 className="h-4 w-4 inline mr-1 text-emerald-600" /> {item.jam}
                        </span>
                        <p className="font-bold text-slate-900 text-lg mt-3 mb-4 leading-tight">{item.mapel}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold border border-indigo-100">
                            <Users className="h-3.5 w-3.5 inline mr-1" /> {item.kelas}
                          </div>
                          <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold border border-amber-100">
                            <MapPin className="h-3.5 w-3.5 inline mr-1" /> {item.ruang}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN: DASHBOARD GURU & RIWAYAT (DENGAN FILTER & PDF) ---
// ============================================================================
const PegawaiDashboard = ({ user, activeMenu, setActiveMenu }) => {
  const [jadwalList, setJadwalList] = useState([]);
  const [riwayatAbsen, setRiwayatAbsen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const [riwayatBulan, setRiwayatBulan] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [riwayatBulan]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const resJadwal = await supabase.from("jadwal").select("*").eq("nip_guru", user.username);
      if (!resJadwal.error) setJadwalList(resJadwal.data || []);
      const resAbsen = await supabase.from("absensi").select("*").eq("nip_guru", user.username).order("id", { ascending: false });
      if (!resAbsen.error) setRiwayatAbsen(resAbsen.data || []);
      setIsLoading(false);
    };
    fetchData();
  }, [user.username, activeMenu]);

  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" });
  const tglHariIni = getTodayDateString();
  const jdwlHariIni = jadwalList.filter((j) => j.hari?.toLowerCase() === hariIni.toLowerCase());
  const absHariIni = riwayatAbsen.find((a) => a.tanggal === tglHariIni);

  const filteredRiwayat = riwayatAbsen.filter((a) => {
    const parts = a.tanggal.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}` === riwayatBulan;
    return false;
  });

  // FIX LOGIKA STATUS
  const statHadir = filteredRiwayat.filter((a) => a.jenis_absen?.includes("Hadir")).length;
  const statTelat = filteredRiwayat.filter((a) => a.status === "Terlambat").length;
  const statIzin = filteredRiwayat.filter((a) => !a.jenis_absen?.includes("Hadir")).length;

  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage);
  const paginatedRiwayat = filteredRiwayat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadPDF = () => {
    if (filteredRiwayat.length === 0) return alert("Tidak ada data rekam jejak untuk dicetak pada bulan ini.");
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up diblokir oleh browser! Mohon izinkan pop-up (Allow Pop-ups) untuk mendownload PDF.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rekap Kehadiran - ${user.name}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; margin: 0; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0 0 5px 0; color: #064e3b; font-size: 22px; }
            .header p { margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
            .info-box p { margin: 5px 0; font-size: 12px; }
            .stats-container { display: flex; gap: 15px; margin-bottom: 20px; page-break-inside: avoid; }
            .stat-card { flex: 1; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; background: white; }
            .stat-card h3 { margin: 0 0 5px 0; font-size: 22px; color: #0f172a; }
            .stat-card p { margin: 0; font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; table-layout: fixed; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            tr { page-break-inside: avoid; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SDIT Izzatul Islam</h1>
            <p>Laporan Resmi Rekam Jejak Presensi Pegawai</p>
          </div>
          <div class="info-grid">
            <div class="info-box">
              <p><strong>Nama Pegawai:</strong> ${user.name}</p>
              <p><strong>NIP / Username:</strong> ${user.username}</p>
              <p><strong>Jabatan Akses:</strong> ${user.role}</p>
            </div>
            <div class="info-box" style="text-align: right;">
              <p><strong>Periode Laporan:</strong> ${riwayatBulan}</p>
              <p><strong>Dicetak Pada:</strong> ${getTodayDateString()} ${getCurrentTimeString()}</p>
            </div>
          </div>
          <div class="stats-container">
            <div class="stat-card" style="border-top: 4px solid #10b981;"><h3>${statHadir}</h3><p>Total Hadir</p></div>
            <div class="stat-card" style="border-top: 4px solid #ef4444;"><h3>${statTelat}</h3><p>Terlambat</p></div>
            <div class="stat-card" style="border-top: 4px solid #f59e0b;"><h3>${statIzin}</h3><p>Izin / Sakit / Dinas</p></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Absen</th>
                <th>Keterangan Tambahan</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Status Sistem</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRiwayat.map((r) => `
                <tr>
                  <td><strong>${r.tanggal}</strong></td>
                  <td>${r.jenis_absen || "Hadir"}</td>
                  <td>${!r.jenis_absen?.includes("Hadir") ? r.keterangan || "-" : "-"}</td>
                  <td style="font-family: monospace;">${r.jenis_absen?.includes("Hadir") ? r.waktu_absen || "-" : "-"}</td>
                  <td style="font-family: monospace;">${r.waktu_pulang || "-"}</td>
                  <td>${r.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Dokumen ini dihasilkan secara otomatis oleh Sistem Portal Presensi SDIT Izzatul Islam.</p>
            <p>Pencetakan tidak memerlukan tanda tangan basah karena telah tervalidasi oleh Database Satelit.</p>
          </div>
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {activeMenu === "dashboard" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2 tracking-wide">Selamat Datang, {user?.name}</h1>
              <p className="text-emerald-100 text-sm max-w-xl leading-relaxed">Semoga hari ini penuh berkah. Jangan lupa presensi kehadiran anda.</p>
            </div>
            <button onClick={() => setActiveMenu("absen")} className="relative z-10 whitespace-nowrap bg-white text-emerald-800 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" /> Buka Presensi Guru
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-1">
              <LiveClockWidget />

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-amber-500" /> Status Hari Ini</h3>
                {absHariIni ? (
                  <div className={`border rounded-xl p-5 text-center ${absHariIni.jenis_absen?.includes("Hadir") ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
                    <p className={`font-bold text-lg mb-4 ${absHariIni.jenis_absen?.includes("Hadir") ? "text-emerald-800" : "text-amber-800"}`}>
                      {absHariIni.jenis_absen === "Hadir" ? "Hadir di Sekolah" : absHariIni.jenis_absen}
                    </p>
                    {absHariIni.jenis_absen?.includes("Hadir") ? (
                      <div className="flex justify-center items-center gap-4 text-xs font-medium">
                        <div className="text-emerald-600 bg-emerald-100/50 p-2 rounded-lg">
                          <span className="block text-slate-500 mb-0.5 text-[10px] uppercase font-bold">Jam Masuk</span>
                          <span className="font-mono text-sm">{absHariIni.waktu_absen || "-"}</span>
                        </div>
                        <div className="text-slate-300"><ArrowRight className="h-4 w-4" /></div>
                        <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                          <span className="block text-slate-500 mb-0.5 text-[10px] uppercase font-bold">Jam Pulang</span>
                          <span className="font-mono text-sm">{absHariIni.waktu_pulang || "Belum"}</span>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-sm font-bold p-2 rounded-lg ${absHariIni.status === "Diizinkan" ? "text-emerald-700 bg-emerald-100" : absHariIni.status === "Ditolak" ? "text-red-700 bg-red-100" : "text-amber-700 bg-amber-100"}`}>
                        Status: {absHariIni.status}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                    <div className="inline-flex bg-slate-200 p-3.5 rounded-full mb-3"><Clock4 className="h-6 w-6 text-slate-500" /></div>
                    <p className="text-slate-800 font-bold text-lg">Belum Ada Catatan</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider flex items-center gap-2"><BarChart3 className="h-4 w-4 text-emerald-500" /> Ringkasan Bulan Ini</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
                    <p className="text-xl font-bold text-emerald-700 leading-none">{statHadir}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/70 mt-1.5">Hadir</p>
                  </div>
                  <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50">
                    <p className="text-xl font-bold text-red-600 leading-none">{statTelat}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-red-500/70 mt-1.5">Telat</p>
                  </div>
                  <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50">
                    <p className="text-xl font-bold text-amber-600 leading-none">{statIzin}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500/70 mt-1.5">Izin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg"><BookOpen className="h-5 w-5 text-emerald-600" /> Agenda Mengajar ({hariIni})</h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{jdwlHariIni.length} Sesi Hari Ini</span>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-slate-500 py-8"><RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" /> Memuat data...</div>
                ) : jdwlHariIni.length === 0 ? (
                  <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"><Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" /><p className="font-medium text-slate-600">Tidak ada jadwal mengajar untuk hari ini.</p></div>
                ) : (
                  jdwlHariIni.map((item) => (
                    <div key={item.id} className="relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                      <div className="pl-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="inline-flex bg-slate-50 text-slate-600 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 items-center gap-1.5 mb-2"><Clock4 className="h-3.5 w-3.5" /> {item.jam}</div>
                          <p className="font-bold text-slate-900 text-lg mb-2">{item.mapel}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-[10px] uppercase font-bold border border-indigo-100"><Users className="h-3 w-3" /> {item.kelas}</div>
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-md text-[10px] uppercase font-bold border border-amber-100"><MapPin className="h-3 w-3" /> {item.ruang}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMenu === "absen" && <AbsenScreen user={user} />}
      {activeMenu === "acara_guru" && <PresensiAcara user={user} />}

      {activeMenu === "riwayat" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl"><FileText className="h-8 w-8 text-emerald-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 font-serif">Riwayat Kehadiran</h2>
                <p className="text-slate-500 text-sm mt-1">Jejak rekam presensi komprehensif Anda.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-emerald-300 w-full sm:w-auto">
                <div className="px-3 text-emerald-600"><Filter className="h-5 w-5" /></div>
                <input type="month" value={riwayatBulan} onChange={(e) => setRiwayatBulan(e.target.value)} className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none pr-3 w-full cursor-pointer" />
              </div>
              <button onClick={handleDownloadPDF} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"><Printer className="h-4 w-4" /> Cetak Laporan PDF</button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-3 md:gap-6 bg-white border-b border-slate-100">
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 text-center"><p className="text-2xl md:text-3xl font-bold text-emerald-700">{statHadir}</p><p className="text-[10px] font-bold uppercase text-emerald-600/70 mt-1">Hadir Tepat</p></div>
            <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50 text-center"><p className="text-2xl md:text-3xl font-bold text-red-600">{statTelat}</p><p className="text-[10px] font-bold uppercase text-red-500/70 mt-1">Terlambat</p></div>
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 text-center"><p className="text-2xl md:text-3xl font-bold text-amber-600">{statIzin}</p><p className="text-[10px] font-bold uppercase text-amber-500/70 mt-1">Izin / Sakit</p></div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Tanggal</th>
                  <th className="px-6 py-4 font-bold">Jenis / Keterangan</th>
                  <th className="px-6 py-4 font-bold">Jam Masuk</th>
                  <th className="px-6 py-4 font-bold">Jam Pulang</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-emerald-500" /> Memuat riwayat...</td></tr>
                ) : paginatedRiwayat.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 bg-slate-50/50"><FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" /><p>Belum ada jejak kehadiran pada bulan ini.</p></td></tr>
                ) : (
                  paginatedRiwayat.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{item.tanggal}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-1 ${item.jenis_absen?.includes("Hadir") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.jenis_absen || "Hadir"}</span>
                        {!item.jenis_absen?.includes("Hadir") && <p className="text-[11px] text-slate-500 italic max-w-[200px] truncate" title={item.keterangan}>"{item.keterangan}"</p>}
                      </td>
                      {/* FIX PENAMPILAN JAM MASUK */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">{item.jenis_absen?.includes("Hadir") ? item.waktu_absen || "-" : "-"}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-600">{item.waktu_pulang || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        {item.jenis_absen?.includes("Hadir") ? (
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "Tepat Waktu" ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"}`}>{item.status}</span>
                        ) : (
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "Diizinkan" ? "bg-emerald-100 text-emerald-700" : item.status === "Ditolak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{item.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500">Hal {currentPage} dari {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"><ChevronLeft className="h-4 w-4 text-slate-600" /></button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"><ChevronRight className="h-4 w-4 text-slate-600" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeMenu === "jadwal" && <JadwalScreen user={user} />}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN BARU: OVERVIEW STATISTIK REAL-TIME ---
// ============================================================================
const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({ totalPegawai: 0, hadir: 0, telat: 0, izin: 0 });
  const [dataLists, setDataLists] = useState({ sudah: [], belum: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data: semuaPegawai } = await supabase.from("pegawai").select("username, name, role").neq("role", "Admin");
        const todayStr = getTodayDateString(); 
        const { data: absensiHariIni } = await supabase.from("absensi").select("nip_guru, nama_guru, waktu_absen, status, jenis_absen, keterangan").eq("tanggal", todayStr);

        if (semuaPegawai && absensiHariIni) {
          const hadir = absensiHariIni.filter((a) => a.status === "Tepat Waktu" && a.jenis_absen === "Hadir").length;
          const telat = absensiHariIni.filter((a) => a.status === "Terlambat").length;
          const izin = absensiHariIni.filter((a) => a.jenis_absen !== "Hadir").length;
          setStats({ totalPegawai: semuaPegawai.length, hadir, telat, izin });

          const sudah = absensiHariIni;
          const belum = semuaPegawai.filter((p) => !absensiHariIni.some((a) => a.nip_guru === p.username));
          setDataLists({ sudah, belum });
        } else {
          setStats({ totalPegawai: 0, hadir: 0, telat: 0, izin: 0 });
        }
      } catch (error) { console.error(error); }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <LiveClockWidget variant="horizontal" />

      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <ShieldCheck className="h-10 w-10 text-emerald-400 mb-4" />
        <h2 className="text-3xl font-bold font-serif">Command Center Utama</h2>
        <p className="mt-2 text-slate-400">Sistem pemantauan Absensi, Jadwal, & Kepegawaian SDIT Izzatul Islam.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" /> Ringkasan Aktivitas Hari Ini
        </h3>
        
        {isLoading ? (
          <div className="py-8 text-center text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-emerald-500" /> Memuat data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-slate-300 transition-colors">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3"><Users className="h-6 w-6" /></div>
                <p className="text-3xl font-bold text-slate-800">{stats.totalPegawai}</p>
                <p className="text-[11px] font-bold uppercase text-slate-500 mt-1">Total Pegawai</p>
              </div>
              
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-emerald-200 transition-colors">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mb-3"><CheckCircle className="h-6 w-6" /></div>
                <p className="text-3xl font-bold text-emerald-700">{stats.hadir}</p>
                <p className="text-[11px] font-bold uppercase text-emerald-600/70 mt-1">Hadir Tepat</p>
              </div>
              
              <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-red-200 transition-colors">
                <div className="bg-red-100 text-red-600 p-3 rounded-full mb-3"><Clock4 className="h-6 w-6" /></div>
                <p className="text-3xl font-bold text-red-600">{stats.telat}</p>
                <p className="text-[11px] font-bold uppercase text-red-500/70 mt-1">Terlambat</p>
              </div>
              
              <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-amber-200 transition-colors">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-full mb-3"><FileText className="h-6 w-6" /></div>
                <p className="text-3xl font-bold text-amber-600">{stats.izin}</p>
                <p className="text-[11px] font-bold uppercase text-amber-500/70 mt-1">Izin / Sakit</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
                <div className="p-4 border-b border-slate-100 bg-emerald-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Terekam Sistem</h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md shadow-sm">{dataLists.sudah.length} Orang</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 space-y-3">
                  {dataLists.sudah.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400"><Clock4 className="h-8 w-8 mb-2 opacity-50" /><p className="text-sm">Belum ada data masuk.</p></div>
                  ) : (
                    dataLists.sudah.map((a) => (
                      <div key={a.nip_guru} className="flex justify-between items-center p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{a.nama_guru}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{a.jenis_absen} • <span className="font-mono text-emerald-600">{a.waktu_absen} WIB</span></p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded shadow-sm ${a.status === "Tepat Waktu" ? "bg-emerald-100 text-emerald-700" : a.status === "Terlambat" ? "bg-red-100 text-red-700" : a.status === "Diizinkan" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2"><Clock4 className="h-4 w-4 text-slate-500" /> Belum Terdeteksi</h4>
                  <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md shadow-sm">{dataLists.belum.length} Orang</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 space-y-3">
                  {dataLists.belum.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-emerald-500"><CheckCircle className="h-8 w-8 mb-2 opacity-50" /><p className="text-sm font-bold">Semua pegawai sudah terekam!</p></div>
                  ) : (
                    dataLists.belum.map((p) => (
                      <div key={p.username} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">{p.name.charAt(0)}</div>
                          <div><p className="font-bold text-sm text-slate-800">{p.name}</p><p className="text-[10px] font-mono text-slate-400 mt-0.5">{p.username}</p></div>
                        </div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">Menunggu...</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN: KELOLA PERIZINAN (DENGAN FILTER TANGGAL & NATIVE PDF) ---
// ============================================================================
const KelolaPerizinan = () => {
  const [izinList, setIzinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const [filterDate, setFilterDate] = useState(`${year}-${month}-${day}`);

  const fetchIzin = async () => {
    setIsLoading(true);
    
    // MENGGUNAKAN FILTER .in() UNTUK PROTEKSI ABSOLUT & KECEPATAN MAKSIMAL
    const { data } = await supabase
      .from("absensi")
      .select("*")
      .in("jenis_absen", ["Sakit", "Izin", "Dinas Luar"]) 
      .order("id", { ascending: false });
      
    setIzinList(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchIzin(); }, []);

  const handleUpdateStatus = async (id, statusBaru) => {
    if (window.confirm(`Yakin ingin mengubah status menjadi ${statusBaru}?`)) {
      await supabase.from("absensi").update({ status: statusBaru }).eq("id", id);
      fetchIzin();
    }
  };

  const handleDeleteIzin = async (id, nama) => {
    if (window.confirm(`Yakin ingin MENGHAPUS data pengajuan izin atas nama ${nama}? Data akan musnah dan guru bisa mengajukan ulang.`)) {
      try {
        await supabase.from("absensi").delete().eq("id", id);
        fetchIzin();
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const filteredIzinList = izinList.filter((item) => {
    if (!filterDate) return true; 
    const parts = item.tanggal.split('/'); 
    if (parts.length === 3) {
      const itemDateISO = `${parts[2]}-${parts[1]}-${parts[0]}`; 
      return itemDateISO === filterDate;
    }
    return false;
  });

  const handleDownloadCSV = () => {
    if (filteredIzinList.length === 0) return alert("Tidak ada data izin di tanggal ini untuk diunduh.");
    const headers = ["Tanggal", "NIP", "Nama Pegawai", "Kategori", "Alasan", "Status"];
    const rows = filteredIzinList.map((r) => [
      r.tanggal, r.nip_guru, r.nama_guru, r.jenis_absen, `"${r.keterangan || ''}"`, r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Izin_${filterDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNGSI NATIVE PDF 0 KB (ANTI-POTONG CSS) ---
  const handleDownloadPDF = () => {
    if (filteredIzinList.length === 0) {
      return alert("Tidak ada data izin di tanggal ini untuk dicetak.");
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up diblokir oleh browser! Mohon izinkan pop-up (Allow Pop-ups) untuk mendownload PDF.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Perizinan - ${filterDate}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; margin: 0; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0 0 5px 0; color: #064e3b; font-size: 22px; }
            .header p { margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
            .info-box p { margin: 5px 0; font-size: 12px; }
            .stats-container { display: flex; gap: 15px; margin-bottom: 20px; page-break-inside: avoid; }
            .stat-card { flex: 1; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; background: white; }
            .stat-card h3 { margin: 0 0 5px 0; font-size: 22px; color: #0f172a; }
            .stat-card p { margin: 0; font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; table-layout: fixed; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            tr { page-break-inside: avoid; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SDIT Izzatul Islam</h1>
            <p>Laporan Pengajuan Izin Pegawai</p>
            <p style="margin-top: 5px; font-weight: bold; color: #10b981;">Tanggal: ${filterDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Pegawai</th>
                <th>NIP</th>
                <th>Kategori</th>
                <th>Alasan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredIzinList.map((r) => `
                <tr>
                  <td><strong>${r.tanggal}</strong></td>
                  <td>${r.nama_guru}</td>
                  <td style="font-family: monospace;">${r.nip_guru}</td>
                  <td>${r.jenis_absen}</td>
                  <td>${r.keterangan || "-"}</td>
                  <td>${r.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Dokumen ini dihasilkan secara otomatis oleh Sistem Portal Presensi SDIT Izzatul Islam.</p>
            <p>Dicetak Pada: ${getTodayDateString()} ${getCurrentTimeString()}</p>
          </div>
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print();
              }, 500); 
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Validasi Pengajuan Izin</h2>
          <p className="text-sm text-slate-500 mt-1">Review, filter, hapus, dan cetak pengajuan Izin/Sakit Pegawai.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* FILTER KALENDER */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-emerald-300 w-full sm:w-auto transition-colors">
            <div className="px-3 text-emerald-600"><Calendar className="h-5 w-5" /></div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none pr-3 w-full cursor-pointer"
            />
          </div>
          
          {/* TOMBOL CETAK */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleDownloadCSV} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all">
              <Printer className="h-4 w-4" /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="p-4 font-bold">Tanggal</th>
              <th className="p-4 font-bold">Pegawai</th>
              <th className="p-4 font-bold">Kategori & Alasan</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-center">Aksi Keputusan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="5" className="p-10 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-500" /> Memuat data...</td></tr>
            ) : filteredIzinList.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-slate-500">Tidak ada pengajuan izin di tanggal ini.</td></tr>
            ) : (
              filteredIzinList.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">{item.tanggal}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.nama_guru}</p>
                    <p className="text-[10px] font-mono text-slate-500">NIP: {item.nip_guru}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase mb-1">{item.jenis_absen}</span>
                    <p className="text-xs text-slate-600 max-w-xs truncate" title={item.keterangan}>"{item.keterangan}"</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "Menunggu Validasi" ? "bg-slate-100 text-slate-600" : item.status === "Diizinkan" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{item.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(item.id, "Diizinkan")} 
                        disabled={item.status === "Diizinkan"} 
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border ${item.status === "Diizinkan" ? "opacity-50 cursor-not-allowed bg-emerald-50 border-emerald-100 text-emerald-400" : "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"}`}
                      >
                        <Check className="h-3 w-3" /> Izinkan
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(item.id, "Ditolak")} 
                        disabled={item.status === "Ditolak"} 
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border ${item.status === "Ditolak" ? "opacity-50 cursor-not-allowed bg-red-50 border-red-100 text-red-400" : "bg-white border-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-colors"}`}
                      >
                        <XCircle className="h-3 w-3" /> Tolak
                      </button>
                      <button 
                        onClick={() => handleDeleteIzin(item.id, item.nama_guru)} 
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN LAINNYA ---
// ============================================================================
const KelolaPegawai = () => {
  const [pegawaiList, setPegawaiList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filterRole, setFilterRole] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalMode, setModalMode] = useState("add"); 
  const [isSaving, setIsSaving] = useState(false); 
  const [formData, setFormData] = useState({ 
    username: "", name: "", role: "Guru", status: "Aktif", is_admin: false, password: "", 
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const fetchPegawai = () => { 
    setIsLoading(true); 
    supabase
      .from("pegawai")
      .select("*")
      .order("name")
      .then(({ data }) => setPegawaiList(data || []))
      .finally(() => setIsLoading(false)); 
  };
  
  useEffect(() => { fetchPegawai(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterRole]);

  const handleOpenAddModal = () => { 
    setModalMode("add"); 
    setFormData({ username: "", name: "", role: "Guru", status: "Aktif", is_admin: false, password: "", }); 
    setIsModalOpen(true); 
  };
  
  const handleOpenEditModal = (pegawai) => { 
    setModalMode("edit"); 
    setFormData({ 
      username: pegawai.username || "", 
      name: pegawai.name || "", 
      role: pegawai.role || "Guru", 
      status: pegawai.status || "Aktif", 
      is_admin: pegawai.is_admin || false, 
    }); 
    setIsModalOpen(true); 
  };
  
  const handleDelete = (username, name) => { 
    if (window.confirm(`Yakin MENGHAPUS Pegawai: ${name}?`)) {
      supabase.from("pegawai").delete().eq("username", username).then(() => { fetchPegawai(); }); 
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsSaving(true); 
    const payload = { 
      username: formData.username, 
      name: formData.name, 
      role: formData.role, 
      status: formData.status, 
      is_admin: formData.is_admin, 
    }; 
    try { 
      if (modalMode === "add") { 
        payload.password = formData.password; 
        
        // 1. Ambil token sesi yang sedang aktif secara paksa
        const { data: { session } } = await supabase.auth.getSession();
        
        // 2. Sisipkan token tersebut ke dalam Headers Edge Function
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: payload,
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });
        
        if (error) throw new Error("Gagal membuat user di server. " + error.message); 
      } else { 
        const { error } = await supabase.from("pegawai").update(payload).eq("username", formData.username); 
        if (error) throw error;
      } 
      setIsModalOpen(false); 
      fetchPegawai(); 
    } catch (error) { 
      alert(`Gagal: ${error.message}`); 
    } finally { 
      setIsSaving(false); 
    } 
  };

  const filteredList = pegawaiList.filter((p) => {
    if (!p) return false;
    const matchSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.username || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "Semua" ? true : (filterRole === "Admin" ? p.is_admin : !p.is_admin);
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Manajemen Pegawai</h2>
          <p className="text-sm text-slate-500 mt-1">Total {filteredList.length} Pegawai terdaftar di sistem.</p>
        </div>
        <button 
          onClick={handleOpenAddModal} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Tambah Pegawai
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative w-full sm:max-w-md group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari NIP atau Nama..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            />
          </div>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)} 
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer bg-slate-50 font-bold text-slate-700"
          >
            <option value="Semua">Semua Akses</option>
            <option value="Guru">Hanya Guru</option>
            <option value="Admin">Hanya Admin</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-emerald-500" /> 
            Memuat data pegawai...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" /> 
            Tidak ada data pegawai yang sesuai.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 border-b border-slate-100">
              {paginatedList.map((p) => (
                <div key={p.username} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center relative overflow-hidden group">
                  <div className={`absolute top-0 w-full h-1.5 ${p.is_admin ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                  
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 shadow-sm transition-transform duration-300 group-hover:scale-110 ${p.is_admin ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-800 text-center leading-tight mb-1 truncate w-full" title={p.name}>{p.name}</h3>
                  <p className="text-xs font-mono text-slate-500 mb-3">{p.username}</p>
                  
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 ${p.is_admin ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {p.is_admin ? 'Super Admin' : 'Guru'}
                  </span>
                  
                  <div className="flex gap-3 w-full mt-auto pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleOpenEditModal(p)} 
                      className="flex-1 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition-colors font-bold text-xs flex justify-center items-center gap-1.5 border border-slate-200 hover:border-emerald-200"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p.username, p.name)} 
                      className="flex-1 py-2.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl transition-colors font-bold text-xs flex justify-center items-center gap-1.5 border border-slate-200 hover:border-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">Hal {currentPage} dari {totalPages}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages} 
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">{modalMode === "add" ? "Registrasi" : "Edit"} Pegawai</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">NIP</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.username} 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, ""), }) } 
                    disabled={modalMode === "edit"} 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value }) } 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({ ...formData, role: e.target.value }) } 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Admin">Administrator</option>
                  </select>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value }) } 
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
                {modalMode === "add" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kata Sandi Login</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value }) } 
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isAdmin" 
                    checked={formData.is_admin} 
                    onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked }) } 
                    className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" 
                  />
                  <label htmlFor="isAdmin" className="text-sm font-bold cursor-pointer">Berikan Akses Super Admin</label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">{isSaving ? "Menyimpan..." : "Simpan Pegawai"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const KelolaJadwal = () => {
  const [jadwalList, setJadwalList] = useState([]); 
  const [guruList, setGuruList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalMode, setModalMode] = useState("add"); 
  const [editId, setEditId] = useState(null); 
  const [isSaving, setIsSaving] = useState(false); 
  const [formData, setFormData] = useState({ 
    nip_guru: "", hari: "Senin", jam: "", mapel: "", kelas: "", ruang: "", 
  });
  
  const fetchData = async () => { 
    setIsLoading(true); 
    try { 
      const [resJadwal, resGuru] = await Promise.all([ 
        supabase.from("jadwal").select("*").order("hari"), 
        supabase.from("pegawai").select("username, name").eq("role", "Guru"), 
      ]); 
      setJadwalList(resJadwal.data || []); 
      setGuruList(resGuru.data || []); 
    } catch (err) {} finally { 
      setIsLoading(false); 
    } 
  };
  
  useEffect(() => { fetchData(); }, []);
  
  const handleOpenAddModal = () => { 
    setModalMode("add"); 
    setEditId(null); 
    setFormData({ nip_guru: guruList[0]?.username || "", hari: "Senin", jam: "", mapel: "", kelas: "", ruang: "", }); 
    setIsModalOpen(true); 
  };
  
  const handleOpenEditModal = (jadwal) => { 
    setModalMode("edit"); 
    setEditId(jadwal.id); 
    setFormData({ nip_guru: jadwal.nip_guru, hari: jadwal.hari, jam: jadwal.jam, mapel: jadwal.mapel, kelas: jadwal.kelas, ruang: jadwal.ruang, }); 
    setIsModalOpen(true); 
  };
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsSaving(true); 
    try { 
      if (modalMode === "add") await supabase.from("jadwal").insert([formData]); 
      else await supabase.from("jadwal").update(formData).eq("id", editId); 
      setIsModalOpen(false); 
      fetchData(); 
    } catch (err) {} finally { 
      setIsSaving(false); 
    } 
  };
  
  const handleDelete = async (id) => { 
    if (window.confirm("Yakin hapus?")) { 
      await supabase.from("jadwal").delete().eq("id", id); 
      fetchData(); 
    } 
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 font-serif">Manajemen Jadwal</h2>
        <button onClick={handleOpenAddModal} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm"><Plus className="h-4 w-4 inline mr-2" /> Tambah</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
              <th className="px-6 py-4">Hari/Jam</th>
              <th className="px-6 py-4">Guru</th>
              <th className="px-6 py-4">Mapel</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr><td colSpan="4" className="py-10 text-center text-slate-500"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-emerald-500" /> Memuat data...</td></tr>
            ) : (
              jadwalList.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-emerald-700">{item.hari}{" "} <span className="block text-xs font-mono text-slate-500">{item.jam}</span></td>
                  <td className="px-6 py-4 font-bold">{guruList.find((g) => g.username === item.nip_guru)?.name || item.nip_guru}</td>
                  <td className="px-6 py-4">{item.mapel}{" "} <span className="block text-xs text-slate-500">{item.kelas} • {item.ruang}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleOpenEditModal(item)} className="mr-3 text-slate-500 hover:text-emerald-600"><Edit2 className="h-4 w-4 inline" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg relative z-10">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 -mx-6 -mt-6 mb-6">
              <h3 className="font-bold text-lg text-slate-800">{modalMode === "add" ? "Tambah" : "Edit"} Jadwal</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <select required value={formData.nip_guru} onChange={(e) => setFormData({ ...formData, nip_guru: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl">
                <option value="">-- Pilih Guru --</option>
                {guruList.map((g) => (<option key={g.username} value={g.username}>{g.name}</option>))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.hari} onChange={(e) => setFormData({ ...formData, hari: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((h) => (<option key={h}>{h}</option>))}
                </select>
                <input type="text" required placeholder="Cth: 07:15 - 08:45" value={formData.jam} onChange={(e) => setFormData({ ...formData, jam: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <input type="text" required placeholder="Mata Pelajaran" value={formData.mapel} onChange={(e) => setFormData({ ...formData, mapel: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required placeholder="Kelas" value={formData.kelas} onChange={(e) => setFormData({ ...formData, kelas: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl" />
                <input type="text" required placeholder="Ruang" value={formData.ruang} onChange={(e) => setFormData({ ...formData, ruang: e.target.value }) } className="w-full px-4 py-2.5 border rounded-xl" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">{isSaving ? "Menyimpan..." : "Simpan Jadwal"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN: REKAP ABSENSI KESELURUHAN ---
// ============================================================================
const RekapAbsensi = () => {
  const [guruList, setGuruList] = useState([]);
  const [absensiList, setAbsensiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const currentMonthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedBulan, setSelectedBulan] = useState(currentMonthValue);
  const [selectedGuru, setSelectedGuru] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: dbGuru } = await supabase.from("pegawai").select("username, name").eq("role", "Guru");
        setGuruList(dbGuru || []);
        const { data: dbAbsen } = await supabase.from("absensi").select("*");
        setAbsensiList(dbAbsen || []);
      } catch (err) {}
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filterAbsenByBulan = (absenData, filterBulan) => {
    return absenData.filter((a) => {
      const parts = a.tanggal ? a.tanggal.split("/") : [];
      if (parts.length === 3) return `${parts[2]}-${parts[1]}` === filterBulan;
      return false;
    });
  };

  const absenBulanIni = filterAbsenByBulan(absensiList, selectedBulan);

  // FIX LOGIKA STATISTIK
  const hitungStatistikGuru = (nip) => {
    const absenGuru = absenBulanIni.filter((a) => a.nip_guru === nip);
    const hadir = absenGuru.filter((a) => a.jenis_absen?.includes("Hadir")).length;
    const telat = absenGuru.filter((a) => a.status === "Terlambat").length;
    const izinSakit = absenGuru.filter((a) => ["Izin", "Sakit", "Dinas Luar"].includes(a.jenis_absen)).length;
    return { hadir, telat, izinSakit, records: absenGuru };
  };

  const downloadCSV = (guruData, records) => {
    if (records.length === 0) { alert("Tidak ada data absen di bulan ini untuk diunduh."); return; }
    const headers = ["Tanggal", "Jenis Absen", "Jam Masuk", "Jam Pulang", "Status", "Jarak/Keterangan"];
    const rows = records.map((r) => [r.tanggal, r.jenis_absen || "Hadir", r.waktu_absen || "-", r.waktu_pulang || "-", r.status, `"${r.keterangan || r.jarak || ""}"`]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Absen_${guruData.name.replace(/\s+/g, "_")}_${selectedBulan}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (guruData, records) => {
    if (records.length === 0) { alert("Tidak ada data absen di bulan ini untuk dicetak."); return; }
    const printWindow = window.open("", "_blank");
    if (!printWindow) { alert("Pop-up diblokir oleh browser! Mohon izinkan pop-up."); return; }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Kehadiran - ${guruData.name}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; margin: 0; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0 0 5px 0; color: #064e3b; font-size: 22px; }
            .header p { margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid; }
            .info-box p { margin: 5px 0; font-size: 12px; }
            .stats-container { display: flex; gap: 15px; margin-bottom: 20px; page-break-inside: avoid; }
            .stat-card { flex: 1; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; background: white; }
            .stat-card h3 { margin: 0 0 5px 0; font-size: 22px; color: #0f172a; }
            .stat-card p { margin: 0; font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; table-layout: fixed; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            tr { page-break-inside: avoid; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <div class="header"><h1>SDIT Izzatul Islam</h1><p>Laporan Resmi Rekam Jejak Presensi Pegawai</p></div>
          <div class="info-grid">
            <div class="info-box"><p><strong>Nama Pegawai:</strong> ${guruData.name}</p><p><strong>NIP / Username:</strong> ${guruData.username}</p></div>
            <div class="info-box" style="text-align: right;"><p><strong>Periode Laporan:</strong> ${selectedBulan}</p><p><strong>Dicetak Pada:</strong> ${getTodayDateString()} ${getCurrentTimeString()}</p></div>
          </div>
          <div class="stats-container">
            <div class="stat-card" style="border-top: 4px solid #10b981;"><h3>${guruData.stats.hadir}</h3><p>Total Hadir</p></div>
            <div class="stat-card" style="border-top: 4px solid #ef4444;"><h3>${guruData.stats.telat}</h3><p>Terlambat</p></div>
            <div class="stat-card" style="border-top: 4px solid #f59e0b;"><h3>${guruData.stats.izinSakit}</h3><p>Izin / Sakit / Dinas</p></div>
          </div>
          <table>
            <thead>
              <tr><th>Tanggal</th><th>Jenis Absen</th><th>Keterangan Tambahan</th><th>Jam Masuk</th><th>Jam Pulang</th><th>Status Sistem</th></tr>
            </thead>
            <tbody>
              ${records.sort((a, b) => b.tanggal.split("/").reverse().join("").localeCompare(a.tanggal.split("/").reverse().join(""))).map((r) => `
                <tr>
                  <td><strong>${r.tanggal}</strong></td>
                  <td>${r.jenis_absen || "Hadir"}</td>
                  <td>${!r.jenis_absen?.includes("Hadir") ? r.keterangan || "-" : "-"}</td>
                  <td style="font-family: monospace;">${r.jenis_absen?.includes("Hadir") ? r.waktu_absen || "-" : "-"}</td>
                  <td style="font-family: monospace;">${r.waktu_pulang || "-"}</td>
                  <td>${r.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Dokumen ini dihasilkan secara otomatis oleh Sistem Portal Presensi SDIT Izzatul Islam.</p>
            <p>Pencetakan tidak memerlukan tanda tangan basah karena telah tervalidasi oleh Database Satelit.</p>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Rekapitulasi Absensi</h2>
          <p className="text-sm text-slate-500 mt-1">Pantau & Ekspor performa kehadiran per entitas Guru.</p>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-emerald-300 transition-colors">
          <div className="px-3 text-emerald-600"><Filter className="h-5 w-5" /></div>
          <input type="month" value={selectedBulan} onChange={(e) => setSelectedBulan(e.target.value)} className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none pr-3 cursor-pointer" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <RefreshCw className="h-10 w-10 animate-spin mx-auto text-emerald-500 mb-4" />
          <p className="text-slate-500 font-medium">Menganalisa Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guruList.map((guru) => {
            const stats = hitungStatistikGuru(guru.username);
            return (
              <div key={guru.username} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-emerald-500/20 transition-colors"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-700 font-bold text-xl border border-emerald-200 shadow-inner group-hover:scale-110 transition-transform duration-300">{guru.name.charAt(0)}</div>
                  <h3 className="font-bold text-slate-800 text-lg truncate leading-tight" title={guru.name}>{guru.name}</h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-1.5 flex items-center gap-1.5"><User className="h-3 w-3" /> NIP: {guru.username}</p>
                </div>
                <div className="p-6 flex-1 bg-white flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-3 text-center mb-6">
                    <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/50 group-hover:bg-emerald-50 transition-colors"><p className="text-2xl font-bold text-emerald-700 leading-none">{stats.hadir}</p><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 mt-2">Hadir</p></div>
                    <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100/50 group-hover:bg-red-50 transition-colors"><p className="text-2xl font-bold text-red-600 leading-none">{stats.telat}</p><p className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 mt-2">Telat</p></div>
                    <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/50 group-hover:bg-amber-50 transition-colors"><p className="text-2xl font-bold text-amber-600 leading-none">{stats.izinSakit}</p><p className="text-[10px] font-bold uppercase tracking-wider text-amber-500/70 mt-2">Izin</p></div>
                  </div>
                  <button onClick={() => setSelectedGuru({ ...guru, stats })} className="w-full py-3.5 bg-slate-50 hover:bg-emerald-600 text-slate-600 hover:text-white font-bold text-sm rounded-xl transition-all duration-300 border border-slate-200 hover:border-transparent flex items-center justify-center gap-2 shadow-sm hover:shadow-md"><LayoutDashboard className="h-4 w-4" /> Lihat Detail</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedGuru && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedGuru(null)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-2xl border border-emerald-200 shadow-inner">{selectedGuru.name.charAt(0)}</div>
                <div><h3 className="font-bold text-2xl text-slate-800 font-serif mb-1">{selectedGuru.name}</h3><p className="text-sm text-slate-500 flex items-center gap-2 font-medium"><Calendar className="h-4 w-4 text-emerald-500" /> Periode Laporan: <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{selectedBulan}</span></p></div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={() => downloadCSV(selectedGuru, selectedGuru.stats.records)} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"><Download className="h-4 w-4" /> CSV</button>
                <button onClick={() => downloadPDF(selectedGuru, selectedGuru.stats.records)} className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"><Printer className="h-4 w-4" /> PDF</button>
                <button onClick={() => setSelectedGuru(null)} className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><X className="h-5 w-5" /></button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-white scrollbar-thin scrollbar-thumb-slate-200">
              {selectedGuru.stats.records.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl"><FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-600 font-bold text-lg">Belum Ada Rekam Jejak</p></div>
              ) : (
                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200"><th className="p-5 font-bold">Tanggal</th><th className="p-5 font-bold">Jenis / Keterangan</th><th className="p-5 font-bold">Jam Masuk</th><th className="p-5 font-bold">Jam Pulang</th><th className="p-5 font-bold text-right">Status Sistem</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedGuru.stats.records.sort((a, b) => b.tanggal.split("/").reverse().join("").localeCompare(a.tanggal.split("/").reverse().join(""))).map((absen, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-5 font-bold text-slate-700 whitespace-nowrap">{absen.tanggal}</td>
                          <td className="p-5">
                            <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-1.5 border ${absen.jenis_absen?.includes("Hadir") ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>{absen.jenis_absen || "Hadir"}</span>
                            {!absen.jenis_absen?.includes("Hadir") && (<p className="text-xs text-slate-500 leading-relaxed max-w-[250px] italic">"{absen.keterangan}"</p>)}
                          </td>
                          {/* FIX PENAMPILAN JAM MASUK DI MODAL ADMIN */}
                          <td className="p-5 font-mono font-bold text-slate-600">{absen.jenis_absen?.includes("Hadir") ? absen.waktu_absen || "-" : "-"}</td>
                          <td className="p-5 font-mono font-bold text-slate-600">{absen.waktu_pulang || "-"}</td>
                          <td className="p-5 text-right">
                            {absen.jenis_absen?.includes("Hadir") ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${absen.status === "Tepat Waktu" ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"}`}><CheckCircle className="h-3 w-3" /> {absen.status}</span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-500"><MoreHorizontal className="h-3 w-3" /> Diizinkan</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN: KELOLA AGENDA ACARA KHUSUS ---
// ============================================================================
const KelolaAcara = () => {
  const [acaraList, setAcaraList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocatingAdmin, setIsLocatingAdmin] = useState(false);
  
  // --- STATE BARU UNTUK EDIT & FILTER ---
  const [modalMode, setModalMode] = useState("add"); 
  const [editId, setEditId] = useState(null);
  
  const today = new Date();
  const currentMonthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [filterBulan, setFilterBulan] = useState(currentMonthValue);
  
  const [formData, setFormData] = useState({
    tanggal: "", nama_acara: "", wajib_gps: false, lat: "", long: "", radius: 50
  });

  const fetchAcara = async () => {
    setIsLoading(true);
    const { data } = await supabase.from("agenda_acara").select("*").order("tanggal", { ascending: true });
    setAcaraList(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchAcara(); }, []);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditId(null);
    const todayDate = new Date();
    const yyyy = todayDate.getFullYear();
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
    const dd = String(todayDate.getDate()).padStart(2, '0');
    
    setFormData({ tanggal: `${yyyy}-${mm}-${dd}`, nama_acara: "", wajib_gps: false, lat: "", long: "", radius: 50 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setEditId(item.id);
    
    // Ubah DD/MM/YYYY dari database menjadi YYYY-MM-DD untuk input kalender HTML
    const parts = item.tanggal.split("/");
    const dateForInput = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";

    setFormData({ 
      tanggal: dateForInput, 
      nama_acara: item.nama_acara, 
      wajib_gps: item.wajib_gps, 
      lat: item.lat || "", 
      long: item.long || "", 
      radius: item.radius || 50 
    });
    setIsModalOpen(true);
  };

  const handleGetAdminLocation = () => {
    setIsLocatingAdmin(true);
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS.");
      setIsLocatingAdmin(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({ ...formData, lat: position.coords.latitude, long: position.coords.longitude });
        setIsLocatingAdmin(false);
      },
      () => {
        alert("Gagal membaca GPS. Pastikan izin lokasi perangkat Anda aktif.");
        setIsLocatingAdmin(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Ubah format YYYY-MM-DD kembali menjadi DD/MM/YYYY
    const tglParts = formData.tanggal.split("-");
    const tglFormatted = `${tglParts[2]}/${tglParts[1]}/${tglParts[0]}`;

    const payload = {
      tanggal: tglFormatted,
      nama_acara: formData.nama_acara,
      wajib_gps: formData.wajib_gps,
      lat: formData.wajib_gps && formData.lat ? parseFloat(formData.lat) : null,
      long: formData.wajib_gps && formData.long ? parseFloat(formData.long) : null,
      radius: formData.wajib_gps ? parseInt(formData.radius) : null,
    };

    let errorResult;
    if (modalMode === "add") {
      const { error } = await supabase.from("agenda_acara").insert([payload]);
      errorResult = error;
    } else {
      const { error } = await supabase.from("agenda_acara").update(payload).eq("id", editId);
      errorResult = error;
    }
    
    setIsSaving(false);

    if (errorResult) {
      alert("Gagal menyimpan acara: " + errorResult.message);
    } else {
      setIsModalOpen(false);
      fetchAcara();
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin membatalkan dan menghapus acara "${nama}"?`)) {
      await supabase.from("agenda_acara").delete().eq("id", id);
      fetchAcara();
    }
  };

  // --- LOGIKA FILTER BERDASARKAN BULAN & TAHUN ---
  const filteredAcaraList = acaraList.filter((item) => {
    if (!filterBulan) return true; 
    const parts = item.tanggal ? item.tanggal.split("/") : []; 
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}` === filterBulan; 
    }
    return false;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Kalender Agenda Acara</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola dan jadwalkan kegiatan luar (Event) dengan mode absensi khusus.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* FILTER BULAN */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-emerald-300 w-full sm:w-auto transition-colors">
            <div className="px-3 text-emerald-600"><Filter className="h-5 w-5" /></div>
            <input
              type="month"
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 outline-none pr-3 w-full cursor-pointer"
            />
          </div>
          <button onClick={handleOpenAddModal} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Tambah Acara
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="p-4 font-bold">Tgl Pelaksanaan</th>
              <th className="p-4 font-bold">Nama Kegiatan</th>
              <th className="p-4 font-bold">Status Pelacakan (GPS)</th>
              <th className="p-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="4" className="p-10 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" /> Memuat kalender...</td></tr>
            ) : filteredAcaraList.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-slate-500 bg-slate-50/50">Belum ada agenda acara khusus di bulan ini.</td></tr>
            ) : (
              filteredAcaraList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">{item.tanggal}</td>
                  <td className="p-4 font-bold text-emerald-700">{item.nama_acara}</td>
                  <td className="p-4">
                    {item.wajib_gps ? (
                      <div>
                        <span className="inline-flex px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider mb-1"><MapPin className="h-3 w-3 inline mr-1" /> GPS WAJIB</span>
                        <p className="text-[10px] font-mono text-slate-500">Radius: {item.radius}m</p>
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">BEBAS LOKASI</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenEditModal(item)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id, item.nama_acara)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" /> {modalMode === "add" ? "Jadwalkan Acara Baru" : "Edit Acara"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal Acara</label>
                  <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Acara</label>
                  <input type="text" required placeholder="Cth: Study Tour" value={formData.nama_acara} onChange={(e) => setFormData({ ...formData, nama_acara: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Wajibkan Pelacakan GPS?</p>
                    <p className="text-[10px] text-slate-500">Jika mati, absen bisa dari manapun.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.wajib_gps} onChange={(e) => setFormData({ ...formData, wajib_gps: e.target.checked })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                {formData.wajib_gps && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2">
                    <button type="button" onClick={handleGetAdminLocation} disabled={isLocatingAdmin} className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200 transition-colors flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" /> {isLocatingAdmin ? "Mencari Satelit..." : "Gunakan Titik Lokasi Saya Saat Ini"}
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                        <input type="text" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} required={formData.wajib_gps} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                        <input type="text" value={formData.long} onChange={(e) => setFormData({ ...formData, long: e.target.value })} required={formData.wajib_gps} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Radius Boleh Absen (Meter)</label>
                      <input type="number" min="10" value={formData.radius} onChange={(e) => setFormData({ ...formData, radius: e.target.value })} required={formData.wajib_gps} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
                  {isSaving ? "Menyimpan..." : (modalMode === "add" ? "Jadwalkan Acara" : "Simpan Perubahan")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// --- KOMPONEN ADMIN: PENGATURAN SISTEM ---
// ============================================================================
const PengaturanSistem = () => {
  const [batasWaktu, setBatasWaktu] = useState("06:50"); 
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => { 
    supabase
      .from("pengaturan")
      .select("waktu_batas")
      .eq("id", 1)
      .single()
      .then(({ data }) => { 
        if (data && data.waktu_batas) setBatasWaktu(data.waktu_batas.substring(0, 5)); 
      }); 
  }, []);
  
  const handleSave = async (e) => { 
    e.preventDefault(); 
    setIsSaving(true); 
    await supabase.from("pengaturan").upsert([{ id: 1, waktu_batas: `${batasWaktu}:00` }]); 
    alert("Pengaturan Global Tersimpan!"); 
    setIsSaving(false); 
  };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-800 text-white p-3 rounded-2xl shadow-md"><Settings className="h-6 w-6" /></div>
        <div><h2 className="text-2xl font-bold font-serif text-slate-800">Pengaturan Sistem</h2><p className="text-sm text-slate-500 mt-1">Konfigurasi batas waktu absensi masuk reguler sekolah.</p></div>
      </div>
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Batas Jam Terlambat Absen Masuk</label>
            <input type="time" value={batasWaktu} onChange={(e) => setBatasWaktu(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none" required />
          </div>
          <div className="p-4 bg-amber-50 rounded-xl flex gap-3 text-amber-700 text-sm border border-amber-200">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>Perhatian: Jam batas ini otomatis berlaku untuk semua guru pada mode absensi harian (non-acara).</p>
          </div>
          <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
            {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Simpan Pengaturan"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// --- ROUTING UTAMA (APP) ---
// ============================================================================
// CARI BLOK INI LALU UBAH MENJADI:
const AdminDashboard = ({ activeMenu }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {activeMenu === "dashboard" && <AdminDashboardOverview />}
      {activeMenu === "pegawai" && <KelolaPegawai />}
      {activeMenu === "acara" && <KelolaAcara />} 
      {activeMenu === "jadwaladmin" && <KelolaJadwal />}
      {activeMenu === "perizinan" && <KelolaPerizinan />}
      {activeMenu === "rekap" && <RekapAbsensi />}
      {activeMenu === "pengaturan" && <PengaturanSistem />}
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  if (!currentUser) return <LoginScreen onLoginSuccess={(u) => { setCurrentUser(u); setActiveMenu("dashboard"); }} />;
  
  return (
    <div className="min-h-screen bg-slate-50/80 font-sans flex">
      <Sidebar 
        user={currentUser} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onLogout={() => { setCurrentUser(null); setActiveMenu(""); }} 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full overflow-hidden">
        <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <div className="font-bold text-lg flex items-center">
            {/* LOGO UNTUK HEADER HP (MOBILE) */}
            <img 
              src="/Logo fix.png" 
              alt="Logo" 
              className="h-8 w-8 inline mr-2 object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
              }} 
            />
            Absensi SDIT Izzatul Islam
          </div>
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
          {currentUser.is_admin ? (
            <AdminDashboard activeMenu={activeMenu} />
          ) : (
            <PegawaiDashboard user={currentUser} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;