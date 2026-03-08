import React, { useState } from 'react';
import { C } from '../../utils/constants';

export function Md({ t }) {
    if (!t) return null;
    return (
        <div>{t.split("\n").map((l, i) => {
            let h = l.replace(/\*\*\[(.+?)\]\*\*/g, `<span style="color:${C.p};font-weight:700">[$1]</span>`).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*\s/g, "• ");
            if (l.startsWith("━")) return <hr key={i} style={{ border: "none", borderTop: `2px solid ${C.g200}`, margin: "10px 0" }} />;
            if (l.startsWith("■")) return <h3 key={i} style={{ color: C.p, marginTop: 14, marginBottom: 6, fontSize: 13.5 }} dangerouslySetInnerHTML={{ __html: h }} />;
            if (/^[🎯📨📅☕📊]/.test(l)) return <h2 key={i} style={{ color: C.g800, marginTop: 12, marginBottom: 6, fontSize: 14.5 }} dangerouslySetInnerHTML={{ __html: h }} />;
            if (l.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: `1px solid ${C.g200}`, margin: "6px 0" }} />;
            if (!l.trim()) return <br key={i} />;
            return <p key={i} style={{ margin: "2px 0", lineHeight: 1.7, color: C.g700, fontSize: 13 }} dangerouslySetInnerHTML={{ __html: h }} />;
        })}</div>
    );
}

export function Shell({ children, title, onBack, backLabel }) {
    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.g800, fontFamily: "'Pretendard',-apple-system,sans-serif" }}>
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 40px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: C.g400, fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}>← {backLabel || "뒤로"}</button>
                {title && <div style={{ fontSize: 20, fontWeight: 700, color: C.g800, marginBottom: 20 }}>{title}</div>}
                <div style={{ background: C.w, borderRadius: 18, border: `1px solid ${C.g200}`, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>{children}</div>
            </div>
        </div>
    );
}

export function GS({ guide }) {
    return guide
        ? (<div style={{ background: C.pl, borderRadius: 10, padding: "10px 14px", marginBottom: 16, border: `1px solid ${C.ps}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><span style={{ color: C.p, fontSize: 12, fontWeight: 600 }}>📄 레벨 가이드 연동됨</span><div style={{ color: C.g400, fontSize: 11, marginTop: 2 }}>{guide.name}</div></div><span style={{ color: C.green, fontSize: 16 }}>✓</span></div>)
        : (<div style={{ background: C.goldL, borderRadius: 10, padding: "10px 14px", marginBottom: 16, border: "1px solid rgba(232,167,77,0.25)" }}>
            <span style={{ color: C.gold, fontSize: 12 }}>⚠️ 레벨 가이드 미등록 — ⚙️ 관리자에서 업로드</span></div>);
}

export function CheckBtn({ checked, onClick, children }) {
    return (
        <button onClick={onClick} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${checked ? C.ps : C.g200}`, background: checked ? C.pl : C.w, color: checked ? C.p : C.g600, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, border: checked ? "none" : `2px solid ${C.g300}`, background: checked ? C.p : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>{checked ? "✓" : ""}</span>
            {children}
        </button>
    );
}

export function StepTutorial({ title, tips }) {
    const [open, setOpen] = useState(true);
    if (!open) return (
        <button onClick={() => setOpen(true)} style={{ width: "100%", marginBottom: 14, padding: "8px 14px", borderRadius: 10, border: `1px dashed ${C.ps}`, background: C.pl, color: C.p, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
            <span>💡</span><span style={{ flex: 1 }}>{title}</span><span style={{ color: C.g400, fontWeight: 400 }}>도움말 보기</span>
        </button>
    );
    return (
        <div style={{ marginBottom: 16, background: C.pl, border: `1px solid ${C.ps}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.pd }}>💡 {title}</div>
                <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: C.g400, fontSize: 12, cursor: "pointer", padding: "0 2px" }}>닫기 ✕</button>
            </div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
                {tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: 12, color: C.pd, lineHeight: 1.7, marginBottom: 2 }}>{tip}</li>
                ))}
            </ul>
        </div>
    );
}

export function TabToggle({ value, onChange, options }) {
    return (
        <div style={{ display: "flex", gap: 4, background: C.g100, borderRadius: 10, padding: 4, marginBottom: 16 }}>
            {options.map(o => (
                <button key={o.k} onClick={() => onChange(o.k)} style={{
                    flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    background: value === o.k ? C.w : "transparent", color: value === o.k ? C.g800 : C.g400,
                    boxShadow: value === o.k ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s"
                }}>
                    {o.l}
                </button>
            ))}
        </div>
    );
}
