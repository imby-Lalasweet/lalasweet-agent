import React, { useState } from 'react';
import { C } from '../../utils/constants';

/**
 * TutorialTip Component
 * 
 * @param {string} id - Unique ID for localStorage persistence (e.g. 'tut_home_member')
 * @param {'tutorial' | 'tip'} type - Determines styling
 * @param {string} title - Bold title text
 * @param {string} content - Description text
 */
export default function TutorialTip({ id, type = 'tutorial', title, content }) {
    const [visible, setVisible] = useState(() => !localStorage.getItem(id));

    if (!visible) return null;

    const isTip = type === 'tip';

    const dismiss = () => {
        localStorage.setItem(id, 'true');
        setVisible(false);
    };

    const style = isTip
        ? {
            bg: '#FFFBF0',
            border: '#F59E0B',
            iconBg: '#FEF3C7',
            titleColor: '#92400E',
            contentColor: '#78350F',
            btnBg: '#F59E0B',
            icon: '💡',
            label: 'TIP',
        }
        : {
            bg: '#EBF3FF',
            border: C.ps,
            iconBg: '#DBEAFE',
            titleColor: C.pd,
            contentColor: C.g700,
            btnBg: C.p,
            icon: '📖',
            label: '튜토리얼',
        };

    return (
        <div style={{
            background: style.bg,
            border: `1.5px solid ${style.border}`,
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 16,
            position: 'relative',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
        }}>
            <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: style.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
            }}>
                {style.icon}
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                        fontSize: 9, fontWeight: 800,
                        background: style.border, color: '#fff',
                        padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5,
                    }}>
                        {style.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: style.titleColor }}>{title}</span>
                </div>
                <div style={{ fontSize: 12, color: style.contentColor, lineHeight: 1.6 }}>{content}</div>
            </div>

            <button
                onClick={dismiss}
                title="다시 보지 않기"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: style.titleColor,
                    fontSize: 14,
                    opacity: 0.5,
                    padding: '2px 4px',
                    lineHeight: 1,
                }}
            >
                ✕
            </button>
        </div>
    );
}
