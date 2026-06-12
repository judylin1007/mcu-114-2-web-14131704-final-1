export interface Product {
  id: number;
  name: string;
  author: string;      
  publisher: string;  
  price: number;       
  originPrice?: number;
  imageUrl: string;
  description: string;
  hidden: boolean;     
}

export interface CartItem {
  product: Product;
  quantity: number;
}