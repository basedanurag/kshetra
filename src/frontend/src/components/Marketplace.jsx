import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";
import {
  IconExplore,
  IconOwnTrade,
  IconSecurity,
  IconInstant,
  IconGlobal,
} from "./Icon";
import { animateOnScroll } from "../animations/gsapScroll";

const PLACEHOLDER_IMG = "/land-images/land-1.jpg";

function GlowButton({ children, onClick, style = {}, ...props }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 32px 12px #3b82f6, 0 2px 16px #a21caf55",
        background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
      }}
      whileTap={{ scale: 0.96 }}
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
        boxShadow: "0 2px 24px #3b82f655, 0 0 0 2px #3b82f6cc",
        letterSpacing: "0.04em",
        outline: "none",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        ...style,
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
  const handleMouseMove = (e) => {
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
        borderRadius: 20,
        boxShadow: "0 8px 40px #3b82f655, 0 2px 0 #3b82f6",
        background: "rgba(24,26,34,0.85)",
        border: "2.5px solid #3b82f6",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transform: `rotateY(${tilt.x * 8}deg) rotateX(${
          -tilt.y * 8
        }deg) scale(1.03)`,
        transition: "transform 0.18s cubic-bezier(.4,0,.2,1)",
        ...style,
      }}
      whileHover={{
        scale: 1.06,
        boxShadow: "0 0 48px #3b82f6cc, 0 2px 24px #a21caf55",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function FloatingIcon({ children, style = {}, ...props }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ display: "inline-block", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Marketplace({ backend, principal }) {
  const [allListings, setAllListings] = useState([]);
  const [myUnlistedLands, setMyUnlistedLands] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // GSAP scroll-triggered animation for section title
    animateOnScroll(".marketplace-title", {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    // GSAP for status message
    animateOnScroll(".marketplace-status", {
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    });
    // GSAP for unlisted lands cards
    animateOnScroll(
      ".marketplace-unlisted-card",
      {
        from: { opacity: 0, scale: 0.92, y: 40 },
        to: {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        },
      },
      { start: "top 85%" }
    );
    // GSAP for marketplace listings cards
    animateOnScroll(
      ".marketplace-listing-card",
      {
        from: { opacity: 0, scale: 0.92, y: 40 },
        to: {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        },
      },
      { start: "top 85%" }
    );
  }, [loading, myUnlistedLands.length, allListings.length]);

  const fetchData = async () => {
    try {
      const [myLands, marketplaceListings] = await Promise.all([
        backend.get_my_land(),
        backend.get_marketplace_listings(), // Returns [(LandNFT, Listing)]
      ]);

      const listedIds = marketplaceListings.map(
        ([land, listing]) => listing.land_id
      );
      const unlisted = myLands.filter((land) => !listedIds.includes(land.id));

      setMyUnlistedLands(unlisted);
      setAllListings(marketplaceListings);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setStatus("❌ Failed to load marketplace data");
      setLoading(false);
    }
  };

  const toBase64 = (vec) => {
    const binary = new Uint8Array(vec).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return `data:image/png;base64,${btoa(binary)}`;
  };

  const handleList = async (id) => {
    const price = prompt(`Enter listing price for Land #${id} (ICP):`);
    if (!price || isNaN(price)) return alert("Invalid price.");

    setStatus(`Listing land #${id}...`);
    try {
      const result = await backend.list_land_for_sale(id, Number(price));

      // ✅ UPDATED: Handle the new ListingResult type
      if (result && typeof result === "object") {
        if ("Ok" in result) {
          setStatus(`✅ Listed Land #${id} for ${price} ICP`);
          fetchData();
        } else if ("Err" in result) {
          setStatus(`❌ Failed to list land: ${result.Err}`);
        }
      } else {
        setStatus(`❌ Unexpected response format`);
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ Failed to list land: ${err.message || err}`);
    }
  };

  const handleBuy = async (id) => {
    setStatus(`Processing purchase for Land #${id}...`);
    try {
      const result = await backend.buy_land(id);

      if (result && typeof result === "object") {
        if ("Ok" in result) {
          setStatus(`✅ Successfully purchased Land #${id}`);
          fetchData(); // Refresh data
        } else if ("Err" in result) {
          setStatus(`❌ Purchase failed: ${result.Err}`);
        }
      } else {
        setStatus(`❌ Unexpected response format`);
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ Purchase failed: ${err.message || err}`);
    }
  };

  // Handle unlisting functionality
  const handleUnlist = async (id) => {
    setStatus(`Removing listing for Land #${id}...`);
    try {
      const result = await backend.remove_listing(id);

      if (result && typeof result === "object") {
        if ("Ok" in result) {
          setStatus(`✅ Removed listing for Land #${id}`);
          fetchData(); // Refresh data
        } else if ("Err" in result) {
          setStatus(`❌ Failed to remove listing: ${result.Err}`);
        }
      } else {
        setStatus(`❌ Unexpected response format`);
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ Failed to remove listing: ${err.message || err}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "80vh",
        width: "100vw",
        position: "relative",
        background: "none",
        padding: "2.5rem 0",
      }}
    >
      <div
        style={{
          width: "clamp(400px, 80vw, 1400px)",
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          gap: "3.5rem",
        }}
      >
        <h2
          className="marketplace-title"
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "1.5rem",
            letterSpacing: "0.01em",
            color: "#fff",
          }}
        >
          🏪 Marketplace
        </h2>
        {status && (
          <p
            className="marketplace-status"
            style={{
              color: status.includes("✅") ? "#22c55e" : "#ef4444",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            {status}
          </p>
        )}
        {loading ? (
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
        ) : (
          <>
            {/* SECTION 1: User's unlisted lands */}
            {myUnlistedLands.length > 0 && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #23233a 80%, #3b82f6 100%)",
                  borderRadius: 24,
                  boxShadow: "0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6",
                  padding: "2.2rem 2rem",
                  marginBottom: "2.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "1.2rem",
                    letterSpacing: "0.01em",
                    fontFamily: "Inter, DM Sans, sans-serif",
                  }}
                >
                  🏠 Your Lands (Available to List)
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    gap: "2.2rem",
                    justifyContent: "center",
                  }}
                >
                  <AnimatePresence>
                    {myUnlistedLands.map((land, i) => (
                      <motion.li
                        key={i}
                        className="marketplace-unlisted-card"
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
                          boxShadow: "0 0 32px #3b82f6aa",
                        }}
                        whileTap={{ scale: 0.97 }}
                        tabIndex={0}
                        style={{
                          background:
                            "linear-gradient(135deg, #23233a 80%, #3b82f6 100%)",
                          borderRadius: 24,
                          boxShadow: "0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6",
                          padding: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "1rem",
                          fontFamily: "Inter, DM Sans, sans-serif",
                          maxWidth: 420,
                          margin: "0 auto",
                          outline: "none",
                          border: "2px solid transparent",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.border = "2px solid #3b82f6")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.border =
                            "2px solid transparent")
                        }
                      >
                        <img
                          src={
                            land.image_data && land.image_data.length > 0
                              ? toBase64(land.image_data)
                              : PLACEHOLDER_IMG
                          }
                          alt={land.name || "Land"}
                          style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            objectFit: "cover",
                            borderRadius: 16,
                            marginBottom: "1rem",
                            boxShadow: "0 2px 12px #3b82f655",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.7rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              background: "var(--accent-blue)",
                              color: "#fff",
                              borderRadius: 999,
                              padding: "0.25rem 0.95rem",
                              fontWeight: 700,
                              fontSize: "1.01rem",
                              boxShadow: "0 1px 8px #3b82f655",
                              fontFamily: "Inter, DM Sans, sans-serif",
                            }}
                          >
                            Available
                          </span>
                        </div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: "1.22rem",
                            color: "#fff",
                            marginBottom: "0.3rem",
                            letterSpacing: "-0.01em",
                            fontFamily: "Inter, DM Sans, sans-serif",
                          }}
                        >
                          {land.name}
                        </div>
                        <div
                          style={{
                            color: "#A0A0A0",
                            fontSize: "1rem",
                            marginBottom: "0.3rem",
                            fontFamily: "Inter, DM Sans, sans-serif",
                          }}
                        >
                          <span>ID: {land.id.toString()}</span> &nbsp;|&nbsp;
                          <span>Size: {land.size}</span> &nbsp;|&nbsp;
                          <span>
                            Coords: ({land.coordinates.x}, {land.coordinates.y})
                          </span>
                        </div>
                        <motion.button
                          whileHover={{
                            scale: 1.06,
                            boxShadow:
                              "0 0 24px 8px #3b82f6, 0 2px 12px #a21caf55",
                          }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            background:
                              "linear-gradient(90deg, #3b82f6 0%, #a21caf 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 999,
                            fontWeight: 800,
                            fontSize: "1.08rem",
                            padding: "0.95rem 2.2rem",
                            fontFamily: "Inter, DM Sans, sans-serif",
                            cursor: "pointer",
                            boxShadow: "0 2px 12px #3b82f655",
                            letterSpacing: "0.04em",
                            outline: "none",
                            marginTop: 8,
                            transition:
                              "box-shadow 0.2s, background 0.2s, transform 0.13s",
                          }}
                          onClick={() => handleList(land.id)}
                          tabIndex={0}
                        >
                          List for Sale
                        </motion.button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            )}
            {/* Divider between sections */}
            <div style={{ height: "2.5rem" }} />
            {/* SECTION 2: Marketplace listings */}
            <div className="landing-section" style={{ paddingTop: 0 }}>
              <h2
                className="section-header"
                style={{ textAlign: "center", marginBottom: 48 }}
              >
                Marketplace
              </h2>
              <div
                className="features-grid"
                style={{
                  flexWrap: "wrap",
                  gap: "2.5rem",
                  justifyContent: "center",
                }}
              >
                <AnimatePresence>
                  {allListings.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      style={{
                        color: "#A0A0A0",
                        fontWeight: 500,
                        fontSize: 22,
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      No lands currently listed in the marketplace.
                    </motion.div>
                  ) : (
                    allListings.map(([land, listing], i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{
                          delay: i * 0.08,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 80,
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          maxWidth: 360,
                        }}
                      >
                        <TiltCard
                          tabIndex={0}
                          className="marketplace-listing-card"
                          style={{
                            minWidth: 300,
                            maxWidth: 340,
                            margin: "0 auto",
                            background:
                              "linear-gradient(135deg, #23233a 80%, #3b82f6 100%)",
                            padding: 0,
                            outline: "none",
                            border: "2px solid transparent",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.border = "2px solid #3b82f6")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.border =
                              "2px solid transparent")
                          }
                        >
                          <div
                            style={{
                              padding: 28,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <FloatingIcon style={{ marginBottom: 8 }}>
                              <IconExplore style={{ width: 48, height: 48 }} />
                            </FloatingIcon>
                            <img
                              src={
                                land.image_data && land.image_data.length > 0
                                  ? toBase64(land.image_data)
                                  : PLACEHOLDER_IMG
                              }
                              alt={land.name || "Land"}
                              style={{
                                width: 180,
                                height: 120,
                                borderRadius: 12,
                                objectFit: "cover",
                                marginBottom: 18,
                                background: "#181a22",
                                boxShadow: "0 2px 12px #3b82f655",
                              }}
                            />
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 22,
                                color: "#fff",
                                marginBottom: 6,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {land.name}
                            </div>
                            <div
                              style={{
                                color: "#A0A0A0",
                                fontSize: 15,
                                marginBottom: 8,
                              }}
                            >
                              ID: {land.id.toString()} | Size: {land.size}
                            </div>
                            <div
                              style={{
                                color: "#A0A0A0",
                                fontSize: 15,
                                marginBottom: 8,
                              }}
                            >
                              Coords: ({land.coordinates.x},{" "}
                              {land.coordinates.y})
                            </div>
                            <div
                              style={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 18,
                                marginBottom: 8,
                              }}
                            >
                              Price:{" "}
                              <span
                                style={{ color: "#3b82f6", fontWeight: 800 }}
                              >
                                {listing.price} ICP
                              </span>
                            </div>
                            <GlowButton
                              style={{
                                fontSize: 15,
                                padding: "0.9rem 2.2rem",
                                marginTop: 8,
                              }}
                              onClick={() => handleBuy(land.id)}
                            >
                              Buy Now
                            </GlowButton>
                          </div>
                        </TiltCard>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
