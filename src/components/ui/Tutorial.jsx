import React, { useState, useEffect } from 'react';
import { C } from '../../utils/constants';

// ─── Tip Definitions ─────────────────────────────────────────

const TIPS = {
  "new-member": "여기서 새 구성원을 추가하고 이니셔티브를 설정하세요",
  "room-list": "구성원을 클릭하면 히스토리와 상세 관리 화면으로 이동해요",
  "quick-actions": "구성원 선택 없이 바로 모드를 실행할 수 있어요",
  "admin-btn": "레벨 가이드, 일하는 방식 등 관리 설정은 여기서!",
  "mode-grid": "4가지 AI 모드 중 원하는 것을 선택해 실행하세요",
  "fixed-initiative": "고정 이니셔티브는 다른 모드에서 자동 참조돼요",
  "history-list": "이전 생성 결과가 여기에 저장됩니다",
  "guide-status": "레벨 가이드가 연동되면 AI가 레벨별 기준을 참고해요",
  "step-progress": "현재 입력 단계를 보여줍니다",
};

const STORAGE_PREFIX = "lalasweet_tip_dismissed_";

function isTipDismissed(tipId) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + tipId) === "1";
  } catch { return false; }
}

function dismissTipStorage(tipId) {
  try {
    localStorage.setItem(STORAGE_PREFIX + tipId, "1");
  } catch {}
}

// ─── Inline Tip Component (used directly in views) ──────────

export function TutorialTip({ id }) {
  const [dismissed, setDismissed] = useState(() => isTipDismissed(id));

  const text = TIPS[id];
  if (!text || dismissed) return null;

  return (
    <div
      onClick={() => { dismissTipStorage(id); setDismissed(true); }}
      style={{
        background: C.p,
        color: "#fff",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.5,
        boxShadow: "0 2px 12px rgba(36,120,255,0.25)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
        marginBottom: 6,
        animation: "tipFadeIn 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
      <span style={{ flex: 1 }}>{text}</span>
      <span style={{ flexShrink: 0, opacity: 0.6, fontSize: 13, lineHeight: 1 }}>✕</span>
    </div>
  );
}

// ─── Main Tutorial Component (provides animation keyframes) ──

export default function Tutorial() {
  return (
    <style>{`@keyframes tipFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
  );
}

// ─── Reset all tips (for admin/testing) ──────────────────────

export function resetTutorial() {
  for (const id of Object.keys(TIPS)) {
    localStorage.removeItem(STORAGE_PREFIX + id);
  }
  localStorage.removeItem("lalasweet_tutorial_done");
  window.location.reload();
}
