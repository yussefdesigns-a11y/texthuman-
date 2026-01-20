
import React from 'react';
import { SavedRecord } from '../types';

interface HistoryViewProps {
  records: SavedRecord[];
  onSelect: (record: SavedRecord) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onSelect, onDelete, onBack }) => {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Your Activity</h1>
            <p className="text-slate-500 text-sm mt-1">Access your previously analyzed and humanized documents stored on this device.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-2">
        {records.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <span className="material-symbols-outlined text-slate-300 text-6xl">history</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No records found</h3>
            <p className="text-slate-500 max-w-xs mt-1">Perform an analysis to save your progress here.</p>
            <button 
              onClick={onBack}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
            >
              Analyze Something
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.sort((a, b) => b.timestamp - a.timestamp).map((record) => (
              <div 
                key={record.id}
                className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col h-64"
                onClick={() => onSelect(record)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(record.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${record.humanized ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      {record.humanized ? 'HUMANIZED' : 'ANALYSIS'}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded text-slate-300 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-4 flex-1 mb-4 italic leading-relaxed">
                  "{record.originalText}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                      {record.analysis.humanPercentage}%
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Human Score</span>
                  </div>
                  {record.humanized && (
                     <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs">
                        <span className="material-symbols-outlined text-sm">face</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{record.tone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
