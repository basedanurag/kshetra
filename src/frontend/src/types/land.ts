export interface Land {
  id: string | number;
  name: string;
  size: string | number;
  coordinates: { x: number; y: number };
  image_data?: string;
  owner?: string;
  price?: number;
  status?: 'owned' | 'on_sale' | 'expired';
} 