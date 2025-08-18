import { Land } from './land';

export interface MarketplaceListing {
  land: Land;
  price: number;
  owner: string;
  listedAt: string;
  status: 'active' | 'sold' | 'removed';
} 