export interface Product {
  id: string;
  name: string;
  author: string;
  company: string;
  price: number;
  isDiscount: boolean;
  hidden: boolean;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}