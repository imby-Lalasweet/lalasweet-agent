import React from 'react';
import { C, crd, inp, bS } from '../../utils/constants';
import { Shell, Md } from '../ui/common';

export default function AdminView({
    adminAuth, setAdminAuth, apw, setApw, pwErr, setPwErr, loadLogs,
    guide, fileRef, deleteGuide, handleFile, err,
    adminTab, setAdminTab, logsLoad, logs, logDetail, setLogDetail,
    logFilter, setLogFilter, clearLogs, goHome
}) {

    if (!adminAuth) {
        return (
            <Shell title="⚙️ 관리자" onBack={goHome} backLabel="홈으로">
                {guide ? (
                    <div style={{ background: C.pl, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${C.ps}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 22 }}>✅</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>레벨 가이드 등록됨</div>
                                <div style={{ color: C.g400, fontSize: 12 }}>{guide.name}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: C.goldL, borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid rgba(232,167,77,0.25)", textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                        <div style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>레벨 가이드 미등록</div>
                        <div style={{ color: C.g400, fontSize: 12, marginTop: 4 }}>관리자에게 요청하세요</div>
                    </div>
                )}

                <div style={{ borderTop: `1px solid ${C.g200}`, paddingTop: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span>🔒</span>
                        <div style={{ fontSize: 13, color: C.g500, fontWeight: 600 }}>관리자 인증</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <input type="password" style={{ ...inp, flex: 1 }} placeholder="비밀번호" value={apw} onChange={e => { setApw(e.target.value); setPwErr(""); }}
                            onKeyDown={e => { if (e.key === "Enter") { if (apw === "sweet0110") { setAdminAuth(true); setApw(""); loadLogs(); } else setPwErr("비밀번호 오류"); } }} />
                        <button onClick={() => { if (apw === "sweet0110") { setAdminAuth(true); setApw(""); loadLogs(); } else setPwErr("오류"); }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: C.p, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>인증</button>
                    </div>
                    {pwErr && <div style={{ color: C.red, fontSize: 12, marginTop: 8 }}>{pwErr}</div>}
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="⚙️ 관리자" onBack={goHome} backLabel="홈으로">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>🔓 인증됨</span>
                <button onClick={() => { setAdminAuth(false); setApw(""); }} style={{ background: "none", border: `1px solid ${C.g200}`, borderRadius: 8, padding: "4px 12px", color: C.g400, fontSize: 11, cursor: "pointer" }}>잠금</button>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[{ k: "guide", l: "📄 가이드" }, { k: "logs", l: "📊 로그" }].map(t => (
                    <button key={t.k} onClick={() => { setAdminTab(t.k); if (t.k === "logs") loadLogs(); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: adminTab === t.k ? C.p : C.g100, color: adminTab === t.k ? "#fff" : C.g500 }}>{t.l}</button>
                ))}
            </div>

            {adminTab === "guide" && (guide ? (
                <div>
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>등록됨</div>
                        <div style={{ color: C.g400, fontSize: 13, marginTop: 4 }}>{guide.name}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => fileRef.current?.click()} style={{ ...bS, flex: 1 }}>🔄 교체</button>
                        <button onClick={deleteGuide} style={{ ...bS, flex: 1, color: C.red }}>🗑️ 삭제</button>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} style={{ display: "none" }} />
                </div>
            ) : (
                <div>
                    <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                        <div style={{ fontSize: 44, marginBottom: 10 }}>📄</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>PDF 업로드</div>
                    </div>
                    <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${C.g200}`, borderRadius: 14, padding: "36px 20px", textAlign: "center", cursor: "pointer", background: C.g50 }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                        <div style={{ color: C.g500, fontSize: 13, fontWeight: 600 }}>클릭하여 업로드</div>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} style={{ display: "none" }} />
                    {err && <div style={{ color: C.red, fontSize: 12, marginTop: 10 }}>{err}</div>}
                </div>
            ))}

            {adminTab === "logs" && (
                <div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
                        {[{ k: "all", l: "전체" }, { k: "1", l: "🚀" }, { k: "2", l: "📅" }, { k: "3", l: "📝" }, { k: "4", l: "☕️" }].map(f => (
                            <button key={f.k} onClick={() => setLogFilter(f.k)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: logFilter === f.k ? C.p : C.g100, color: logFilter === f.k ? "#fff" : C.g500 }}>{f.l}</button>
                        ))}
                    </div>
                    {logsLoad ? <div style={{ textAlign: "center", padding: 20, color: C.g400, fontSize: 13 }}>불러오는 중...</div>
                        : logDetail ? (
                            <div>
                                <button onClick={() => setLogDetail(null)} style={{ background: "none", border: "none", color: C.p, fontSize: 12, cursor: "pointer", fontWeight: 600, marginBottom: 12 }}>← 목록</button>
                                <div style={{ background: C.g50, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>{logDetail.modeLabel || logDetail.mode_label}</span>
                                        <span style={{ fontSize: 11, color: C.g400 }}>{new Date(logDetail.ts).toLocaleString("ko-KR")}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: C.g600, marginTop: 4 }}>{logDetail.name} · {logDetail.team} · {logDetail.role} · {logDetail.level}</div>
                                </div>
                                <div style={{ background: C.g50, borderRadius: 12, padding: 14, maxHeight: 350, overflowY: "auto", fontSize: 12.5 }}><Md t={logDetail.result} /></div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                    <span style={{ fontSize: 12, color: C.g400 }}>{logs.filter(l => logFilter === "all" || String(l.mode) === logFilter).length}건</span>
                                    {logs.length > 0 && <button onClick={clearLogs} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>전체 삭제</button>}
                                </div>
                                {logs.filter(l => logFilter === "all" || String(l.mode) === logFilter).length === 0 ? <div style={{ textAlign: "center", padding: 30, color: C.g400, fontSize: 13 }}>로그 없음</div>
                                    : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 400, overflowY: "auto" }}>
                                            {logs.filter(l => logFilter === "all" || String(l.mode) === logFilter).map((l, i) => (
                                                <button key={i} onClick={() => setLogDetail(l)} style={{ background: C.w, borderRadius: 10, border: `1px solid ${C.g200}`, padding: "12px 14px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <div style={{ fontSize: 12, fontWeight: 600, color: C.g800 }}>{l.modeLabel || l.mode_label} — {l.name}</div>
                                                        <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{l.team} · {l.role}</div>
                                                    </div>
                                                    <div style={{ fontSize: 10, color: C.g400, textAlign: "right" }}>{new Date(l.ts).toLocaleDateString("ko-KR")}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        )}
                </div>
            )}
        </Shell>
    );
}
