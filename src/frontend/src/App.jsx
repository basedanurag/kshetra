import React, { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { backend } from "../../declarations/backend";
import Navbar from "./components/Navbar";
import MintLandForm from "./components/MintLandForm";
import MyLands from "./components/MyLands";
import Marketplace from "./components/Marketplace";
import { getIdentityProvider } from "./identity";
import { createActor } from "./actor";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./components/Landing";
import HowItWorks from "./components/sections/HowItWorks";
import Footer from "./components/sections/Footer";
import Cursor from "./components/ui/Cursor";

function App() {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [view, setView] = useState("mint");

  const setAuthenticatedUser = (identity) => {
    try {
      const principalId = identity.getPrincipal().toText();
      const actor = createActor(identity);

      setPrincipal(principalId);
      setIsAuthenticated(true);
      setBackendActor(actor);
    } catch (error) {
      console.error("Authentication setup failed:", error);
    }
  };

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setAuthenticatedUser(identity);
      }
    });
  }, []);

  const login = async () => {
    await authClient.login({
      identityProvider: getIdentityProvider(),
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setAuthenticatedUser(identity);
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setPrincipal(null);
    setIsAuthenticated(false);
    setBackendActor(null);
  };

  return (
    <>
      {isAuthenticated && <Cursor />}
      {isAuthenticated ? (
        <>
          <Navbar
            currentView={view}
            onNavigate={setView}
            isAuthenticated={isAuthenticated}
            principal={principal}
            onLogin={login}
            onLogout={logout}
          />
          <main className="content-wrapper">
            <AnimatePresence mode="wait" initial={false}>
              {view === "mint" && (
                <motion.div
                  key="mint"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ width: "100%" }}
                >
                  <MintLandForm principal={principal} backend={backendActor} />
                </motion.div>
              )}
              {view === "my" && (
                <motion.div
                  key="my"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ width: "100%" }}
                >
                  <MyLands principal={principal} backend={backendActor} />
                </motion.div>
              )}
              {view === "market" && (
                <motion.div
                  key="market"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ width: "100%" }}
                >
                  <Marketplace principal={principal} backend={backendActor} />
                </motion.div>
              )}
            </AnimatePresence>
            <HowItWorks />
          </main>
          <Footer />
        </>
      ) : (
        <Landing onGetStarted={login} />
      )}
    </>
  );
}

export default App;
