import { canisterId as iiCanisterId } from '../../declarations/internet_identity';

export function getIdentityProvider() {
  const isLocal = window.location.host.includes('localhost');
  
  if (isLocal) {
    return `http://${iiCanisterId}.localhost:4943`;
  }

  // Use ICP's official Internet Identity in production
  return 'https://identity.ic0.app';
}
