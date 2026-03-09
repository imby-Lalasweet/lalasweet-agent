import React, { useState } from 'react';
import { C, ML, LEVELS, inp, lbl, bP, bS } from '../../utils/constants';
import { Shell, Md, GS, CheckBtn, TabToggle } from '../ui/common';
import TutorialTip from '../ui/TutorialTip';

export default function ModeView({
    modeId, curRoom, rooms, step, setStep, loading, err, result,
    modTxt, setModTxt, handleModify, startMode, goHome, goRoom,
    guide,
    f1, setF1, hasExisting, setHasExisting, existingInit, setExistingInit, applyDirect,
    noOkr, setNoOkr, okr, setOkr, checkGoals,
    goalsMode, setGoalsMode, goalsChecked, savedGoals, goals, setGoals,
    goalsPdfData, goalsPdfName, setGoalsPdfData, setGoalsPdfName, goalsPdfRef, handleGoalsPdf,
    saveOrgGoals, gen1, goalsValid,
    f2, setF2, gen2,
    f3, setF3, gen3,
    f4, setF4, gen4,
    pinInitiative, unpinInitiative
}) {
    const [specificity, setSpecificity] = useState("100%");
    const [pinned, setPinned] = useState(false);
    const [useFixed, setUseFixed] = useState(null); // null = not decided, true = use fixed, false = enter new
    const backFn = curRoom ? goRoom : goHome;
    const backLbl = curRoom ? `${curRoom.name}` : "홈으로";
    const isResult1 = modeId === 1 && (step === 99 || step >= 5);
    const isResult = modeId === 1 ? isResult1 : modeId === 2 ? step >= 2 : step >= 1;

    if (isResult) {
        return (
            <Shell title={ML[modeId]} onBack={backFn} backLabel={backLbl}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ fontSize: 44, marginBottom: 14, display: "inline-block", animation: "spin 2s linear infinite" }}>🍨</div>
                        <div style={{ color: C.p, fontSize: 15, fontWeight: 600 }}>생성 중...</div>
                        <div style={{ color: C.g400, fontSize: 13, marginTop: 6 }}>가치 기반 분석 중...</div>
                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : err ? (
                    <div>
                        <div style={{ color: C.red, padding: 16, background: C.redL, borderRadius: 12, fontSize: 13, marginBottom: 16 }}>{err}</div>
                        <button onClick={() => setStep(s => s - 1)} style={bS}>← 돌아가기</button>
                    </div>
                ) : result ? (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: C.g800, margin: 0 }}>{step === 99 ? "📋 직접 입력된 이니셔티브" : "✅ 결과"}</h2>
                            <button onClick={() => navigator.clipboard.writeText(result)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.g200}`, background: C.g50, color: C.p, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📋 복사</button>
                        </div>

                        <div style={{ background: C.g50, borderRadius: 14, padding: 18, maxHeight: 420, overflowY: "auto", fontSize: 13 }}><Md t={result} /></div>

                        {modeId === 1 && (
                            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                <a href="https://flex.team/goals/member" target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: C.green, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", textDecoration: "none", boxShadow: "0 4px 16px rgba(34,197,94,0.3)", cursor: "pointer", boxSizing: "border-box" }}>📋 이니셔티브 등록하기 (Flex)</a>
                                <button
                                    onClick={async () => { await pinInitiative(result); setPinned(true); }}
                                    disabled={pinned || !curRoom}
                                    style={{
                                        padding: "13px 18px", borderRadius: 12, border: "none",
                                        background: pinned ? C.g200 : "linear-gradient(135deg, #F59E0B, #D97706)",
                                        color: pinned ? C.g500 : "#fff",
                                        fontSize: 13, fontWeight: 700, cursor: pinned ? "default" : "pointer",
                                        boxShadow: pinned ? "none" : "0 4px 16px rgba(245,158,11,0.3)",
                                        whiteSpace: "nowrap"
                                    }}
                                >{pinned ? "✅ 고정됨" : "📌 고정"}</button>
                            </div>
                        )}
                        {modeId === 2 && (<a href="https://flex.team/one-on-one/all" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", marginTop: 14, padding: "13px 0", borderRadius: 12, border: "none", background: C.green, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", textDecoration: "none", boxShadow: "0 4px 16px rgba(34,197,94,0.3)", cursor: "pointer", boxSizing: "border-box" }}>📅 1on1 아젠다 등록/공유하기</a>)}

                        {modeId === 1 && (
                            <div style={{ marginTop: 16, background: C.g50, borderRadius: 12, padding: 14, border: `1px solid ${C.g200}` }}>
                                <label style={{ display: "block", marginBottom: 8, color: C.g500, fontSize: 12, fontWeight: 600 }}>✏️ 수정 요청</label>
                                <textarea style={{ ...inp, minHeight: 72, resize: "vertical", fontSize: 13 }} placeholder="예: Core 1 기준 구체화" value={modTxt} onChange={e => setModTxt(e.target.value)} />

                                <div style={{ marginTop: 14 }}>
                                    <label style={{ display: "block", marginBottom: 8, color: C.g500, fontSize: 12, fontWeight: 600 }}>🔍 구체화 수준</label>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {["60%", "80%", "100%", "120%", "150%"].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setSpecificity(lvl)}
                                                style={{
                                                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                    background: specificity === lvl ? C.p : C.g100,
                                                    color: specificity === lvl ? "#fff" : C.g500
                                                }}>
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => { if (modTxt.trim()) { handleModify(modTxt.trim(), specificity); setModTxt(""); } }} disabled={!modTxt.trim()} style={{ width: "100%", marginTop: 14, padding: "11px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700, cursor: modTxt.trim() ? "pointer" : "not-allowed", background: modTxt.trim() ? C.p : C.g200, color: modTxt.trim() ? "#fff" : C.g400 }}>🔄 다시 만들기</button>
                            </div>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <div style={{ color: C.g400, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>📌 다음 단계</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {(modeId === 1 ? [{ m: 2, l: "📅 1on1 아젠다 만들기" }, { m: 4, l: "☕️ 라포 1on1 만들기" }]
                                    : modeId === 2 ? [{ m: 3, l: "📝 미팅 후 노트 정리" }]
                                        : modeId === 3 ? [{ m: 2, l: "📅 다음 1on1 아젠다" }, { m: 4, l: "☕️ 라포 1on1" }]
                                            : [{ m: 2, l: "📅 성과 1on1 아젠다" }, { m: 3, l: "📝 미팅 노트" }]).map((a, i) => (
                                                <button key={i} onClick={() => startMode(a.m, curRoom)} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.ps}`, background: C.pl, color: C.pd, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>{a.l}</button>
                                            ))}
                            </div>
                        </div>
                        <button onClick={curRoom ? goRoom : goHome} style={{ ...bS, width: "100%", marginTop: 12 }}>{curRoom ? `← ${curRoom.name}으로` : "🏠 홈으로"}</button>
                    </div>
                ) : null}
            </Shell>
        );
    }

    if (modeId === 1) {
        const steps1 = ["기본정보", "구성원정보", "개인OKR", "조직목표", "확인"];
        return (
            <Shell title="🚀 이니셔티브 설정" onBack={backFn} backLabel={backLbl}>
                <div data-tutorial="guide-status"><GS guide={guide} /></div>
                <div data-tutorial="step-progress" style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {steps1.map((s, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.p : C.g200 }} />))}
                </div>

                {step === 0 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 14 }}>📋 기본 정보</h3>

                        {/* 고정 이니셔티브 안내 */}
                        {curRoom?.fixed_initiative && useFixed === null && (
                            <div style={{ marginBottom: 20, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 14, padding: 18, border: "1.5px solid #F59E0B" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <span style={{ fontSize: 20 }}>📌</span>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>고정된 이니셔티브가 있습니다</div>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 10, padding: 12, fontSize: 12, color: C.g600, lineHeight: 1.6, maxHeight: 100, overflowY: "auto", whiteSpace: "pre-wrap", marginBottom: 14 }}>{curRoom.fixed_initiative.substring(0, 300)}{curRoom.fixed_initiative.length > 300 ? "..." : ""}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <button
                                        onClick={() => {
                                            setUseFixed(true);
                                            setHasExisting(true);
                                            setExistingInit(curRoom.fixed_initiative);
                                        }}
                                        style={{ padding: "13px 16px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(245,158,11,0.3)" }}
                                    >
                                        <div>📌 고정 이니셔티브 사용하기</div>
                                        <div style={{ fontSize: 11, fontWeight: 400, marginTop: 3, opacity: 0.9 }}>이 이니셔티브를 기반으로 진행합니다</div>
                                    </button>
                                    <button
                                        onClick={() => setUseFixed(false)}
                                        style={{ padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${C.g200}`, background: C.g50, color: C.g600, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}
                                    >
                                        <div>✏️ 다른 이니셔티브로 새로 만들기</div>
                                        <div style={{ fontSize: 11, fontWeight: 400, marginTop: 3, opacity: 0.7 }}>새로운 이니셔티브를 입력합니다</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 고정 이니셔티브 선택이 끝난 후 or 고정 없을 때 기본 정보 폼 표시 */}
                        {(!curRoom?.fixed_initiative || useFixed !== null) && (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                                    <div><label style={lbl}>조직명 *</label><input style={inp} placeholder="피플팀" value={f1.team} onChange={e => setF1(p => ({ ...p, team: e.target.value }))} /></div>
                                    <div><label style={lbl}>주기 *</label><input style={inp} placeholder="2026년 상반기" value={f1.period} onChange={e => setF1(p => ({ ...p, period: e.target.value }))} /></div>
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={lbl}>성명 *</label>
                                    <input style={inp} placeholder="홍길동" value={f1.name} onChange={e => setF1(p => ({ ...p, name: e.target.value }))} />
                                </div>

                                <div style={{ borderTop: `1px solid ${C.g200}`, paddingTop: 18, marginBottom: 14 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.g700, marginBottom: 10 }}>✍️ 기존에 별도로 작성한 이니셔티브가 있나요?</div>
                                    <CheckBtn checked={hasExisting} onClick={() => { setHasExisting(p => !p); if (hasExisting) setExistingInit(""); }}>
                                        네, 이미 작성한 이니셔티브가 있어요
                                    </CheckBtn>
                                </div>

                                {hasExisting && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={lbl}>기존 이니셔티브 내용</label>
                                        <textarea style={{ ...inp, minHeight: 160, resize: "vertical", lineHeight: 1.7 }} placeholder={"작성해둔 이니셔티브를 붙여넣어 주세요"} value={existingInit} onChange={e => setExistingInit(e.target.value)} />
                                        {existingInit.trim().length > 10 && (
                                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                                                <div style={{ fontSize: 12, color: C.g500, fontWeight: 600, marginBottom: 2 }}>이 이니셔티브를 어떻게 활용할까요?</div>
                                                <button onClick={() => { if (f1.team && f1.name && f1.period) applyDirect(); }} disabled={!(f1.team && f1.name && f1.period)} style={{ padding: "13px 16px", borderRadius: 12, border: "none", background: f1.team && f1.name && f1.period ? C.green : C.g200, color: f1.team && f1.name && f1.period ? "#fff" : C.g400, fontSize: 13, fontWeight: 700, cursor: f1.team && f1.name && f1.period ? "pointer" : "not-allowed", textAlign: "left", boxShadow: f1.team && f1.name && f1.period ? "0 2px 10px rgba(34,197,94,0.25)" : "none" }}>
                                                    <div>📋 그대로 적용하기</div>
                                                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 3, opacity: 0.85 }}>수정 없이 바로 Flex에 등록할게요</div>
                                                </button>
                                                <button onClick={() => { if (f1.team && f1.name && f1.period) setStep(1); }} disabled={!(f1.team && f1.name && f1.period)} style={{ padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${f1.team && f1.name && f1.period ? C.ps : C.g200}`, background: f1.team && f1.name && f1.period ? C.pl : C.g50, color: f1.team && f1.name && f1.period ? C.pd : C.g400, fontSize: 13, fontWeight: 700, cursor: f1.team && f1.name && f1.period ? "pointer" : "not-allowed", textAlign: "left" }}>
                                                    <div>🚀 이를 기반으로 AI가 디벨롭하기</div>
                                                    <div style={{ fontSize: 11, fontWeight: 400, marginTop: 3, opacity: 0.85 }}>기존 내용을 바탕으로 가치 기반 이니셔티브로 발전시킬게요</div>
                                                </button>
                                                {!(f1.team && f1.name && f1.period) && <div style={{ fontSize: 11, color: C.gold, marginTop: 2 }}>⚠️ 조직명, 성명, 주기를 먼저 입력해주세요</div>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!hasExisting && (
                                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                        <button onClick={() => setStep(1)} disabled={!(f1.team && f1.name && f1.period)} style={bP(!!(f1.team && f1.name && f1.period))}>다음 →</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 14 }}>👤 구성원 상세 정보</h3>
                        <div style={{ marginBottom: 10 }}>
                            <label style={lbl}>레벨</label>
                            <div style={{ display: "flex", gap: 4 }}>
                                {LEVELS.map(l => (<button key={l} onClick={() => setF1(p => ({ ...p, level: l }))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: f1.level === l ? C.p : C.g100, color: f1.level === l ? "#fff" : C.g500 }}>{l}</button>))}
                            </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={lbl}>직무 *</label>
                            <input style={inp} placeholder="HRM, 구매/원가, 디자인" value={f1.role} onChange={e => setF1(p => ({ ...p, role: e.target.value }))} />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={{ ...lbl, marginBottom: 0 }}>리더 기대사항 (상세히 작성해주실 수록 좋은 이니셔티브가 생성돼요.) *</label>
                            </div>
                            <TutorialTip
                                id="tip_mode1_expectations"
                                type="tip"
                                title="기대사항이 구체적일수록 좋아요"
                                content="리더의 기대사항을 자세히 쓸수록 더 정교한 이니셔티브가 만들어져요. 아래 '최근 기대사항'을 참고해서 클릭으로 불러올 수도 있어요."
                            />
                            <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="이번 분기 기대 역할/성과" value={f1.expectation} onChange={e => setF1(p => ({ ...p, expectation: e.target.value }))} />

                            {/* 최근 기대사항 표시 로직 */}
                            {(() => {
                                const allHistories = [...(rooms ? rooms.flatMap(r => r.history || []) : []), ...(curRoom && curRoom.history ? curRoom.history : [])];
                                // mode 1 의 히스토리 중 expectation 값이 있는 것만 필터링 (최신순)
                                const historyExpectations = allHistories
                                    // sort by timestamp descending just to be sure
                                    .filter(h => h && Number(h.mode) === 1)
                                    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
                                    .map(h => {
                                        let i = h.info;
                                        if (typeof i === 'string') { try { i = JSON.parse(i); } catch (e) { i = {}; } }
                                        return i?.expectation;
                                    })
                                    .filter(Boolean);

                                // 중복 제거 및 최근 3개만 추출
                                const uniqueRecentExps = [...new Set(historyExpectations)].slice(0, 3);

                                if (uniqueRecentExps.length === 0) return null;

                                return (
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ fontSize: 11, color: C.g400, marginBottom: 6, fontWeight: 600 }}>💡 최근 작성했던 기대사항 (클릭하여 적용)</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {uniqueRecentExps.map((exp, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setF1(p => ({ ...p, expectation: exp }))}
                                                    style={{
                                                        textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                                                        border: `1px solid ${C.g200}`, background: C.g50, color: C.g600,
                                                        fontSize: 12, cursor: 'pointer', lineHeight: 1.4,
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {exp}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        <div>
                            <label style={lbl}>Pre-Level</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {[{ v: "N", l: "아니오" }, { v: "Y", l: "예" }].map(o => (<button key={o.v} onClick={() => setF1(p => ({ ...p, preLevel: o.v }))} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: f1.preLevel === o.v ? (o.v === "Y" ? C.gold : C.p) : C.g100, color: f1.preLevel === o.v ? "#fff" : C.g500 }}>{o.l}</button>))}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setStep(0)} style={bS}>← 이전</button>
                            <button onClick={() => setStep(2)} disabled={!(f1.role && f1.expectation)} style={bP(!!(f1.role && f1.expectation))}>다음 →</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 4 }}>📊 개인 OKR</h3>
                        <p style={{ color: C.g400, fontSize: 12, marginBottom: 14 }}>이 구성원의 개인 OKR을 입력해주세요.</p>
                        <CheckBtn checked={noOkr} onClick={() => { setNoOkr(p => !p); if (!noOkr) setOkr(""); }}>
                            개인 OKR을 운영하지 않습니다
                        </CheckBtn>
                        {!noOkr && <textarea style={{ ...inp, minHeight: 140, resize: "vertical", lineHeight: 1.7, marginTop: 12 }} placeholder={"O: Objective\n- KR1: Key Result 1"} value={okr} onChange={e => setOkr(e.target.value)} />}
                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setStep(1)} style={bS}>← 이전</button>
                            <button onClick={() => { setStep(3); checkGoals(f1.team); }} disabled={!(noOkr || okr.trim().length > 10)} style={bP(!!(noOkr || okr.trim().length > 10))}>다음 →</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 4 }}>🎯 조직 목표</h3>
                        <p style={{ color: C.g400, fontSize: 12, marginBottom: 14 }}>이번 분기 팀 조직 목표를 입력해주세요.</p>

                        <TabToggle value={goalsMode} onChange={v => { setGoalsMode(v); }} options={[{ k: "text", l: "✏️ 직접 입력" }, { k: "pdf", l: "📄 PDF 등록" }]} />

                        {goalsMode === "text" && (
                            <div>
                                {goalsChecked && savedGoals && !goals.trim() && (
                                    <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginBottom: 14, border: `1px solid ${C.ps}` }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                            <span style={{ color: C.p, fontSize: 12, fontWeight: 600 }}>📂 [{f1.team}] 이전 목표</span>
                                            <span style={{ color: C.g400, fontSize: 10 }}>{savedGoals.updatedAt ? new Date(savedGoals.updatedAt).toLocaleDateString("ko-KR") + " 저장" : ""}</span>
                                        </div>
                                        <div style={{ background: C.w, borderRadius: 8, padding: 10, fontSize: 12, color: C.g600, lineHeight: 1.6, maxHeight: 80, overflowY: "auto", whiteSpace: "pre-wrap", marginBottom: 10 }}>{savedGoals.goals}</div>
                                        <button onClick={() => setGoals(savedGoals.goals)} style={{ width: "100%", padding: "9px 0", borderRadius: 8, border: "none", background: C.p, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>이전 목표 불러오기</button>
                                    </div>
                                )}
                                <textarea style={{ ...inp, minHeight: 120, resize: "vertical", lineHeight: 1.7 }} placeholder={"1. 조직 목표 1\n2. 조직 목표 2"} value={goals} onChange={e => setGoals(e.target.value)} />
                            </div>
                        )}

                        {goalsMode === "pdf" && (
                            <div>
                                {goalsPdfData ? (
                                    <div style={{ background: C.pl, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.ps}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontSize: 22 }}>📄</span>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: C.g800 }}>{goalsPdfName}</div>
                                                <div style={{ fontSize: 11, color: C.p, marginTop: 2 }}>업로드 완료 · AI가 PDF 내용을 참조합니다</div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setGoalsPdfData(""); setGoalsPdfName(""); }} style={{ background: "none", border: `1px solid ${C.g200}`, borderRadius: 8, padding: "5px 10px", color: C.red, fontSize: 11, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>삭제</button>
                                    </div>
                                ) : (
                                    <div onClick={() => goalsPdfRef.current?.click()} style={{ border: `2px dashed ${C.g200}`, borderRadius: 14, padding: "36px 20px", textAlign: "center", cursor: "pointer", background: C.g50 }}>
                                        <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                                        <div style={{ color: C.g600, fontSize: 13, fontWeight: 600 }}>클릭하여 조직목표 PDF 업로드</div>
                                        <div style={{ color: C.g400, fontSize: 11, marginTop: 6 }}>4MB 이하 · PDF 파일만 가능</div>
                                    </div>
                                )}
                                <input ref={goalsPdfRef} type="file" accept=".pdf" onChange={handleGoalsPdf} style={{ display: "none" }} />
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setStep(2)} style={bS}>← 이전</button>
                            <button onClick={() => setStep(4)} disabled={!goalsValid} style={bP(goalsValid)}>다음 →</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 14 }}>🚀 최종 확인</h3>
                        <div style={{ background: C.g50, borderRadius: 12, padding: 16, fontSize: 12.5, lineHeight: 2 }}>
                            <div><span style={{ color: C.g400 }}>조직:</span> {f1.team} · <span style={{ color: C.g400 }}>주기:</span> {f1.period} · <span style={{ color: C.g400 }}>성명:</span> {f1.name}</div>
                            <div><span style={{ color: C.p, fontWeight: 700 }}>{f1.level}</span> · {f1.role} · Pre-Level: {f1.preLevel === "Y" ? "예 ⚡" : "아니오"}</div>
                            <div><span style={{ color: C.g400 }}>기대:</span> {f1.expectation}</div>
                            {hasExisting && existingInit.trim() && (<div style={{ background: C.pl, borderRadius: 8, padding: "8px 10px", marginTop: 4, fontSize: 12 }}><span style={{ color: C.p, fontWeight: 600 }}>📋 기반 이니셔티브 있음</span> — AI가 디벨롭합니다</div>)}
                            <hr style={{ border: "none", borderTop: `1px solid ${C.g200}`, margin: "6px 0" }} />
                            <div><span style={{ color: C.g400 }}>개인OKR:</span> {noOkr ? "없음" : ""}</div>
                            {!noOkr && <div style={{ whiteSpace: "pre-wrap", color: C.g600, fontSize: 12 }}>{okr}</div>}
                            <hr style={{ border: "none", borderTop: `1px solid ${C.g200}`, margin: "6px 0" }} />
                            <div><span style={{ color: C.g400 }}>조직목표:</span>{" "}
                                {goalsMode === "pdf"
                                    ? <span style={{ color: C.p, fontSize: 12 }}>📄 {goalsPdfName}</span>
                                    : <span style={{ color: C.g600, fontSize: 12, whiteSpace: "pre-wrap" }}>{goals}</span>}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setStep(3)} style={bS}>← 이전</button>
                            <button onClick={() => { setStep(5); if (goalsMode === "text") saveOrgGoals(f1.team, goals); gen1(); }} style={bP()}>🚀 생성</button>
                        </div>
                    </div>
                )}
            </Shell>
        );
    }

    if (modeId === 2) {
        return (
            <Shell title="📅 성과 1on1 아젠다" onBack={backFn} backLabel={backLbl}>
                <GS guide={guide} />
                {step === 0 && (
                    <div>
                        {/* 고정 이니셔티브 안내 카드 */}
                        {curRoom?.fixed_initiative && (
                            <div style={{ marginBottom: 16, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 12, padding: 14, border: "1px solid #F59E0B" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                    <span style={{ fontSize: 16 }}>📌</span>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>고정 이니셔티브 적용됨</div>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: 10, fontSize: 11, color: C.g600, lineHeight: 1.5, maxHeight: 60, overflowY: "auto", whiteSpace: "pre-wrap" }}>{curRoom.fixed_initiative.substring(0, 200)}{curRoom.fixed_initiative.length > 200 ? "..." : ""}</div>
                            </div>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <div><label style={lbl}>대상자 성명 *</label><input style={inp} placeholder="홍길동" value={f2.name} onChange={e => setF2(p => ({ ...p, name: e.target.value }))} /></div>
                            <div><label style={lbl}>레벨</label><div style={{ display: "flex", gap: 4 }}>{LEVELS.map(l => (<button key={l} onClick={() => setF2(p => ({ ...p, level: l }))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: f2.level === l ? C.p : C.g100, color: f2.level === l ? "#fff" : C.g500 }}>{l}</button>))}</div></div>
                        </div>
                        <div style={{ marginBottom: 10 }}><label style={lbl}>직무</label><input style={inp} placeholder="HRM, 구매/원가, 디자인" value={f2.role} onChange={e => setF2(p => ({ ...p, role: e.target.value }))} /></div>
                        <div style={{ marginBottom: 10 }}><label style={lbl}>주요 이니셔티브 *</label><textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} placeholder="핵심 과제 1~2개" value={f2.initiatives} onChange={e => setF2(p => ({ ...p, initiatives: e.target.value }))} /></div>
                        <div><label style={lbl}>리더의 고민/관점</label><textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} placeholder="이번 미팅에서 확인/피드백하고 싶은 부분" value={f2.concern} onChange={e => setF2(p => ({ ...p, concern: e.target.value }))} /></div>
                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button onClick={() => setStep(1)} disabled={!(f2.name && f2.initiatives.length > 10)} style={bP(!!(f2.name && f2.initiatives.length > 10))}>다음 →</button></div>
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.g800, marginBottom: 10 }}>확인</h3>
                        <div style={{ background: C.g50, borderRadius: 12, padding: 14, fontSize: 12.5, lineHeight: 1.8 }}>
                            <div>{f2.name} · <span style={{ color: C.p, fontWeight: 700 }}>{f2.level}</span> · {f2.role || "-"}</div>
                            <hr style={{ border: "none", borderTop: `1px solid ${C.g200}`, margin: "6px 0" }} />
                            <div style={{ color: C.g400, fontSize: 11, fontWeight: 600 }}>이니셔티브</div>
                            <div style={{ whiteSpace: "pre-wrap", color: C.g600 }}>{f2.initiatives}</div>
                            {f2.concern && (<><hr style={{ border: "none", borderTop: `1px solid ${C.g200}`, margin: "6px 0" }} /><div style={{ color: C.g400, fontSize: 11, fontWeight: 600 }}>리더 고민</div><div style={{ whiteSpace: "pre-wrap", color: C.g600 }}>{f2.concern}</div></>)}
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button onClick={() => setStep(0)} style={bS}>← 이전</button>
                            <button onClick={() => { setStep(2); gen2(); }} style={bP()}>📅 생성</button>
                        </div>
                    </div>
                )}
            </Shell>
        );
    }

    if (modeId === 3) {
        return (
            <Shell title="📝 1on1 미팅 노트" onBack={backFn} backLabel={backLbl}>
                <div style={{ background: C.pl, borderRadius: 10, padding: 12, marginBottom: 16, border: `1px solid ${C.ps}` }}><div style={{ fontSize: 12, color: C.p, fontWeight: 600 }}>📝 600자 이내 가치 중심 압축</div></div>
                {/* 고정 이니셔티브 안내 카드 */}
                {curRoom?.fixed_initiative && (
                    <div style={{ marginBottom: 14, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 12, padding: 14, border: "1px solid #F59E0B" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 16 }}>📌</span>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>고정 이니셔티브 참고 중</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: 10, fontSize: 11, color: C.g600, lineHeight: 1.5, maxHeight: 60, overflowY: "auto", whiteSpace: "pre-wrap" }}>{curRoom.fixed_initiative.substring(0, 200)}{curRoom.fixed_initiative.length > 200 ? "..." : ""}</div>
                    </div>
                )}
                <div style={{ marginBottom: 10 }}><label style={lbl}>구성원 이름 *</label><input style={inp} placeholder="홍길동" value={f3.name} onChange={e => setF3(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label style={lbl}>미팅 내용 *</label><textarea style={{ ...inp, minHeight: 200, resize: "vertical" }} placeholder="미팅 대화 내용 (녹음/메모 등)" value={f3.content} onChange={e => setF3(p => ({ ...p, content: e.target.value }))} /></div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button onClick={() => { setStep(1); gen3(); }} disabled={!(f3.name && f3.content.length >= 20)} style={bP(!!(f3.name && f3.content.length >= 20))}>📝 생성</button></div>
            </Shell>
        );
    }

    if (modeId === 4) {
        return (
            <Shell title="☕️ 라포 1on1 아젠다" onBack={backFn} backLabel={backLbl}>
                {/* 고정 이니셔티브 안내 카드 */}
                {curRoom?.fixed_initiative && (
                    <div style={{ marginBottom: 14, background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 12, padding: 14, border: "1px solid #F59E0B" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 16 }}>📌</span>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>고정 이니셔티브 참고 중</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: 10, fontSize: 11, color: C.g600, lineHeight: 1.5, maxHeight: 60, overflowY: "auto", whiteSpace: "pre-wrap" }}>{curRoom.fixed_initiative.substring(0, 200)}{curRoom.fixed_initiative.length > 200 ? "..." : ""}</div>
                    </div>
                )}
                <div style={{ marginBottom: 10 }}><label style={lbl}>구성원 이름 *</label><input style={inp} placeholder="홍길동" value={f4.name} onChange={e => setF4(p => ({ ...p, name: e.target.value }))} /></div>
                <div style={{ marginBottom: 10 }}><label style={lbl}>직무</label><input style={inp} placeholder="HRM, 구매/원가, 디자인" value={f4.role} onChange={e => setF4(p => ({ ...p, role: e.target.value }))} /></div>
                <div><label style={lbl}>참고 맥락 (선택)</label><textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="최근 상황, 특이사항 등" value={f4.context} onChange={e => setF4(p => ({ ...p, context: e.target.value }))} /></div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button onClick={() => { setStep(1); gen4(); }} disabled={!f4.name} style={bP(!!f4.name)}>☕️ 생성</button></div>
            </Shell>
        );
    }

    return null;
}
