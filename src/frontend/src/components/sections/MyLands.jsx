import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "../ui/Card";
import Badge from "../ui/Badge";
import Tooltip from "../ui/Tooltip";
import Loader from "../ui/Loader";
import GlowButton from "../ui/Button";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import { animateOnScroll } from "../../animations/gsapScroll";

// Demo data (replace with real API integration)
const demoLands = [
  {
    id: 1,
    name: "Genesis Parcel",
    size: "100x100",
    coordinates: { x: 12, y: 34 },
    image: "/land-images/land-1.jpg",
    status: "owned",
    qr: "/land-images/land-1.jpg",
  },
  {
    id: 2,
    name: "Metaverse Heights",
    size: "80x120",
    coordinates: { x: 56, y: 78 },
    image: "/land-images/land-2.jpg",
    status: "on_sale",
    qr: "/land-images/land-2.jpg",
  },
  {
    id: 3,
    name: "Skyline Estate",
    size: "150x90",
    coordinates: { x: 90, y: 12 },
    image: "/land-images/land-3.jpg",
    status: "expired",
    qr: "/land-images/land-3.jpg",
  },
];

const statusMap = {
  owned: { label: "Owned", color: "from-green-500 to-green-700" },
  on_sale: { label: "On Sale", color: "from-accent-blue to-accent-purple" },
  expired: { label: "Expired", color: "from-gray-500 to-gray-700" },
};

export default function MyLands() {
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const lands = demoLands.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(demoLands.length / perPage);

  const titleRef = useRef();
  const cardRefs = useRef([]);

  function handleFlip(id) {
    setFlipped((f) => ({ ...f, [id]: !f[id] }));
  }
  function handleDownloadQR(qr, name) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate download
      const link = document.createElement("a");
      link.href = qr;
      link.download = `${name}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  }

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
  }, [lands.length, page]);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#23233a] to-[#3b82f6] py-20">
      <MaxWidthContainer>
        <h2
          ref={titleRef}
          className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent mb-10 tracking-tight text-center"
        >
          My Lands
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {lands.map((land, i) => (
              <motion.div
                key={land.id}
                ref={(el) => (cardRefs.current[i] = el)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 80,
                }}
              >
                <div className="perspective-1000">
                  <motion.div
                    className="relative w-full h-80 cursor-pointer group"
                    style={{ perspective: 1000 }}
                    animate={{ rotateY: flipped[land.id] ? 180 : 0 }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 80,
                    }}
                    onClick={() => handleFlip(land.id)}
                  >
                    {/* Front */}
                    <TiltCard
                      className={`absolute w-full h-full top-0 left-0 backface-hidden z-10 ${
                        flipped[land.id]
                          ? "opacity-0 pointer-events-none"
                          : "opacity-100"
                      }`}
                      style={{ transition: "opacity 0.3s" }}
                    >
                      <img
                        src={land.image}
                        alt={land.name}
                        className="w-full h-40 object-cover rounded-t-2xl"
                      />
                      <div className="p-6 flex flex-col gap-2">
                        <div className="font-bold text-xl text-white mb-1 truncate">
                          {land.name}
                        </div>
                        <Badge
                          className={`bg-gradient-to-r ${
                            statusMap[land.status].color
                          }`}
                        >
                          {statusMap[land.status].label}
                        </Badge>
                        <div className="flex gap-3 text-accent-blue/80 text-sm mt-2">
                          <Tooltip content="Land ID" show={true}>
                            <span>ID: {land.id}</span>
                          </Tooltip>
                          <Tooltip content="Size" show={true}>
                            <span>Size: {land.size}</span>
                          </Tooltip>
                        </div>
                        <GlowButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlip(land.id);
                          }}
                        >
                          View Details
                        </GlowButton>
                      </div>
                    </TiltCard>
                    {/* Back */}
                    <TiltCard
                      className={`absolute w-full h-full top-0 left-0 backface-hidden z-20 ${
                        flipped[land.id]
                          ? "rotate-y-180 opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                      style={{
                        transform: "rotateY(180deg)",
                        transition: "opacity 0.3s",
                      }}
                    >
                      <div className="p-6 flex flex-col gap-2 h-full justify-between">
                        <div>
                          <div className="font-bold text-xl text-white mb-1">
                            {land.name}
                          </div>
                          <div className="text-accent-blue/80 text-sm mb-2">
                            Size: {land.size}
                          </div>
                          <div className="text-accent-blue/80 text-sm mb-2">
                            Coords: ({land.coordinates.x}, {land.coordinates.y})
                          </div>
                          <Tooltip content="Download QR" show={true}>
                            <img
                              src={land.qr}
                              alt="QR"
                              className="w-20 h-20 object-cover rounded-lg shadow-md mb-2 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadQR(land.qr, land.name);
                              }}
                            />
                          </Tooltip>
                        </div>
                        <GlowButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlip(land.id);
                          }}
                        >
                          Back
                        </GlowButton>
                      </div>
                    </TiltCard>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-10">
          <GlowButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </GlowButton>
          <span className="text-white font-bold text-lg">
            Page {page} / {totalPages}
          </span>
          <GlowButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </GlowButton>
        </div>
        {/* Loader overlay for QR download */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader size={48} />
            </motion.div>
          )}
        </AnimatePresence>
      </MaxWidthContainer>
    </section>
  );
}
