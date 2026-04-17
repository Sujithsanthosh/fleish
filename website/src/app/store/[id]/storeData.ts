// Pricing option types
export type PricingMode = 'weight' | 'amount' | 'custom';

export interface PricingOption {
  id: string;
  label: string;
  value: number;
  unit: string;
  type: 'fixed' | 'calculated';
}

export interface ProductVariant {
  id: string;
  name: string;
  pricePerKg: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Base price per kg
  unit: string;
  category: "fish" | "meat";
  subcategory?: string;
  image: string;
  rating: number;
  reviews: number;
  isFresh: boolean;
  discount?: number;
  weight: string;
  description: string;
  inStock: boolean;
  // New pricing features
  pricingMode: PricingMode;
  pricingOptions?: PricingOption[];
  variants?: ProductVariant[]; // For chicken with/without skin, etc.
  minOrderAmount?: number; // Minimum Rs amount
  vendorEnabled: boolean; // Vendor can enable/disable this product
  vendorId: string;
  tags: string[];
  origin?: string;
  isOrganic?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

export interface StoreData {
  id: string;
  name: string;
  type: "fish" | "meat" | "both";
  address: string;
  distance: number;
  rating: number;
  reviews: number;
  phone: string;
  hours: string;
  isOpen: boolean;
  coordinates: { lat: number; lng: number };
  image: string;
  coverImage: string;
  products: Product[];
  categories: Category[];
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  description: string;
  established: string;
  certifications: string[];
  features: string[];
  acceptsCustomOrders: boolean;
  pricePer100gEnabled: boolean;
  pricePer200gEnabled: boolean;
}

// Complete Indian Fish Catalog - All popular varieties available in India
const ALL_FISH_PRODUCTS: Product[] = [
  // Premium Seafood
  { id: 'f1', name: 'Atlantic Salmon', price: 899, unit: 'kg', category: 'fish', subcategory: 'premium', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400', rating: 4.8, reviews: 234, isFresh: true, discount: 10, weight: '500g - 1kg', description: 'Premium imported salmon, rich in Omega-3, perfect for grilling or baking.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['premium', 'imported', 'omega3'], origin: 'Norway' },
  { id: 'f2', name: 'Tiger Prawns (Jumbo)', price: 649, unit: 'kg', category: 'fish', subcategory: 'shellfish', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', rating: 4.7, reviews: 189, isFresh: true, weight: '250g - 500g', description: 'Large, juicy tiger prawns with firm texture and sweet flavor. Perfect for biryani.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['shellfish', 'biryani', 'jumbo'], origin: 'India' },
  { id: 'f3', name: 'Bluefin Tuna', price: 549, unit: 'kg', category: 'fish', subcategory: 'premium', image: 'https://images.unsplash.com/photo-1611171711791-b34bff4f5e84?w=400', rating: 4.6, reviews: 156, isFresh: true, discount: 15, weight: '300g - 600g', description: 'Sashimi-grade tuna steaks, fresh caught and flash frozen.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['sashimi', 'premium', 'steaks'], origin: 'India' },
  
  // Freshwater Fish - North & Central India
  { id: 'f4', name: 'Rohu (Rui)', price: 299, unit: 'kg', category: 'fish', subcategory: 'freshwater', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', rating: 4.5, reviews: 312, isFresh: true, weight: '1kg - 2kg', description: 'Farm-fresh Rohu, cleaned and ready for your favorite curry. Bengali favorite!', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['curry', 'bengali', 'freshwater'], origin: 'India' },
  { id: 'f5', name: 'Catla (Bengal Carp)', price: 319, unit: 'kg', category: 'fish', subcategory: 'freshwater', image: 'https://images.unsplash.com/photo-1626202384366-c2f2578129d6?w=400', rating: 4.6, reviews: 245, isFresh: true, weight: '1kg - 3kg', description: 'Thick, fleshy fish perfect for fish head curry and traditional preparations.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['curry', 'head-curry', 'bengali'], origin: 'India' },
  { id: 'f6', name: 'Mrigal (Naini)', price: 279, unit: 'kg', category: 'fish', subcategory: 'freshwater', image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400', rating: 4.4, reviews: 178, isFresh: true, weight: '800g - 1.5kg', description: 'Soft, tender flesh ideal for frying and curry preparations.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['fry', 'curry', 'soft'], origin: 'India' },
  { id: 'f7', name: 'Singhara (Catfish)', price: 349, unit: 'kg', category: 'fish', subcategory: 'freshwater', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', rating: 4.7, reviews: 203, isFresh: true, weight: '500g - 1kg', description: 'Boneless delight with soft flesh. Great for patients and elderly.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['boneless', 'soft', 'healthy'], origin: 'India' },
  
  // South Indian Favorites
  { id: 'f8', name: 'Seer Fish (Neymeen/Surmai)', price: 699, unit: 'kg', category: 'fish', subcategory: 'premium', image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400', rating: 4.8, reviews: 425, isFresh: true, discount: 5, weight: '500g - 1.5kg', description: 'Premium seer fish, excellent for fry, curry, or grilling. South Indian favorite!', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['premium', 'fry', 'kerala'], origin: 'India' },
  { id: 'f9', name: 'Silver Pomfret (Avoli)', price: 799, unit: 'kg', category: 'fish', subcategory: 'premium', image: 'https://images.unsplash.com/photo-1626202384366-c2f2578129d6?w=400', rating: 4.9, reviews: 378, isFresh: true, weight: '300g - 600g', description: 'Delicate, buttery pomfret - the king of white fish. Perfect for tawa fry.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['premium', 'buttery', 'fry'], origin: 'India' },
  { id: 'f10', name: 'Black Pomfret (Karutha Avoli)', price: 749, unit: 'kg', category: 'fish', subcategory: 'premium', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', rating: 4.7, reviews: 289, isFresh: true, weight: '400g - 800g', description: 'Rich flavor, firmer texture than white pomfret. Excellent for grilling.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['premium', 'grill', 'rich'], origin: 'India' },
  { id: 'f11', name: 'Mackerel (Ayala/Bangda)', price: 249, unit: 'kg', category: 'fish', subcategory: 'oily', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', rating: 4.5, reviews: 312, isFresh: true, discount: 8, weight: '300g - 500g', description: 'Oily fish rich in Omega-3. Best for fry and curry.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['oily', 'omega3', 'fry'], origin: 'India' },
  { id: 'f12', name: 'Sardine (Mathi/Tarli)', price: 199, unit: 'kg', category: 'fish', subcategory: 'oily', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400', rating: 4.6, reviews: 267, isFresh: true, weight: '100g - 200g per piece', description: 'Small, oily fish perfect for curry and fry. Very affordable and nutritious.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['oily', 'budget', 'curry'], origin: 'India' },
  { id: 'f13', name: 'Anchovy (Nethili/Kozhuva)', price: 229, unit: 'kg', category: 'fish', subcategory: 'small', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', rating: 4.5, reviews: 198, isFresh: true, weight: 'Tiny - perfect for fry', description: 'Tiny fish, big flavor! Crispy fry favorite. Rich in calcium.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['small', 'crispy', 'calcium'], origin: 'India' },
  { id: 'f14', name: 'Sole Fish (Lepo/Manthal)', price: 459, unit: 'kg', category: 'fish', subcategory: 'white', image: 'https://images.unsplash.com/photo-1611171711791-b34bff4f5e84?w=400', rating: 4.6, reviews: 234, isFresh: true, weight: '200g - 400g', description: 'Delicate white fish, almost boneless. Perfect for kids and elderly.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['white', 'boneless', 'kids'], origin: 'India' },
  { id: 'f15', name: 'Pearl Spot (Karimeen)', price: 599, unit: 'kg', category: 'fish', subcategory: 'backwater', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', rating: 4.8, reviews: 445, isFresh: true, discount: 12, weight: '150g - 250g', description: 'Kerala\'s favorite backwater fish. Tender flesh, unique taste. Must try!', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['kerala', 'backwater', 'specialty'], origin: 'Kerala' },
  { id: 'f16', name: 'Red Snapper (Chemballi)', price: 549, unit: 'kg', category: 'fish', subcategory: 'reef', image: 'https://images.unsplash.com/photo-1626202384366-c2f2578129d6?w=400', rating: 4.7, reviews: 312, isFresh: true, weight: '400g - 800g', description: 'Sweet, nutty flavor with firm texture. Excellent for any preparation.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['reef', 'sweet', 'firm'], origin: 'India' },
  { id: 'f17', name: 'Grouper (Neelakohu)', price: 579, unit: 'kg', category: 'fish', subcategory: 'reef', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', rating: 4.6, reviews: 267, isFresh: true, weight: '500g - 2kg', description: 'Mild, sweet flavor with large flakes. Perfect for steaming or curry.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['reef', 'mild', 'steaming'], origin: 'India' },
  
  // Shellfish & Crustaceans
  { id: 'f18', name: 'Live Mud Crab', price: 799, unit: 'kg', category: 'fish', subcategory: 'crab', image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400', rating: 4.8, reviews: 398, isFresh: true, weight: '400g - 800g per crab', description: 'Live crabs delivered fresh. Perfect for pepper crab or curry preparations.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['live', 'crab', 'pepper'], origin: 'India' },
  { id: 'f19', name: 'Squid (Koonthal/Calamari)', price: 459, unit: 'kg', category: 'fish', subcategory: 'cephalopod', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', rating: 4.5, reviews: 234, isFresh: true, weight: '500g pack', description: 'Cleaned and prepared squid rings, ready for frying or stuffing.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['cleaned', 'rings', 'fry'], origin: 'India' },
  { id: 'f20', name: 'Cuttlefish (Kanava)', price: 429, unit: 'kg', category: 'fish', subcategory: 'cephalopod', image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400', rating: 4.4, reviews: 178, isFresh: true, weight: '500g pack', description: 'Tender cuttlefish, softer than squid. Great for curry and fry.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['tender', 'curry', 'soft'], origin: 'India' },
  { id: 'f21', name: 'Lobster (Chemmeen)', price: 1299, unit: 'kg', category: 'fish', subcategory: 'lobster', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', rating: 4.9, reviews: 567, isFresh: true, discount: 5, weight: '300g - 600g', description: 'Premium lobsters for special occasions. Grilled or thermidor style.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['premium', 'lobster', 'special'], origin: 'India' },
  { id: 'f22', name: 'White Prawns', price: 549, unit: 'kg', category: 'fish', subcategory: 'shellfish', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', rating: 4.6, reviews: 289, isFresh: true, weight: '300g - 500g', description: 'Sweet, delicate white prawns. Perfect for pulao and curry.', inStock: true, pricingMode: 'weight', vendorEnabled: true, vendorId: '1', tags: ['white', 'sweet', 'pulao'], origin: 'India' },
];

// Complete Meat Catalog - All meats available in Bangalore
const ALL_MEAT_PRODUCTS: Product[] = [
  // Chicken Varieties - With Skin/Without Skin Options
  { 
    id: 'm1', 
    name: 'Broiler Chicken', 
    price: 240, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 
    rating: 4.5, 
    reviews: 312, 
    isFresh: true, 
    discount: 5, 
    weight: '1kg - 1.5kg whole bird', 
    description: 'Farm-raised broiler chicken. Choose with skin (₹240/kg) or without skin (₹260/kg).', 
    inStock: true,
    pricingMode: 'custom',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
      { id: '2kg', label: '2 Kg', value: 2000, unit: 'g', type: 'fixed' },
    ],
    variants: [
      { id: 'with-skin', name: 'With Skin', pricePerKg: 240, isAvailable: true },
      { id: 'without-skin', name: 'Without Skin', pricePerKg: 260, isAvailable: true },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['broiler', 'whole', 'fresh'],
    isOrganic: false
  },
  { 
    id: 'm2', 
    name: 'Naatu Kozhi (Country Chicken)', 
    price: 450, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea7796?w=400', 
    rating: 4.8, 
    reviews: 245, 
    isFresh: true, 
    weight: '800g - 1.2kg whole bird', 
    description: 'Free-range country chicken with rich flavor. Traditional naatu kozhi, perfect for authentic curries.', 
    inStock: true,
    pricingMode: 'custom',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    variants: [
      { id: 'with-skin', name: 'With Skin', pricePerKg: 450, isAvailable: true },
      { id: 'without-skin', name: 'Without Skin', pricePerKg: 480, isAvailable: true },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['country', 'naatu', 'free-range', 'organic'],
    isOrganic: true
  },
  { 
    id: 'm3', 
    name: 'Chicken Breast (Boneless)', 
    price: 320, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 
    rating: 4.6, 
    reviews: 278, 
    isFresh: true, 
    discount: 5, 
    weight: '500g pack', 
    description: 'Lean, boneless chicken breast. Perfect for grilling, salads, and healthy meals.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['breast', 'boneless', 'lean', 'healthy']
  },
  { 
    id: 'm4', 
    name: 'Chicken Drumsticks', 
    price: 280, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', 
    rating: 4.7, 
    reviews: 198, 
    isFresh: true, 
    discount: 8, 
    weight: '6-8 pieces per kg', 
    description: 'Juicy chicken drumsticks, perfect for fry, roast, or curry.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['drumsticks', 'fry', 'roast']
  },
  { 
    id: 'm5', 
    name: 'Chicken Wings', 
    price: 260, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', 
    rating: 4.5, 
    reviews: 234, 
    isFresh: true, 
    discount: 12, 
    weight: '12-15 pieces per kg', 
    description: 'Whole chicken wings, perfect for BBQ, hot wings, or air frying.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['wings', 'bbq', 'party']
  },
  { 
    id: 'm6', 
    name: 'Chicken Lollipop', 
    price: 340, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 
    rating: 4.8, 
    reviews: 312, 
    isFresh: true, 
    weight: '10-12 pieces per kg', 
    description: 'Frenched chicken lollipops, ready for marination and deep frying.',
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['lollipop', 'starter', 'fried']
  },
  
  // Mutton (Goat Meat)
  { 
    id: 'm7', 
    name: 'Mutton Curry Cut', 
    price: 699, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'mutton',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400', 
    rating: 4.8, 
    reviews: 401, 
    isFresh: true, 
    discount: 8,
    weight: '500g pack with bone', 
    description: 'Tender goat meat with bone, cut perfect for traditional curries and biryani.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['mutton', 'curry-cut', 'bone', 'biryani']
  },
  { 
    id: 'm8', 
    name: 'Mutton Boneless', 
    price: 899, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'mutton',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400', 
    rating: 4.7, 
    reviews: 234, 
    isFresh: true, 
    weight: '500g pack boneless', 
    description: 'Premium boneless mutton, perfect for kebabs, roasts, and special dishes.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['mutton', 'boneless', 'kebab', 'premium']
  },
  { 
    id: 'm9', 
    name: 'Mutton Mince (Kheema)', 
    price: 749, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'mutton',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400', 
    rating: 4.6, 
    reviews: 178, 
    isFresh: true, 
    weight: '500g pack', 
    description: 'Freshly minced goat meat, perfect for keema curry, cutlets, and stuffing.', 
    inStock: true,
    pricingMode: 'weight',
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['mutton', 'mince', 'keema', 'fresh']
  },
  
  // Beef
  { 
    id: 'm10', 
    name: 'Beef Curry Cut', 
    price: 349, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'beef',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400', 
    rating: 4.5, 
    reviews: 267, 
    isFresh: true, 
    discount: 10, 
    weight: '500g pack with bone', 
    description: 'Tender beef with bone, perfect for Kerala-style beef curry and roast.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['beef', 'curry', 'kerala-style']
  },
  { 
    id: 'm11', 
    name: 'Beef Boneless', 
    price: 449, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'beef',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400', 
    rating: 4.6, 
    reviews: 198, 
    isFresh: true, 
    weight: '500g pack', 
    description: 'Lean boneless beef, perfect for stir-fry, steaks, and quick cooking.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['beef', 'boneless', 'lean', 'steak']
  },
  { 
    id: 'm12', 
    name: 'Ribeye Steak', 
    price: 899, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'beef',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400', 
    rating: 4.8, 
    reviews: 167, 
    isFresh: true, 
    discount: 15, 
    weight: '250g - 400g steaks', 
    description: 'Premium marbled ribeye steak, aged for maximum tenderness. Restaurant quality.', 
    inStock: true,
    pricingMode: 'weight',
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['beef', 'steak', 'premium', 'ribeye']
  },
  
  // Pork
  { 
    id: 'm13', 
    name: 'Pork Curry Cut', 
    price: 399, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'pork',
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 
    rating: 4.6, 
    reviews: 234, 
    isFresh: true, 
    discount: 5,
    weight: '500g pack with bone', 
    description: 'Fresh pork with bone, perfect for Coorg-style pork curry and vindaloo.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['pork', 'curry', 'coorg', 'vindaloo']
  },
  { 
    id: 'm14', 
    name: 'Pork Belly', 
    price: 499, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'pork',
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 
    rating: 4.8, 
    reviews: 189, 
    isFresh: true, 
    weight: '500g pack', 
    description: 'Premium pork belly with perfect fat ratio. Ideal for crispy pork belly dishes.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['pork', 'belly', 'crispy', 'premium']
  },
  { 
    id: 'm15', 
    name: 'Pork Ribs', 
    price: 459, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'pork',
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 
    rating: 4.7, 
    reviews: 156, 
    isFresh: true, 
    weight: '800g - 1kg rack', 
    description: 'Tender pork ribs, perfect for BBQ, grilling, or slow cooking.', 
    inStock: true,
    pricingMode: 'weight',
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['pork', 'ribs', 'bbq', 'grill']
  },
  
  // Duck
  { 
    id: 'm16', 
    name: 'Whole Duck', 
    price: 599, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'duck',
    image: 'https://images.unsplash.com/photo-1574672280609-4b487f92f313?w=400', 
    rating: 4.6, 
    reviews: 98, 
    isFresh: true, 
    weight: '1.5kg - 2kg whole bird', 
    description: 'Whole duck with skin, perfect for roasting, Peking duck, or rich curries.', 
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['duck', 'whole', 'roast', 'rich']
  },
  { 
    id: 'm17', 
    name: 'Duck Breast', 
    price: 749, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'duck',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400', 
    rating: 4.7, 
    reviews: 67, 
    isFresh: true, 
    weight: '400g - 600g pack', 
    description: 'Rich, flavorful duck breast with crispy skin when cooked. Restaurant quality.', 
    inStock: true,
    pricingMode: 'weight',
    vendorEnabled: true, 
    vendorId: '2', 
    tags: ['duck', 'breast', 'premium', 'crispy']
  },
  
  // Turkey
  { 
    id: 'm18', 
    name: 'Turkey Whole', 
    price: 549, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'turkey',
    image: 'https://images.unsplash.com/photo-1574672280609-4b487f92f313?w=400', 
    rating: 4.5, 
    reviews: 89, 
    isFresh: true, 
    weight: '3kg - 5kg whole bird', 
    description: 'Whole turkey, perfect for special occasions and Christmas feasts.',
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
      { id: '500g', label: '500g', value: 500, unit: 'g', type: 'fixed' },
      { id: '1kg', label: '1 Kg', value: 1000, unit: 'g', type: 'fixed' },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['turkey', 'whole', 'festive', 'healthy']
  },
  
  // Quail & Other Birds
  { 
    id: 'm19', 
    name: 'Quail (Kada)', 
    price: 299, 
    unit: 'piece', 
    category: 'meat', 
    subcategory: 'quail',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 
    rating: 4.6, 
    reviews: 134, 
    isFresh: true, 
    weight: '200g - 250g per bird', 
    description: 'Whole quail, perfect for roast or rich curries. Tender and flavorful.',
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['quail', 'kada', 'whole', 'roast']
  },
  { 
    id: 'm20', 
    name: 'Chicken Lollipop', 
    price: 249, 
    unit: 'kg', 
    category: 'meat', 
    subcategory: 'chicken',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 
    rating: 4.6, 
    reviews: 134, 
    isFresh: true, 
    weight: '200g - 250g per piece', 
    description: 'Crispy fried chicken lollipop, perfect for snacks or appetizers.',
    inStock: true,
    pricingMode: 'weight',
    pricingOptions: [
      { id: '100rs', label: '₹100 worth', value: 100, unit: 'g', type: 'calculated' },
      { id: '200rs', label: '₹200 worth', value: 200, unit: 'g', type: 'calculated' },
      { id: '300rs', label: '₹300 worth', value: 300, unit: 'g', type: 'calculated' },
      { id: '400rs', label: '₹400 worth', value: 400, unit: 'g', type: 'calculated' },
    ],
    vendorEnabled: true,
    vendorId: '2',
    tags: ['chicken', 'lollipop', 'crispy', 'snack']
  },
];

export const STORE_DATA: Record<string, StoreData> = {
  '1': {
    id: '1',
    name: 'Ocean Fresh Fish Market',
    type: 'fish',
    address: '123 Marine Drive, Coastal Area, Mumbai',
    distance: 0.8,
    rating: 4.5,
    reviews: 1250,
    phone: '+91 98765 43210',
    hours: '6:00 AM - 9:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=400',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
    products: ALL_FISH_PRODUCTS,
    categories: [
      { id: 'premium', name: 'Premium Seafood', icon: 'crown', enabled: true, sortOrder: 1 },
      { id: 'freshwater', name: 'Freshwater Fish', icon: 'waves', enabled: true, sortOrder: 2 },
      { id: 'shellfish', name: 'Shellfish & Crabs', icon: 'shell', enabled: true, sortOrder: 3 },
      { id: 'backwater', name: 'Backwater Special', icon: 'fish', enabled: true, sortOrder: 4 },
    ],
    deliveryTime: '15-25 min',
    minOrder: 200,
    deliveryFee: 30,
    description: 'Premium seafood market bringing fresh catch directly from fishermen to your table.',
    established: '2015',
    certifications: ['FSSAI Certified', 'HACCP Compliant'],
    features: ['Live Seafood', 'Custom Cutting', 'Home Delivery'],
    acceptsCustomOrders: true,
    pricePer100gEnabled: true,
    pricePer200gEnabled: true
  },
  '2': {
    id: '2',
    name: 'Premium Meat House',
    type: 'meat',
    address: '45 Butcher Street, Meat District, Delhi',
    distance: 1.2,
    rating: 4.3,
    reviews: 890,
    phone: '+91 98765 43211',
    hours: '8:00 AM - 8:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9756, lng: 77.5986 },
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=1200',
    products: ALL_MEAT_PRODUCTS,
    categories: [
      { id: 'chicken', name: 'Chicken', icon: 'chicken', enabled: true, sortOrder: 1 },
      { id: 'mutton', name: 'Mutton & Goat', icon: 'beef', enabled: true, sortOrder: 2 },
      { id: 'beef', name: 'Beef', icon: 'beef', enabled: true, sortOrder: 3 },
      { id: 'pork', name: 'Pork', icon: 'pig', enabled: true, sortOrder: 4 },
      { id: 'exotic', name: 'Duck, Turkey & Quail', icon: 'bird', enabled: true, sortOrder: 5 },
    ],
    deliveryTime: '20-30 min',
    minOrder: 300,
    deliveryFee: 40,
    description: 'Artisanal butcher shop offering premium cuts and aged meats.',
    established: '2010',
    certifications: ['Halal Certified', 'FSSAI Certified'],
    features: ['Aged Meats', 'Custom Cuts', 'Marinades Available'],
    acceptsCustomOrders: true,
    pricePer100gEnabled: true,
    pricePer200gEnabled: true
  },
  '3': {
    id: '3',
    name: 'Fresh Catch & Butcher',
    type: 'both',
    address: '78 Market Road, Central Hub, Bangalore',
    distance: 2.1,
    rating: 4.7,
    reviews: 2100,
    phone: '+91 98765 43212',
    hours: '5:30 AM - 10:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9616, lng: 77.5846 },
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400',
    coverImage: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=1200',
    products: [...ALL_FISH_PRODUCTS.slice(0, 3), ...ALL_MEAT_PRODUCTS.slice(0, 2)],
    categories: [
      { id: 'fish', name: 'Fresh Fish', icon: 'fish', enabled: true, sortOrder: 1 },
      { id: 'chicken', name: 'Chicken', icon: 'chicken', enabled: true, sortOrder: 2 },
    ],
    deliveryTime: '25-35 min',
    minOrder: 250,
    deliveryFee: 25,
    description: 'Your one-stop shop for both premium seafood and quality meats.',
    established: '2010',
    certifications: ['FSSAI Certified', 'Quality Assured'],
    features: ['Fish & Meat', 'Ready to Cook', 'Family Packs'],
    acceptsCustomOrders: true,
    pricePer100gEnabled: true,
    pricePer200gEnabled: true
  },
  '4': {
    id: '4',
    name: 'Daily Fresh Seafood',
    type: 'fish',
    address: '22 Fisherman Wharf, Harbor Area, Kochi',
    distance: 3.5,
    rating: 4.2,
    reviews: 567,
    phone: '+91 98765 43213',
    hours: '5:00 AM - 7:00 PM',
    isOpen: false,
    coordinates: { lat: 12.9816, lng: 77.6046 },
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    coverImage: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=1200',
    products: ALL_FISH_PRODUCTS.slice(2, 4),
    categories: [
      { id: 'fresh', name: 'Harbor Fresh', icon: 'anchor', enabled: true, sortOrder: 1 },
      { id: 'oily', name: 'Oily Fish', icon: 'waves', enabled: true, sortOrder: 2 },
    ],
    deliveryTime: '30-40 min',
    minOrder: 150,
    deliveryFee: 50,
    description: 'Direct from the harbor to your home. Guaranteed fresh catch every morning.',
    established: '2018',
    certifications: ['FSSAI Certified'],
    features: ['Harbor Fresh', 'Early Delivery'],
    acceptsCustomOrders: true,
    pricePer100gEnabled: true,
    pricePer200gEnabled: true
  },
  '5': {
    id: '5',
    name: 'Royal Meat Palace',
    type: 'meat',
    address: '156 Palace Road, City Center, Hyderabad',
    distance: 4.2,
    rating: 4.6,
    reviews: 1580,
    phone: '+91 98765 43214',
    hours: '9:00 AM - 9:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9916, lng: 77.6146 },
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    coverImage: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=1200',
    products: ALL_MEAT_PRODUCTS.slice(1, 4),
    categories: [
      { id: 'premium', name: 'Premium Meats', icon: 'crown', enabled: true, sortOrder: 1 },
      { id: 'mutton', name: 'Mutton', icon: 'beef', enabled: true, sortOrder: 2 },
      { id: 'beef', name: 'Beef & Steaks', icon: 'beef', enabled: true, sortOrder: 3 },
    ],
    deliveryTime: '35-45 min',
    minOrder: 500,
    deliveryFee: 60,
    description: 'Luxury meat boutique offering imported and premium local varieties.',
    established: '2012',
    certifications: ['Premium Partner', 'FSSAI Certified'],
    features: ['Imported Meats', 'Aged Steaks'],
    acceptsCustomOrders: false,
    pricePer100gEnabled: false,
    pricePer200gEnabled: false
  },
  '6': {
    id: '6',
    name: 'Coastal Fish Hub',
    type: 'fish',
    address: '33 Beach Road, Seaside, Chennai',
    distance: 5.1,
    rating: 4.4,
    reviews: 945,
    phone: '+91 98765 43215',
    hours: '6:00 AM - 8:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9516, lng: 77.5746 },
    image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400',
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200',
    products: ALL_FISH_PRODUCTS.slice(0, 3),
    categories: [
      { id: 'local', name: 'Local Favorites', icon: 'fish', enabled: true, sortOrder: 1 },
      { id: 'shellfish', name: 'Shellfish', icon: 'shell', enabled: true, sortOrder: 2 },
    ],
    deliveryTime: '40-50 min',
    minOrder: 300,
    deliveryFee: 70,
    description: 'Coastal specialty store with wide variety of local and imported seafood.',
    established: '2016',
    certifications: ['FSSAI Certified'],
    features: ['Local Varieties', 'Export Quality'],
    acceptsCustomOrders: true,
    pricePer100gEnabled: true,
    pricePer200gEnabled: true
  }
};

