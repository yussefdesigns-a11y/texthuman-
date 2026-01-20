
import React, { useState, useRef } from 'react';
import Gauge from './Gauge';
import { AnalysisResult } from '../types';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

interface AnalysisDashboardProps {
  inputText: string;
  setInputText: (text: string) => void;
  onAnalyze: () => void;
  result: AnalysisResult | null;
  loading: boolean;
  onHumanize: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  inputText,
  setInputText,
  onAnalyze,
  result,
  loading,
  onHumanize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessingFile(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setInputText(fullText.trim());
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        setInputText(res.value.trim());
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setInputText(text.trim());
      } else {
        alert('Unsupported file format. Please upload PDF, DOCX, or TXT.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to read file content.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full overflow-hidden pb-4">
      <div className="lg:col-span-8 flex flex-col h-full gap-4">
        <div className="flex justify-between items-end px-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Message Analyzer</h1>
            <p className="text-slate-500 text-sm mt-1">Paste text or upload a document to detect AI patterns.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Upload PDF/DOCX
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
          </div>
        </div>

        <div 
          className={`bg-white rounded-2xl shadow-soft flex flex-col flex-1 overflow-hidden border transition-all relative group ${isDragging ? 'border-primary ring-4 ring-primary/10 bg-primary/5' : 'border-slate-100 hover:shadow-lg'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessingFile && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-slate-700">Extracting content...</p>
            </div>
          )}

          {isDragging && (
            <div className="absolute inset-0 border-4 border-dashed border-primary m-4 rounded-xl flex flex-col items-center justify-center bg-primary/5 pointer-events-none z-10">
              <span className="material-symbols-outlined text-primary text-6xl mb-2">cloud_upload</span>
              <p className="text-primary font-black text-xl">Drop file to analyze</p>
              <p className="text-primary/60 text-sm">PDF, DOCX, or TXT</p>
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-white">
            <div className="flex gap-1">
              <button onClick={() => setInputText('')} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors" title="Clear Text">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
              <button onClick={() => navigator.clipboard.writeText(inputText)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light/50 rounded-lg transition-colors" title="Copy Text">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {inputText ? 'Document Loaded' : 'Waiting for input'}
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              className="w-full h-full resize-none border-none p-6 text-base md:text-lg leading-relaxed text-slate-800 placeholder:text-slate-300 focus:ring-0 bg-transparent"
              placeholder="Start typing, paste your content, or drag and drop a PDF/DOCX here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-4 text-xs font-medium text-slate-400">
              <span>{inputText.trim().split(/\s+/).filter(Boolean).length} Words</span>
              <span>{inputText.length} Characters</span>
            </div>
            <button
              onClick={onAnalyze}
              disabled={loading || isProcessingFile || !inputText.trim()}
              className="flex items-center justify-center bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-glow hover:shadow-lg transition-all transform active:scale-95 gap-2"
            >
              {loading ? (
                 <span className="animate-spin material-symbols-outlined">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">search_check</span>
              )}
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col h-full gap-4 min-h-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 pt-1">Analysis Report</h2>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scroll">
          {result ? (
            <>
              <div className="flex flex-col items-center justify-center py-4">
                <Gauge percentage={result.humanPercentage} label="Human" />
              </div>

              <div className={`border rounded-xl p-4 flex gap-3 items-start ${result.aiPercentage > 50 ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
                <div className={`p-1.5 rounded-md shrink-0 ${result.aiPercentage > 50 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  <span className="material-symbols-outlined text-[20px]">{result.aiPercentage > 50 ? 'warning' : 'check_circle'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm font-bold ${result.aiPercentage > 50 ? 'text-amber-900' : 'text-green-900'}`}>{result.verdict}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${result.aiPercentage > 50 ? 'text-amber-700/80' : 'text-green-700/80'}`}>{result.verdictDescription}</p>
                </div>
              </div>

              <button
                onClick={onHumanize}
                className="w-full bg-primary hover:bg-primary-dark text-white p-4 rounded-xl shadow-glow hover:shadow-lg transition-all group relative overflow-hidden shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="material-symbols-outlined">auto_fix_high</span>
                  <span className="font-bold text-lg">Humanize Now</span>
                </div>
              </button>

              <div className="w-full h-px bg-slate-100 my-2"></div>

              {/* Enhanced Metrics Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Linguistic Complexity</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vocabulary</p>
                      <p className="text-lg font-black text-slate-800">{result.complexity.vocabularyRichness}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Structures</p>
                      <p className="text-lg font-black text-slate-800">{result.complexity.structuralVariety}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Grade Level</p>
                      <p className="text-sm font-bold text-primary">{result.complexity.gradeLevel}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Markers</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Perplexity', metric: result.perplexity, color: 'bg-slate-400' },
                      { label: 'Burstiness', metric: result.burstiness, color: result.burstiness.status === 'Very Low' ? 'bg-red-400' : 'bg-primary' },
                      { label: 'Readability', metric: result.readability, color: 'bg-primary' }
                    ].map((item) => (
                      <div key={item.label} className="group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-600">{item.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.metric.status === 'Good' || item.metric.status === 'High' ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-600'}`}>
                            {item.metric.status}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.metric.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Word Frequency</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.wordFrequency.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                        <span className="text-slate-400">#</span>
                        {item.word}
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded-full text-[10px] text-slate-500">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <span className="material-symbols-outlined text-slate-300 text-6xl">analytics</span>
              </div>
              <p className="text-slate-400 font-medium">Run analysis to see detailed report and humanization options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
