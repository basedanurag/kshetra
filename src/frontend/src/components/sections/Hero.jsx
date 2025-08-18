import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlowButton from "../ui/Button";
import TiltCard from "../ui/Card";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import { IconExplore } from "../icons/IconExplore";
import { animateOnScroll } from "../../animations/gsapScroll";

export default function Hero({ onGetStarted }) {
  const headlineRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    animateOnScroll(headlineRef.current, {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    animateOnScroll(
      ctaRef.current,
      {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      },
      { start: "top 85%" }
    );
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#23233a] to-[#3b82f6] relative overflow-hidden">
      <MaxWidthContainer>
        <motion.div
          className="flex flex-col items-center text-center gap-10 py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1
            ref={headlineRef}
            className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent mb-4 tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Your Land, Your Legacy—On The Blockchain
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-accent-blue/80 mb-2 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Securely buy, sell, and manage virtual real estate. Build your
            digital empire in the metaverse.
          </motion.p>
          <motion.div
            ref={ctaRef}
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlowButton onClick={onGetStarted}>Explore Marketplace</GlowButton>
            <GlowButton
              onClick={onGetStarted}
              className="bg-transparent border border-accent-blue text-white shadow-none"
            >
              Mint Land
            </GlowButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5, type: "spring" }}
            className="mt-12"
          >
            <TiltCard className="w-80 mx-auto p-0 bg-gradient-to-br from-[#23233a] to-accent-blue">
              <div className="p-8 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-4"
                >
                  <IconExplore style={{ width: 64, height: 64 }} />
                </motion.div>
                <div className="font-bold text-2xl text-white mt-2">
                  Discover Digital Lands
                </div>
                <div className="text-accent-blue/80 text-base mt-2 text-center">
                  Browse, select, and own unique parcels in the metaverse.
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </MaxWidthContainer>
    </section>
  );
}
