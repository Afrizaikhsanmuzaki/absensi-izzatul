import { Info } from 'lucide-react';

export default function RunningText() {
  return (
    <>
      <style>
        {`
          @keyframes marquee {
            /* Mulai dari posisi diam (karena teks sudah didorong oleh padding) */
            0% { transform: translateX(0); }
            /* Bergerak ke kiri sampai seluruh teks dan padding habis */
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            /* INI KUNCINYA: Mendorong teks tepat ke luar batas kanan wadah/layar */
            padding-left: 100%;
            animation: marquee 15s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="w-full overflow-hidden bg-slate-800/80 border border-slate-700/50 rounded-xl mb-8 py-2.5 shadow-inner" title="Papan Pengumuman Digital">
        <div className="animate-marquee cursor-default">
          <span className="text-amber-400 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
            <Info className="h-3.5 w-3.5" /> Selamat datang di portal absensi SDIT Izzatul Islam. Silahkan melakukan absen sebelum jam 06.50 agar tidak dihitung terlambat. Terimakasih.
          </span>
        </div>
      </div>
    </>
  );
}