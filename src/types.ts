export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  featured?: boolean;
  affiliateLink?: string;
  clicks?: number;
  lastClickedAt?: any;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}
