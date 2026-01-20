
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AppView, AnalysisResult, HumanizedResult, SavedRecord, Protocol } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';
import HumanizeResults from './components/HumanizeResults';
import HistoryView from './components/HistoryView';
import { analyzeMessage, humanizeMessage } from './services/geminiService';

const INITIAL_PROTOCOLS: Protocol[] = [
  {
    id: 'first_contact',
    title: 'First Contact',
    description: 'Execute your very first linguistic analysis to initialize core subroutines.',
    completed: false,
    actionHint: 'Analyze any text',
    icon: 'radar'
  },
  {
    id: 'deep_scrutiny',
    title: 'Deep Scrutiny',
    description: 'Process a complex document (PDF or DOCX) to test extraction limits.',
    completed: false,
    actionHint: 'Upload a file',
    icon: 'description'
  },
  {
    id: 'ghost_in_machine',
    title: 'Ghost in the Machine',
    description: 'Take a result with high AI likelihood and transform it through the humanizer.',
    completed: false,
    actionHint: 'Humanize a detection',
    icon: 'auto_fix_high'
  },
  {
    id: 'memory_vault',
    title: 'Memory Vault',
    description: 'Revisit a past analysis from your History logs to ensure data integrity.',
    completed: false,
    actionHint: 'Open a history record',
    icon: 'history'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ANALYZE);
  const [history, setHistory] = useState<SavedRecord[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS);
  
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [humanizedResult, setHumanizedResult] = useState<HumanizedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [humanizing, setHumanizing] = useState<boolean>(false);

  // Persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem('textguard_history');
    const savedProtocols = localStorage.getItem('textguard_protocols');
    
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    if (savedProtocols) {
      try { setProtocols(JSON.parse(savedProtocols)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('textguard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('textguard_protocols', JSON.stringify(protocols));
  }, [protocols]);

  const completeProtocol = (id: string) => {
    setProtocols(prev => prev.map(p => p.id === id ? { ...p, completed: true } : p));
  };

  const nextProtocol = useMemo(() => {
    return protocols.find(p => !p.completed) || null;
  }, [protocols]);

  const allCompleted = useMemo(() => protocols.every(p => p.completed), [protocols]);

  const saveToHistory = (analysis: AnalysisResult, humanized?: HumanizedResult, tone?: string) => {
    const newRecord: SavedRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      originalText: inputText,
      analysis,
      humanized,
      tone
    };
    setHistory(prev => [newRecord, ...prev]);
  };

  const handleAnalyze = useCallback(async (isUpload: boolean = false) => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeMessage(inputText);
      setAnalysisResult(result);
      saveToHistory(result);
      
      // Mission tracking
      completeProtocol('first_contact');
      if (isUpload) completeProtocol('deep_scrutiny');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const handleHumanize = useCallback(async (tone: string = 'Professional') => {
    if (!inputText.trim()) return;

    setHumanizing(true);
    setView(AppView.RESULTS);
    try {
      const result = await humanizeMessage(inputText, tone);
      setHumanizedResult(result);
      if (analysisResult) {
        saveToHistory(analysisResult, result, tone);
        if (analysisResult.aiPercentage > 40) {
          completeProtocol('ghost_in_machine');
        }
      }
    } catch (error) {
      console.error('Humanization failed:', error);
      alert('Failed to humanize text.');
    } finally {
      setHumanizing(false);
    }
  }, [inputText, analysisResult]);

  const handleSelectHistoryRecord = (record: SavedRecord) => {
    setInputText(record.originalText);
    setAnalysisResult(record.analysis);
    setHumanizedResult(record.humanized || null);
    completeProtocol('memory_vault');
    if (record.humanized) {
      setView(AppView.RESULTS);
    } else {
      setView(AppView.ANALYZE);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-900 cursor-pointer" onClick={() => setView(AppView.ANALYZE)}>
            <div className="size-8 text-[#097c7c]">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">TextGuard</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-8">
              <button 
                onClick={() => setView(AppView.HISTORY)}
                className={`text-sm font-medium transition-colors ${view === AppView.HISTORY ? 'text-[#097c7c]' : 'text-slate-500 hover:text-[#097c7c]'}`}
              >
                History
              </button>
              <a className="text-slate-500 hover:text-[#097c7c] text-sm font-medium transition-colors" href="#">Pricing</a>
              <a className="text-slate-500 hover:text-[#097c7c] text-sm font-medium transition-colors" href="#">API</a>
            </nav>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Node</span>
              <div className="size-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-65px)] overflow-hidden">
        {view === AppView.ANALYZE && (
          <AnalysisDashboard
            inputText={inputText}
            setInputText={setInputText}
            onAnalyze={handleAnalyze}
            result={analysisResult}
            loading={loading}
            onHumanize={() => handleHumanize()}
            currentProtocol={nextProtocol}
            allCompleted={allCompleted}
          />
        )}
        
        {view === AppView.RESULTS && (
          <HumanizeResults
            originalText={inputText}
            analysis={analysisResult!}
            humanized={humanizedResult}
            loading={humanizing}
            onHumanize={handleHumanize}
            onBack={() => setView(AppView.ANALYZE)}
          />
        )}

        {view === AppView.HISTORY && (
          <HistoryView 
            records={history}
            onSelect={handleSelectHistoryRecord}
            onDelete={handleDeleteRecord}
            onBack={() => setView(AppView.ANALYZE)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
