import { useState } from "react";
import { generateContent } from "../services/aiService";

const CONTENT_TYPES = [
  { value: "general", label: "일반 콘텐츠" },
  { value: "blog", label: "블로그 글" },
  { value: "email", label: "비즈니스 이메일" },
  { value: "social", label: "소셜 미디어" },
];

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("general");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const content = await generateContent(prompt, contentType);
      setResult(content);
    } catch (err) {
      setError(err.message || "콘텐츠 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI 콘텐츠 생성기</h1>
      <p style={styles.subtitle}>
        원하는 콘텐츠 유형을 선택하고 주제를 입력하세요
      </p>

      <div style={styles.typeSelector}>
        {CONTENT_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setContentType(type.value)}
            style={{
              ...styles.typeBtn,
              ...(contentType === type.value ? styles.typeBtnActive : {}),
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      <textarea
        style={styles.textarea}
        placeholder="예: '재택근무의 장단점에 대한 글을 작성해주세요'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{
          ...styles.generateBtn,
          opacity: loading || !prompt.trim() ? 0.6 : 1,
        }}
      >
        {loading ? "생성 중..." : "콘텐츠 생성"}
      </button>

      {error && <div style={styles.error}>{error}</div>}

      {result && (
        <div style={styles.resultContainer}>
          <div style={styles.resultHeader}>
            <h3 style={styles.resultTitle}>생성된 콘텐츠</h3>
            <button onClick={handleCopy} style={styles.copyBtn}>
              복사
            </button>
          </div>
          <div style={styles.result}>{result}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Pretendard', -apple-system, sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 28,
  },
  typeSelector: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  typeBtn: {
    padding: "8px 18px",
    border: "1px solid #ddd",
    borderRadius: 20,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  },
  typeBtnActive: {
    background: "#4f46e5",
    color: "#fff",
    borderColor: "#4f46e5",
  },
  textarea: {
    width: "100%",
    padding: 14,
    border: "1px solid #ddd",
    borderRadius: 10,
    fontSize: 15,
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 16,
  },
  generateBtn: {
    width: "100%",
    padding: "14px 0",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 16,
    padding: 12,
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: 8,
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 24,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  resultTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
  },
  copyBtn: {
    padding: "6px 14px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  result: {
    padding: 16,
    fontSize: 15,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    color: "#333",
  },
};
