import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { animateOnScroll } from "../../animations/gsapScroll";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const socials = [
  { name: "Twitter", url: "https://twitter.com/", icon: "🐦" },
  { name: "GitHub", url: "https://github.com/basedanurag", icon: "💻" },
  { name: "Discord", url: "", icon: "💬" },
];

const navLinks = [
  { name: "Marketplace", href: "#marketplace" },
  { name: "Mint", href: "#mint" },
  { name: "My Lands", href: "#mylands" },
  { name: "How It Works", href: "#howitworks" },
];

function Footer() {
  useEffect(() => {
    animateOnScroll(".footer-root", {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
  }, []);

  return (
    <footer
      className="footer-root"
      style={{
        background: "rgba(18,20,34,0.98)",
        padding: "3.5rem 0 2rem 0",
        width: "100vw",
        borderTop: "1.5px solid #23233a",
        marginTop: 60,
      }}
    >
      <MaxWidthContainer>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2.5rem",
            width: "100%",
          }}
        >
          {/* Brand & Copyright */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.35rem",
                color: "#fff",
                letterSpacing: "0.01em",
                fontFamily: "Inter, DM Sans, sans-serif",
              }}
            >
              <Badge
                style={{
                  background: "#23233a",
                  color: "#3b82f6",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  marginRight: 10,
                }}
              >
              KSH
              </Badge>
              KSHETRA
            </span>
            <span
              style={{ color: "#A0A0A0", fontSize: "0.98rem", fontWeight: 500 }}
            >
              © {new Date().getFullYear()} KSHETRA Land Registry. All rights
              reserved.
            </span>
          </div>
          {/* Navigation Links */}
          <nav
            style={{ display: "flex", gap: "1.8rem", flexWrap: "wrap" }}
            aria-label="Footer Navigation"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ color: "#3b82f6", scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.08rem",
                  textDecoration: "none",
                  transition: "color 0.18s",
                  borderRadius: 8,
                  padding: "0.2rem 0.7rem",
                  outline: "none",
                }}
                tabIndex={0}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>
          {/* Social Links */}
          <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.18, color: "#3b82f6" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontSize: "1.45rem",
                  color: "#fff",
                  borderRadius: 999,
                  background: "#23233a",
                  padding: "0.45rem 0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.18s, color 0.18s",
                  outline: "none",
                }}
                aria-label={social.name}
                tabIndex={0}
              >
                <span style={{ fontSize: "1.25em" }}>{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            style={{
              fontSize: "1.08rem",
              padding: "0.9rem 2.2rem",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            this is a demo project for KSHETRA Land Registry project for QuadBtech Internship
          </Button>
        </div>
      </MaxWidthContainer>
    </footer>
  );
}

export default Footer;
