import React, { useState } from 'react';
import { PieChart, Plus, Trash2, PlayCircle, Loader2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const C = {
    primary: '#6366f1', primaryDark: '#4338ca', emerald: '#10b981',
    amber: '#f59e0b', rose: '#e11d48', border: 'rgba(255,255,255,0.07)',
    textMuted: '#64748b',
};

const DEFAULTS = ['AAPL', 'MSFT', 'TSLA'];

function getSentimentScore(text) {
    if (!text) return 0;
    const lower = text.toLowerCase();
    let score = 0;
    ['positive', 'growth', 'strong', 'bullish', 'revenue'].forEach(w => { if (lower.includes(w)) score += 1; });
    ['negative', 'risk', 'decline', 'bearish', 'loss'].forEach(w => { if (lower.includes(w)) score -= 1; });
    return Math.max(-3, Math.min(3, score));
}

function ScoreBar({ score }) {
    const pct = ((score + 3) / 6) * 100;
    const color = score > 0 ? C.emerald : score < 0 ? C.rose : C.amber;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.8s' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 24 }}>{score > 0 ? `+${score}` : score}</span>
        </div>
    );
}

export default function PortfolioDiligence({ addToAuditLog }) {
    const [tickers, setTickers] = useState(DEFAULTS);
    const [newTicker, setNewTicker] = useState('');
    const [results, setResults] = useState({});
    const [running, setRunning] = useState(false);
    const [currentTicker, setCurrentTicker] = useState(null);

    const add = () => {
        const t = newTicker.trim().toUpperCase();
        if (t && !tickers.includes(t)) setTickers(p => [...p, t]);
        setNewTicker('');
    };

    const remove = (t) => setTickers(p => p.filter(x => x !== t));

    const runAll = async () => {
        setRunning(true);
        setResults({});
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        for (const t of tickers) {
            setCurrentTicker(t);
            try {
                const res = await fetch(`${API_URL}/research`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticker: t }),
                });
                const data = await res.json();
                const score = getSentimentScore(data.news_sentiment);
                const cfaOk = data.compliance_check?.toLowerCase().includes('passed') || data.compliance_check?.toLowerCase().includes('verified');
                setResults(p => ({ ...p, [t]: { score, cfa: cfaOk ? 'PASSED' : 'FLAGGED', compliance: data.compliance_check, ts: new Date().toLocaleTimeString() } }));
                addToAuditLog?.({ ticker: t, status: cfaOk ? 'PASSED' : 'FLAGGED', compliance: data.compliance_check, ts: new Date().toISOString() });
            } catch {
                setResults(p => ({ ...p, [t]: { score: 0, cfa: 'ERROR', ts: new Date().toLocaleTimeString() } }));
            }
        }
        setCurrentTicker(null);
        setRunning(false);
    };

    const done = Object.keys(results).length;
    const total = tickers.length;

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <PieChart size={18} color={C.primary} />
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Portfolio Diligence</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted }}>Run batch CFA-compliant due diligence across your entire watchlist.</p>
                </div>
                {running && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: `1px solid ${C.primary}30` }}>
                        <Loader2 size={14} color={C.primary} className="animate-spin" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>Analyzing {currentTicker}… ({done}/{total})</span>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
                {/* Watchlist */}
                <div style={{ width: 280, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Watchlist ({total})</div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            value={newTicker}
                            onChange={e => setNewTicker(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && add()}
                            placeholder="Add ticker…"
                            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', fontFamily: 'inherit' }}
                        />
                        <button onClick={add} style={{ padding: '10px 12px', borderRadius: 10, background: C.primaryDark, border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <Plus size={15} />
                        </button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
                        {tickers.map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: currentTicker === t ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', border: currentTicker === t ? `1px solid ${C.primary}40` : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {results[t] ? (
                                        results[t].cfa === 'PASSED' ? <CheckCircle2 size={13} color={C.emerald} /> :
                                            results[t].cfa === 'FLAGGED' ? <AlertTriangle size={13} color={C.amber} /> :
                                                <AlertTriangle size={13} color={C.rose} />
                                    ) : currentTicker === t ? <Loader2 size={13} color={C.primary} className="animate-spin" /> : <Clock size={13} color={C.textMuted} />}
                                    <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '0.06em' }}>{t}</span>
                                </div>
                                <button onClick={() => remove(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 2 }}>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={runAll}
                        disabled={running || tickers.length === 0}
                        style={{ padding: '13px 0', borderRadius: 12, background: running || tickers.length === 0 ? 'rgba(99,102,241,0.3)' : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: running || tickers.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 24px rgba(99,102,241,0.3)', fontFamily: 'inherit' }}
                    >
                        {running ? <><Loader2 size={14} className="animate-spin" />Running batch…</> : <><PlayCircle size={14} />Run Batch Diligence</>}
                    </button>
                </div>

                {/* Results table */}
                <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Research Results</div>

                    {Object.keys(results).length === 0 ? (
                        <div style={{ textAlign: 'center', opacity: 0.3, marginTop: 80 }}>
                            <PieChart size={48} color={C.textMuted} style={{ margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 13, color: C.textMuted }}>Add tickers and run batch diligence to see results.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {/* Table header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px', gap: 16, padding: '8px 20px', fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                <span>Ticker</span><span>Sentiment Score</span><span>CFA V(A)</span><span>Time</span>
                            </div>
                            {tickers.map(t => results[t] && (
                                <div key={t} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px', gap: 16, padding: '16px 20px', borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }} className="animate-slide-up">
                                    <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '0.06em', fontFamily: "'Outfit',sans-serif" }}>{t}</span>
                                    <ScoreBar score={results[t].score} />
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: results[t].cfa === 'PASSED' ? 'rgba(16,185,129,0.1)' : results[t].cfa === 'FLAGGED' ? 'rgba(245,158,11,0.1)' : 'rgba(225,29,72,0.1)', color: results[t].cfa === 'PASSED' ? C.emerald : results[t].cfa === 'FLAGGED' ? C.amber : C.rose, fontSize: 10, fontWeight: 700 }}>
                                        {results[t].cfa === 'PASSED' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                                        {results[t].cfa}
                                    </div>
                                    <span style={{ fontSize: 10, color: C.textMuted }}>{results[t].ts}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
