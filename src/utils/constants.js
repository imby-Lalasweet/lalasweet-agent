export const BASE = `당신은 Lalasweet 회사의 '가치 기반 성과관리' AI 파트너입니다.
7가지 핵심 가치: 문제정의, 목표설정, 가설사고, 피드백, 주도성, 학습, 원팀
가치 판단: [문제정의]:현상→원인 분석 [가설사고]:"~하면 ~할 것이다" [목표설정]:측정가능 수치 [피드백]:실행→검증→개선 [주도성]:자발적 문제해결 [학습]:패턴화 [원팀]:협업
레벨별: L1:수행/기록 L2:패턴분석/개선 L3:독립수립/실행 L4:구조화/방법론 L5:비즈니스임팩트/조직해법`;

export const SYS = {
    1: BASE + `\n[이니셔티브 도출]\n- 레벨역량 발휘 행동, 개인OKR 달성 연계\n- 조직목표 그대로 가져오기 금지\n- "앞으로 해야 할 행동"으로 작성\n- 직무 전문성 내 도출, 리더 기대 최우선\n비중: 일반 Core60:Chal25:BAU15 / Pre-Level Core20:Chal70:BAU10\nStandard: 정량/정성/산출물 최소1\n\n출력:\n[YYYY-분기] [이름] 이니셔티브 ([직무])\n━━━━━━━━━━━━━━━━━━\n🎯 [상위 목표]\n📊 [연계 개인 OKR] (있는 경우)\n\n■ 1. 목표 연계\n**[Core 1]** 행동/기준/가이드/리소스\n**[Core 2]** 동일\n**[🚀Challenge]** 레벨+1 도전/성공기준/실패인정조건\n■ 2. Expertise+C&L\n■ 3. BAU`,
    2: BASE + `\nGROW 모델 기반 성과 1on1 아젠다. 리더의 고민/관점을 반영한 질문 포함.\n출력: 📨 [YY.MM월] 성과 1on1 아젠다 ([이름]님)\n━━━\n📋 구성원 준비사항 / 📋 리더 준비사항\n---\n1. 목표설정/원팀 2. 문제정의/가설사고 3. 피드백/학습 4. 리소스`,
    3: BASE + `\n1on1 미팅 요약. 600자 이내, 개조식.\nP1:총평+NextAction(필수) P2:가치+제안 P3:수행내역(생략가능)\n출력: 📅 [YY.MM월] 성과 1on1\n━━━\n■ Core/Chal ■ 역량 ■ Overall Feedback`,
    4: BASE + `\n라포 1on1 아젠다. 심리적 안전감+원팀.\n출력: ☕️ [YY.MM] 라포 1on1 ([이름]님)\n━━━\n1.Check-in 2.Value&Strength 3.Team 4.Career 5.LeaderMemo`,
};

export const C = {
    p: "#2478FF", pd: "#1A5FCC", pl: "#EBF3FF", ps: "#A8CBFF", bg: "#F7F9FC", w: "#FFFFFF",
    g50: "#F4F6FA", g100: "#EBEEF5", g200: "#D8DCE6", g300: "#B8BFCC", g400: "#8E96A6", g500: "#6B7280", g600: "#4B5563", g700: "#374151", g800: "#1F2937",
    gold: "#E8A74D", goldL: "#FEF3E1", green: "#22C55E", red: "#EF4444", redL: "#FEF2F2"
};

export const LEVELS = ["L1", "L2", "L3", "L4", "L5"];
export const ML = { 1: "🚀 이니셔티브", 2: "📅 성과 1on1", 3: "📝 미팅노트", 4: "☕️ 라포 1on1" };

// Shared styles
export const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.g200}`, background: C.w, color: C.g800, fontSize: 14, outline: "none", boxSizing: "border-box" };
export const lbl = { display: "block", marginBottom: 6, color: C.g500, fontSize: 13, fontWeight: 600 };
export const crd = { background: C.w, borderRadius: 18, border: `1px solid ${C.g200}`, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
export const bP = (ok = true) => ({ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed", background: ok ? C.p : C.g200, color: ok ? "#fff" : C.g400 });
export const bS = { flex: 1, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${C.g200}`, background: C.w, color: C.g600, fontSize: 14, cursor: "pointer", fontWeight: 600 };
