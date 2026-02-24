import React, { useState, useEffect } from 'react';
import { C, crd } from '../../utils/constants';

export default function HomeView({
    guideLoad, guide, roomsLoad, rooms,
    setCurRoom, startMode, deleteRoom, setView,
    user, onLogout
}) {
    return (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard',-apple-system,sans-serif" }}>
            <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: C.g500, fontWeight: 600 }}>👤 {user?.username}</span>
                            <button onClick={onLogout} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.w, color: C.g400, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>로그아웃</button>
                        </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: C.p }}>Lalasweet</div>
                    <div style={{ fontSize: 13, color: C.g400, marginTop: 4 }}>가치 기반 성과관리 파트너</div>
                    {!guideLoad && <div style={{ marginTop: 10, fontSize: 12, color: guide ? C.p : C.gold }}>{guide ? `📄 ${guide.name}` : "⚠️ 레벨 가이드 미등록"}</div>}
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.g800 }}>👥 내 구성원</div>
                        <button onClick={() => { setCurRoom(null); startMode(1, null); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: C.p, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ 새 구성원</button>
                    </div>

                    {roomsLoad ? <div style={{ color: C.g400, fontSize: 13, textAlign: "center", padding: 20 }}>불러오는 중...</div>
                        : rooms.length === 0 ? <div style={{ ...crd, textAlign: "center", padding: "30px 20px" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div><div style={{ color: C.g400, fontSize: 13 }}>아직 관리 중인 구성원이 없습니다</div><div style={{ color: C.g300, fontSize: 12, marginTop: 4 }}>새 구성원을 추가하고 이니셔티브를 설정해보세요</div></div>
                            : (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {rooms.map(r => (
                                    <div key={r.id} style={{ ...crd, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <button onClick={() => { setCurRoom(r); setView("room"); }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, padding: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>{r.team} / {r.name}</div>
                                            <div style={{ fontSize: 11, color: C.g400, marginTop: 3 }}>
                                                {r.level && <span style={{ color: C.p, fontWeight: 600, marginRight: 6 }}>{r.level}</span>}
                                                {r.role && <span style={{ marginRight: 8 }}>{r.role}</span>}
                                                {new Date(r.updatedAt).toLocaleDateString("ko-KR")} 수정
                                                {r.history?.length > 0 && <span style={{ marginLeft: 6 }}>· {r.history.length}건</span>}
                                            </div>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`${r.name} 구성원을 삭제하시겠습니까?`)) deleteRoom(r.id); }} style={{ background: "none", border: "none", color: C.g300, fontSize: 16, cursor: "pointer", padding: "4px 8px", flexShrink: 0 }}>✕</button>
                                    </div>
                                ))}
                            </div>)}
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.g800, marginBottom: 12 }}>⚡ 빠른 실행</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {[{ id: 1, icon: "🚀", t: "이니셔티브" }, { id: 2, icon: "📅", t: "성과 1on1" }, { id: 3, icon: "📝", t: "미팅 노트" }, { id: 4, icon: "☕️", t: "라포 1on1" }].map(m => (
                            <button key={m.id} onClick={() => { setCurRoom(null); startMode(m.id, null); }} style={{ ...crd, padding: "16px", cursor: "pointer", textAlign: "center", border: `1px solid ${C.g200}` }}>
                                <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.g700 }}>{m.t}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={() => setView("admin")} style={{ ...crd, width: "100%", padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", border: `1px solid ${C.g200}` }}>
                    <span style={{ fontSize: 22 }}>⚙️</span><div><div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>관리자</div></div>
                </button>
                <div style={{ textAlign: "center", marginTop: 24, color: C.g300, fontSize: 11 }}>Powered by Multi-AI · 7 Core Values</div>
            </div>
        </div>
    );
}
