import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.55 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 60, scale: 0.96 },
};

export default function AnimatedModal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 2000,
              background: "var(--surface-color)",
              opacity: 0.55,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          />
          <motion.div
            className="modal-content story-card"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, type: "spring" }}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2100,
              background: "var(--surface-color)",
              borderRadius: 12,
              boxShadow: "0 8px 32px 0 #0066ff22, 0 2px 8px #0008",
              padding: "var(--space-xl)",
              minWidth: 320,
              maxWidth: "90vw",
              minHeight: 120,
              maxHeight: "80vh",
              overflowY: "auto",
              fontFamily: "var(--font-family-sans)",
              color: "var(--text-primary)"
            }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 