export interface ProductItem {
  id: string;
  category: 'women' | 'men';
  categoryName: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  howToUse: string;
  size: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  activeMatrix?: string;
  benefits: string[];
}

export const PRODUCTS: ProductItem[] = [
  // --- WOMEN COLLECTION ---
  {
    id: 'prod-w-1',
    category: 'women',
    categoryName: 'Women Collection',
    name: 'Women Face Wash',
    slug: 'women-face-wash-100ml',
    subtitle: 'Rosewater & Botanical Hydration Cleanser',
    description:
      'Velvety botanical foaming cleanser infused with Damask Rose Hydrosol, Aloe Vera, and mild amino acids that gently washes away impurities while maintaining dewy moisture.',
    howToUse:
      'Pump into damp hands and massage across face and neck in soft upward circular motions for 60 seconds. Rinse with cool or tepid water and pat dry with a soft muslin towel.',
    size: '100ml / 3.4 fl. oz',
    price: 1950,
    salePrice: 1650,
    sku: 'EBA-W-FW100',
    stock: 150,
    rating: 4.9,
    reviewsCount: 312,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkv5jVPPTESDqRukEOVPhDdyl8VS4CvYWHOSOPukgL9jJixKDUcHcsY2B0lKkhoqelpkgzzWTLRM6kAqQigYusDKXpxYlZBYskWxvO8jq2vAYzWDsL_geWxXSfxSQLaOhR_HEuwhXNlCXBfiOB08fBWp2DrTAg2Pe_fLxISsln5sj8QVN3IP8V3B-bo70OnfIe4LQs4VG8IT8Kr4KrK2NVcuSzvkHroPpG4sUjbf-RC9OrDFcy-IBPYQ',
    badge: 'Gentle Purity Formula',
    activeMatrix: 'Organic Damask Rose Hydrosol + Amino Surfactants & Provitamin B5',
    benefits: [
      'Gently dissolves dust, excess sebum, and makeup',
      'Protects the delicate epidermal moisture barrier',
      'Prevents post-wash dryness in arid and air-conditioned environments',
    ],
  },
  {
    id: 'prod-w-2',
    category: 'women',
    categoryName: 'Women Collection',
    name: 'Beauty Glow Serum',
    slug: 'beauty-glow-serum-30ml',
    subtitle: '10% Niacinamide + Alpha Arbutin & 24K Gold Micro-Infusion',
    description:
      'Multi-molecular Hyaluronic Acid blended with 24K Gold micro-flecks, stabilized Vitamin C, and Niacinamide for immediate glass-skin radiance and long-term collagen synthesis under local climate conditions.',
    howToUse:
      'Dispense 3-4 drops directly onto cleansed skin. Gently press with palms into the face and decolletage until fully absorbed. Follow with moisturizer in the evening or SPF in the daytime.',
    size: '30ml / 1.0 fl. oz',
    price: 3450,
    salePrice: 2850,
    sku: 'EBA-W-BGS30',
    stock: 140,
    rating: 5.0,
    reviewsCount: 892,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeLyXcefQA73i9Aso3aZUrTsrf5RUVKwqPicHaZl8TzywoMyOhpZTBUSBMdYS3OdTzqlJLx5xZ1kg0KFfiucvAi7zOzprzRYQqO1_o2e4CQlHntUfFun1iL-zWohMns3qR6GYMx1LDLTHgiFuk5iykgqTHfSDHn1C6NVR31USJcj_UlBS2WCFOtf3W24tadmy37k3eWdsiwWgNqhD5Uuwsu9JmdrYw4xkrpIGYUP-FG2YpVCUPBpuPOw',
    badge: 'Pakistan #1 Best Seller',
    activeMatrix: '10% Niacinamide + Alpha Arbutin & 24K Pure Gold Micro-Suspension',
    benefits: [
      'Visible luminosity within 14 days of daily application',
      'Diminishes stubborn hyperpigmentation and sun spots',
      'Non-sticky, rapid absorbing water-gel texture',
    ],
  },
  {
    id: 'prod-w-3',
    category: 'women',
    categoryName: 'Women Collection',
    name: 'Beauty Night Whitening Cream',
    slug: 'women-beauty-night-whitening-cream-50gm',
    subtitle: 'Pure Glutathione + Multi-Peptides & Hyaluronic 4D Matrix',
    description:
      'Rich regenerative nighttime elixir with Licorice Root, Squalane, and Niacinamide. Evens skin tone, reduces stubborn blemishes, and produces waking luminosity.',
    howToUse:
      'Warm a pearl-sized amount between fingertips and smooth upward over face and decolletage every night before sleep.',
    size: '50gm / Net Wt. 1.76 oz',
    price: 2750,
    salePrice: 2350,
    sku: 'EBA-W-NWC50',
    stock: 110,
    rating: 4.9,
    reviewsCount: 446,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjFQ7jlCLBZzcuK8c28gT-PwZ5CaBpz5ZGoyrbe6zKB4-oIWoa-gKx2wA9ucKzo9w_ocgsub9-HIT-_JftPqrmIgJV4BxCPAjl0DWDb6xpvOCT8Zs6lqg-GvwPpiNAeV03V73l73XadFMUtY8UvomB34YnfhEv9w0UFiH_cUJHamD9oq0YIUxGBOfe3b8AgXapwuhsqXeHW1fNpmqFHGpFYY3lqw-LlVWvTv15hCFPccRIaOvUHGj9Jg',
    badge: 'Clinical Award Winner',
    activeMatrix: 'Pure Glutathione + Multi-Peptides & Hyaluronic 4D Moisture Lock',
    benefits: [
      'Overnight deep cellular repair and replenishment',
      'Fades dark acne scars and uneven melanin patches',
      'Sinks deeply without greasy residue on bedding',
    ],
  },

  // --- MEN COLLECTION ---
  {
    id: 'prod-m-1',
    category: 'men',
    categoryName: 'Men Collection',
    name: 'Men Face Wash',
    slug: 'men-face-wash-100ml',
    subtitle: 'Volcanic Charcoal Detox & Active Sebum Control',
    description:
      'Activated volcanic charcoal detox cleanser that extracts urban impurities, controls sebum, and tightens pores without stripping moisture.',
    howToUse:
      'Lather a dime-sized amount with lukewarm water. Massage gently onto damp skin in circular motions for 60 seconds. Rinse thoroughly with cool water.',
    size: '100ml / 3.4 fl. oz',
    price: 2100,
    salePrice: 1750,
    sku: 'EBA-M-FW100',
    stock: 120,
    rating: 4.8,
    reviewsCount: 284,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qZKfD-MmNm5hiTS0HR2ypZ0igcS6R30TPE3Xf10lTaRD9-R6qXgi0w2Wu03vrOF4jWOw85hlWh9ScTihOZ-pgdzAOLXjtRYY_aukHaqLSevRJS0l4ztJNpZabWPnX_1ALl_vC19arWn07UgRWg9wZNBGWULzs0Gt-8Xad_k9eX7-DstSzrErdwitiv8nqunUa9qxw7goA7MGiHygDpenhWwEH_cEQoQ1Z8wJEAB14aRszcSwRShcZA',
    badge: 'Detox Pore Refining',
    activeMatrix: 'Bamboo Charcoal + Tea Tree Extracts & Salicylic Acid (BHA)',
    benefits: [
      'Eliminates daily city grime and exhaust oxidation',
      'Prevents ingrown hairs and post-shave irritation',
      'Delivers long-lasting matte feel for 12+ hours',
    ],
  },
  {
    id: 'prod-m-2',
    category: 'men',
    categoryName: 'Men Collection',
    name: "Men's Active Defense Glow Serum",
    slug: 'men-beauty-glow-serum-30ml',
    subtitle: '15% Vitamin C Complex + Zinc PCA & Hyaluronic Acid',
    description:
      'Triple-strength Niacinamide + Zinc PCA and Hyaluronic concentrate designed to energize fatigued skin, combat sun damage, and impart subtle matte radiance.',
    howToUse:
      'Dispense 3-4 drops onto palms and pat gently onto clean skin before moisturizer. Ideal for morning and evening routines.',
    size: '30ml / 1.0 fl. oz',
    price: 3500,
    salePrice: 2950,
    sku: 'EBA-M-BGS30',
    stock: 95,
    rating: 4.9,
    reviewsCount: 124,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCr1Jp8uumCCUCOxIYh8cIyenPX-UNT86WuZMaoGw8Hsrsd6BUhMZERjHAd9z638rb3cBDEw6wokPU8gKjZ_UQLE9O-EWJ4O49bCHISnjNywSPp44sWdxeVfDeIXUG11-C1Q5aS7Yi1ziwTZloCQCHEAzGLZk0GIYoaDdzvLXjed_hayTOmAIdrDd5tvm_RnXV4x5jz7Phoah_utbJne_l4MC_0E8J3Stc03SLV8YU8YLLOD62HkA_kQg',
    badge: 'High Potency Defense',
    activeMatrix: '15% Stabilized Vitamin C Complex + Zinc PCA & Hyaluronic Acid',
    benefits: [
      'Corrects sun-induced hyperpigmentation from daily commutes',
      'Zero greasy shine; dries to an invisible matte barrier',
      'Boosts cellular vitality and soothes razor burn',
    ],
  },
  {
    id: 'prod-m-3',
    category: 'men',
    categoryName: 'Men Collection',
    name: 'Men Beauty Night Whitening Cream',
    slug: 'men-beauty-night-whitening-cream-50gm',
    subtitle: 'Night Barrier Defense & Pigmentation Complex',
    description:
      'High-potency night repair formula infused with Alpha Arbutin, Ceramides, and Peptides to fade hyperpigmentation and restore the moisture barrier.',
    howToUse:
      'Apply evenly across cleansed face and neck every evening before sleep. Press lightly with fingertips until fully absorbed.',
    size: '50gm / Net Wt. 1.76 oz',
    price: 2650,
    salePrice: 2250,
    sku: 'EBA-M-NWC50',
    stock: 85,
    rating: 4.8,
    reviewsCount: 198,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCs_moTyGQeNGOpApyIJFUdOjXL3H6vUwHS_OhqnthAZTnIG1kokac2EZN0l7o00posXzt8Zw4K04cxtZZ3bTtLhGGHfTmlVGz_wrrWo6Dg5X7AWI1f3iqtPYftzPdR7iZawSZPb98fO6fsySYFrf3hMu4vaWMO1KXNL8RVxu2sUJ_EIg2dLkTuH415eBhhiAQVmuSs5zooCLWAhm5yDwhaEHg8pBB1jAbn5459PITcv2h3e5nHlqpBBA',
    badge: 'Intense Dermal Repair',
    activeMatrix: 'Ceramides Complex + Alpha Arbutin & Peptides Shield',
    benefits: [
      'Fortifies thick epidermal barrier against seasonal dryness',
      'Repairs UV cellular trauma while you rest',
      'Locks in deep moisture without clogging pores',
    ],
  },
];

export function getProductBySlug(slug: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: 'women' | 'men'): ProductItem[] {
  return PRODUCTS.filter((p) => p.category === category);
}
