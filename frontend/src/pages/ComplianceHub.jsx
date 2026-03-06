import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock, FileText } from 'lucide-react';

const C = {
    primary: '#6366f1', emerald: '#10b981', amber: '#f59e0b',
    rose: '#e11d48', textMuted: '#64748b', border: 'rgba(255,255,255,0.07)',
};

const CFA_RULES = [
    { code: 'V(A)', title: 'Diligence and Reasonable Basis', desc: 'Exercise diligence, independence, and thoroughness in analyzing investments.' },
    { code: 'I(B)', title: 'Independence and Objectivity', desc: 'Maintain independence and objectivity in professional activities.' },
    { code: 'I(C)', title: 'Misrepresentation', desc: 'Do not make material misrepresentations about investment recommendations.' },
    { code: 'V(B)', title: 'Communication with Clients', desc: 'Disclose basic format and principles of investment analysis.' },
    { code: 'VI(A)', title: 'Disclosure of Conflicts', desc: 'Disclose to clients all matters that could impair objectivity.' },
];

export default function ComplianceHub({ auditLog }) {
    const passed = auditLog.filter(l => l.status === 'PASSED').length;
    const flagged = auditLog.filter(l => l.status === 'FLAGGED').length;

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <ShieldCheck size={18} color={C.primary} />
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Compliance Hub</span>
                </div>
                <p style={{ fontSize: 12, color: C.textMuted }}>CFA Ethics Standards audit log and research compliance tracking.</p>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: CFA Rules Reference */}
                <div style={{ width: 320, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 24, overflowY: 'auto' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>CFA Standards Reference</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {CFA_RULES.map(rule => (
                            <div key={rule.code} style={{ padding: 16, borderRadius: 14, background: rule.code === 'V(A)' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: rule.code === 'V(A)' ? `1px solid ${C.primary}30` : '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: rule.code === 'V(A)' ? `${C.primary}20` : 'rgba(255,255,255,0.05)', color: rule.code === 'V(A)' ? '#818cf8' : C.textMuted, letterSpacing: '0.1em' }}>
                                        STD {rule.code}
                                    </span>
                                    {rule.code === 'V(A)' && <span style={{ fontSize: 9, color: C.primary, fontWeight: 700 }}>★ Active</span>}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{rule.title}</div>
                                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>{rule.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Audit Log */}
                <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Summary */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                        {[
                            ['Total Audits', auditLog.length, '#818cf8'],
                            ['Passed', passed, C.emerald],
                            ['Flagged', flagged, C.amber],
                        ].map(([lbl, val, clr]) => (
                            <div key={lbl} style={{ flex: 1, padding: '16px 20px', borderRadius: 14, background: 'rgba(15,23,42,0.7)', border: `1px solid ${clr}20` }}>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, color: clr, lineHeight: 1 }}>{val}</div>
                                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, fontWeight: 600 }}>{lbl}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>
                        Session Audit Log
                    </div>

                    {auditLog.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.3, gap: 12 }}>
                            <FileText size={48} color={C.textMuted} />
                            <p style={{ fontSize: 13, color: C.textMuted }}>No compliance audits yet. Run research from any page to populate this log.</p>
                        </div>
                    ) : (
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[...auditLog].reverse().map((entry, i) => (
                                <div key={i} className="animate-slide-up" style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: `1px solid ${entry.status === 'PASSED' ? C.emerald : C.amber}25`, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: entry.status === 'PASSED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {entry.status === 'PASSED' ? <CheckCircle2 size={18} color={C.emerald} /> : <AlertTriangle size={18} color={C.amber} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '0.06em', fontFamily: "'Outfit',sans-serif" }}>{entry.ticker}</span>
                                            <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: entry.status === 'PASSED' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: entry.status === 'PASSED' ? C.emerald : C.amber, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                CFA V(A) {entry.status}
                                            </span>
                                        </div>
                                        {entry.compliance && (
                                            <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, marginBottom: 4 }}>{entry.compliance.substring(0, 120)}…</p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(100,116,139,0.5)' }}>
                                            <Clock size={10} />
                                            {new Date(entry.ts).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
