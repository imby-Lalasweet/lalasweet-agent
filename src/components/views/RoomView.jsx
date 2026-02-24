import React, { useState } from 'react';
import { C } from '../../utils/constants';
import { Shell, Md } from '../ui/common';

export default function RoomView({ curRoom, goHome, startMode }) {
    const [expandIdx, setExpandIdx] = useState(null);

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
                                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(h.result); alert("클립보드에 복사되었습니다."); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.w, color: C.p, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>📋 복사</button>
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
