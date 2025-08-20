import React, { useState, useRef, useEffect } from "react";
// import ProfileMenu from "./ProfileMenu";
import { motion, AnimatePresence } from "framer-motion";
// Remove import of ThreeDModernProfileAvatar
import User3DIcon from "./User3DIcon";

function Navbar({
  currentView,
  onNavigate,
  isAuthenticated,
  principal,
  onLogout,
  onLogin,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click-away logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <motion.nav
      className="navbar navbar-flat"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        background: "var(--background-dark)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "var(--shadow-lg)",
        padding: "var(--spacing-md) var(--spacing-xl)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1.5px solid rgba(255,255,255,0.08)",
        minHeight: 72
      }}
    > 
      <a
        href="#"
        className="navbar-brand"
        onClick={() => onNavigate("mint")}
        style={{
          fontWeight: 800,
          fontFamily: 'Inter, DM Sans, sans-serif',
          fontSize: '1.7rem',
          letterSpacing: '0.04em',
          textDecoration: 'none',
          marginRight: 40,

          // ✅ adjusted gradient
          background: 'linear-gradient(to right, #333, #aaa, #fff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        KSHETRA
      </a>
      <div className="navbar-links" style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
        {[{ label: "Mint Land", view: "mint" }, { label: "Marketplace", view: "market" }, { label: "My Lands", view: "my" }].map(({ label, view }) => (
          <motion.button
            key={view}
            className={`nav-link-flat${currentView === view ? " active" : ""}`}
            onClick={() => onNavigate(view)}
            whileHover={{ scale: 1.07, boxShadow: currentView === view ? "0 0 0 4px #3b82f6aa" : "0 2px 8px #3b82f655" }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'Inter, DM Sans, sans-serif',
              fontWeight: 700,
              fontSize: '1.13rem',
              color: currentView === view ? '#fff' : '#A0A0A0',
              background: currentView === view ? 'var(--accent-blue)' : 'transparent',
              border: 'none',
              borderRadius: '999px',
              padding: '0.7rem 1.7rem',
              margin: '0 0.5rem',
              outline: 'none',
              boxShadow: currentView === view ? '0 2px 8px #3b82f655' : 'none',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              borderBottom: currentView !== view ? '2px solid transparent' : 'none',
            }}
            tabIndex={0}
            aria-current={currentView === view ? 'page' : undefined}
          >
            {label}
          </motion.button>
        ))}
      </div>
      <div>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                borderRadius: "50%",
                outline: "none",
                boxShadow: dropdownOpen ? "0 0 0 4px #3b82f6aa" : "none",
                transition: "box-shadow 0.18s"
              }}
              aria-label="Open profile menu"
            >
              <User3DIcon size={40} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    position: "absolute",
                    top: 48,
                    right: 0,
                    background: "#181a22",
                    borderRadius: 16,
                    boxShadow: "0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6",
                    border: "2px solid #3b82f6",
                    padding: "2rem 1.8rem 1.5rem 1.8rem",
                    minWidth: 260,
                    zIndex: 1200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontFamily: "Inter, DM Sans, var(--font-family-sans)"
                  }}
                >
                  {/* Avatar with blue glow */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    boxShadow: "0 0 0 6px #3b82f655, 0 4px 24px #3b82f655",
                    borderRadius: "50%",
                    background: "#23233a",
                    padding: 6
                  }}>
                    <User3DIcon size={48} />
                  </div>
                  {/* Profile heading */}
                  <div style={{
                    fontWeight: 800,
                    color: "#3b82f6",
                    fontSize: "1.18rem",
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                    textAlign: "center"
                  }}>Profile</div>
                  {/* Principal ID pill */}
                  <span style={{
                    background: "#3b82f6",
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "0.22rem 1.1rem",
                    fontWeight: 600,
                    fontFamily: "DM Mono, monospace",
                    fontSize: "1.04rem",
                    letterSpacing: "0.03em",
                    display: "inline-block",
                    marginBottom: 18,
                    boxShadow: "0 0 8px #3b82f655"
                  }}>
                    {principal ? principal.slice(0, 8) + "..." + principal.slice(-4) : "-"}
                  </span>
                  {/* Logout button */}
                  <button
                    onClick={onLogout}
                    style={{
                      borderRadius: 999,
                      padding: "13px 0",
                      border: "none",
                      background: "linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      fontFamily: "Inter, DM Sans, var(--font-family-sans)",
                      fontSize: "1.09rem",
                      marginTop: 8,
                      boxShadow: "0 2px 12px #3b82f655",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      width: "100%",
                      outline: "none",
                      transition: "box-shadow 0.2s, background 0.2s, transform 0.13s"
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #3b82f6, 0 2px 12px #3b82f655'}
                    onBlur={e => e.currentTarget.style.boxShadow = '0 2px 12px #3b82f655'}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="nav-link-flat login-btn"
            style={{
              borderRadius: '999px',
              padding: '0.7rem 1.6rem',
              border: 'none',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'Inter, DM Sans, sans-serif',
              fontSize: '1.13rem',
              marginLeft: 16,
              boxShadow: '0 2px 8px #3b82f655',
              cursor: 'pointer',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
            }}
          >
            Login
          </button>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
