import React, { useState } from 'react';
import { C, inp } from '../../utils/constants';

export default function LoginView({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isNew, setIsNew] = useState(false);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('이름과 비밀번호를 모두 입력해주세요');
            return;
        }
        setLoading(true);
        setError('');
        setIsNew(false);
        try {
            const result = await onLogin(username.trim(), password);
            if (!result.success) {
                setError(result.error);
            }
            if (result.isNew) {
                setIsNew(true);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", background: `linear-gradient(135deg, ${C.bg} 0%, #E8EEFF 100%)`,
            fontFamily: "'Pretendard',-apple-system,sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
            <div style={{
                width: "100%", maxWidth: 400, background: C.w,
                borderRadius: 24, padding: "40px 32px", boxShadow: "0 8px 32px rgba(99,102,241,0.10)"
            }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: C.p, marginBottom: 4 }}>Lalasweet</div>
                    <div style={{ fontSize: 13, color: C.g400 }}>가치 기반 성과관리 파트너</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", marginBottom: 6, color: C.g500, fontSize: 12, fontWeight: 600 }}>👤 이름</label>
                        <input
                            style={inp}
                            placeholder="이름을 입력하세요"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 6, color: C.g500, fontSize: 12, fontWeight: 600 }}>🔒 비밀번호</label>
                        <input
                            type="password"
                            style={inp}
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                            padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#DC2626", fontWeight: 600
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {isNew && (
                        <div style={{
                            background: C.pl, border: `1px solid ${C.ps}`, borderRadius: 10,
                            padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.p, fontWeight: 600
                        }}>
                            🎉 새 계정이 생성되었습니다! 로그인됩니다...
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                            background: loading ? C.g300 : `linear-gradient(135deg, ${C.p}, #818CF8)`,
                            color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {loading ? "로그인 중..." : "로그인 / 가입"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: C.g300 }}>
                    처음 로그인하면 자동으로 계정이 생성됩니다
                </div>
            </div>
        </div>
    );
}
