export const runtime = 'edge';
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";

/* ── Markdown-lite: bold, bullets ── */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) => {
      if (p.startsWith("**") && p.endsWith("**")) {
        return <strong key={j} style={{ color: "#e2d5ff", fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
      }
      return p;
    });

    const isHeader = line.match(/^#+\s/);
    const isBullet = line.match(/^[-*•]\s/);

    if (isHeader) {
      return (
        <div key={i} style={{ fontWeight: 800, fontSize: "16px", color: "#f0ecff", margin: "20px 0 8px" }}>
          {rendered}
        </div>
      );
    }
    if (isBullet) {
      return (
        <div key={i} style={{ paddingLeft: "16px", marginBottom: "4px", display: "flex", gap: "8px" }}>
          <span style={{ color: "#c084fc", flexShrink: 0 }}>•</span>
          <span>{rendered}</span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: "10px" }} />;
    return <div key={i} style={{ marginBottom: "4px" }}>{rendered}</div>;
  });
}

/* ── Tarot deck ── */
const TAROT_CARDS = [
  "0 바보", "I 마법사", "II 여사제", "III 여황제", "IV 황제",
  "V 교황", "VI 연인", "VII 전차", "VIII 힘", "IX 은둔자",
  "X 운명의 수레바퀴", "XI 정의", "XII 매달린 남자", "XIII 죽음",
  "XIV 절제", "XV 악마", "XVI 탑", "XVII 별", "XVIII 달",
  "XIX 태양", "XX 심판", "XXI 세계",
];

function TarotSelector({ onSelect }: { onSelect: (cards: string[]) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const shuffled = useRef([...TAROT_CARDS].sort(() => Math.random() - 0.5));

  function toggle(i: number) {
    setSelected(prev => {
      if (prev.includes(i)) return prev.filter(x => x !== i);
      if (prev.length >= 3) return prev;
      const next = [...prev, i];
      if (next.length === 3) onSelect(next.map(idx => shuffled.current[idx]));
      return next;
    });
  }

  return (
    <div>
      <p style={{ fontSize: "13px", color: "#a89bc4", marginBottom: "14px", textAlign: "center" }}>
        카드를 3장 선택하세요 ({selected.length}/3)
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
        gap: "8px",
        maxHeight: "260px",
        overflowY: "auto",
        paddingRight: "4px",
      }}>
        {shuffled.current.map((card, i) => {
          const sel = selected.includes(i);
          const pos = selected.indexOf(i);
          const labels = ["과거", "현재", "미래"];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                background: sel
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${sel ? "transparent" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "10px",
                padding: "10px 6px",
                cursor: "pointer",
                color: sel ? "#fff" : "#a89bc4",
                fontSize: "11px",
                fontFamily: "inherit",
                textAlign: "center",
                transition: "all 0.2s",
                transform: sel ? "scale(1.05)" : "scale(1)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>🃏</div>
              {sel && <div style={{ fontSize: "9px", color: "#ffd700", marginBottom: "2px", fontWeight: 700 }}>{labels[pos]}</div>}
              <div style={{ lineHeight: 1.3 }}>{card}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Image Upload ── */
function ImageUpload({ onChange, label, hint }: { onChange: (base64: string, mime: string) => void; label: string; hint?: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(",")[1];
      onChange(base64, file.type);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          border: "2px dashed rgba(124,58,237,0.4)",
          borderRadius: "14px",
          padding: "24px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(124,58,237,0.06)",
          transition: "all 0.2s",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" style={{ maxHeight: "160px", borderRadius: "10px", objectFit: "contain" }} />
        ) : (
          <>
            <div style={{ fontSize: "32px" }}>📸</div>
            <div style={{ fontSize: "14px", color: "#c084fc", fontWeight: 600 }}>{label}</div>
            {hint && <div style={{ fontSize: "12px", color: "#a89bc4" }}>{hint}</div>}
            <div style={{ fontSize: "12px", color: "#a89bc4" }}>클릭 또는 드래그앤드롭</div>
          </>
        )}
      </div>
      {preview && (
        <button
          onClick={() => { setPreview(null); onChange("", ""); }}
          style={{ marginTop: "8px", fontSize: "12px", color: "#a89bc4", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          × 이미지 제거
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

/* ── Main Page ── */
export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const cat = CATEGORIES[categoryId];

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [imageBase64, setImageBase64] = useState("");
  const [imageMime, setImageMime] = useState("");
  const [tarotCards, setTarotCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const scrollToResult = useCallback(() => {
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  useEffect(() => {
    setInputs({});
    setResult("");
    setDone(false);
    setImageBase64("");
    setTarotCards([]);
  }, [categoryId]);

  if (!cat) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
        <h1 style={{ color: "#f0ecff" }}>페이지를 찾을 수 없습니다</h1>
        <Link href="/" style={{ color: "#c084fc" }}>← 홈으로</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setDone(false);

    const body: Record<string, unknown> = { category: categoryId, inputs };
    if (cat.special === "tarot" && tarotCards.length > 0) {
      body.inputs = { ...inputs, selectedCards: tarotCards.join(", ") };
    }
    if (imageBase64) { body.imageBase64 = imageBase64; body.imageMime = imageMime; }

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("API 오류");
      if (!res.body) throw new Error("응답 없음");

      setLoading(false);
      scrollToResult();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { setDone(true); break; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) setResult(prev => prev + parsed.text);
          } catch { /* ignore */ }
        }
      }
      setDone(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setResult("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setDone(true);
    }
  }

  const isImageCat = categoryId === "gwansang" || categoryId === "palm";
  const isCookie = cat.special === "cookie";

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,8,24,0.75)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
          ← <span className="gradient-text" style={{ fontWeight: 800 }}>AI 운세</span>
        </Link>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {CATEGORY_LIST.filter(c => c.id !== categoryId).slice(0, 4).map(c => (
            <Link key={c.id} href={`/${c.id}`} style={{
              padding: "5px 12px", borderRadius: "16px", fontSize: "12px",
              color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none", background: "rgba(255,255,255,0.03)", whiteSpace: "nowrap",
            }}>
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Category Hero */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            fontSize: "38px",
            marginBottom: "16px",
            background: `${cat.glowColor}20`,
            border: `1px solid ${cat.glowColor}40`,
          }}>
            {cat.emoji}
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 5vw, 38px)",
            fontWeight: 900,
            color: "#f0ecff",
            letterSpacing: "-1px",
            marginBottom: "10px",
          }}>
            {cat.name}
          </h1>
          <p style={{ fontSize: "15px", color: "#a89bc4", lineHeight: 1.75, maxWidth: "500px", margin: "0 auto" }}>
            {cat.longDesc}
          </p>
        </div>

        {/* Form */}
        <div className="glass" style={{ borderRadius: "24px", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f0ecff", marginBottom: "24px" }}>
            정보 입력
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {cat.fields.map(field => (
                <div key={field.id}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#c4b5fd", marginBottom: "7px" }}>
                    {field.label}
                    {field.required && <span style={{ color: "#ec4899", marginLeft: "4px" }}>*</span>}
                  </label>

                  {field.type === "textarea" && (
                    <textarea
                      className="form-input"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                      required={field.required}
                      rows={5}
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      className="form-input"
                      value={inputs[field.id] || ""}
                      onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                      required={field.required}
                    >
                      <option value="">선택하세요</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}

                  {(field.type === "text" || field.type === "number") && (
                    <input
                      type={field.type}
                      className="form-input"
                      placeholder={field.placeholder}
                      value={inputs[field.id] || ""}
                      onChange={e => setInputs(p => ({ ...p, [field.id]: e.target.value }))}
                      required={field.required}
                    />
                  )}

                  {field.type === "image" && isImageCat && (
                    <ImageUpload
                      label={field.label}
                      hint={field.hint}
                      onChange={(b64, mime) => { setImageBase64(b64); setImageMime(mime); }}
                    />
                  )}

                  {field.hint && field.type !== "image" && (
                    <p style={{ fontSize: "11.5px", color: "#a89bc4", marginTop: "5px" }}>💡 {field.hint}</p>
                  )}
                </div>
              ))}

              {/* Tarot card selector */}
              {cat.special === "tarot" && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#c4b5fd", marginBottom: "7px" }}>
                    타로카드 선택 (선택사항)
                  </label>
                  <TarotSelector onSelect={setTarotCards} />
                  {tarotCards.length > 0 && (
                    <div style={{ marginTop: "10px", padding: "12px 16px", background: "rgba(124,58,237,0.12)", borderRadius: "10px", fontSize: "13px", color: "#c084fc" }}>
                      선택한 카드: {tarotCards.join(" → ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn"
              style={{ width: "100%", marginTop: "28px", fontSize: "16px", padding: "15px" }}
            >
              {loading ? (
                <span className="loading-dots">
                  <span /><span /><span />
                </span>
              ) : (
                isCookie ? "🍪 포춘쿠키 열기!" : `${cat.emoji} AI 분석 시작`
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {(loading || result) && (
          <div ref={resultRef} className="glass fade-in-up" style={{ borderRadius: "24px", padding: "32px", borderColor: `${cat.glowColor}30` }}>
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{
                width: "36px", height: "36px",
                borderRadius: "10px",
                background: `${cat.glowColor}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>{cat.emoji}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f0ecff" }}>AI {cat.name} 분석 결과</div>
                <div style={{ fontSize: "12px", color: "#a89bc4" }}>Powered by Claude AI</div>
              </div>
              {!done && (
                <div className="loading-dots" style={{ marginLeft: "auto" }}>
                  <span /><span /><span />
                </div>
              )}
            </div>

            {loading && !result && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div className="loading-dots" style={{ marginBottom: "16px" }}>
                  <span /><span /><span />
                </div>
                <p style={{ color: "#a89bc4", fontSize: "14px" }}>AI가 분석하고 있어요...</p>
              </div>
            )}

            {result && (
              <div className={`result-prose ${!done ? "typing-cursor" : ""}`}
                style={{ lineHeight: 1.9, fontSize: "15px", color: "#e8e3f5" }}>
                {renderMarkdown(result)}
              </div>
            )}

            {done && result && (
              <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { setResult(""); setDone(false); setInputs({}); setImageBase64(""); setTarotCards([]); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="glow-btn"
                  style={{ fontSize: "14px", padding: "10px 20px", flex: 1, minWidth: "140px" }}
                >
                  🔄 다시 분석
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(result); }}
                  style={{
                    flex: 1, minWidth: "140px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "#f0ecff",
                    fontSize: "14px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  📋 결과 복사
                </button>
              </div>
            )}
          </div>
        )}

        {/* Other categories */}
        <div style={{ marginTop: "48px" }}>
          <p style={{ fontSize: "13px", color: "#a89bc4", marginBottom: "14px", textAlign: "center" }}>다른 운세도 확인해보세요</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {CATEGORY_LIST.filter(c => c.id !== categoryId).map(c => (
              <Link key={c.id} href={`/${c.id}`} style={{
                padding: "8px 16px", borderRadius: "20px", fontSize: "13px",
                color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none", background: "rgba(255,255,255,0.04)",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
