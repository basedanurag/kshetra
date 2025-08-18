import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";
import { animateOnScroll } from "../animations/gsapScroll";
import Input from "./ui/Input";
import Dropdown from "./ui/Dropdown";
import Alert from "./ui/Alert";

function OwnershipTimeline({ lands }) {
  if (!lands || lands.length === 0) return null;
  return (
    <div className="ownership-timeline card">
      <h3 className="section-header">Ownership Timeline</h3>
      <ul className="timeline-list">
        {lands.map((land) => (
          <li key={land.id.toString()} className="timeline-item">
            <span className="timeline-dot" />
            <span className="timeline-title">
              {land.name || `Land #${land.id}`}
            </span>
            <span className="timeline-meta">ID: {land.id.toString()}</span>
            <span className="timeline-meta">Minted</span>
            {/* Add more blockchain events here if available */}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustIndicators() {
  return (
    <div className="trust-indicators card">
      <h3 className="section-header">Trust & Blockchain Proof</h3>
      <div className="trust-badges">
        <span className="trust-badge verified">Verified Blockchain</span>
        <span className="trust-badge audit">Smart Contract Audited</span>
        <span className="trust-badge compliance">Compliant</span>
      </div>
    </div>
  );
}

function MyLands({ principal, backend }) {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const PLACEHOLDER_IMG = "/land-images/land-1.jpg";

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true);
      try {
        const data = await backend.get_my_land();
        setLands(data);
      } catch (error) {
        console.error("Failed to fetch lands:", error);
        setLands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, [backend]);

  useEffect(() => {
    // GSAP scroll-triggered animation for section title
    animateOnScroll(".mylands-title", {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    // GSAP for card grid
    animateOnScroll(
      ".mylands-card",
      {
        from: { opacity: 0, scale: 0.92, y: 40 },
        to: {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        },
      },
      { start: "top 85%" }
    );
  }, [loading, lands.length]);

  const toBase64 = (vec) => {
    if (!vec || vec.length === 0) {
      return "";
    }
    const binary = new Uint8Array(vec).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return `data:image/png;base64,${btoa(binary)}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "clamp(400px, 80vw, 1400px)",
          maxWidth: "95vw",
        }}
      >
        <motion.h2
          className="mylands-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Minted Lands
        </motion.h2>
        <AnimatePresence>
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 180,
              }}
            >
              <Spinner size={48} color="#6B46C1" />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!loading && lands.length === 0 ? (
            <motion.p
              className="message-text"
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              You haven't minted any lands yet. Head over to "Mint Land" to
              create your first plot!
            </motion.p>
          ) : (
            <motion.ul
              className="land-list"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                listStyle: "none",
                padding: 0,
              }}
            >
              <AnimatePresence>
                {lands.map((land, i) => (
                  <motion.li
                    key={land.id.toString()}
                    className="land-item animate-fade-in-up mylands-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 80,
                    }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "#121212",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      padding: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "1rem",
                      fontFamily: "Inter, DM Sans, sans-serif",
                      cursor: "pointer",
                    }}
                    tabIndex={0}
                    aria-label={`Owned land card for ${
                      land.name || land.id.toString()
                    }`}
                  >
                    <img
                      src={
                        land.image_data && land.image_data.length > 0
                          ? toBase64(land.image_data)
                          : PLACEHOLDER_IMG
                      }
                      alt={`Land: ${land.name || land.id.toString()}`}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: 10,
                        marginBottom: "1rem",
                      }}
                    />
                    <motion.div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.7rem",
                        marginBottom: "0.5rem",
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span
                        style={{
                          background: "#0066ff",
                          color: "#fff",
                          borderRadius: 999,
                          padding: "0.25rem 0.75rem",
                          fontWeight: 600,
                          fontSize: "0.98rem",
                        }}
                      >
                        Owned
                      </span>
                    </motion.div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        color: "#fff",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {land.name || `Land #${land.id.toString()}`}
                    </div>
                    <div
                      style={{
                        color: "#A0A0A0",
                        fontSize: "1rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <span>ID: {land.id.toString()}</span> &nbsp;|&nbsp;
                      <span>Size: {land.size}</span> &nbsp;|&nbsp;
                      <span>
                        Coords: ({land.coordinates.x}, {land.coordinates.y})
                      </span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MyLands;
