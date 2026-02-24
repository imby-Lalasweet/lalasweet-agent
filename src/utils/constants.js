export const BASE = `당신은 Lalasweet 회사의 '가치 기반 성과관리' AI 파트너입니다.
7가지 핵심 가치: 문제정의, 목표설정, 가설사고, 피드백, 주도성, 학습, 원팀
가치 판단: [문제정의]:현상→원인 분석 [가설사고]:"~하면 ~할 것이다" [목표설정]:측정가능 수치 [피드백]:실행→검증→개선 [주도성]:자발적 문제해결 [학습]:패턴화 [원팀]:협업
레벨별: L1:수행/기록 L2:패턴분석/개선 L3:독립수립/실행 L4:구조화/방법론 L5:비즈니스임팩트/조직해법`;

export const SYS = {
    1: BASE + `\n[이니셔티브 도출 핵심 원칙]\n1. 사용자가 입력한 내용(조직목표, 기존 과제 등)을 그대로 복붙하거나 단순 재구성하지 마세요.\n2. 직무별 레벨 기준(L1~L5)에 맞춰, 해당 조직목표에 실질적으로 기여할 수 있는 구체적이고 뾰족한 '행동 중심(Action-oriented)' 가이드를 제안해야 합니다.\n3. 각 이니셔티브를 달성했을 때 상위 목표에 명확하게 어떤 기여를 하는지 체감할 수 있어야 합니다.\n4. 추상적인 표현(예: "노력한다", "잘 관리한다")을 철저히 배제하고, 실무에서 즉시 실행 가능한 형태로 구체화하세요.\n5. 비중 가이드: 일반 (Core 60 : Challenge 25 : BAU 15) / Pre-Level (Core 20 : Challenge 70 : BAU 10)\n\n[각 이니셔티브 세부 항목 필수 작성법]\n- (행동): 목표 달성을 위해 구체적으로 무엇을 어떻게 해야 하는지 상세한 액션 아이템 기록 (단순 나열이 아닌 프로세스나 구체적 방법론 포함)\n- (기준): 이 과제가 완료되었음을 증명할 수 있는 명확한 정량적/정성적 성공 기준 및 산출물 명시\n- (가이드): 해당 구성원의 '레벨(L1~L5)'을 고려할 때, 이 과제를 어떤 관점과 태도로 수행해야 조직 목표에 기여할 수 있는지에 대한 실질적인 조언과 팁 (단순 응원이 아닌 실무적 조언 필수)\n\n출력 포맷 (아래 포맷을 정확히 유지):\n[YYYY-분기/반기] [이름] 이니셔티브 ([직무])\n━━━━━━━━━━━━━━━━━━\n🎯 [상위 목표]\n📊 [연계 개인 OKR]\n\n■ 1. 목표 (비)연계 이니셔티브\n[Core 1: 이니셔티브 제목 (구체적인 목적이 드러나게 작성)]\n(행동): (구체적 실행 행동)\n(기준): (정량/정성/산출물 성공 기준)\n(가이드): (레벨 맞춤 실행 방식, 주의사항, 조직 목표 기여 방안 등 실무 조언)\n\n[Core 2: 이니셔티브 제목]\n(행동): ...\n(기준): ...\n(가이드): ...\n\n[🚀Challenge: 레벨+1 수준 도전 과제 제목]\n(행동): ...\n(기준): ...\n(가이드): ...\n\n■ 2. 지식/학습/리더십/커뮤니케이션\n[Expertise]\n(지식/스킬 내용): (필요한 핵심 지식)\n(학습 방향성): (어떻게 학습하고 적용할 것인지)\n\n[C&L]\n(협업 및 리더십 관련 행동 가이드): (레벨에 맞는 협업/리더십 가이드 명시)\n\n■ 3. 일상 운영 (BAU)\n[BAU 제목]\n(행동): ...\n(기준): ...\n(가이드): ...`,
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

export const AI_MODELS = [
    // Google Gemini 3
    { id: "gemini-3.0-flash", label: "Gemini 3 빠른 모드", desc: "빠르게 답변", provider: "google", icon: "✨" },
    { id: "gemini-3.0-flash-thinking", label: "Gemini 3 사고 모드", desc: "복잡한 문제 해결", provider: "google", icon: "✨" },
    { id: "gemini-3.1-pro", label: "Gemini 3 Pro", desc: "고급 수학 및 코딩", provider: "google", icon: "✨" },
    // OpenAI GPT-5
    { id: "gpt-5.2", label: "GPT-5", desc: "최신 GPT 모델", provider: "openai", icon: "🤖" },
    // Anthropic Claude
    { id: "claude-opus-4-20250514", label: "Opus 4.6", desc: "복잡한 작업에 가장 강력한 성능", provider: "anthropic", icon: "🟠" },
    { id: "claude-sonnet-4-20250514", label: "Sonnet 4.6", desc: "일상적인 작업에 가장 효율적", provider: "anthropic", icon: "🟠" },
];

// Shared styles
export const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.g200}`, background: C.w, color: C.g800, fontSize: 14, outline: "none", boxSizing: "border-box" };
export const lbl = { display: "block", marginBottom: 6, color: C.g500, fontSize: 13, fontWeight: 600 };
export const crd = { background: C.w, borderRadius: 18, border: `1px solid ${C.g200}`, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
export const bP = (ok = true) => ({ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed", background: ok ? C.p : C.g200, color: ok ? "#fff" : C.g400 });
export const bS = { flex: 1, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${C.g200}`, background: C.w, color: C.g600, fontSize: 14, cursor: "pointer", fontWeight: 600 };
