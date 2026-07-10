export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "ponni-rice",
    name: "Ponni Boiled Rice",
    category: "Rice",
    price: 720,
    originalPrice: 780,
    image: "/products/ponni-rice.jpg",
    description: "Premium-quality Ponni boiled rice, ideal for everyday meals.",
  },
  {
    id: "toor-dal",
    name: "Toor Dal",
    category: "Pulses",
    price: 185,
    originalPrice: 200,
    image: "/products/toor-dal.jpg",
    description: "Clean and high-quality toor dal for sambar and daily cooking.",
  },
  {
    id: "urad-dal",
    name: "Urad Dal",
    category: "Pulses",
    price: 170,
    originalPrice: 190,
    image: "/products/urad-dal.jpg",
    description: "Premium urad dal suitable for idli, dosa, vada, and more.",
  },
  {
    id: "sunflower-oil",
    name: "Sunflower Oil",
    category: "Cooking Oil",
    price: 145,
    originalPrice: 160,
    image: "/products/sunflower-oil.jpg",
    description: "Refined sunflower oil suitable for everyday cooking.",
  },
  {
    id: "sugar",
    name: "White Sugar",
    category: "Groceries",
    price: 48,
    originalPrice: 52,
    image: "/products/sugar.jpg",
    description: "Fine-quality white sugar for beverages, sweets, and cooking.",
  },
  {
    id: "wheat-flour",
    name: "Wheat Flour",
    category: "Flour",
    price: 58,
    originalPrice: 65,
    image: "/products/wheat-flour.jpg",
    description: "Fresh wheat flour suitable for chapati, poori, and other dishes.",
  },
];