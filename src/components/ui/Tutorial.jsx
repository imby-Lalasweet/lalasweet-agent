import React, { useState, useEffect, useCallback, useRef } from 'react';
import { C } from '../../utils/constants';

// ─── Tip Definitions per View ────────────────────────────────

const VIEW_TIPS = {
  home: [
    { id: "home-new-member", target: "[data-tutorial='new-member']", text: "여기서 새 구성원을 추가하고 이니셔티브를 설정하세요", position: "bottom" },
    { id: "home-room-list", target: "[data-tutorial='room-list']", text: "구성원을 클릭하면 히스토리와 상세 관리 화면으로 이동해요", position: "bottom" },
    { id: "home-quick-actions", target: "[data-tutorial='quick-actions']", text: "구성원 선택 없이 바로 모드를 실행할 수 있어요", position: "top" },
    { id: "home-admin", target: "[data-tutorial='admin-btn']", text: "레벨 가이드, 일하는 방식 설정은 여기서!", position: "top" },
  ],
  room: [
    { id: "room-mode-grid", target: "[data-tutorial='mode-grid']", text: "4가지 AI 모드 중 원하는 것을 선택해 실행하세요", position: "bottom" },
    { id: "room-fixed-init", target: "[data-tutorial='fixed-initiative']", text: "고정 이니셔티브는 다른 모드에서 자동 참조돼요", position: "bottom" },
    { id: "room-history", target: "[data-tutorial='history-list']", text: "이전 생성 결과가 여기에 저장됩니다", position: "bottom" },
  ],
  mode: [
    { id: "mode-guide", target: "[data-tutorial='guide-status']", text: "레벨 가이드가 연동되면 AI가 레벨별 기준을 참고해요", position: "bottom" },
    { id: "mode-progress", target: "[data-tutorial='step-progress']", text: "현재 입력 단계를 보여줍니다", position: "bottom" },
  ],
};

const STORAGE_PREFIX = "lalasweet_tip_dismissed_";

function isTipDismissed(tipId) {
  return localStorage.getItem(STORAGE_PREFIX + tipId) === "1";
}

function dismissTip(tipId) {
  localStorage.setItem(STORAGE_PREFIX + tipId, "1");
}

// ─── Single Floating Tip ─────────────────────────────────────

function FloatingTip({ tip, onDismiss }) {
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);

  const updateRect = useCallback(() => {
    const el = document.querySelector(tip.target);
    if (el) {
      const r = el.getBoundingClientRect();
      // Only show if element is visible in viewport
      if (r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0) {
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        setVisible(true);
      } else {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  }, [tip.target]);

  useEffect(() => {
    // Delay initial position to let DOM settle
    const timer = setTimeout(updateRect, 300);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  if (!visible || !rect) return null;

  const isTop = tip.position === "top";
  const tooltipWidth = 240;
  // Center tooltip on target, clamped to viewport
  let leftPos = rect.left + rect.width / 2 - tooltipWidth / 2;
  leftPos = Math.max(12, Math.min(leftPos, window.innerWidth - tooltipWidth - 12));

  const style = {
    position: "fixed",
    zIndex: 9990,
    width: tooltipWidth,
    left: leftPos,
    ...(isTop
      ? { bottom: window.innerHeight - rect.top + 8 }
      : { top: rect.top + rect.height + 8 }),
  };

  // Arrow pointing at the target
  const arrowLeft = rect.left + rect.width / 2 - leftPos - 6;

  return (
    <div style={style} onClick={onDismiss}>
      {/* Arrow */}
      {!isTop && (
        <div style={{
          position: "absolute", top: -6, left: Math.max(12, Math.min(arrowLeft, tooltipWidth - 18)),
          width: 0, height: 0,
          borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
          borderBottom: `6px solid ${C.p}`,
        }} />
      )}

      {/* Body */}
      <div style={{
        background: C.p,
        color: "#fff",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
        boxShadow: "0 4px 16px rgba(36,120,255,0.35)",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        animation: "tipFadeIn 0.3s ease-out",
      }}>
        <span style={{ flex: 1 }}>{tip.text}</span>
        <span style={{
          flexShrink: 0, opacity: 0.7, fontSize: 14, lineHeight: 1,
          marginTop: -1,
        }}>✕</span>
      </div>

      {/* Arrow for top position */}
      {isTop && (
        <div style={{
          position: "absolute", bottom: -6, left: Math.max(12, Math.min(arrowLeft, tooltipWidth - 18)),
          width: 0, height: 0,
          borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
          borderTop: `6px solid ${C.p}`,
        }} />
      )}
    </div>
  );
}

// ─── Main Tutorial Component ─────────────────────────────────

export default function Tutorial({ view }) {
  const [dismissed, setDismissed] = useState({});
  const [mounted, setMounted] = useState(false);

  // Re-check dismissed state on view change
  useEffect(() => {
    const d = {};
    for (const tips of Object.values(VIEW_TIPS)) {
      for (const tip of tips) {
        if (isTipDismissed(tip.id)) d[tip.id] = true;
      }
    }
    setDismissed(d);
    // Small delay before showing tips so DOM is ready
    const t = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(t);
  }, [view]);

  const handleDismiss = (tipId) => {
    dismissTip(tipId);
    setDismissed(prev => ({ ...prev, [tipId]: true }));
  };

  if (!mounted) return null;

  const currentView = view === "mode" ? "mode" : view === "room" ? "room" : "home";
  const tips = VIEW_TIPS[currentView] || [];
  const activeTips = tips.filter(t => !dismissed[t.id]);

  if (activeTips.length === 0) return null;

  return (
    <>
      {activeTips.map(tip => (
        <FloatingTip
          key={tip.id}
          tip={tip}
          onDismiss={() => handleDismiss(tip.id)}
        />
      ))}
      <style>{`@keyframes tipFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
}

// Reset all tips (for admin/testing)
export function resetTutorial() {
  for (const tips of Object.values(VIEW_TIPS)) {
    for (const tip of tips) {
      localStorage.removeItem(STORAGE_PREFIX + tip.id);
    }
  }
  // Also remove old onboarding flag
  localStorage.removeItem("lalasweet_tutorial_done");
  window.location.reload();
}
