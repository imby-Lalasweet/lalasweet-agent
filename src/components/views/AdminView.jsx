import React, { useState, useEffect } from 'react';
import { C, crd, inp, bS } from '../../utils/constants';
import { Shell, Md } from '../ui/common';
import { getAllUsers, deleteUser, resetUserPassword } from '../../services/supabase';

export default function AdminView({
    adminAuth, setAdminAuth, apw, setApw, pwErr, setPwErr, loadLogs,
    guide, fileRef, deleteGuide, handleFile, err,
    adminTab, setAdminTab, logsLoad, logs, logDetail, setLogDetail,
    logFilter, setLogFilter, clearLogs, goHome,
    user,
    workingStyle, saveWorkingStyle, deleteWorkingStyle,
    orgOkr = null, saveOrgOkr, deleteOrgOkr,
    orgBp = null, saveOrgBp, deleteOrgBp,
    saveGuide
}) {
    const [users, setUsers] = useState([]);
    const [usersLoad, setUsersLoad] = useState(false);
    const [wsText, setWsText] = useState(workingStyle?.content || '');
    const [wsSaving, setWsSaving] = useState(false);
    const [wsMsg, setWsMsg] = useState('');

    // Guide text state
    const [guideText, setGuideText] = useState(guide?.data || '');
    const [guideSaving, setGuideSaving] = useState(false);
    const [guideMsg, setGuideMsg] = useState('');

    // OKR state (single blob)
    const [okrText, setOkrText] = useState(orgOkr?.content || '');
    const [okrSaving, setOkrSaving] = useState(false);
    const [okrMsg, setOkrMsg] = useState('');

    // BP state (single blob)
    const [bpText, setBpText] = useState(orgBp?.content || '');
    const [bpSaving, setBpSaving] = useState(false);
    const [bpMsg, setBpMsg] = useState('');

    useEffect(() => { setWsText(workingStyle?.content || ''); }, [workingStyle]);
    useEffect(() => { setGuideText(guide?.data || ''); }, [guide]);
    useEffect(() => { setOkrText(orgOkr?.content || ''); }, [orgOkr]);
    useEffect(() => { setBpText(orgBp?.content || ''); }, [orgBp]);

    const loadUsers = async () => {
        setUsersLoad(true);
        try { const arr = await getAllUsers(); setUsers(arr); } catch (e) { console.error("Load users error", e); }
        setUsersLoad(false);
    };

    const handleDeleteUser = async (id, username) => {
        if (!window.confirm(`"${username}" 사용자를 삭제하시겠습니까?\n관련된 모든 데이터가 삭제됩니다.`)) return;
        try { await deleteUser(id); setUsers(prev => prev.filter(u => u.id !== id)); } catch (e) { console.error("Delete user error", e); }
    };

    const handleResetPassword = async (id, username) => {
        if (!window.confirm(`"${username}" 사용자의 비밀번호를 '1234'로 초기화하시겠습니까?`)) return;
        try {
            const success = await resetUserPassword(id);
            if (success) {
                window.showToast(`"${username}" 사용자의 비밀번호가 '1234'로 초기화되었습니다.`);
                setUsers(prev => prev.map(u => u.id === id ? { ...u, password_plain: '1234' } : u));
            } else { window.showToast('비밀번호 초기화에 실패했습니다.', 'error'); }
        } catch (e) { console.error("Reset password error", e); }
    };

    // ──── helper: 텍스트 저장 탭 UI ────
    const TextTab = ({ icon, title, desc, hint, hintColor, placeholder, text, setText, saving, msg, setMsg, onSave, onDelete, existing, updatedAt, accordionInfo }) => (
        <div>
            <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{existing ? '✅' : icon}</span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>
                        {title} {existing ? '(등록됨)' : '(미등록)'}
                    </div>
                </div>
                <div style={{ fontSize: 12, color: C.g400, marginBottom: 8, lineHeight: 1.5 }}>{desc}</div>
                {hint && (
                    <div style={{ fontSize: 11, color: hintColor || '#7C3AED', background: `${hintColor || '#7C3AED'}10`, padding: '8px 12px', borderRadius: 8, lineHeight: 1.5, fontWeight: 600, marginBottom: 8 }}>
                        {hint}
                    </div>
                )}
                {existing && updatedAt && (
                    <div style={{ fontSize: 11, color: C.g400, marginBottom: 8 }}>
                        최종 수정: {new Date(updatedAt).toLocaleString('ko-KR')}
                    </div>
                )}
            </div>
            <textarea
                value={text}
                onChange={e => { setText(e.target.value); setMsg(''); }}
                placeholder={placeholder}
                style={{ ...inp, minHeight: 250, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, fontSize: 13 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                    onClick={onSave}
                    disabled={saving || !text.trim()}
                    style={{
                        flex: 2, padding: '12px 0', borderRadius: 12, border: 'none',
                        fontSize: 14, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'not-allowed',
                        background: text.trim() ? C.p : C.g200,
                        color: text.trim() ? '#fff' : C.g400
                    }}
                >
                    {saving ? '저장 중...' : '💾 저장'}
                </button>
                {existing && (
                    <button onClick={onDelete} style={{ ...bS, flex: 1, color: C.red }}>🗑️ 삭제</button>
                )}
            </div>
            {msg && <div style={{ textAlign: 'center', color: C.green, fontSize: 12, marginTop: 10, fontWeight: 600 }}>{msg}</div>}

            {accordionInfo && (
                <details style={{ marginTop: 24, background: C.g50, borderRadius: 12, overflow: 'hidden' }}>
                    <summary style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: C.g700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyle: 'none' }}>
                        <span>💡 이 내용은 AI에 어떻게 반영되나요?</span>
                        <span style={{ fontSize: 12 }}>▼</span>
                    </summary>
                    <div style={{ padding: '0 16px 16px 16px', fontSize: 13, color: C.g600, lineHeight: 1.6 }}>
                        <div style={{ padding: '12px 14px', background: C.w, borderRadius: 8, border: `1px solid ${C.g200}` }}>
                            <div style={{ fontWeight: 700, color: C.p, marginBottom: 8, fontSize: 12 }}>적용 순위: {accordionInfo.rank} / 6</div>
                            <div style={{ marginBottom: 10, whiteSpace: 'pre-line' }}>{accordionInfo.desc}</div>
                            {accordionInfo.table && (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 8 }}>
                                    <tbody>
                                        {accordionInfo.table.map((row, idx) => (
                                            <tr key={idx} style={{ borderTop: idx === 0 ? 'none' : `1px solid ${C.g100}` }}>
                                                <td style={{ padding: '8px', fontWeight: 600, color: C.g700, width: '30%', verticalAlign: 'top' }}>{row.label}</td>
                                                <td style={{ padding: '8px', color: C.g600 }}>{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </details>
            )}
        </div>
    );

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

    const tabs = [
        { k: "guide", l: "📄 가이드" },
        { k: "okr", l: "🎯 OKR" },
        { k: "workstyle", l: "📋 일하는 방식" },
        { k: "bp", l: "⭐ BP" },
        { k: "logs", l: "📊 로그" },
        { k: "users", l: "👥 사용자" }
    ];

    return (
        <Shell title="⚙️ 관리자" onBack={goHome} backLabel="홈으로">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>🔓 인증됨</span>
                <button onClick={() => { setAdminAuth(false); setApw(""); }} style={{ background: "none", border: `1px solid ${C.g200}`, borderRadius: 8, padding: "4px 12px", color: C.g400, fontSize: 11, cursor: "pointer" }}>잠금</button>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
                {tabs.map(t => (
                    <button key={t.k} onClick={() => { setAdminTab(t.k); if (t.k === "logs") loadLogs(); if (t.k === "users") loadUsers(); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: adminTab === t.k ? C.p : C.g100, color: adminTab === t.k ? "#fff" : C.g500, minWidth: 50 }}>{t.l}</button>
                ))}
            </div>

            {/* ========== Guide Tab (텍스트 입력) ========== */}
            {adminTab === "guide" && (
                <TextTab
                    icon="📄" title="레벨 가이드"
                    desc="레벨 가이드 전체 내용을 복사해서 붙여넣으세요. 이니셔티브 생성 시 레벨별 기대사항을 참고합니다."
                    placeholder={`레벨 가이드 전체 내용을 그대로 복사해서 붙여넣으세요.\n\n예시:\n[L1 - Junior]\n- 주어진 업무를 기한 내 완수\n- 기본적인 업무 프로세스 이해\n\n[L2 - Senior]\n- 독립적으로 프로젝트 수행\n- 주니어 멘토링\n\n[L3 - Lead]\n- 팀 전략 수립 및 실행\n- 교차 기능 협업 리드`}
                    text={guideText} setText={setGuideText}
                    saving={guideSaving} msg={guideMsg} setMsg={setGuideMsg}
                    existing={!!guide} updatedAt={guide?.created_at}
                    onSave={async () => {
                        if (!guideText.trim()) return;
                        setGuideSaving(true);
                        try {
                            if (saveGuide) {
                                const now = new Date();
                                const yy = String(now.getFullYear()).slice(2);
                                const mm = String(now.getMonth() + 1).padStart(2, '0');
                                const dd = String(now.getDate()).padStart(2, '0');
                                const ok = await saveGuide(`가이드 최신화 : ${yy}${mm}${dd}`, guideText.trim());
                                if (ok) setGuideMsg('✅ 저장 완료');
                            }
                        } catch (e) { console.error(e); }
                        setGuideSaving(false);
                    }}
                    onDelete={async () => {
                        if (!window.confirm('레벨 가이드를 삭제하시겠습니까?')) return;
                        await deleteGuide();
                        setGuideText('');
                        setGuideMsg('🗑️ 삭제 완료');
                    }}
                    accordionInfo={{
                        rank: "5순위",
                        desc: "구성원의 레벨(L1~L5)을 파악하여 행동의 '난이도'와 '구조화 수준'을 결정합니다. (예: L1은 '수행/기록', L4는 '구조화/방법론' 중심)",
                        table: [
                            { label: "직무별 가이드", value: "해당 내용에 특정 직무 가이드가 포함돼있다면 최우선으로 찾아서 반영합니다." },
                            { label: "공통 수준 가이드", value: "유사 직무가 없으면 '공통 레벨 수준'을 참고하여 난이도를 맞춥니다." }
                        ]
                    }}
                />
            )}

            {/* ========== OKR Tab (단일 텍스트) ========== */}
            {adminTab === "okr" && (
                <TextTab
                    icon="🎯" title="개인 OKR"
                    desc="구성원별 개인 OKR을 한번에 복사해서 붙여넣으세요. 이름이 포함된 형식으로 넣으면 이니셔티브 생성 시 자동으로 매칭됩니다."
                    placeholder={`구성원별 개인 OKR을 한번에 복사해서 붙여넣으세요.\n이름이 포함되어 있으면 자동으로 매칭됩니다.\n\n예시:\n[김철수]\nO1: 고객 만족도 극대화\n  KR1: NPS 70점 달성\n  KR2: 고객 문의 응답시간 4시간 이내\n\n[이영희]\nO1: 제품 경쟁력 강화\n  KR1: 신규 기능 10건 출시\n  KR2: 버그 수 50% 감소\n\n[박지민]\nO1: 매출 성장 가속화\n  KR1: 분기 매출 20% 성장\n  KR2: 신규 고객 50명 확보`}
                    text={okrText} setText={setOkrText}
                    saving={okrSaving} msg={okrMsg} setMsg={setOkrMsg}
                    existing={!!orgOkr} updatedAt={orgOkr?.updated_at}
                    onSave={async () => {
                        if (!okrText.trim()) return;
                        setOkrSaving(true);
                        const ok = await saveOrgOkr(okrText.trim());
                        setOkrSaving(false);
                        if (ok) { setOkrMsg('✅ OKR 저장 완료'); setTimeout(() => setOkrMsg(''), 2000); }
                    }}
                    onDelete={async () => {
                        if (!window.confirm('OKR 전체를 삭제하시겠습니까?')) return;
                        await deleteOrgOkr();
                        setOkrText('');
                        setOkrMsg('🗑️ 삭제 완료');
                    }}
                    accordionInfo={{
                        rank: "2순위",
                        desc: "개인의 목표를 직접적으로 포괄하는 상위 이니셔티브를 도출하기 위한 핵심 뼈대입니다.",
                        table: [
                            { label: "반영 방법", value: "입력된 이름(예: [김철수])을 기반으로 자동 매칭하여 해당 구성원의 이니셔티브 생성 시 가장 강력한 내용 소스로 사용됩니다." },
                            { label: "적용 효과", value: "구체적인 OKR이 있을수록 결과물이 부서/실무에 더욱 밀착되고 정밀한(Deep-dive) 행동 계획 리스트로 변화합니다." }
                        ]
                    }}
                />
            )}

            {/* ========== Working Style Tab ========== */}
            {adminTab === "workstyle" && (
                <TextTab
                    icon="📋" title="일하는 방식"
                    desc="7가지 핵심 가치 및 행동 기준을 텍스트로 입력하세요."
                    placeholder={`예시:\n가설사고 (도구): 답을 가지고 시작하는 사람\n- 명확한 의도를 가설로 세우고 시작합니다.\n- BP의 핵심을 골라내고, 행동하고 검증할 수 있는 가설을 만듭니다.\n\n문제정의 (도구): 내외부 BP와 고객으로부터\n- 압도적인 BP를 분해해 핵심원인을 찾고, 고객 경험을 파헤쳐 진짜 문제를 정의합니다.\n...`}
                    text={wsText} setText={setWsText}
                    saving={wsSaving} msg={wsMsg} setMsg={setWsMsg}
                    existing={!!workingStyle} updatedAt={workingStyle?.updated_at}
                    onSave={async () => {
                        if (!wsText.trim()) return;
                        setWsSaving(true);
                        const ok = await saveWorkingStyle(wsText.trim());
                        setWsSaving(false);
                        if (ok) setWsMsg('✅ 저장 완료');
                    }}
                    onDelete={async () => {
                        if (!window.confirm('일하는 방식 문서를 삭제하시겠습니까?')) return;
                        await deleteWorkingStyle();
                        setWsText('');
                        setWsMsg('🗑️ 삭제 완료');
                    }}
                    accordionInfo={{
                        rank: "6순위",
                        desc: "도출된 이니셔티브 행동에 7가지 제플린 핵심 가치(예: [가설사고], [문제정의]) 태그를 알맞게 맵핑하고, 가이드라인 멘트를 작성할 때 조언 기준으로 쓰입니다.",
                        table: [
                            { label: "핵심 역할", value: "행동의 명확한 '태도/도구 방향성'을 주기 위해 AI가 행동과 연관깊은 핵심 가치 태그를 자동으로 부여합니다." },
                            { label: "과잉 부여 방지", value: "단순히 '목표를 세우는 행동'에 [목표설정] 태그를 습관적으로 달지 않고, 실제로 그 핵심 역량이 필요할 때만 선별 기입하게 되어 있습니다." }
                        ]
                    }}
                />
            )}

            {/* ========== BP (Best Practice) Tab (단일 텍스트) ========== */}
            {adminTab === "bp" && (
                <TextTab
                    icon="⭐" title="BP (Best Practice)"
                    desc="잘 만들어진 이니셔티브 사례를 한번에 복사해서 붙여넣으세요. 조직/직무별 구분이 있으면 그대로 넣으면 됩니다."
                    hint="⭐ 등록된 BP는 이니셔티브 도출 시 최우선으로 참고되어 양식과 구조가 적용됩니다."
                    placeholder={`잘 만들어진 이니셔티브 사례(Best Practice)를 그대로 복사해서 붙여넣으세요.\n조직/직무별 구분이 있으면 그대로 넣으면 됩니다.\n\n이 내용의 양식과 구조가 이니셔티브 생성 시 최우선 적용됩니다.\n\n예시:\n[제품개발팀 - 백엔드 개발자]\n이니셔티브 1: API 응답 속도 개선\n  목표: p95 latency 200ms 이하 달성\n  핵심 활동:\n  - 캐싱 레이어 도입\n  - DB 쿼리 최적화\n  기대 효과: 사용자 만족도 10% 향상\n\n[마케팅팀 - 콘텐츠 마케터]\n이니셔티브 1: SEO 기반 유기적 트래픽 확대\n  ...`}
                    text={bpText} setText={setBpText}
                    saving={bpSaving} msg={bpMsg} setMsg={setBpMsg}
                    existing={!!orgBp} updatedAt={orgBp?.updated_at}
                    onSave={async () => {
                        if (!bpText.trim()) return;
                        setBpSaving(true);
                        const ok = await saveOrgBp(bpText.trim());
                        setBpSaving(false);
                        if (ok) { setBpMsg('✅ BP 저장 완료'); setTimeout(() => setBpMsg(''), 2000); }
                    }}
                    onDelete={async () => {
                        if (!window.confirm('BP 전체를 삭제하시겠습니까?')) return;
                        await deleteOrgBp();
                        setBpText('');
                        setBpMsg('🗑️ 삭제 완료');
                    }}
                    accordionInfo={{
                        rank: "1순위 (최우선)",
                        desc: "AI가 가장 먼저 읽고 '형식 제약'과 '문장 구조론'의 기준으로 삼는 절대적 템플릿입니다.",
                        table: [
                            { label: "복제 메커니즘", value: "이 곳에 입력된 (행동)-(기준)-(가이드) 형태와 정량적 수치 표현 방식을 AI가 거울처럼 그대로 따라하여 답변을 설계합니다." },
                            { label: "직무 반영", value: "동일 팀/직무의 BP가 있으면 1차로 내용 로직까지 모방하며, 다른 직무여도 '좋은 사례의 작성법'으로서 모방합니다." }
                        ]
                    }}
                />
            )}

            {/* ========== Logs Tab ========== */}
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
                                    {logDetail.username && <div style={{ fontSize: 11, color: C.p, marginTop: 4, fontWeight: 600 }}>작성자: {logDetail.username}</div>}
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
                                                        <div style={{ fontSize: 11, color: C.g400, marginTop: 2 }}>{l.team} · {l.role} {l.username && <span style={{ color: C.p, fontWeight: 600 }}>· 👤 {l.username}</span>}</div>
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

            {/* ========== Users Tab ========== */}
            {adminTab === "users" && (
                <div>
                    {usersLoad ? <div style={{ textAlign: "center", padding: 20, color: C.g400, fontSize: 13 }}>불러오는 중...</div>
                        : users.length === 0 ? <div style={{ textAlign: "center", padding: 30, color: C.g400, fontSize: 13 }}>등록된 사용자 없음</div>
                            : (
                                <div>
                                    <div style={{ fontSize: 12, color: C.g400, marginBottom: 10 }}>{users.length}명</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 500, overflowY: "auto" }}>
                                        {users.map(u => (
                                            <div key={u.id} style={{ background: C.w, borderRadius: 10, border: `1px solid ${C.g200}`, padding: "14px 16px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: C.g800 }}>
                                                            👤 {u.username}
                                                            {u.email && <span style={{ fontSize: 12, fontWeight: 500, color: C.g500, marginLeft: 8, background: C.g50, padding: "2px 6px", borderRadius: 4, transform: "translateY(-1px)", display: "inline-block" }}>✉️ {u.email}</span>}
                                                        </div>
                                                        <div style={{ fontSize: 11, color: C.g400, marginTop: 4 }}>
                                                            비밀번호: <span style={{ color: C.g600, fontWeight: 600, fontFamily: "monospace" }}>****</span>
                                                        </div>
                                                        <div style={{ fontSize: 10, color: C.g300, marginTop: 4 }}>
                                                            가입: {new Date(u.created_at).toLocaleDateString("ko-KR")}
                                                            {u.last_login && <span> · 최근: {new Date(u.last_login).toLocaleDateString("ko-KR")}</span>}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <button onClick={() => handleResetPassword(u.id, u.username)} style={{ background: C.g50, border: `1px solid ${C.g200}`, color: C.g600, fontSize: 11, cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>초기화</button>
                                                        <button onClick={() => handleDeleteUser(u.id, u.username)} style={{ background: "none", border: "none", color: C.g300, fontSize: 14, cursor: "pointer", padding: "4px 6px" }}>🗑️</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                </div>
            )}
        </Shell>
    );
}
