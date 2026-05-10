import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8,8,24,0.75)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>✨</span>
          <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}
            className="gradient-text">AI 운세</span>
        </div>
        <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {CATEGORY_LIST.slice(0, 5).map(cat => (
            <Link key={cat.id} href={`/${cat.id}`} style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.04)',
              whiteSpace: 'nowrap',
            }}>
              {cat.emoji} {cat.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '13px',
          color: '#c084fc',
          marginBottom: '28px',
          fontWeight: 500,
        }}>
          <span>🤖</span>
          <span>Claude AI 기반 · 완전 무료</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 62px)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '20px',
          letterSpacing: '-1.5px',
        }}>
          <span className="gradient-text-anim">AI가 읽어주는</span>
          <br />
          <span style={{ color: '#f0ecff' }}>나의 운명</span>
        </h1>

        <p style={{
          fontSize: '17px',
          color: '#a89bc4',
          lineHeight: 1.85,
          marginBottom: '40px',
        }}>
          사주 · 타로 · 꿈해몽 · 관상 · 점성술까지<br />
          AI가 10가지 방식으로 당신의 운명을 분석합니다
        </p>

        <Link href="/fortune" style={{ textDecoration: 'none' }}>
          <button className="glow-btn" style={{ fontSize: '17px', padding: '16px 40px' }}>
            🔮 지금 바로 운세 보기
          </button>
        </Link>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          marginTop: '52px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { num: '10', label: '운세 카테고리' },
            { num: 'AI', label: 'Claude 최신 모델' },
            { num: '무료', label: '완전 무료' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#c084fc' }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: '#a89bc4', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px',
          color: '#a89bc4',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}>
          카테고리
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '14px',
        }}>
          {CATEGORY_LIST.map((cat, i) => (
            <Link key={cat.id} href={`/${cat.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="glass category-card"
                style={{
                  padding: '26px 20px 22px',
                  borderRadius: '20px',
                  borderColor: `${cat.glowColor}22`,
                  animationDelay: `${i * 0.06}s`,
                  animation: 'fadeInUp 0.5s ease both',
                  height: '100%',
                }}
              >
                <div style={{
                  height: '2px',
                  background: `linear-gradient(90deg, ${cat.glowColor}, transparent)`,
                  borderRadius: '2px',
                  marginBottom: '18px',
                }} />

                <div style={{ fontSize: '34px', marginBottom: '10px' }}>{cat.emoji}</div>

                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#f0ecff',
                  marginBottom: '7px',
                  letterSpacing: '-0.3px',
                }}>
                  {cat.name}
                </h3>

                <p style={{ fontSize: '12.5px', color: '#a89bc4', lineHeight: 1.65 }}>
                  {cat.description}
                </p>

                <div style={{
                  marginTop: '14px',
                  fontSize: '12.5px',
                  color: cat.glowColor,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  분석 시작 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section style={{
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '60px 24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '21px',
            fontWeight: 800,
            marginBottom: '36px',
            color: '#f0ecff',
          }}>
            왜 AI 운세인가요?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { icon: '🤖', title: '최신 AI 모델', desc: 'Anthropic Claude AI가 동서양 운명학 지식을 바탕으로 분석합니다.' },
              { icon: '⚡', title: '실시간 분석', desc: '입력 즉시 AI가 스트리밍으로 결과를 생성합니다.' },
              { icon: '🔒', title: '개인정보 보호', desc: '입력 정보는 분석 후 저장되지 않습니다. 안심하세요.' },
              { icon: '🎯', title: '전문 특화', desc: '10가지 카테고리별 전문 프롬프트로 정밀 분석을 제공합니다.' },
            ].map(f => (
              <div key={f.title} className="glass" style={{ padding: '22px', borderRadius: '16px' }}>
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '7px', color: '#f0ecff' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#a89bc4', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ marginBottom: '12px', lineHeight: 2.2 }}>
          {CATEGORY_LIST.map((cat, i) => (
            <span key={cat.id}>
              <Link href={`/${cat.id}`} style={{ color: '#a89bc4', textDecoration: 'none', fontSize: '13px' }}>
                {cat.emoji} {cat.name}
              </Link>
              {i < CATEGORY_LIST.length - 1 && <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.15)' }}>·</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          © 2025 AI 운세 · Powered by Claude AI · 운세는 참고용이며 실제 결과를 보장하지 않습니다.
        </div>
      </footer>
    </main>
  );
}
