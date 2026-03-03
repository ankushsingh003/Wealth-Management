import React, { useState } from 'react';
import { Search, Loader2, BookOpen, BarChart3, ShieldCheck, FileText, ChevronRight, Share2, Download } from 'lucide-react';

const App = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState([]);

  const handleResearch = async () => {
    if (!ticker) return;
    setLoading(true);
    setReport(null);
    setStatus(["Initializing agents..."]);
    
    try {
      const response = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const data = await response.json();
      setReport(data.final_report);
      setStatus(data.messages || ["Research completed"]);
    } catch (error) {
      console.error(error);
      setStatus(["Error connecting to backend"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NeuroPress Wealth
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Market Analysis</a>
            <a href="#" className="hover:text-white transition-colors">SEC Insights</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20">
              Enterprise Access
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Status */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Agentic <span className="text-indigo-400">Due Diligence</span>
              </h1>
              <p className="text-slate-400 leading-relaxed">
                Automated CFA-compliant research synthesizing massive datasets from SEC filings and global news sentiment.
              </p>
            </div>

            <div className="p-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl shadow-xl">
              <div className="bg-[#1e293b] rounded-[14px] p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Company Ticker</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. TSLA, AAPL, MSFT"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      className="w-full bg-[#0f172a] border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white placeholder:text-slate-600"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  </div>
                </div>
                
                <button 
                  onClick={handleResearch}
                  disabled={loading || !ticker}
                  className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Loader2 className="w-5 h-5" />}
                  {loading ? 'Orchestrating Agents...' : 'Initiate Research'}
                </button>
              </div>
            </div>

            {/* Agent Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Agent Status
              </h3>
              <div className="space-y-3">
                {status.map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <span className="text-slate-300">{msg}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3 text-sm italic text-slate-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Processing next node...</span>
                  </div>
                )}
                {!loading && status.length === 0 && (
                  <div className="text-sm text-slate-600">Enter a ticker to start the agentic workflow.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <div className="h-full min-h-[600px] bg-slate-800/20 backdrop-blur-sm border border-slate-800/50 rounded-3xl overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/10">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-white">Consolidated Research Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                {report ? (
                  <div className="prose prose-invert max-w-none prose-h1:text-3xl prose-h2:text-xl prose-h2:text-indigo-400 prose-p:text-slate-300 prose-p:leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-slate-400">No Active Analysis</h4>
                      <p className="text-sm text-slate-600 max-w-xs mx-auto">
                        Trigger the research agents to generate a CFA-compliant due diligence summary.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-8 py-4 border-t border-slate-800/50 bg-slate-900/40 flex items-center justify-between text-[10px] font-medium tracking-widest uppercase text-slate-500">
                <span>System Health: Nominal</span>
                <span>CFA Standard V(A) Framework</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
