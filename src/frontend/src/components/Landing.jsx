import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import "../index.scss";
import { IconConnect, IconExplore, IconOwnTrade, IconSecurity, IconInstant, IconGlobal } from "./Icon";

function GlowButton({ children, onClick, style = {}, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, boxShadow: "0 0 24px 8px #3b82f6, 0 2px 12px #a21caf55" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320 }}
      className="hero-cta"
      style={{
        background: "linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: "1.18rem",
        padding: "1.1rem 2.6rem",
        fontFamily: "Inter, DM Sans, sans-serif",
        cursor: "pointer",
        boxShadow: "0 2px 16px #3b82f655",
        letterSpacing: "0.04em",
        outline: "none",
        ...style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function TiltCard({ children, style = {}, ...props }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
        borderRadius: 16,
        boxShadow: "0 4px 32px #3b82f655, 0 1.5px 0 #3b82f6",
        background: "#181a22",
        transform: `rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg) scale(1.02)`,
        transition: "transform 0.18s cubic-bezier(.4,0,.2,1)",
        ...style
      }}
      whileHover={{ scale: 1.04 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ end, duration = 2, ...props }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView) {
      let start = 0;
      const step = Math.ceil(end / (duration * 60));
      const interval = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 1000 / 60);
      return () => clearInterval(interval);
    }
  }, [inView, end, duration]);
  return <span ref={ref} {...props}>{count.toLocaleString()}</span>;
}

function FloatingIcon({ children, style = {}, ...props }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ display: 'inline-block', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default function Landing({ onGetStarted }) {
  // Parallax effect for hero
  const heroRef = useRef();
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.backgroundPosition = `center ${y * 0.3}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // List your real land images here (autofixed to match actual files)
  const landImages = [
    "land-1.jpg",
    "land-2.jpg",
    "land-3.jpg",
    "land-4.jpg",
    "land-5.jpg",
    "land-6.jpg",
    "land-7.jpg",
    "land-8.jpg",
    "land-9.jpg",
    "land-10.jpg",
    "land-11.jpg",
    "land-12.jpg"
  ];

  return (
    <div className="landing-root">
      {/* Hero Section with Parallax */}
      <section
        className="hero-bg landing-hero bg-parallax"
        ref={heroRef}
        style={{
          background: 'linear-gradient(120deg, #0a0a0a 70%, #939dadff 100%)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center 0',
          backgroundSize: 'cover',
          padding: '4rem 0',
        }}
      >
        <motion.div
          className="hero-content"
          style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h1
            className="hero-headline"
            style={{
              fontFamily: 'Inter, DM Sans, sans-serif',
              fontWeight: 800,
              fontSize: '4.6rem',
              letterSpacing: '0.05em',
              background: 'linear-gradient(290deg, #ffffff 0%, #cccccc 50%, #000000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.2rem',
              textShadow: 'none', // 🚀 remove bluish glow
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            KSHETRA 
           
          </motion.h1>
          <motion.div
            style={{ fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1rem', fontWeight: 500, color: '#f3f2f2ff', marginBottom: '0.7rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            on  ICP blockchain
          </motion.div>
          <motion.div
            style={{ fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1.3rem', color: '#A0A0A0', marginBottom: '2.2rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Securely buy, sell, and manage virtual real estate powered by blockchain technology. Build your digital empire in the metaverse.
          </motion.div>
          <motion.div
            style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlowButton onClick={onGetStarted}>Explore Marketplace</GlowButton>
            <GlowButton onClick={onGetStarted} style={{ background: 'transparent', color: '#fff', border: '1.5px solid #333', boxShadow: 'none' }}>Mint Land</GlowButton>
          </motion.div>
          {/* Floating 3D card visual */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5, type: 'spring' }}
            style={{ marginTop: 36 }}
          >
            <TiltCard style={{ width: 320, margin: '0 auto', padding: 0, background: 'linear-gradient(135deg, #23233a 80%, #3b82f6 100%)' }}>
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconExplore style={{ width: 64, height: 64 }} />
                <div style={{ fontWeight: 700, fontSize: 24, color: '#fff', marginTop: 18 }}>Discover Digital Lands</div>
                <div style={{ color: '#A0A0A0', fontSize: 16, marginTop: 8, textAlign: 'center' }}>Browse, select, and own unique parcels in the metaverse.</div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Horizontal Scroll Snap Carousel for Featured Lands */}
      <section className="landing-section landing-carousel" style={{ padding: '2.5rem 0' }}>
        <h2 className="section-header">Featured Lands</h2>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              overflowX: 'auto',
              display: 'flex',
              gap: 32,
              padding: '0 24px',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="carousel-track"
            tabIndex={0}
          >
            {/* Left spacer for centering */}
            <div style={{ minWidth: 48, pointerEvents: 'none' }} />
            {landImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ display: 'flex' }}
              >
                <TiltCard
                  tabIndex={0}
                  style={{
                    minWidth: 300,
                    maxWidth: 340,
                    scrollSnapAlign: 'center',
                    margin: '0 0',
                    background: 'linear-gradient(135deg, #23233a 80%, #3b82f6 100%)',
                    padding: 0,
                    outline: 'none',
                    border: '2px solid transparent',
                  }}
                  onFocus={e => e.currentTarget.style.border = '2px solid #3b82f6'}
                  onBlur={e => e.currentTarget.style.border = '2px solid transparent'}
                >
                  <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {img ? (
                      <img src={`/land-images/${img}`} alt={`Land ${i + 1}`} style={{ width: 180, height: 120, borderRadius: 12, objectFit: 'cover', marginBottom: 18, background: '#181a22', boxShadow: '0 2px 12px #3b82f655' }} />
                    ) : (
                      <svg width="80" height="80" fill="none"><rect width="80" height="80" rx="18" fill="#23233a"/><text x="50%" y="50%" fill="#3b82f6" fontSize="18" fontWeight="bold" textAnchor="middle" dy=".3em">No Image</text></svg>
                    )}
                    <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 6, letterSpacing: "-0.01em" }}>{`Land #${i + 1}`}</div>
                    <div style={{ color: '#A0A0A0', fontSize: 15, marginBottom: 18 }}>Prime Metaverse Parcel</div>
                    <GlowButton style={{ fontSize: 15, padding: '0.9rem 2.2rem', marginTop: 8 }}>View Details</GlowButton>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
            {/* Right spacer for centering */}
            <div style={{ minWidth: 48, pointerEvents: 'none' }} />
          </div>
          {/* Removed drag indicator for scroll-to-reveal effect */}
          <style>{`
            .carousel-track::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      </section>

      {/* How It Works */}
      <motion.section className="landing-section landing-steps" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <h2 className="section-header">How It Works</h2>
        <div className="steps-grid">
          {[{
            icon: <IconConnect />, title: "Connect", desc: "Sign in with Internet Identity and access the registry." },
            { icon: <IconExplore />, title: "Explore", desc: "Browse, discover, and select virtual land parcels." },
            { icon: <IconOwnTrade />, title: "Own & Trade", desc: "Securely mint, buy, and sell land on-chain." }
          ].map((step, i) => (
            <TiltCard key={i} style={{ padding: 32, minWidth: 220, margin: '0 auto' }}>
              <FloatingIcon style={{ marginBottom: 8 }}>{step.icon}</FloatingIcon>
              <div className="step-title" style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginTop: 18 }}>{step.title}</div>
              <div className="step-desc" style={{ color: '#A0A0A0', fontSize: 15, marginTop: 8 }}>{step.desc}</div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* Market/Trust Section with Animated Counters */}
      <motion.section className="landing-section landing-stats" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <h2 className="section-header">Trusted by the Web3 Community</h2>
        <div className="stats-grid">
          <TiltCard style={{ padding: 32, minWidth: 180, margin: '0 auto' }}>
            <div className="stat-value"><AnimatedCounter end={12000} duration={2.5} />+</div>
            <div className="stat-label">Parcels Registered</div>
          </TiltCard>
          <TiltCard style={{ padding: 32, minWidth: 180, margin: '0 auto' }}>
            <div className="stat-value"><AnimatedCounter end={4800} duration={2.5} /></div>
            <div className="stat-label">Active Users</div>
          </TiltCard>
          <TiltCard style={{ padding: 32, minWidth: 180, margin: '0 auto' }}>
            <div className="stat-value">$<AnimatedCounter end={2100000} duration={2.5} /></div>
            <div className="stat-label">Total Volume</div>
          </TiltCard>
        </div>
      </motion.section>

      {/* Features/Benefits with Floating Icons */}
      <motion.section className="landing-section landing-features" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <h2 className="section-header">Why Choose Us?</h2>
        <div className="features-grid">
          {[{
            icon: <IconSecurity />, title: "Blockchain Security", desc: "All transactions are secured and verified on the ICP blockchain." },
            { icon: <IconInstant />, title: "Instant Settlement", desc: "Buy, sell, and transfer land instantly with no middlemen." },
            { icon: <IconGlobal />, title: "Global Access", desc: "Participate from anywhere, anytime—no borders, no limits." }
          ].map((feature, i) => (
            <TiltCard key={i} style={{ padding: 32, minWidth: 220, margin: '0 auto' }}>
              <FloatingIcon style={{ marginBottom: 8 }}>{feature.icon}</FloatingIcon>
              <div className="feature-title" style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginTop: 18 }}>{feature.title}</div>
              <div className="feature-desc" style={{ color: '#A0A0A0', fontSize: 15, marginTop: 8 }}>{feature.desc}</div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="landing-section landing-cta">
        <GlowButton onClick={onGetStarted}>Explore Virtual Land</GlowButton>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} KSHETRA  A Virtual Land Registry Project</span>
        <span>Built on ICP Blockchain</span>
      </footer>
    </div>
  );
} 