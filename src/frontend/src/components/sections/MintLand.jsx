import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlowButton from "../ui/Button";
import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Tooltip from "../ui/Tooltip";
import MaxWidthContainer from "../layout/MaxWidthContainer";
import { animateOnScroll } from "../../animations/gsapScroll";

const steps = [
  {
    label: "Upload Image",
    desc: "Drag & drop or click to upload your land image.",
  },
  {
    label: "Enter Details",
    desc: "Name, size, and coordinates for your land.",
  },
  { label: "Mint", desc: "Confirm and mint your land NFT." },
];

export default function MintLand() {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [coords, setCoords] = useState({ x: "", y: "" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInput = useRef();

  const titleRef = useRef();
  const stepperRef = useRef();
  const stepContentRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  }
  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
    else setModalOpen(true);
  }
  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }
  function handleMint() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
        setStep(0);
        setImage(null);
        setName("");
        setSize("");
        setCoords({ x: "", y: "" });
      }, 1800);
    }, 1500);
  }

  useEffect(() => {
    animateOnScroll(titleRef.current, {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    animateOnScroll(
      stepperRef.current,
      {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      },
      { start: "top 85%" }
    );
    animateOnScroll(
      stepContentRef.current,
      {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      },
      { start: "top 90%" }
    );
  }, [step]);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#23233a] to-[#3b82f6] py-20">
      <MaxWidthContainer>
        <div className="max-w-2xl mx-auto">
          <h2
            ref={titleRef}
            className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-accent-blue via-accent-purple to-pink-500 bg-clip-text text-transparent mb-10 tracking-tight text-center"
          >
            Mint New Land
          </h2>
          {/* Stepper */}
          <div
            ref={stepperRef}
            className="flex justify-between items-center mb-12"
          >
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg mb-2 ${
                    i === step
                      ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg"
                      : "bg-surface text-accent-blue border-2 border-accent-blue"
                  }`}
                  animate={{
                    scale: i === step ? 1.15 : 1,
                    boxShadow: i === step ? "0 0 16px #3b82f6" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {i + 1}
                </motion.div>
                <div
                  className={`font-semibold text-sm ${
                    i === step ? "text-white" : "text-accent-blue/80"
                  }`}
                >
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-full h-1 bg-gradient-to-r from-accent-blue to-accent-purple my-2" />
                )}
              </div>
            ))}
          </div>
          {/* Step Content */}
          <div
            ref={stepContentRef}
            className="bg-surface rounded-2xl shadow-lg p-8 mb-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-accent-blue rounded-xl bg-[#181a22] cursor-pointer mb-4 hover:bg-[#23233a] transition"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInput.current.click()}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="w-40 h-28 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-accent-blue/80">
                        Drag & drop or click to upload
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInput}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="text-accent-blue/80 text-sm text-center">
                    Supported: JPG, PNG, GIF. Max 5MB.
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col gap-4">
                    <label className="text-accent-blue/80 font-semibold">
                      Land Name
                    </label>
                    <input
                      type="text"
                      className="px-4 py-2 rounded-lg bg-[#23233a] text-white border border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Genesis Parcel"
                    />
                    <label className="text-accent-blue/80 font-semibold">
                      Size
                    </label>
                    <input
                      type="text"
                      className="px-4 py-2 rounded-lg bg-[#23233a] text-white border border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. 100x100"
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-accent-blue/80 font-semibold">
                          X
                        </label>
                        <input
                          type="number"
                          className="px-4 py-2 rounded-lg bg-[#23233a] text-white border border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          value={coords.x}
                          onChange={(e) =>
                            setCoords({ ...coords, x: e.target.value })
                          }
                          placeholder="X"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-accent-blue/80 font-semibold">
                          Y
                        </label>
                        <input
                          type="number"
                          className="px-4 py-2 rounded-lg bg-[#23233a] text-white border border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          value={coords.y}
                          onChange={(e) =>
                            setCoords({ ...coords, y: e.target.value })
                          }
                          placeholder="Y"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="mint"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <Badge className="mb-2">Ready to Mint</Badge>
                    <div className="font-bold text-xl text-white mb-1">
                      {name || "Unnamed Land"}
                    </div>
                    <div className="text-accent-blue/80 text-sm mb-2">
                      Size: {size || "--"} | Coords: ({coords.x || "--"},{" "}
                      {coords.y || "--"})
                    </div>
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-lg shadow-md mb-2"
                      />
                    )}
                    <GlowButton
                      className="mt-4 w-full relative overflow-hidden"
                      onClick={handleMint}
                    >
                      {loading ? <Loader size={24} /> : "Mint Land"}
                      {/* Ripple effect */}
                      <span
                        className="absolute inset-0 pointer-events-none animate-ping rounded-full bg-accent-blue/30"
                        style={{ display: loading ? "block" : "none" }}
                      />
                    </GlowButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Stepper Controls */}
          <div className="flex justify-between">
            <GlowButton
              onClick={handlePrev}
              disabled={step === 0}
              className="bg-transparent border border-accent-blue text-white shadow-none"
            >
              Back
            </GlowButton>
            <GlowButton
              onClick={handleNext}
              disabled={step === steps.length - 1}
              className="w-full"
            >
              Next
            </GlowButton>
          </div>
        </div>
        {/* Modal for confirmation/success */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="flex flex-col items-center gap-6">
            {success ? (
              <>
                <div className="text-5xl">🎉</div>
                <div className="font-bold text-2xl text-white">
                  Land Minted!
                </div>
                <div className="text-accent-blue/80 text-lg">
                  Your land NFT is now on-chain.
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-2xl text-white mb-2">
                  Confirm Mint
                </div>
                <div className="text-accent-blue/80 text-lg mb-4">
                  Are you sure you want to mint{" "}
                  <span className="font-bold text-white">
                    {name || "Unnamed Land"}
                  </span>
                  ?
                </div>
                <GlowButton
                  onClick={handleMint}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? <Loader size={24} /> : "Confirm & Mint"}
                </GlowButton>
              </>
            )}
          </div>
        </Modal>
      </MaxWidthContainer>
    </section>
  );
}
