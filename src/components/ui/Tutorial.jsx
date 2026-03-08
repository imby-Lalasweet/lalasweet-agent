import React, { useState, useEffect, useCallback, useRef } from 'react';
import { C } from '../../utils/constants';

// ─── Tutorial Data ───────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    title: "Lalasweet에 오신 것을 환영합니다!",
    desc: "가치 기반 성과관리 AI 파트너가 이니셔티브 설정부터 1on1 미팅까지 도와드려요.",
    icon: "🍨",
  },
  {
    title: "구성원 관리",
    desc: "홈 화면에서 팀 구성원을 추가하고 관리할 수 있어요. 각 구성원별로 이니셔티브, 1on1 기록 등이 저장됩니다.",
    icon: "👥",
  },
  {
    title: "4가지 AI 모드",
    desc: "이니셔티브 도출, 성과 1on1 아젠다, 미팅 노트 정리, 라포 1on1 아젠다 — 4가지 모드로 성과관리를 지원합니다.",
    icon: "🚀",
  },
  {
    title: "이니셔티브 고정 & 연계",
    desc: "생성된 이니셔티브를 고정하면 다른 모드(성과 1on1, 미팅 노트 등)에서 자동으로 참조됩니다.",
    icon: "📌",
  },
  {
    title: "레벨 가이드 설정",
    desc: "관리자 페이지에서 레벨 가이드 PDF를 업로드하면 AI가 레벨별 기준에 맞는 결과를 생성해요.",
    icon: "📄",
  },
];

const INTERACTIVE_STEPS = {
  home: [
    { target: "[data-tutorial='new-member']", title: "새 구성원 추가", desc: "여기를 눌러 새로운 팀 구성원을 추가하고 이니셔티브를 설정하세요.", position: "bottom" },
    { target: "[data-tutorial='room-list']", title: "구성원 목록", desc: "등록된 구성원을 클릭하면 히스토리와 상세 관리 화면으로 이동합니다.", position: "bottom" },
    { target: "[data-tutorial='quick-actions']", title: "빠른 실행", desc: "구성원을 선택하지 않고도 바로 모드를 실행할 수 있어요.", position: "top" },
    { target: "[data-tutorial='admin-btn']", title: "관리자 설정", desc: "레벨 가이드 업로드, 일하는 방식 설정, 로그 확인 등을 할 수 있습니다.", position: "top" },
  ],
  room: [
    { target: "[data-tutorial='mode-grid']", title: "AI 모드 선택", desc: "4가지 AI 모드 중 원하는 것을 선택해 실행하세요.", position: "bottom" },
    { target: "[data-tutorial='fixed-initiative']", title: "고정 이니셔티브", desc: "이니셔티브를 고정하면 다른 모드에서 자동으로 참조됩니다.", position: "bottom" },
    { target: "[data-tutorial='history-list']", title: "히스토리", desc: "이전에 생성한 결과들이 시간순으로 저장됩니다. 복사/펼치기가 가능해요.", position: "top" },
  ],
  mode: [
    { target: "[data-tutorial='guide-status']", title: "레벨 가이드 상태", desc: "레벨 가이드가 연동되어 있으면 AI가 레벨별 기준을 참고합니다.", position: "bottom" },
    { target: "[data-tutorial='step-progress']", title: "진행 상태", desc: "현재 입력 단계를 보여줍니다. 이전/다음으로 이동할 수 있어요.", position: "bottom" },
  ],
};

const HELP_CONTENT = {
  home: {
    title: "홈 화면 도움말",
    items: [
      { q: "구성원은 어떻게 추가하나요?", a: "'+ 새 구성원' 버튼을 누르면 이니셔티브 모드가 시작되며, 자동으로 구성원이 생성됩니다." },
      { q: "빠른 실행은 무엇인가요?", a: "구성원을 먼저 선택하지 않고 바로 모드를 실행하는 기능입니다. 실행 시 기존 구성원을 선택하거나 새로 시작할 수 있어요." },
      { q: "검색은 어떻게 하나요?", a: "검색창에 이름이나 부서(팀)명을 입력하면 실시간으로 필터링됩니다." },
      { q: "레벨 가이드 미등록이 뜹니다", a: "관리자(⚙️) 페이지에서 레벨 가이드 PDF를 업로드해주세요. AI가 더 정확한 결과를 생성합니다." },
    ],
  },
  room: {
    title: "구성원 상세 도움말",
    items: [
      { q: "이니셔티브 고정은 무엇인가요?", a: "이니셔티브를 고정(📌)하면 성과 1on1, 미팅 노트, 라포 1on1 모드에서 자동으로 해당 이니셔티브를 참조하여 생성합니다." },
      { q: "히스토리는 어떻게 관리되나요?", a: "각 모드에서 생성한 결과가 자동으로 저장됩니다. 펼치기/복사 기능으로 활용하세요." },
      { q: "구성원 정보는 어떻게 수정하나요?", a: "이니셔티브 모드를 다시 실행하면 기본 정보를 수정할 수 있습니다." },
    ],
  },
  mode: {
    title: "모드 실행 도움말",
    items: [
      { q: "이니셔티브 모드 (모드 1)", a: "구성원의 조직목표, 개인 OKR, 리더 기대사항을 기반으로 가치 중심 이니셔티브를 AI가 생성합니다. 5단계 입력 후 자동 생성됩니다." },
      { q: "성과 1on1 모드 (모드 2)", a: "GROW 모델 기반 1on1 아젠다를 생성합니다. 리더의 고민이나 관점을 반영할 수 있어요." },
      { q: "미팅 노트 모드 (모드 3)", a: "1on1 미팅 내용을 600자 이내로 가치 중심 압축 정리합니다." },
      { q: "라포 1on1 모드 (모드 4)", a: "심리적 안전감과 원팀 가치 기반의 라포 1on1 아젠다를 생성합니다." },
      { q: "수정 요청은 어떻게 하나요?", a: "이니셔티브 결과 화면에서 '수정 요청'란에 원하는 수정 사항을 입력하고 '다시 만들기'를 누르세요. 구체화 수준(60%~150%)도 조절 가능합니다." },
      { q: "AI 모델은 어떻게 바꾸나요?", a: "화면 하단의 모델 선택 바에서 원하는 AI 모델을 선택할 수 있습니다." },
    ],
  },
  admin: {
    title: "관리자 도움말",
    items: [
      { q: "레벨 가이드란?", a: "조직의 레벨(L1~L5)별 기대 행동과 역량 기준이 담긴 PDF 문서입니다. 업로드하면 모든 AI 생성에 반영됩니다." },
      { q: "일하는 방식이란?", a: "7가지 핵심 가치의 정의와 행동 기준을 담은 텍스트 문서입니다. 모든 AI 답변에 자동으로 반영됩니다." },
      { q: "에이전트 로그란?", a: "모든 AI 호출 기록을 확인할 수 있습니다. 누가 어떤 모드를 사용했는지 추적 가능합니다." },
    ],
  },
};

// ─── Onboarding Modal ────────────────────────────────────────

function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const s = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 380, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        {/* Header gradient */}
        <div style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2478FF 50%, #3B82F6 100%)", padding: "32px 24px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{s.icon}</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1.4 }}>{s.title}</div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ color: C.g600, fontSize: 14, lineHeight: 1.7, textAlign: "center", minHeight: 60 }}>{s.desc}</div>

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "20px 0" }}>
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? C.p : C.g200, transition: "all 0.3s" }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${C.g200}`, background: C.w, color: C.g600, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                이전
              </button>
            )}
            <button
              onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
              style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: C.p, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(36,120,255,0.3)" }}
            >
              {isLast ? "시작하기" : "다음"}
            </button>
          </div>

          {step === 0 && (
            <button onClick={onComplete} style={{ width: "100%", marginTop: 8, padding: "8px 0", background: "none", border: "none", color: C.g400, fontSize: 12, cursor: "pointer" }}>
              건너뛰기
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes tutorialFadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ─── Spotlight Guide ─────────────────────────────────────────

function SpotlightGuide({ steps, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState(null);
  const current = steps[idx];

  const updateRect = useCallback(() => {
    if (!current) return;
    const el = document.querySelector(current.target);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setRect(null);
    }
  }, [current]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  if (!current) return null;

  const pad = 8;
  const isLast = idx === steps.length - 1;

  // Calculate tooltip position
  let tooltipStyle = {
    position: "fixed",
    zIndex: 50002,
    background: "#fff",
    borderRadius: 14,
    padding: "16px 18px",
    maxWidth: 300,
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    animation: "tutorialFadeIn 0.2s ease-out",
  };

  if (rect) {
    if (current.position === "bottom") {
      tooltipStyle.top = rect.top + rect.height + pad + 8;
      tooltipStyle.left = Math.max(16, Math.min(rect.left, window.innerWidth - 320));
    } else {
      tooltipStyle.bottom = window.innerHeight - rect.top + pad + 8;
      tooltipStyle.left = Math.max(16, Math.min(rect.left, window.innerWidth - 320));
    }
  } else {
    tooltipStyle.top = "50%";
    tooltipStyle.left = "50%";
    tooltipStyle.transform = "translate(-50%, -50%)";
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50001 }}>
      {/* Dark overlay with spotlight cutout using CSS clip-path */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 50001 }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - pad} y={rect.top - pad}
                width={rect.width + pad * 2} height={rect.height + pad * 2}
                rx="12" fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#spotlight-mask)" />
        {rect && (
          <rect
            x={rect.left - pad} y={rect.top - pad}
            width={rect.width + pad * 2} height={rect.height + pad * 2}
            rx="12" fill="none" stroke={C.p} strokeWidth="2"
            style={{ animation: "spotlightPulse 2s ease-in-out infinite" }}
          />
        )}
      </svg>

      {/* Tooltip */}
      <div style={tooltipStyle}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.g800, marginBottom: 6 }}>{current.title}</div>
        <div style={{ fontSize: 13, color: C.g600, lineHeight: 1.6, marginBottom: 14 }}>{current.desc}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: C.g400 }}>{idx + 1} / {steps.length}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {idx > 0 && (
              <button onClick={() => setIdx(i => i - 1)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.g200}`, background: C.w, color: C.g600, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>이전</button>
            )}
            <button
              onClick={() => isLast ? onComplete() : setIdx(i => i + 1)}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: C.p, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              {isLast ? "완료" : "다음"}
            </button>
          </div>
        </div>
      </div>

      {/* Click blocker */}
      <div onClick={onComplete} style={{ position: "fixed", inset: 0, zIndex: 50000 }} />

      <style>{`
        @keyframes spotlightPulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes tutorialFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

// ─── Help Panel ──────────────────────────────────────────────

function HelpPanel({ view, onClose, onStartGuide }) {
  const content = HELP_CONTENT[view] || HELP_CONTENT.home;
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40000 }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderRadius: "20px 20px 0 0",
        maxHeight: "70vh", overflowY: "auto",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
        animation: "helpSlideUp 0.3s ease-out",
        zIndex: 40001,
      }}>
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.g200 }} />
        </div>

        <div style={{ padding: "8px 20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.g800 }}>{content.title}</div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.g400, padding: 4 }}>✕</button>
          </div>

          {/* Interactive guide button */}
          {INTERACTIVE_STEPS[view] && (
            <button
              onClick={onStartGuide}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                border: `1.5px solid ${C.ps}`, background: C.pl,
                color: C.pd, fontSize: 13, fontWeight: 700, cursor: "pointer",
                textAlign: "left", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>👆</span>
              <div>
                <div>화면 가이드 시작하기</div>
                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2, opacity: 0.8 }}>UI 요소를 하이라이트하며 단계별로 안내합니다</div>
              </div>
            </button>
          )}

          {/* FAQ items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {content.items.map((item, i) => (
              <div key={i} style={{ borderRadius: 12, border: `1px solid ${C.g200}`, overflow: "hidden" }}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    width: "100%", padding: "12px 14px", background: expanded === i ? C.g50 : C.w,
                    border: "none", cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.g700 }}>{item.q}</span>
                  <span style={{ fontSize: 12, color: C.g400, flexShrink: 0, marginLeft: 8 }}>{expanded === i ? "▲" : "▼"}</span>
                </button>
                {expanded === i && (
                  <div style={{ padding: "0 14px 12px", fontSize: 13, color: C.g600, lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes helpSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── Help Button (FAB) ───────────────────────────────────────

function HelpFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      data-tutorial="help-fab"
      style={{
        position: "fixed", bottom: 80, right: 16, zIndex: 9998,
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #1E40AF, #2478FF)",
        border: "none", color: "#fff", fontSize: 18, fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(36,120,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      ?
    </button>
  );
}

// ─── Main Tutorial Component ─────────────────────────────────

export default function Tutorial({ view }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("lalasweet_tutorial_done");
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("lalasweet_tutorial_done", "1");
    setShowOnboarding(false);
  };

  const startGuide = () => {
    setShowHelp(false);
    // Small delay so help panel closes before spotlight opens
    setTimeout(() => setShowGuide(true), 350);
  };

  const currentView = view === "mode" ? "mode" : view === "room" ? "room" : view === "admin" ? "admin" : "home";

  return (
    <>
      {/* 1. First login onboarding */}
      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}

      {/* 2. Always accessible help button */}
      {!showOnboarding && !showGuide && <HelpFAB onClick={() => setShowHelp(true)} />}

      {/* Help panel */}
      {showHelp && (
        <HelpPanel
          view={currentView}
          onClose={() => setShowHelp(false)}
          onStartGuide={INTERACTIVE_STEPS[currentView] ? startGuide : undefined}
        />
      )}

      {/* 3. Interactive spotlight guide */}
      {showGuide && INTERACTIVE_STEPS[currentView] && (
        <SpotlightGuide
          steps={INTERACTIVE_STEPS[currentView]}
          onComplete={() => setShowGuide(false)}
        />
      )}
    </>
  );
}

// Export for manual trigger (e.g., from admin or settings)
export function resetTutorial() {
  localStorage.removeItem("lalasweet_tutorial_done");
  window.location.reload();
}
