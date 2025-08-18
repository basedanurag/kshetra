import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "../ui/Card";
import GlowButton from "../ui/Button";
import Badge from "../ui/Badge";
import Tooltip from "../ui/Tooltip";
import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import { animateOnScroll } from "../../animations/gsapScroll";
import Dropdown from "../ui/Dropdown";
import Alert from "../ui/Alert";

// Demo data (replace with real API integration)
const demoLands = [
  {
    id: 1,
    name: "Genesis Parcel",
    size: "100x100",
    coordinates: { x: 12, y: 34 },
    image: "/land-images/land-1.jpg",
    price: 120,
    status: "on_sale",
    owner: "0xA1B2...C3D4",
  },
  {
    id: 2,
    name: "Metaverse Heights",
    size: "80x120",
    coordinates: { x: 56, y: 78 },
    image: "/land-images/land-2.jpg",
    price: 95,
    status: "on_sale",
    owner: "0xE5F6...G7H8",
  },
  {
    id: 3,
    name: "Skyline Estate",
    size: "150x90",
    coordinates: { x: 90, y: 12 },
    image: "/land-images/land-3.jpg",
    price: 210,
    status: "on_sale",
    owner: "0xI9J0...K1L2",
  },
];

const statusMap = {
  on_sale: { label: "For Sale", color: "from-accent-blue to-accent-purple" },
  owned: { label: "Owned", color: "from-green-500 to-green-700" },
  expired: { label: "Expired", color: "from-gray-500 to-gray-700" },
};

export default function Marketplace() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);

  const titleRef = useRef();
  const filterRef = useRef();
  const cardRefs = useRef([]);

  // Filtering/sorting logic (demo only)
  let filteredLands = demoLands.filter((land) =>
    land.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "price_low")
    filteredLands = [...filteredLands].sort((a, b) => a.price - b.price);
  if (sort === "price_high")
    filteredLands = [...filteredLands].sort((a, b) => b.price - a.price);

  function handleBuy(land) {
    setSelectedLand(land);
    setModalOpen(true);
  }

  function handleConfirmBuy() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(false);
      // Success animation or toast here
    }, 1500);
  }

  useEffect(() => {
    animateOnScroll(titleRef.current, {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    animateOnScroll(
      filterRef.current,
      {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      },
      { start: "top 85%" }
    );
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
  }, [filteredLands.length]);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#23233a] to-[#3b82f6] py-20">
      <MaxWidthContainer>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <h2
              ref={titleRef}
              className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent mb-2 tracking-tight"
            >
              Marketplace
            </h2>
            <p className="text-lg text-accent-blue/80 font-medium">
              Browse, filter, and buy premium virtual lands.
            </p>
          </div>
          <div ref={filterRef} className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name..."
              className="px-4 py-2 rounded-lg bg-surface text-white border border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Dropdown
              label="Sort By"
              options={[
                { value: "newest", label: "Newest" },
                { value: "price_low", label: "Price: Low to High" },
                { value: "price_high", label: "Price: High to Low" },
              ]}
              value={sort}
              onChange={setSort}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredLands.map((land, i) => (
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
                <TiltCard className="p-0 cursor-pointer group" tabIndex={0}>
                  <div className="relative">
                    <img
                      src={land.image}
                      alt={land.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`bg-gradient-to-r ${
                          statusMap[land.status].color
                        }`}
                      >
                        {statusMap[land.status].label}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Tooltip content={`Listed by ${land.owner}`} show={true}>
                        <span className="bg-surface/80 px-3 py-1 rounded-full text-xs text-white font-semibold shadow-md">
                          {land.owner}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <div className="font-bold text-xl text-white mb-1 truncate">
                      {land.name}
                    </div>
                    <div className="flex gap-3 text-accent-blue/80 text-sm">
                      <Tooltip content="Land ID" show={true}>
                        <span>ID: {land.id}</span>
                      </Tooltip>
                      <Tooltip content="Size" show={true}>
                        <span>Size: {land.size}</span>
                      </Tooltip>
                      <Tooltip content="Coordinates" show={true}>
                        <span>
                          ({land.coordinates.x}, {land.coordinates.y})
                        </span>
                      </Tooltip>
                    </div>
                    <div className="font-bold text-lg text-white mt-2">
                      {land.price} ICP
                    </div>
                    <GlowButton onClick={() => handleBuy(land)}>
                      Buy Now
                    </GlowButton>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {selectedLand && (
            <div className="flex flex-col items-center gap-6">
              <img
                src={selectedLand.image}
                alt={selectedLand.name}
                className="w-40 h-28 object-cover rounded-xl shadow-lg"
              />
              <div className="font-bold text-2xl text-white">
                {selectedLand.name}
              </div>
              <div className="text-accent-blue/80 text-lg">
                Price: {selectedLand.price} ICP
              </div>
              <GlowButton onClick={handleConfirmBuy} disabled={loading}>
                {loading ? <Loader size={24} /> : "Confirm Purchase"}
              </GlowButton>
            </div>
          )}
        </Modal>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </MaxWidthContainer>
    </section>
  );
}
