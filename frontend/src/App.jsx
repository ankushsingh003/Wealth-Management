import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Loader2, BookOpen, BarChart3, ShieldCheck,
  FileText, Download, Share2, LayoutDashboard, PieChart,
  Activity, Settings, TrendingUp, Globe, Zap, CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg: '#020617',
  surface: '#0f172a',
  surfaceAlt: '#0d1526',
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.04)',
  primary: '#6366f1',
  primaryDark: '#4338ca',
  emerald: '#10b981',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textFaint: '#1e293b',
};

// ─── Reusable helpers ─────────────────────────────────────────────────────────
const glass = (extra = {}) => ({
  background: 'rgba(15,23,42,0.65)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${C.border}`,
  ...extra,
});

// ─── Sidebar NavItem ──────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active = false, soon = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 16px', borderRadius: 14, cursor: 'default',
      background: active ? `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` : 'transparent',
      color: active ? '#fff' : C.textMuted,
      boxShadow: active ? `0 8px 24px rgba(99,102,241,0.25)` : 'none',
      transition: 'all 0.2s',
    }}>
      <Icon size={16} />
      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{label}</span>
      {soon && (
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: C.textMuted }}>
          Soon
        </span>
      )}
    </div>
  );
}

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
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg) => setLogs(prev => [...prev, { msg, ts: new Date().toLocaleTimeString() }]);

  const handleResearch = async () => {
    if (!ticker) return;
    setLoading(true);
    setReport(null);
    setLogs([]);

    const steps = [
      'Initializing LangGraph orchestration nodes…',
      `Connecting to SEC EDGAR for ${ticker}…`,
      'Fetching 10-K / 10-Q primary documents…',
      'Spawning News Sentiment Analysis agent…',
      'Running CFA Standard V(A) compliance audit…',
      'Synthesizing consolidated research report…',
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
      addLog('✗ Backend connection error. Ensure port 8000 is active.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", position: 'relative' }}>

      {/* ── Injected keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 1.8s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .report h1 { font-family:'Outfit',sans-serif; font-size:2rem; font-weight:800; color:#fff; margin-bottom:1.5rem; letter-spacing:-0.02em; }
        .report h2 { font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:700; color:#818cf8; text-transform:uppercase; letter-spacing:0.12em; margin:2.5rem 0 0.75rem; }
        .report p { color:#94a3b8; line-height:1.85; margin-bottom:1rem; }
        .report blockquote { padding:1rem 1.5rem; border-left:3px solid #6366f1; background:rgba(99,102,241,0.07); border-radius:12px; color:#c7d2fe; font-style:italic; margin:1.5rem 0; }
        .bg-grid { background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0); background-size:32px 32px; }
        .chip-btn:hover { background:rgba(255,255,255,0.07) !important; color:#e2e8f0 !important; }
        .icon-btn:hover { background:rgba(255,255,255,0.06) !important; color:#e2e8f0 !important; }
        .nav-hover:hover { background:rgba(255,255,255,0.04) !important; color:#e2e8f0 !important; }
        input::placeholder { color: #1e3a5f; }
        input:focus { outline: none; border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>

      {/* ── Background orbs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.20) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '0%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      {/* ══════════════════════════════ SIDEBAR ══════════════════════════════ */}
      <aside style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', zIndex: 10, ...glass(), borderRight: `1px solid ${C.border}`, padding: '28px 16px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 36 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, boxShadow: `0 8px 32px rgba(99,102,241,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>NEURO<span style={{ color: C.primary }}>PRESS</span></div>
            <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 4, fontWeight: 700 }}>Wealth · Research</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavItem icon={LayoutDashboard} label="Research Terminal" active />
          <NavItem icon={Activity} label="Live Orchestration" soon />
          <NavItem icon={PieChart} label="Portfolio Diligence" soon />
          <NavItem icon={TrendingUp} label="Market Sentiment" soon />
          <NavItem icon={ShieldCheck} label="Compliance Hub" soon />
        </nav>

        {/* User card */}
        <div style={{ marginTop: 24, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img src="https://ui-avatars.com/api/?name=RD&background=4f46e5&color=fff&bold=true&size=36" style={{ width: 38, height: 38, borderRadius: 10 }} alt="avatar" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Institutional Plan</div>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>Research Desk</div>
            </div>
          </div>
          <button className="nav-hover" style={{ width: '100%', padding: '9px 0', borderRadius: 10, background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, fontWeight: 600, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
            <Settings size={13} /> System Config
          </button>
        </div>
      </aside>

      {/* ══════════════════════════ MAIN CONTENT ════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}>

        {/* ── Top bar ── */}
        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: `1px solid ${C.border}`, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(16px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.textMuted }}>
            <LayoutDashboard size={14} />
            <span>Platform</span>
            <ChevronRight size={12} style={{ opacity: 0.4 }} />
            <span style={{ color: '#fff', fontWeight: 600 }}>Research Terminal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{time.toLocaleTimeString()}</div>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 2 }}>Market Hours Closed</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
              <div className="animate-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: C.emerald }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: C.emerald, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Systems Nominal</span>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', gap: 20, padding: 20, overflow: 'hidden' }}>

          {/* ─── LEFT COLUMN ─── */}
          <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Input panel */}
            <div style={{ borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden', ...glass() }}>
              <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.03, pointerEvents: 'none', transform: 'translate(20%, -20%)' }}>
                <Search size={160} />
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Agentic Initiation</div>
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>Execute CFA-compliant due diligence on any global equity ticker.</div>

              {/* Input */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Asset Identifier</div>
                <div style={{ position: 'relative' }}>
                  <Zap size={15} color={C.primary} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="TSLA, AAPL, MSFT…"
                    value={ticker}
                    onChange={e => setTicker(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleResearch()}
                    style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: 14, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleResearch}
                disabled={loading || !ticker}
                style={{ width: '100%', padding: '16px 0', borderRadius: 14, background: loading || !ticker ? 'rgba(99,102,241,0.3)' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading || !ticker ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading || !ticker ? 'none' : '0 8px 32px rgba(99,102,241,0.35)', transition: 'all 0.3s', fontFamily: 'inherit' }}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /><span className="animate-pulse">Orchestrating Agents…</span></>
                  : <><LayoutDashboard size={16} /><span>Start Research Pipeline</span></>
                }
              </button>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                {[['4 Active', 'Data Sources'], ['V(A)', 'CFA Standard']].map(([val, lbl]) => (
                  <div key={lbl} style={{ borderRadius: 12, padding: 12, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.borderLight}` }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: "'Outfit',sans-serif" }}>{val}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent console */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 20, overflow: 'hidden', background: 'rgba(2,6,23,0.85)', border: `1px solid ${C.border}` }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={14} color={C.primary} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Agent Console</span>
                </div>
                {loading && <span className="animate-pulse" style={{ fontSize: 9, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.15em' }}>● Live</span>}
              </div>
              <div ref={consoleRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {logs.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.25 }}>
                    <FileText size={36} color={C.textMuted} />
                    <p style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>Awaiting mission parameters…</p>
                  </div>
                ) : logs.map((l, i) => (
                  <div key={i} className="animate-fade-in" style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                    <span style={{ color: 'rgba(100,116,139,0.5)', flexShrink: 0, fontVariantNumeric: 'tabular-nums', marginTop: 1, fontSize: 10 }}>{l.ts}</span>
                    <span style={{ color: i === logs.length - 1 ? '#fff' : '#94a3b8', fontWeight: i === logs.length - 1 ? 600 : 400 }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Report workspace ─── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 28, overflow: 'hidden', ...glass() }}>
            {/* Workspace header */}
            <div style={{ padding: '18px 28px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.22)' }}>
                  Live Workspace
                </span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ticker ? `${ticker}_DILIGENCE_REPORT` : 'SYSTEM_IDLE'}
                  {report && <CheckCircle2 size={15} color={C.emerald} />}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[Download, Share2].map((Icon, i) => (
                  <button key={i} className="icon-btn" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, transition: 'all 0.2s' }}>
                    <Icon size={15} />
                  </button>
                ))}
                <button className="icon-btn" style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted, fontSize: 12, fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  <Globe size={13} /> Export PDF
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-grid" style={{ flex: 1, overflowY: 'auto', padding: 36 }}>
              {report ? (
                <div className="report animate-slide-up" style={{ maxWidth: 720, margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: report }} />
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
                  <div className="animate-float" style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={32} color={C.textFaint} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Workspace Ready</div>
                    <div style={{ fontSize: 13, color: 'rgba(100,116,139,0.5)', maxWidth: 320 }}>Input a ticker to initiate the multi-agent research pipeline.</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['TSLA', 'AAPL', 'NVDA', 'MSFT'].map(t => (
                      <button key={t} className="chip-btn" onClick={() => setTicker(t)} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em', fontFamily: 'inherit' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 28px', borderTop: `1px solid ${C.border}`, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {[['CFA Std V(A) Active', C.primary], ['SEC EDGAR · Real-time', C.emerald]].map(([lbl, clr]) => (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: clr }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{lbl}</span>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 9, color: 'rgba(30,41,59,1)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>© 2026 NeuroPress AI Research</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
