import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader2, RefreshCw, TrendingDown, Minus } from 'lucide-react';

const C = {
    primary: '#6366f1', emerald: '#10b981', amber: '#f59e0b',
    rose: '#e11d48', textMuted: '#64748b', border: 'rgba(255,255,255,0.07)',
};

const MARKETS = [
    { ticker: 'SPY', label: 'S&P 500', emoji: '🇺🇸', category: 'Index' },
    { ticker: 'QQQ', label: 'NASDAQ 100', emoji: '💻', category: 'Index' },
    { ticker: 'DIA', label: 'Dow Jones', emoji: '🏛️', category: 'Index' },
    { ticker: 'GLD', label: 'Gold', emoji: '🏅', category: 'Commodity' },
    { ticker: 'USO', label: 'Crude Oil', emoji: '🛢️', category: 'Commodity' },
    { ticker: 'XLF', label: 'Financials', emoji: '🏦', category: 'Sector' },
    { ticker: 'XLK', label: 'Technology', emoji: '⚡', category: 'Sector' },
    { ticker: 'XLE', label: 'Energy', emoji: '⚡', category: 'Sector' },
];

function getSentiment(text) {
    if (!text) return { score: 0, label: 'Neutral', color: C.amber };
    const lower = text.toLowerCase();
    let score = 0;
    ['positive', 'growth', 'strong', 'bullish', 'revenue', 'gain', 'profit'].forEach(w => { if (lower.includes(w)) score++; });
    ['negative', 'risk', 'decline', 'bearish', 'loss', 'fall', 'weak'].forEach(w => { if (lower.includes(w)) score--; });
    if (score > 1) return { score, label: 'Bullish', color: C.emerald };
    if (score < -1) return { score, label: 'Bearish', color: C.rose };
    return { score, label: 'Neutral', color: C.amber };
}

function SentimentCard({ market, data, loading }) {
    const sentiment = data ? getSentiment(data.news_sentiment) : null;
    return (
        <div style={{ padding: 20, borderRadius: 18, background: 'rgba(15,23,42,0.7)', border: sentiment ? `1px solid ${sentiment.color}25` : '1px solid rgba(255,255,255,0.07)', transition: 'all 0.4s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{market.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{market.label}</div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{market.ticker} · {market.category}</div>
                </div>
                {loading ? (
                    <Loader2 size={18} color={C.primary} className="animate-spin" />
                ) : sentiment ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        {sentiment.label === 'Bullish' ? <TrendingUp size={20} color={sentiment.color} /> : sentiment.label === 'Bearish' ? <TrendingDown size={20} color={sentiment.color} /> : <Minus size={20} color={sentiment.color} />}
                        <span style={{ fontSize: 10, fontWeight: 700, color: sentiment.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sentiment.label}</span>
                    </div>
                ) : null}
            </div>

            {sentiment && (
                <>
                    {/* Score bar */}
                    <div style={{ marginBottom: 10 }}>
                        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.max(5, ((sentiment.score + 4) / 8) * 100)}%`, background: sentiment.color, borderRadius: 99, transition: 'width 0.8s' }} />
                        </div>
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.5 }}>
                        {data.news_sentiment?.substring(0, 80) || 'No news data.'}…
                    </div>
                </>
            )}

            {!loading && !data && (
                <div style={{ fontSize: 11, color: C.textMuted, opacity: 0.5 }}>Pending analysis…</div>
            )}
        </div>
    );
}

export default function MarketSentiment() {
    const [results, setResults] = useState({});
    const [loadingSet, setLoadingSet] = useState(new Set());
    const [lastRefresh, setLastRefresh] = useState(null);
    const [running, setRunning] = useState(false);

    const fetchAll = async () => {
        setRunning(true);
        setResults({});
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        for (const m of MARKETS) {
            setLoadingSet(p => new Set([...p, m.ticker]));
            try {
                const res = await fetch(`${API_URL}/research`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticker: m.ticker }),
                });
                const data = await res.json();
                setResults(p => ({ ...p, [m.ticker]: data }));
            } catch {
                setResults(p => ({ ...p, [m.ticker]: null }));
            } finally {
                setLoadingSet(p => { const next = new Set(p); next.delete(m.ticker); return next; });
            }
        }
        setLastRefresh(new Date().toLocaleTimeString());
        setRunning(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const counts = { Bullish: 0, Bearish: 0, Neutral: 0 };
    Object.values(results).forEach(d => { if (d) { const s = getSentiment(d.news_sentiment); counts[s.label]++; } });

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <TrendingUp size={18} color={C.primary} />
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Market Sentiment</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted }}>Real-time sentiment analysis for major indices, sectors, and commodities.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {lastRefresh && <span style={{ fontSize: 10, color: C.textMuted }}>Last refresh: {lastRefresh}</span>}
                    <button onClick={fetchAll} disabled={running} style={{ padding: '10px 16px', borderRadius: 12, background: running ? 'rgba(99,102,241,0.3)' : `linear-gradient(135deg, ${C.primary}, ${C.primary}cc)`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: running ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                        <RefreshCw size={13} className={running ? 'animate-spin' : ''} />
                        {running ? 'Refreshing…' : 'Refresh All'}
                    </button>
                </div>
            </div>

            {/* Summary strip */}
            <div style={{ display: 'flex', gap: 12, padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {[['Bullish', C.emerald, counts.Bullish], ['Neutral', C.amber, counts.Neutral], ['Bearish', C.rose, counts.Bearish]].map(([lbl, clr, cnt]) => (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 12, background: `${clr}0d`, border: `1px solid ${clr}25` }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: clr }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: clr }}>{cnt}</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{lbl}</span>
                    </div>
                ))}
            </div>

            {/* Cards grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {MARKETS.map(m => (
                        <SentimentCard key={m.ticker} market={m} data={results[m.ticker]} loading={loadingSet.has(m.ticker)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
