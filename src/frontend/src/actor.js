import { HttpAgent } from "@dfinity/agent";
import { Actor } from "@dfinity/agent";
import {
  idlFactory as backend_idl,
  canisterId as backend_id,
} from "../../declarations/backend";

export function createActor(identity) {
  // Determine if we're in local development
  const isLocal = window.location.host.includes("localhost");

  const agent = new HttpAgent({
    identity,
    host: isLocal ? "http://localhost:4943" : "https://ic0.app",
  });

  // ✅ COMPREHENSIVE FIX: Fetch root key for local development only
  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. This is expected in local development."
      );
      console.warn("Make sure your local replica is running with: dfx start");
      console.error("Root key fetch error:", err);
    });
  }

  return Actor.createActor(backend_idl, {
    agent,
    canisterId: backend_id,
  });
}
