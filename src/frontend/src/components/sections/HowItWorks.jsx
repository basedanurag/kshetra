import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { animateOnScroll } from "../../animations/gsapScroll";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const steps = [
  {
    title: "Connect Wallet",
    icon: "🔗",
    desc: "Securely connect your Web3 wallet to get started.",
  },
  {
    title: "Mint Land",
    icon: "🌱",
    desc: "Create and mint your unique virtual land NFT on-chain.",
  },
  {
    title: "List & Trade",
    icon: "🛒",
    desc: "List your land on the marketplace or trade with others.",
  },
  {
    title: "Own & Explore",
    icon: "🌍",
    desc: "Showcase, manage, and explore your digital land assets.",
  },
];

function HowItWorks() {
  useEffect(() => {
    animateOnScroll(".howitworks-title", {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    animateOnScroll(
      ".howitworks-step",
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
  }, []);

  return (
    <section
      style={{
        background: "rgba(18,20,34,0.98)",
        padding: "5rem 0",
        width: "100vw",
      }}
    >
      <MaxWidthContainer>
        <motion.h2
          className="howitworks-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "2.3rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "2.5rem",
            letterSpacing: "0.01em",
            textAlign: "center",
            fontFamily: "Inter, DM Sans, sans-serif",
          }}
        >
          <Badge
            style={{ marginRight: 12, background: "#23233a", color: "#3b82f6" }}
          >
            How It Works
          </Badge>
          Seamless Web3 Land Ownership
        </motion.h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2.2rem",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              className="howitworks-step"
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.7,
                type: "spring",
                stiffness: 80,
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px #3b82f6aa" }}
              whileTap={{ scale: 0.97 }}
              style={{ outline: "none" }}
              tabIndex={0}
              aria-label={`Step ${i + 1}: ${step.title}`}
            >
              <Card
                style={{
                  background:
                    "linear-gradient(135deg, #23233a 80%, #3b82f6 100%)",
                  borderRadius: 20,
                  boxShadow: "0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6",
                  padding: "2.2rem 1.6rem",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.2rem",
                  fontFamily: "Inter, DM Sans, sans-serif",
                }}
              >
                <span style={{ fontSize: "2.5rem", marginBottom: 8 }}>
                  {step.icon}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    background: "#181a22",
                    color: "#3b82f6",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    padding: "0.3rem 1.1rem",
                    marginBottom: 8,
                  }}
                >
                  Step {i + 1}
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.18rem",
                    color: "#fff",
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    color: "#A0A0A0",
                    fontSize: "1.05rem",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {step.desc}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3.5rem",
          }}
        >
          <Button
            style={{
              fontSize: "1.15rem",
              padding: "1.1rem 2.6rem",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Get Started
          </Button>
        </div>
      </MaxWidthContainer>
    </section>
  );
}

export default HowItWorks;
