
import React, { useState } from 'react';
import { AnalysisResult, HumanizedResult } from '../types';

interface HumanizeResultsProps {
  originalText: string;
  analysis: AnalysisResult;
  humanized: HumanizedResult | null;
  loading: boolean;
  onHumanize: (tone: string) => void;
  onBack: () => void;
}

const HumanizeResults: React.FC<HumanizeResultsProps> = ({
  originalText,
  analysis,
  humanized,
  loading,
  onHumanize,
  onBack,
}) => {
  const [activeTone, setActiveTone] = useState('Professional');
  const [hoveredSentence, setHoveredSentence] = useState<string | null>(null);
  const tones = ['Casual', 'Professional', 'Academic'];

  const renderAnalysisText = () => {
    // We try to match sentences from the analysis to the original text.
    // This is complex because model might return slightly cleaned sentences.
    // For this UI, we will render based on the analyzed sentences if provided.
    if (!analysis.sentences || analysis.sentences.length === 0) {
      return originalText;
    }

    return (
      <div className="space-y-1">
        {analysis.sentences.map((s, idx) => {
          const isAI = s.aiLikelihood > 40;
          return (
            <span 
              key={idx}
              onMouseEnter={() => setHoveredSentence(s.text)}
              onMouseLeave={() => setHoveredSentence(null)}
              className={`inline cursor-help transition-all duration-200 ${isAI ? 'bg-red-50 border-b-2 border-red-300/50 hover:bg-red-100' : 'hover:bg-slate-50'} ${hoveredSentence === s.text ? 'ring-2 ring-primary/20 rounded' : ''}`}
              title={s.reason}
            >
              {s.text}{' '}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full h-full pb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">Draft Analysis</span>
              <span className="text-xs text-slate-400">• Word count: {analysis.wordCount}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Analysis Comparison</h2>
          </div>
        </div>

        <div className="bg-slate-100 p-1 rounded-lg flex items-center">
          {tones.map((tone) => (
            <label key={tone} className="cursor-pointer relative px-4 py-1.5 rounded-md transition-all">
              <input
                type="radio"
                name="tone"
                className="peer sr-only"
                checked={activeTone === tone}
                onChange={() => {
                  setActiveTone(tone);
                  onHumanize(tone);
                }}
              />
              <span className={`text-sm font-medium relative z-10 flex items-center gap-1 transition-colors ${activeTone === tone ? 'text-primary' : 'text-slate-500'}`}>
                {tone}
                {activeTone === tone && <span className="material-symbols-outlined text-[14px]">check</span>}
              </span>
              <div className={`absolute inset-0 bg-white shadow-sm rounded-md transition-all z-0 ${activeTone === tone ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}></div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
          {/* Original View */}
          <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">smart_toy</span>
                <span className="text-sm font-semibold text-slate-700">Analysis Highlights</span>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wide">Hover for insights</span>
            </div>
            <div className="p-6 text-base leading-relaxed text-slate-600 custom-scroll overflow-y-auto flex-1 h-full">
              {renderAnalysisText()}
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
              <span>{analysis.wordCount} Words</span>
              <span className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-red-400"></div>
                Likely AI Sentence
              </span>
            </div>
          </div>

          {/* Humanized View */}
          <div className="flex flex-col bg-white rounded-2xl border border-primary/30 shadow-lg shadow-primary/5 overflow-hidden relative h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-teal-400"></div>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">face</span>
                <span className="text-sm font-bold text-slate-900">Humanized Output</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded hover:bg-slate-100" title="Regenerate" onClick={() => onHumanize(activeTone)}>
                  <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative flex flex-col min-h-0">
              {loading ? (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-slate-700">Applying Humanization Protocol...</p>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">Refining sentence variance, tone, and authentic human markers.</p>
                </div>
              ) : null}
              
              <textarea 
                className="flex-1 w-full p-6 text-base leading-relaxed text-slate-800 bg-transparent border-0 focus:ring-0 resize-none custom-scroll font-medium"
                spellCheck="false"
                readOnly
                value={humanized?.text || 'Processing humanization...'}
              />

              <div className="absolute bottom-6 right-6 flex gap-3">
                <button 
                  onClick={() => navigator.clipboard.writeText(humanized?.text || '')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5 text-sm font-bold"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                  Copy Text
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="xl:col-span-4 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scroll pb-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-[100px]">verified</span>
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Humanization Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative size-24 shrink-0">
                <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                  <path className="text-primary drop-shadow-[0_0_4px_rgba(9,124,124,0.4)] transition-all duration-1000" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${humanized?.humanizationScore || 0}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black text-slate-900">{humanized?.humanizationScore || '--'}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">/100</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-slate-900">
                  {humanized ? (humanized.humanizationScore > 90 ? 'Excellent' : 'Great') : 'Analyzing'}
                </p>
                <p className="text-sm text-slate-500 leading-snug">Your text is now undetectable by major AI classifiers.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
              Improvements Made
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{humanized?.improvements.length || 0} Changes</span>
            </h3>
            <div className="flex flex-col gap-4">
              {humanized?.improvements.map((imp, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
                  <div className={`mt-0.5 rounded-full p-1 shrink-0 ${idx % 3 === 0 ? 'bg-teal-100 text-primary' : idx % 3 === 1 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <span className="material-symbols-outlined text-sm block">{imp.icon || 'star'}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{imp.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{imp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HumanizeResults;
