import React, { useState, useEffect } from 'react';
import { C, crd } from '../../utils/constants';
import { changeUserPassword } from '../../services/supabase';
import TutorialTip from '../ui/TutorialTip';

export default function HomeView({
    guideLoad, guide, roomsLoad, rooms,
    setCurRoom, startMode, deleteRoom, setView,
    user, onLogout
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [quickModeId, setQuickModeId] = useState(null);
    const filteredRooms = rooms.filter(r =>
        (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.team && r.team.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleChangePassword = async () => {
        const newPw = window.prompt("새로운 비밀번호를 입력해주세요:");
        if (!newPw) return;
        if (newPw.length < 4) {
            window.showToast("비밀번호는 최소 4초 이상이어야 합니다.", "error");
            return;
        }

        try {
            const success = await changeUserPassword(user.id, newPw);
            if (success) {
                window.showToast("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                window.showToast("비밀번호 변경에 실패했습니다.", "error");
            }
        } catch (e) {
            console.error("Password change error", e);
            window.showToast("오류가 발생했습니다: " + e.message, "error");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard',-apple-system,sans-serif" }}>
            <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: C.g500, fontWeight: 600 }}>👤 {user?.username}</span>
                            <button onClick={handleChangePassword} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.w, color: C.g500, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>비밀번호 변경</button>
                            <button onClick={onLogout} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.w, color: C.g400, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>로그아웃</button>
                        </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: C.p }}>Lalasweet</div>
                    <div style={{ fontSize: 13, color: C.g400, marginTop: 4 }}>가치 기반 성과관리 파트너</div>
                    {!guideLoad && <div style={{ marginTop: 10, fontSize: 12, color: guide ? C.p : C.gold }}>{guide ? `📄 ${guide.name}` : "⚠️ 레벨 가이드 미등록"}</div>}
                </div>

                <div style={{ marginBottom: 24 }}>
                    <TutorialTip
                        id="tut_home_add_member"
                        type="tutorial"
                        title="구성원을 추가해보세요"
                        content="'+ 새 구성원' 버튼을 눌러 팀원을 등록하고, 이니셔티브 설정 · 1on1 아젠다 · 미팅 노트를 AI와 함께 준비해보세요."
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.g800 }}>👥 내 구성원</div>
                        <button data-tutorial="new-member" onClick={() => { setCurRoom(null); startMode(1, null); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: C.p, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ 새 구성원</button>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <input
                            type="text"
                            placeholder="이름 또는 부서(팀)로 검색..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.g200}`, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                        />
                    </div>

                    <div data-tutorial="room-list">{roomsLoad ? <div style={{ color: C.g400, fontSize: 13, textAlign: "center", padding: 20 }}>불러오는 중...</div>
                        : rooms.length === 0 ? <div style={{ ...crd, textAlign: "center", padding: "30px 20px" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div><div style={{ color: C.g400, fontSize: 13 }}>아직 관리 중인 구성원이 없습니다</div><div style={{ color: C.g300, fontSize: 12, marginTop: 4 }}>새 구성원을 추가하고 이니셔티브를 설정해보세요</div></div>
                            : filteredRooms.length === 0 ? <div style={{ textAlign: "center", padding: "20px", color: C.g400, fontSize: 13 }}>검색 결과가 없습니다</div>
                                : (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {filteredRooms.map(r => (
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
                </div>

                <div data-tutorial="quick-actions" style={{ marginBottom: 24 }}>
                    <TutorialTip
                        id="tip_home_quick_action"
                        type="tip"
                        title="빠른 실행 활용하기"
                        content="특정 구성원 없이도 이니셔티브 · 1on1 · 미팅 노트를 바로 시작할 수 있어요. 구성원 선택 후 결과가 저장됩니다."
                    />
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.g800, marginBottom: 12 }}>⚡ 빠른 실행</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {[{ id: 1, icon: "🚀", t: "이니셔티브" }, { id: 2, icon: "📅", t: "성과 1on1" }, { id: 3, icon: "📝", t: "미팅 노트" }, { id: 4, icon: "☕️", t: "라포 1on1" }].map(m => (
                            <button key={m.id} onClick={() => setQuickModeId(m.id)} style={{ ...crd, padding: "16px", cursor: "pointer", textAlign: "center", border: `1px solid ${C.g200}` }}>
                                <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.g700 }}>{m.t}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <button data-tutorial="admin-btn" onClick={() => setView("admin")} style={{ ...crd, width: "100%", padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", border: `1px solid ${C.g200}` }}>
                    <span style={{ fontSize: 22 }}>⚙️</span><div><div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>관리자</div></div>
                </button>
                <div style={{ textAlign: "center", marginTop: 24, color: C.g300, fontSize: 11 }}>Powered by Multi-AI · 7 Core Values</div>
            </div>

            {quickModeId && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 400, padding: 24, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.g800 }}>대상 구성원 선택</div>
                            <button onClick={() => setQuickModeId(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.g400 }}>✕</button>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <button onClick={() => { setQuickModeId(null); setCurRoom(null); startMode(quickModeId, null); }} style={{ width: "100%", padding: "12px", background: C.p, color: "#fff", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>
                                + 새 구성원 시작
                            </button>
                        </div>
                        <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                            {rooms.map(r => (
                                <button key={r.id} onClick={() => { setQuickModeId(null); setCurRoom(r); startMode(quickModeId, r); }} style={{ width: "100%", padding: "12px 14px", background: C.g50, border: `1px solid ${C.g200}`, borderRadius: 10, textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, color: C.g800, fontSize: 14 }}>{r.name}</span>
                                    <span style={{ fontSize: 12, color: C.g500 }}>{r.team} {r.level && <span style={{ color: C.p }}>({r.level})</span>}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
