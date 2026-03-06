import React, { useState } from 'react';
import { C } from '../../utils/constants';
import { Shell, Md } from '../ui/common';

export default function RoomView({ curRoom, goHome, startMode, unpinInitiative }) {
    const [expandIdx, setExpandIdx] = useState(null);
    const [fixedExpanded, setFixedExpanded] = useState(false);

    if (!curRoom) return null;
    const hist = curRoom.history || [];

    return (
        <Shell title={`${curRoom.team} / ${curRoom.name}`} onBack={goHome} backLabel="홈으로">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                {curRoom.level && <span style={{ background: C.pl, color: C.p, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>{curRoom.level}</span>}
                {curRoom.role && <span style={{ background: C.g100, color: C.g600, fontSize: 11, padding: "4px 10px", borderRadius: 6 }}>{curRoom.role}</span>}
            </div>

            <div style={{ fontSize: 11, color: C.g400, marginBottom: 16 }}>마지막 수정: {new Date(curRoom.updatedAt).toLocaleString("ko-KR")}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                {[{ id: 1, icon: "🚀", t: "이니셔티브" }, { id: 2, icon: "📅", t: "성과 1on1" }, { id: 3, icon: "📝", t: "미팅 노트" }, { id: 4, icon: "☕️", t: "라포 1on1" }].map(m => (
                    <button key={m.id} onClick={() => startMode(m.id, curRoom)} style={{ padding: "12px", borderRadius: 10, border: `1px solid ${C.g200}`, background: C.g50, cursor: "pointer", textAlign: "center" }}>
                        <span style={{ fontSize: 18 }}>{m.icon}</span>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.g700, marginTop: 2 }}>{m.t}</div>
                    </button>
                ))}
            </div>

            {/* 고정 이니셔티브 표시 */}
            {curRoom.fixed_initiative && (
                <div style={{ marginBottom: 18, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 14, border: "1.5px solid #F59E0B", overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 18 }}>📌</span>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>고정 이니셔티브</div>
                                <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>모든 모드에서 이 이니셔티브를 기반으로 생성됩니다</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => setFixedExpanded(p => !p)} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #F59E0B", borderRadius: 6, padding: "4px 10px", color: "#92400E", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{fixedExpanded ? "접기 ▲" : "펼치기 ▼"}</button>
                            <button onClick={() => { if (window.confirm("고정을 해제하시겠습니까?")) unpinInitiative(); }} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #EF4444", borderRadius: 6, padding: "4px 10px", color: "#EF4444", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>해제</button>
                        </div>
                    </div>
                    <div style={{ padding: "0 16px 14px 16px" }}>
                        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: 14, fontSize: 12, color: C.g700, lineHeight: 1.7, maxHeight: fixedExpanded ? "none" : 80, overflowY: fixedExpanded ? "auto" : "hidden", whiteSpace: "pre-wrap", position: "relative" }}>
                            <Md t={curRoom.fixed_initiative} />
                            {!fixedExpanded && curRoom.fixed_initiative.length > 200 && (
                                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, background: "linear-gradient(transparent, rgba(255,255,255,0.95))" }} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ fontSize: 14, fontWeight: 700, color: C.g800, marginBottom: 10 }}>📋 히스토리 <span style={{ color: C.g400, fontWeight: 400, fontSize: 12 }}>({hist.length}건)</span></div>

            {hist.length === 0 ? <div style={{ textAlign: "center", padding: "24px 0", color: C.g400, fontSize: 13 }}>아직 생성된 기록이 없습니다</div>
                : (<div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                    {hist.map((h, i) => (
                        <div key={i} style={{ background: C.g50, borderRadius: 10, border: `1px solid ${C.g200}`, overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div onClick={() => setExpandIdx(expandIdx === i ? null : i)} style={{ flex: 1, cursor: "pointer" }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.g800 }}>{h.mode_label || h.modeLabel}</div>
                                    <div style={{ fontSize: 11, color: C.g400, marginTop: 4 }}>{new Date(h.ts).toLocaleString("ko-KR")}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(h.result); window.showToast("클립보드에 복사되었습니다."); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.w, color: C.p, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>📋 복사</button>
                                    <button onClick={() => setExpandIdx(expandIdx === i ? null : i)} style={{ background: "none", border: "none", color: C.g400, fontSize: 12, cursor: "pointer" }}>{expandIdx === i ? "▲" : "▼"}</button>
                                </div>
                            </div>
                            {expandIdx === i && (
                                <div style={{ padding: "14px", borderTop: `1px solid ${C.g200}`, background: C.w, fontSize: 13 }}>
                                    <Md t={h.result} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>)}
        </Shell>
    );
}
