import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import TiltCard from "../ui/Card";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import { animateOnScroll } from "../../animations/gsapScroll";

const featuredImages = [
  "/land-images/land-1.jpg",
  "/land-images/land-2.jpg",
  "/land-images/land-3.jpg",
  "/land-images/land-4.jpg",
  "/land-images/land-5.jpg",
  "/land-images/land-6.jpg",
];

export default function FeaturedCarousel() {
  const titleRef = useRef();
  const cardRefs = useRef([]);

  useEffect(() => {
    animateOnScroll(titleRef.current, {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    cardRefs.current.forEach((ref, i) => {
      if (ref) {
        animateOnScroll(
          ref,
          {
            from: { opacity: 0, y: 40 },
            to: {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.08,
              ease: "power3.out",
            },
          },
          { start: "top 90%" }
        );
      }
    });
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-[#0a0a0a] via-[#23233a] to-[#3b82f6] py-20">
      <MaxWidthContainer>
        <h2
          ref={titleRef}
          className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent mb-10 tracking-tight text-center"
        >
          Featured Lands
        </h2>
        <div
          className="overflow-x-auto flex gap-8 px-4 pb-4 carousel-track"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div style={{ minWidth: 48, pointerEvents: "none" }} />
          {featuredImages.map((img, i) => (
            <motion.div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              style={{ display: "flex", scrollSnapAlign: "center" }}
            >
              <TiltCard className="min-w-[300px] max-w-[340px] mx-auto p-0 bg-gradient-to-br from-[#23233a] to-accent-blue">
                <div className="p-7 flex flex-col items-center">
                  <img
                    src={img}
                    alt={`Land ${i + 1}`}
                    className="w-48 h-32 object-cover rounded-xl mb-4 bg-[#181a22] shadow-lg"
                  />
                  <div className="font-bold text-lg text-white mb-1">{`Land #${
                    i + 1
                  }`}</div>
                  <div className="text-accent-blue/80 text-sm mb-2">
                    Prime Metaverse Parcel
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
          <div style={{ minWidth: 48, pointerEvents: "none" }} />
        </div>
        <style>{`.carousel-track::-webkit-scrollbar { display: none; }`}</style>
      </MaxWidthContainer>
    </section>
  );
}
