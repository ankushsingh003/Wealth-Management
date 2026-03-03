import React, { useState, useEffect } from 'react';
import {
  Search, Loader2, BookOpen, BarChart3, ShieldCheck,
  FileText, ChevronRight, Share2, Download,
  LayoutDashboard, PieChart, Activity, Settings,
  ExternalLink, TrendingUp, AlertCircle, CheckCircle2,
  Globe, Zap
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, comingSoon = false }) => (
  <div className={`
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-not-allowed transition-all duration-300 group
    ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
  `}>
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-primary-light transition-colors'}`} />
    <span className="font-medium text-sm">{label}</span>
    {comingSoon && (
      <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">SOON</span>
    )}
  </div>
);

const App = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResearch = async () => {
    if (!ticker) return;
    setLoading(true);
    setReport(null);
    setStatus(["Initializing high-level audit agents...", "Connecting to SEC EDGAR API...", "Accessing global news sentiment buffers..."]);

    try {
      // Small Delay simulation for realistic agent orchestration feel
      await new Promise(r => setTimeout(r, 1500));

      const response = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const data = await response.json();

      // Step through status for premium vibe
      setStatus(prev => [...prev, "Analyzing 10-K Filings for MDA...", "Calculating sentiment polarity index..."]);
      await new Promise(r => setTimeout(r, 1000));

      setReport(data.final_report);
      setStatus(data.messages || ["Research completed successfully.", "CFA Compliance Check: PASSED"]);
    } catch (error) {
      console.error(error);
      setStatus(["System Error: Connection to backend timed out.", "Please ensure the research server is online."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-slate-200 font-sans antialiased overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-accent-emerald/10 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-surface/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white leading-none">NEURO<span className="text-primary-light">PRESS</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Wealth Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Research Terminal" active />
          <SidebarItem icon={Activity} label="Live Orchestration" comingSoon />
          <SidebarItem icon={PieChart} label="Portfolio Diligence" comingSoon />
          <SidebarItem icon={TrendingUp} label="Market Sentiment" comingSoon />
          <SidebarItem icon={ShieldCheck} label="Compliance Hub" comingSoon />
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="User" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Institutional Plan</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Research Desk 04</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2">
            <Settings className="w-3.5 h-3.5" /> System Config
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-surface/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>Research Desktop</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white">Active Analysis</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-bold text-white uppercase tracking-wider">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-[10px] text-slate-500">UTC-5 | New York</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 bg-accent-emerald/10 px-3 py-1.5 rounded-full border border-accent-emerald/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-[10px] font-bold text-accent-emerald uppercase tracking-widest">Network Nominal</span>
            </div>
          </div>
        </header>

        {/* Console & Content Area */}
        <div className="flex-1 flex p-8 gap-8 overflow-hidden">

          {/* Analysis Controller */}
          <div className="w-96 flex flex-col gap-6">
            <section className="bg-surface/40 rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Search className="w-32 h-32 -rotate-12 translate-x-12 -translate-y-12" />
              </div>

              <h2 className="text-2xl font-display font-bold text-white mb-2 relative">Agentic Initiation</h2>
              <p className="text-sm text-slate-400 mb-8 relative">Execute CFA-compliant due diligence on global equity tickers.</p>

              <div className="space-y-6 relative">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Asset Identifier</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. MSFT, GOOGL..."
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold tracking-widest placeholder:text-slate-700 transition-all font-display"
                    />
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  </div>
                </div>

                <button
                  onClick={handleResearch}
                  disabled={loading || !ticker}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark hover:brightness-110 disabled:grayscale disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 overflow-hidden group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="animate-pulse">Orchestrating...</span>
                    </>
                  ) : (
                    <>
                      <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Start Research Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Orchestration Log */}
            <section className="flex-1 bg-slate-900/40 rounded-3xl p-6 border border-white/5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Agent Console
                </h3>
                {loading && <div className="text-[10px] text-primary animate-pulse font-bold tracking-widest uppercase">Busy</div>}
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {status.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                    <Terminal className="w-12 h-12 mb-3 text-slate-600" />
                    <p className="text-xs font-medium">Awaiting mission parameters...</p>
                  </div>
                ) : (
                  status.map((msg, i) => (
                    <div key={i} className="flex gap-3 text-xs leading-relaxed group">
                      <div className="h-5 w-5 rounded-lg bg-white/5 border border-white/5 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-primary-light">
                        {i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-300 group-last:text-white group-last:font-bold transition-colors">{msg}</span>
                        <span className="text-[8px] text-slate-600 mt-0.5">{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
              </div>
            </section>
          </div>

          {/* Analysis Workspace */}
          <div className="flex-1 flex flex-col">
            <div className="h-full bg-surface/40 backdrop-blur-sm border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
              <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active File</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    {ticker ? `${ticker}_DILIGENCE_RPT.v1` : 'SYSTEM_IDLE'}
                    {report && <CheckCircle2 className="w-4 h-4 text-accent-emerald" />}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                  <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 border border-white/5">
                    <Globe className="w-3.5 h-3.5" /> Full Screen
                  </button>
                </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto bg-grid-pattern selection:bg-primary/30">
                {report ? (
                  <div className="max-w-3xl mx-auto report-content slide-up">
                    <div
                      className="prose prose-invert prose-slate max-w-none 
                        prose-h1:font-display prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-8
                        prose-h2:text-primary-light prose-h2:font-display prose-h2:text-xl prose-h2:tracking-wider prose-h2:uppercase prose-h2:mb-4 prose-h2:mt-12
                        prose-p:text-slate-300 prose-p:leading-extra-relaxed prose-p:mb-6
                        prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:italic
                      "
                      dangerouslySetInnerHTML={{ __html: report }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-3xl flex items-center justify-center border border-white/5 mb-6 animate-float">
                      <FileText className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-500 mb-2">Workspace Ready</h3>
                    <p className="text-sm text-slate-600 max-w-sm">Please input a target ticker to initiate the synthesis of massive datasets from SEC filings and global sentiment buffers.</p>
                  </div>
                )}
              </div>

              <footer className="px-10 py-5 border-t border-white/5 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">CFA Standard V(A) - Compliance Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">SEC Feed: Real-time</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em]">© 2026 NeuroPress AI Research</div>
              </footer>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 40px 40px;
        }
        .slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

const Terminal = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default App;
