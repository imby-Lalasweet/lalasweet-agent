import React, { useState, useEffect } from 'react';
import { C, inp } from '../../utils/constants';
import { signInWithGoogle } from '../../services/supabase';

export default function LoginView({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        // Parse hash for Supabase OAuth errors
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
            const params = new URLSearchParams(hash.replace('#', '?'));
            const errorDesc = params.get('error_description');
            if (errorDesc) {
                setError(`[구글 로그인 실패] ${errorDesc.replace(/\+/g, ' ')}`);
                window.location.hash = ''; // Clear error hash
            }
        }
    }, []);

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

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message || '구글 로그인 중 오류가 발생했습니다');
            setGoogleLoading(false);
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
                        disabled={loading || googleLoading}
                        style={{
                            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                            background: (loading || googleLoading) ? C.g300 : `linear-gradient(135deg, ${C.p}, #818CF8)`,
                            color: "#fff", fontSize: 15, fontWeight: 700, cursor: (loading || googleLoading) ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {loading ? "로그인 중..." : "일반 로그인 / 가입"}
                    </button>

                    <div style={{ textAlign: "center", margin: "20px 0", position: "relative" }}>
                        <div style={{ borderTop: `1px solid ${C.g200}`, width: "100%", position: "absolute", top: "50%", transform: "translateY(-50%)" }} />
                        <span style={{ background: C.w, padding: "0 10px", fontSize: 12, color: C.g400, position: "relative", zIndex: 1, fontWeight: 600 }}>또는</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        style={{
                            width: "100%", padding: "14px 0", borderRadius: 12, border: `1px solid ${C.g200}`,
                            background: "#fff",
                            color: C.g700, fontSize: 15, fontWeight: 700, cursor: (loading || googleLoading) ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {googleLoading ? "구글로 연결 중..." : "Google로 계속하기"}
                    </button>

                </form>

                <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: C.g300 }}>
                    처음 로그인하면 자동으로 계정이 생성됩니다
                </div>
            </div>
        </div>
    );
}

