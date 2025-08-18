import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { animateOnScroll } from "../animations/gsapScroll";
import Input from "./ui/Input";
import Dropdown from "./ui/Dropdown";
import Checkbox from "./ui/Checkbox";
import Radio from "./ui/Radio";
import Alert from "./ui/Alert";

const steps = [
  { label: "Fill Details" },
  { label: "Confirm & Mint" },
  { label: "Success" },
];

function MintLandForm({ principal, backend }) {
  const [name, setName] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [size, setSize] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    // GSAP scroll-triggered animation for section title
    animateOnScroll(".mintland-title", {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
    });
    // GSAP for stepper
    animateOnScroll(
      ".mintland-stepper",
      {
        from: { opacity: 0, x: -40 },
        to: {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "power2.out",
        },
      },
      { start: "top 85%" }
    );
    // GSAP for form
    animateOnScroll(
      ".mintland-form",
      {
        from: { opacity: 0, scale: 0.96, y: 40 },
        to: { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
      },
      { start: "top 85%" }
    );
  }, []);

  const handleMint = async (e) => {
    e.preventDefault();
    setCurrentStep(1);

    if (!name.trim() || x === "" || y === "" || !size.trim() || !image) {
      setStatus(" 534 Please fill all fields and select an image.");
      return;
    }

    const parsedX = Number(x);
    const parsedY = Number(y);

    if (isNaN(parsedX) || isNaN(parsedY)) {
      setStatus(" 534 Coordinates X and Y must be valid numbers.");
      return;
    }

    if (!(image instanceof File)) {
      setStatus(
        " 534 Invalid image file selected. Please select a valid image."
      );
      setImage(null);
      setFileInputKey((prevKey) => prevKey + 1);
      return;
    }

    let imageVec;
    try {
      const imageBytes = await image.arrayBuffer();
      imageVec = Array.from(new Uint8Array(imageBytes));
    } catch (imageError) {
      console.error("Error reading image file:", imageError);
      setStatus(" 534 Failed to read image file. Please try another image.");
      return;
    }

    try {
      setStatus("Minting land...");
      const id = await backend.mint_land(
        name.trim(),
        { x: parsedX, y: parsedY },
        size.trim(),
        imageVec
      );
      setStatus(` 197 Land minted with ID: ${id}.`);
      setTxHash(id.toString());
      setCurrentStep(2);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      setName("");
      setX("");
      setY("");
      setSize("");
      setImage(null);
      setFileInputKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error("Error calling backend.mint_land:", err);
      let errorMessage = " 534 Error minting land. Please try again.";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage += ` Details: ${err.message}`;
      } else if (typeof err === "string") {
        errorMessage += ` Details: ${err}`;
      }
      setStatus(errorMessage + " (Check console for more details)");
      setCurrentStep(2);
    }
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
      <div style={{ width: "100%" }}>
        <h2
          className="mintland-title"
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            marginBottom: "2rem",
            color: "#fff",
            letterSpacing: "0.01em",
          }}
        >
          🪙 Mint Land
        </h2>
        <motion.form
          className="mintland-form"
          onSubmit={handleMint}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: "#121212",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: "2.5rem 3rem",
            fontFamily: "Inter, DM Sans, sans-serif",
            position: "relative",
            width: "clamp(400px, 60vw, 900px)",
            maxWidth: "90vw",
            margin: 0,
          }}
        >
          {/* Stepper UI */}
          <div
            className="tx-stepper mintland-stepper"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "2rem",
              gap: "1.2rem",
            }}
          >
            {steps.map((step, idx) => (
              <motion.div
                key={step.label}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <motion.div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: currentStep === idx ? "#0066ff" : "#23233a",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border:
                      currentStep === idx
                        ? "2px solid #0066ff"
                        : "2px solid #23233a",
                    transition: "background 0.2s, border 0.2s",
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  {idx + 1}
                </motion.div>
                <div
                  style={{
                    fontWeight: currentStep === idx ? 700 : 500,
                    color: currentStep === idx ? "#fff" : "#A0A0A0",
                    fontSize: "1.08rem",
                  }}
                >
                  {step.label}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Form Fields */}
          {[
            {
              label: "Land Name:",
              id: "landName",
              value: name,
              onChange: (e) => setName(e.target.value),
              type: "text",
              placeholder: "e.g., Green Valley Plot",
              required: true,
            },
            {
              label: "Coordinate X:",
              id: "coordX",
              value: x,
              onChange: (e) => setX(e.target.value),
              type: "number",
              placeholder: "e.g., 100",
              required: true,
            },
            {
              label: "Coordinate Y:",
              id: "coordY",
              value: y,
              onChange: (e) => setY(e.target.value),
              type: "number",
              placeholder: "e.g., 250",
              required: true,
            },
            {
              label: "Land Size:",
              id: "landSize",
              value: size,
              onChange: (e) => setSize(e.target.value),
              type: "text",
              placeholder: "e.g., 10x10 meters",
              required: true,
            },
          ].map((field, i) => (
            <motion.div
              className="form-group"
              key={field.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.4,
                type: "spring",
                stiffness: 80,
              }}
              style={{ marginBottom: "1.2rem" }}
            >
              <label
                htmlFor={field.id}
                style={{
                  fontSize: "1rem",
                  color: "#A0A0A0",
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                value={field.value}
                onChange={field.onChange}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                style={{
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #333",
                  padding: "12px 16px",
                  borderRadius: 8,
                  fontSize: "1.08rem",
                  fontFamily: "Inter, DM Sans, sans-serif",
                  width: "100%",
                }}
              />
            </motion.div>
          ))}
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.47,
              duration: 0.4,
              type: "spring",
              stiffness: 80,
            }}
            style={{ marginBottom: "1.2rem" }}
          >
            <label
              htmlFor="landImage"
              style={{
                fontSize: "1rem",
                color: "#A0A0A0",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Land Image:
            </label>
            <Input
              key={fileInputKey}
              id="landImage"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
              style={{
                background: "#1e1e1e",
                color: "#fff",
                border: "1px solid #333",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: "1.08rem",
                fontFamily: "Inter, DM Sans, sans-serif",
                width: "100%",
              }}
            />
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04, boxShadow: "0 2px 8px #0066ff33" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              marginTop: 18,
              padding: "1rem 0",
              background: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              fontFamily: "Inter, DM Sans, sans-serif",
              width: "100%",
              boxShadow: "0 2px 8px #0066ff33",
              transition: "background 0.18s, color 0.18s, box-shadow 0.18s",
            }}
          >
            Mint Land
          </motion.button>
          <AnimatePresence>
            {status && (
              <Alert
                key={status}
                type={
                  status.startsWith(" 197")
                    ? "success"
                    : status.startsWith(" 534")
                    ? "error"
                    : "info"
                }
                message={status}
                showIcon={true}
                closable={true}
                onClose={() => setStatus("")}
                style={{
                  marginTop: 18,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: status.startsWith(" 197")
                    ? "#22c55e"
                    : status.startsWith(" 534")
                    ? "#ef4444"
                    : "#fff",
                  background: "#181a1a",
                  borderRadius: 8,
                  padding: "0.7rem 1.2rem",
                }}
              />
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  );
}

export default MintLandForm;
