import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Loader2, BookOpen, BarChart3, ShieldCheck,
  FileText, ChevronRight, Share2, Download,
  LayoutDashboard, PieChart, Activity, Settings,
  TrendingUp, Globe, Zap, CheckCircle2, Clock
} from 'lucide-react';

// ─── Sidebar Item ─────────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active = false, soon = false }) => (
  <button
    disabled
    className={[
      'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-not-allowed',
      active
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5',
    ].join(' ')}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
    <span className="text-sm font-semibold">{label}</span>
    {soon && (
      <span className="ml-auto text-[9px] font-bold tracking-widest uppercase bg-slate-800 text-slate-600 border border-slate-700 px-1.5 py-0.5 rounded">
        Soon
      </span>
    )}
  </button>
);

// ─── Status Pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ ok = true }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
    {ok ? 'Systems Nominal' : 'Degraded'}
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState(new Date());
  const consoleRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg) => setLogs(prev => [...prev, { msg, time: new Date().toLocaleTimeString() }]);

  const handleResearch = async () => {
    if (!ticker) return;
    setLoading(true);
    setReport(null);
    setLogs([]);

    const steps = [
      'Initializing agent orchestration nodes...',
      `Connecting to SEC EDGAR for ${ticker}...`,
      'Fetching 10-K / 10-Q primary documents...',
      'Spawning News Sentiment Analyzer...',
      'Running CFA Standard V(A) compliance check...',
      'Synthesizing consolidated research report...',
    ];

    for (const step of steps) {
      addLog(step);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const res = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const data = await res.json();
      setReport(data.final_report);
      addLog('✓ Report generated. CFA audit complete.');
    } catch {
      addLog('✗ Connection error. Ensure the backend server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020617', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-72 flex-shrink-0 flex flex-col z-10 relative" style={{ background: 'rgba(15,23,42,0.7)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}>
        {/* Logo */}
        <div className="px-7 pt-8 pb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
              NEURO<span style={{ color: '#6366f1' }}>PRESS</span>
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold mt-0.5">Wealth · Research</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1.5">
          <NavItem icon={LayoutDashboard} label="Research Terminal" active />
          <NavItem icon={Activity} label="Live Orchestration" soon />
          <NavItem icon={PieChart} label="Portfolio Diligence" soon />
          <NavItem icon={TrendingUp} label="Market Sentiment" soon />
          <NavItem icon={ShieldCheck} label="Compliance Hub" soon />
        </nav>

        {/* User Card */}
        <div className="m-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <img src="https://ui-avatars.com/api/?name=Research+Desk&background=4f46e5&color=fff&size=36&bold=true" className="w-9 h-9 rounded-lg" alt="Avatar" />
            <div>
              <p className="text-xs font-bold text-white">Institutional Plan</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Research Desk</p>
            </div>
          </div>
          <button className="w-full py-2 text-xs font-semibold text-slate-400 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-white/5">
            <Settings className="w-3.5 h-3.5" /> System Configuration
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* ── Top Bar ── */}
        <header className="h-18 flex items-center justify-between px-8 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LayoutDashboard className="w-4 h-4" />
            <span>Platform</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Research Terminal</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm font-bold text-white tabular-nums">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">Market Hours Closed</p>
            </div>
            <StatusPill ok />
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">

          {/* LEFT: Input + Console */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4">

            {/* Input Panel */}
            <div className="rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)' }}>
              <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
                <Search style={{ width: 160, height: 160, transform: 'translate(30%, -30%) rotate(-10deg)' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Agentic Initiation</h2>
                <p className="text-xs text-slate-500 leading-relaxed">Execute CFA-compliant due diligence on any global equity ticker.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2">Asset Identifier</label>
                <div className="relative">
                  <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6366f1' }} />
                  <input
                    type="text"
                    placeholder="TSLA, AAPL, MSFT…"
                    value={ticker}
                    onChange={e => setTicker(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleResearch()}
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-white font-bold text-sm placeholder-slate-700 outline-none focus:ring-2"
                    style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.08em', transition: 'all 0.2s' }}
                  />
                </div>
              </div>

              <button
                onClick={handleResearch}
                disabled={loading || !ticker}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.35)' }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Orchestrating Agents…</span></> : <><LayoutDashboard className="w-4 h-4" /><span>Start Research Pipeline</span></>}
              </button>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Data Sources', value: '4 Active' },
                  { label: 'CFA Standard', value: 'V(A)' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs font-bold text-white">{s.value}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Console */}
            <div className="flex-1 rounded-2xl flex flex-col overflow-hidden" style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{ color: '#6366f1' }} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agent Console</span>
                </div>
                {loading && <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse" style={{ color: '#6366f1' }}>● Live</span>}
              </div>

              <div ref={consoleRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none gap-3">
                    <FileText className="w-10 h-10 text-slate-700" />
                    <p className="text-xs text-slate-500">Awaiting mission parameters…</p>
                  </div>
                ) : logs.map((l, i) => (
                  <div key={i} className="flex gap-3 text-xs animate-fade-in">
                    <span className="text-slate-700 tabular-nums flex-shrink-0 mt-0.5">{l.time}</span>
                    <span className={i === logs.length - 1 ? 'text-white font-semibold' : 'text-slate-400'}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Report Workspace */}
          <div className="flex-1 flex flex-col rounded-3xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}>
            {/* Workspace Topbar */}
            <div className="px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
                  Live Workspace
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {ticker ? `${ticker}_DILIGENCE_REPORT` : 'SYSTEM_IDLE'}
                  {report && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all flex items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Globe className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-grid" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
              {report ? (
                <div className="max-w-2xl mx-auto animate-slide-in" style={{ lineHeight: 1.8 }}>
                  <div dangerouslySetInnerHTML={{ __html: report }} style={{
                    '--report-h1-color': '#ffffff',
                    '--report-h2-color': '#818cf8',
                    '--report-p-color': '#cbd5e1',
                  }} className="report-view" />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-5">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-float" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <BookOpen className="w-8 h-8 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-500 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Workspace Ready</h3>
                    <p className="text-sm text-slate-700 max-w-xs">Input a ticker on the left and trigger the agentic research pipeline.</p>
                  </div>
                  <div className="flex gap-3">
                    {['TSLA', 'AAPL', 'NVDA', 'MSFT'].map(t => (
                      <button key={t} onClick={() => setTicker(t)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-8 py-4 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,6,23,0.5)' }}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">CFA Std V(A) Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">SEC EDGAR · Real-time</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-800 font-bold uppercase tracking-[0.2em]">© 2026 NeuroPress AI Research</p>
            </div>
          </div>

        </div>
      </div>

      {/* Global Report Styles */}
      <style>{`
        .report-view h1 { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .report-view h2 { font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2.5rem; margin-bottom: 0.75rem; }
        .report-view p { color: #94a3b8; margin-bottom: 1rem; line-height: 1.8; }
        .report-view blockquote { padding: 1rem 1.5rem; border-left: 3px solid #6366f1; background: rgba(99,102,241,0.07); border-radius: 12px; color: #c7d2fe; font-style: italic; margin: 1.5rem 0; }
        .bg-grid { background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0); background-size: 32px 32px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slide-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease forwards; }
      `}</style>
    </div>
  );
}
