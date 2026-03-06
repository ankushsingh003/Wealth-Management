import React, { useState, useRef } from 'react';
import { Activity, Zap, BookOpen, BarChart2, ShieldCheck, FileText, Loader2, CheckCircle2, Clock } from 'lucide-react';

const C = {
    primary: '#6366f1', primaryDark: '#4338ca', emerald: '#10b981',
    amber: '#f59e0b', rose: '#e11d48', border: 'rgba(255,255,255,0.07)',
    textMuted: '#64748b', surface: 'rgba(15,23,42,0.7)',
};

const AGENTS = [
    { id: 'researcher', label: 'Researcher Agent', icon: BookOpen, desc: 'Fetches 10-K/10-Q from SEC EDGAR', color: '#6366f1' },
    { id: 'analyst', label: 'Analyst Agent', icon: BarChart2, desc: 'News sentiment & market analysis', color: '#f59e0b' },
    { id: 'compliance', label: 'Compliance Auditor', icon: ShieldCheck, desc: 'CFA Standard V(A) validation', color: '#10b981' },
    { id: 'synthesis', label: 'Synthesis Agent', icon: FileText, desc: 'Generates final research report', color: '#818cf8' },
];

const STATUS = { idle: 'idle', running: 'running', done: 'done', error: 'error' };

export default function LiveOrchestration({ addToAuditLog }) {
    const [ticker, setTicker] = useState('');
    const [agentStatus, setAgentStatus] = useState({});
    const [logs, setLogs] = useState([]);
    const [report, setReport] = useState(null);
    const [running, setRunning] = useState(false);
    const consoleRef = useRef(null);

    const log = (msg) => {
        setLogs(p => [...p, { msg, ts: new Date().toLocaleTimeString() }]);
        setTimeout(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight; }, 50);
    };

    const setAgent = (id, status) => setAgentStatus(p => ({ ...p, [id]: status }));

    const run = async () => {
        if (!ticker || running) return;
        setRunning(true);
        setReport(null);
        setLogs([]);
        setAgentStatus({});

        const steps = [
            { id: 'researcher', msg: `Researcher: Connecting to SEC EDGAR for ${ticker}…` },
            { id: 'analyst', msg: `Analyst: Pulling news sentiment for ${ticker}…` },
            { id: 'compliance', msg: `Compliance: Auditing research against CFA V(A)…` },
            { id: 'synthesis', msg: `Synthesis: Generating consolidated research report…` },
        ];

        for (let i = 0; i < steps.length; i++) {
            if (i > 0) setAgent(steps[i - 1].id, STATUS.done);
            setAgent(steps[i].id, STATUS.running);
            log(steps[i].msg);
            await new Promise(r => setTimeout(r, 800));
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/research`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker }),
            });
            const data = await res.json();
            AGENTS.forEach(a => setAgent(a.id, STATUS.done));
            setReport(data.final_report);
            log('✓ Pipeline complete. Report generated.');
            addToAuditLog?.({ ticker, status: 'PASSED', compliance: data.compliance_check, ts: new Date().toISOString() });
        } catch {
            setAgent(steps[steps.length - 1].id, STATUS.error);
            log('✗ Pipeline error. Check backend connection.');
        } finally {
            setRunning(false);
        }
    };

    const getAgentStyle = (id) => {
        const s = agentStatus[id];
        if (s === STATUS.running) return { border: `1px solid ${C.primary}`, boxShadow: `0 0 20px rgba(99,102,241,0.25)` };
        if (s === STATUS.done) return { border: `1px solid ${C.emerald}`, boxShadow: `0 0 12px rgba(16,185,129,0.15)` };
        if (s === STATUS.error) return { border: `1px solid ${C.rose}` };
        return { border: '1px solid rgba(255,255,255,0.07)' };
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <Activity size={18} color={C.primary} />
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Live Orchestration</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted }}>Watch the LangGraph multi-agent pipeline execute in real-time.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Zap size={14} color={C.primary} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            value={ticker}
                            onChange={e => setTicker(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && run()}
                            placeholder="Enter ticker…"
                            style={{ padding: '10px 14px 10px 34px', borderRadius: 12, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(99,102,241,0.25)', color: '#fff', fontWeight: 700, fontSize: 13, width: 160, fontFamily: 'inherit', letterSpacing: '0.06em' }}
                        />
                    </div>
                    <button
                        onClick={run}
                        disabled={running || !ticker}
                        style={{ padding: '10px 20px', borderRadius: 12, background: running || !ticker ? 'rgba(99,102,241,0.3)' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: running || !ticker ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: running || !ticker ? 'none' : '0 4px 24px rgba(99,102,241,0.3)', fontFamily: 'inherit' }}
                    >
                        {running ? <><Loader2 size={14} className="animate-spin" />Running…</> : <><Activity size={14} />Execute Pipeline</>}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
                {/* Agent Pipeline visual */}
                <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Agent Pipeline Flow</div>
                    {AGENTS.map((agent, i) => {
                        const s = agentStatus[agent.id];
                        const Icon = agent.icon;
                        return (
                            <div key={agent.id}>
                                <div style={{ padding: '18px 24px', borderRadius: 16, background: 'rgba(15,23,42,0.6)', transition: 'all 0.4s', display: 'flex', alignItems: 'center', gap: 18, ...getAgentStyle(agent.id) }}>
                                    <div style={{ width: 46, height: 46, borderRadius: 14, background: `${agent.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${agent.color}30` }}>
                                        {s === STATUS.running
                                            ? <Loader2 size={20} color={agent.color} className="animate-spin" />
                                            : s === STATUS.done
                                                ? <CheckCircle2 size={20} color={C.emerald} />
                                                : <Icon size={20} color={s ? C.rose : agent.color} />
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{agent.label}</div>
                                        <div style={{ fontSize: 11, color: C.textMuted }}>{agent.desc}</div>
                                    </div>
                                    <div style={{
                                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                                        color: s === STATUS.running ? C.primary : s === STATUS.done ? C.emerald : s === STATUS.error ? C.rose : C.textMuted,
                                        padding: '4px 10px', borderRadius: 8, background: s === STATUS.running ? 'rgba(99,102,241,0.1)' : s === STATUS.done ? 'rgba(16,185,129,0.1)' : 'transparent'
                                    }}>
                                        {s === STATUS.running ? '● Active' : s === STATUS.done ? '✓ Done' : s === STATUS.error ? '✗ Error' : '○ Idle'}
                                    </div>
                                </div>
                                {i < AGENTS.length - 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                                        <div style={{ width: 2, height: 20, background: agentStatus[agent.id] === STATUS.done ? `${C.emerald}60` : 'rgba(255,255,255,0.07)', borderRadius: 1, transition: 'all 0.5s' }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Report preview */}
                    {report && (
                        <div style={{ marginTop: 16, padding: 24, borderRadius: 16, background: 'rgba(16,185,129,0.06)', border: `1px solid ${C.emerald}30` }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.emerald, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>✓ Report Generated</div>
                            <div className="report" style={{ maxHeight: 200, overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: report }} />
                        </div>
                    )}
                </div>

                {/* Console */}
                <div style={{ width: 320, borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(2,6,23,0.8)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                        Execution Log
                    </div>
                    <div ref={consoleRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {logs.length === 0
                            ? <div style={{ opacity: 0.25, fontSize: 12, color: C.textMuted, textAlign: 'center', marginTop: 40 }}>No executions yet.</div>
                            : logs.map((l, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11 }} className="animate-fade-in">
                                    <span style={{ color: 'rgba(100,116,139,0.5)', flexShrink: 0, fontSize: 9 }}>{l.ts}</span>
                                    <span style={{ color: i === logs.length - 1 ? '#fff' : '#64748b' }}>{l.msg}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
