
import React, { useState, useCallback, useEffect } from 'react';
import { AppView, AnalysisResult, HumanizedResult, SavedRecord } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';
import HumanizeResults from './components/HumanizeResults';
import HistoryView from './components/HistoryView';
import { analyzeMessage, humanizeMessage } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ANALYZE);
  const [history, setHistory] = useState<SavedRecord[]>([]);
  
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [humanizedResult, setHumanizedResult] = useState<HumanizedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [humanizing, setHumanizing] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('textguard_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('textguard_history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = (analysis: AnalysisResult, humanized?: HumanizedResult, tone?: string) => {
    const newRecord: SavedRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      originalText: inputText,
      analysis,
      humanized,
      tone
    };
    
    setHistory(prev => {
      // Avoid duplicate saves for the same state if needed, 
      // but for simplicity we'll just push.
      return [newRecord, ...prev];
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeMessage(inputText);
      setAnalysisResult(result);
      saveToHistory(result);
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
    if (record.humanized) {
      setView(AppView.RESULTS);
    } else {
      setView(AppView.ANALYZE);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const newHistory = history.filter(r => r.id !== id);
    setHistory(newHistory);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Mode</span>
              <div className="size-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-65px)] overflow-hidden">
        {view === AppView.ANALYZE && (
          <AnalysisDashboard
            inputText={inputText}
            setInputText={setInputText}
            onAnalyze={handleAnalyze}
            result={analysisResult}
            loading={loading}
            onHumanize={() => handleHumanize()}
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
