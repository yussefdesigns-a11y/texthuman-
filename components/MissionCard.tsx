
import React from 'react';
import { Protocol } from '../types';

interface MissionCardProps {
  currentProtocol: Protocol | null;
  allCompleted: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({ currentProtocol, allCompleted }) => {
  if (allCompleted) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-lg border border-emerald-400/30 flex items-center justify-between group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-white text-7xl">military_tech</span>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
            <span className="material-symbols-outlined">done_all</span>
          </div>
          <div>
            <h3 className="text-white font-black text-lg leading-tight">Master Protocols Active</h3>
            <p className="text-emerald-50 text-xs font-medium opacity-80">All training modules completed. System at peak efficiency.</p>
          </div>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-white text-[10px] font-black uppercase tracking-widest relative z-10">
          Elite Rank
        </div>
      </div>
    );
  }

  if (!currentProtocol) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex items-center justify-between hover:shadow-md transition-all group border-l-4 border-l-amber-400">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
          <span className="material-symbols-outlined text-3xl">{currentProtocol.icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Primary Mission</span>
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Protocol</span>
          </div>
          <h3 className="text-slate-900 font-black text-lg leading-tight">{currentProtocol.title}</h3>
          <p className="text-slate-500 text-xs mt-1 font-medium">{currentProtocol.description}</p>
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-2 text-right">
        <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Status</p>
          <p className="text-xs font-black text-primary uppercase tracking-tighter">In Progress</p>
        </div>
        <p className="text-[10px] font-black text-amber-600 italic group-hover:translate-x-[-4px] transition-transform">
          {currentProtocol.actionHint} →
        </p>
      </div>
    </div>
  );
};

export default MissionCard;
