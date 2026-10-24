// Mock Data for Cayman Islands Multi-Vendor E-Commerce Platform

export const CAYMAN_DISTRICTS = [
  "Georgetown",
  "Seven Mile Beach",
  "West Bay",
  "Bodden Town",
  "East End",
  "North Side",
  "Cayman Brac",
  "Little Cayman"
];

export const CATEGORIES = [
  { id: "cat-1", name: "Artisanal Crafts", icon: "Palette", count: 24, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-2", name: "Beach & Watersports", icon: "Waves", count: 18, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-3", name: "Gourmet Food & Rum", icon: "Utensils", count: 32, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-4", name: "Duty-Free Luxury", icon: "Watch", count: 15, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-5", name: "Island Apparel", icon: "Shirt", count: 29, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-6", name: "Cayman Souvenirs", icon: "Gift", count: 41, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80" },
];

export const INITIAL_VENDORS = [
  {
    id: "v-101",
    store_name: "Grand Cayman Artisan Hub",
    stall_number: "Stall #04",
    stall_tag: "Craft Market Stall",
    specialty: "Caymanite Gemstones & Woven Thatch",
    is_open_now: true,
    slug: "grand-cayman-artisans",
    owner_name: "Sarah Ebanks",
    phone: "+1 (345) 949-1234",
    email: "sarah@caymanartisans.ky",
    logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230F1F38' stroke='%23F59E0B' stroke-width='3'/><path d='M50 20 L58 40 L80 40 L62 54 L69 76 L50 62 L31 76 L38 54 L20 40 L42 40 Z' fill='%23F59E0B'/><text x='50' y='90' font-size='10' font-family='serif' fill='%2300E5C9' text-anchor='middle' font-weight='bold'>ARTISAN</text></svg>",
    banner: "/cayman_stall_artisan.jpg",
    district: "Georgetown",
    address: "Cardinall Avenue, Craft Market Stall #4, Georgetown, Grand Cayman",
    rating: 4.9,
    reviews_count: 84,
    verified: true,
    status: "active",
    wallet_balance: 145.50, // KYD
    commission_rate: 0.10, // 10%
    bio: "Authentic hand-carved Caymanite jewelry, woven palm art, and locally crafted island souvenirs.",
    policies: {
      return_policy: "7-day return policy for unused items with original receipt.",
      pickup_policy: "Holds reserved items for 48 hours. Please present 4-digit PIN or QR code upon arrival.",
      shipping_policy: "Curbside pickup & local island delivery available across Grand Cayman."
    },
    social_connections: {
      instagram: "@cayman_artisan_hub",
      facebook: "facebook.com/GrandCaymanArtisanHub",
      tiktok: "@caymanartisans",
      pinterest: "pinterest.com/caymanartisans"
    },
    hours: "Mon - Sat: 9:00 AM - 6:00 PM"
  },
  {
    id: "v-102",
    store_name: "Seven Mile Surf & Watersports",
    stall_number: "Stall #12",
    stall_tag: "Beachside Watersport Shack",
    specialty: "Panoramic Snorkel Gear & Reef Wear",
    is_open_now: true,
    slug: "seven-mile-surf",
    owner_name: "Marcus Bodden",
    phone: "+1 (345) 945-8899",
    email: "marcus@7milesurf.ky",
    logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23081E36' stroke='%2300E5C9' stroke-width='3'/><path d='M25 65 Q 40 40 55 55 T 85 45' fill='none' stroke='%2300E5C9' stroke-width='5' stroke-linecap='round'/><circle cx='50' cy='35' r='12' fill='%23FBBF24'/><text x='50' y='88' font-size='11' font-family='sans-serif' fill='%23FFFFFF' text-anchor='middle' font-weight='900'>7-MILE</text></svg>",
    banner: "/cayman_watersports_stall.jpg",
    district: "Seven Mile Beach",
    address: "West Bay Road, Plaza #12, Seven Mile Beach, Grand Cayman",
    rating: 4.8,
    reviews_count: 112,
    verified: true,
    status: "active",
    wallet_balance: 210.00, // KYD
    commission_rate: 0.10,
    bio: "Premium snorkeling gear, eco-friendly beachwear, reef-safe sunscreen, and paddleboard accessories.",
    policies: {
      return_policy: "14-day exchange policy for unworn apparel & sealed gear.",
      pickup_policy: "Store pickup available daily 8 AM - 7 PM with 4-digit PIN.",
      shipping_policy: "Free Seven Mile Beach resort delivery on orders above $50 KYD."
    },
    social_connections: {
      instagram: "@7milesurf_cayman",
      facebook: "facebook.com/7MileSurfCayman",
      tiktok: "@7milesurf",
      pinterest: ""
    },
    hours: "Daily: 8:00 AM - 7:00 PM"
  },
  {
    id: "v-103",
    store_name: "Rum Point Gourmet & Spices",
    stall_number: "Stall #02",
    stall_tag: "Island Bakery & Spice Cabin",
    specialty: "Tortuga Rum Cakes & Scotch Bonnet Sauces",
    is_open_now: true,
    slug: "rum-point-gourmet",
    owner_name: "Chef Anthony Rivers",
    phone: "+1 (345) 947-4433",
    email: "chef@rumpointgourmet.ky",
    logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%232D150B' stroke='%23D97706' stroke-width='3'/><rect x='32' y='28' width='36' height='42' rx='10' fill='%23B45309' stroke='%23FDE68A' stroke-width='2'/><line x1='32' y1='42' x2='68' y2='42' stroke='%23FDE68A' stroke-width='2'/><line x1='32' y1='56' x2='68' y2='56' stroke='%23FDE68A' stroke-width='2'/><text x='50' y='88' font-size='10' font-family='serif' fill='%23FDE68A' text-anchor='middle' font-weight='bold'>RUM POINT</text></svg>",
    banner: "/cayman_rum_spice_stall.jpg",
    district: "North Side",
    address: "Rum Point Drive, Cottage #2, North Side, Grand Cayman",
    rating: 4.95,
    reviews_count: 96,
    verified: true,
    status: "active",
    wallet_balance: 88.00, // KYD
    commission_rate: 0.10,
    bio: "Famous Cayman Tortuga rum cakes, artisanal Scotch Bonnet hot sauces, gourmet sea salt, and Caribbean spice rubs.",
    policies: {
      return_policy: "All food items are final sale. Replacement offered for damaged goods.",
      pickup_policy: "Store pickup available at North Side location or Georgetown pop-up booth.",
      shipping_policy: "COD Island-wide courier delivery within 24 hours."
    },
    social_connections: {
      instagram: "@rumpoint_gourmet",
      facebook: "facebook.com/RumPointGourmet",
      tiktok: "",
      pinterest: ""
    },
    hours: "Mon - Sun: 10:00 AM - 5:00 PM"
  },
  {
    id: "v-104",
    store_name: "Georgetown Duty-Free Gems",
    stall_number: "Boutique #201",
    stall_tag: "Cruise Port Duty-Free Showcase",
    specialty: "Blue Larimar & Nautical Timepieces",
    is_open_now: true,
    slug: "georgetown-duty-free",
    owner_name: "Elena Rostova",
    phone: "+1 (345) 949-9900",
    email: "elena@georgetowngems.ky",
    logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230A1428' stroke='%23FCD34D' stroke-width='3'/><path d='M26 60 L32 35 L44 48 L50 30 L56 48 L68 35 L74 60 Z' fill='%23F59E0B' stroke='%23FEF3C7' stroke-width='2'/><circle cx='50' cy='62' r='3' fill='%2300E5C9'/><text x='50' y='88' font-size='10' font-family='serif' fill='%23FCD34D' text-anchor='middle' font-weight='bold'>GEMS KY</text></svg>",
    banner: "/cayman_duty_free_boutique.jpg",
    district: "Georgetown",
    address: "Harbour Drive, Suite 201, Cruise Port Walkway, Georgetown",
    rating: 4.7,
    reviews_count: 53,
    verified: true,
    status: "active",
    wallet_balance: 340.00, // KYD
    commission_rate: 0.10,
    bio: "Duty-free Swiss timepieces, fine Larimar silver jewelry, custom nautical pendants, and luxury sunglasses.",
    policies: {
      return_policy: "30-day international warranty and 7-day money back guarantee.",
      pickup_policy: "Express cruise port pickup booth available with 4-digit PIN & QR.",
      shipping_policy: "Courier delivery to all Grand Cayman hotels & condos."
    },
    social_connections: {
      instagram: "@georgetown_gems_ky",
      facebook: "facebook.com/GeorgetownDutyFreeGems",
      tiktok: "@georgetowngems",
      pinterest: "pinterest.com/georgetowngems"
    },
    hours: "Mon - Sat: 9:00 AM - 5:00 PM"
  },
  {
    id: "v-105",
    store_name: "Bodden Town Coral Crafts",
    stall_number: "Stall #08",
    stall_tag: "Historic Square Craft Booth",
    specialty: "Handmade Seashell Gifts & Coconut Wax",
    is_open_now: true,
    slug: "bodden-town-crafts",
    owner_name: "Clara Miller",
    phone: "+1 (345) 947-1122",
    email: "clara@boddentowncrafts.ky",
    logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%231E1838' stroke='%23F472B6' stroke-width='3'/><circle cx='50' cy='46' r='18' fill='%23EC4899'/><path d='M50 22 C64 22 72 36 72 50 C72 65 58 72 50 72 C42 72 28 65 28 50 C28 36 36 22 50 22 Z' fill='none' stroke='%23FCE7F3' stroke-width='3'/><text x='50' y='90' font-size='9' font-family='sans-serif' fill='%23FCE7F3' text-anchor='middle' font-weight='bold'>BODDEN</text></svg>",
    banner: "/cayman_market_promenade.jpg",
    district: "Bodden Town",
    address: "Main Street, Historic Guard House Square, Bodden Town",
    rating: 4.6,
    reviews_count: 31,
    verified: false,
    status: "active",
    wallet_balance: 15.00, // KYD - Low wallet balance test
    commission_rate: 0.10,
    bio: "Handmade seashell ornaments, eco-printed canvas tote bags, and hand-poured coconut soy candles.",
    policies: {
      return_policy: "Exchanges accepted within 7 days.",
      pickup_policy: "Reserve online and pay/pickup at Bodden Town square.",
      shipping_policy: "COD available across Bodden Town & East End."
    },
    social_connections: {
      instagram: "@boddentowncrafts",
      facebook: "",
      tiktok: "",
      pinterest: ""
    },
    hours: "Tue - Sat: 10:00 AM - 4:00 PM"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "p-1",
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    title: "Hand-Polished Caymanite Gemstone Pendant",
    slug: "caymanite-gemstone-pendant",
    price: 45.00, // KYD
    price_usd: 54.00,
    category_id: "cat-1",
    category_name: "Artisanal Crafts",
    sku: "ART-CAY-001",
    stock_count: 8,
    status: "active",
    featured: true,
    sponsored: true,
    images: [
      "/product_caymanite_pendant.jpg"
    ],
    variations: {
      chain_length: ["18 inch Sterling Silver", "20 inch Sterling Silver", "Black Leather Cord"],
      stone_cut: ["Oval Teardrop", "Round Cabochon"]
    },
    description: "Genuine Caymanite mineral stone found uniquely in the Cayman Islands cliffs. Expertly polished and set in solid .925 Sterling Silver. Each piece features distinct natural copper, beige, and reddish strata layers."
  },
  {
    id: "p-2",
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    title: "Woven Silver Thatch Palm Beach Tote",
    slug: "woven-thatch-palm-tote",
    price: 32.00,
    price_usd: 38.40,
    category_id: "cat-1",
    category_name: "Artisanal Crafts",
    sku: "ART-PALM-002",
    stock_count: 14,
    status: "active",
    featured: false,
    sponsored: false,
    images: [
      "/product_thatch_palm_tote.jpg"
    ],
    variations: {
      color_trim: ["Natural Sand", "Coral Pink", "Ocean Turquoise"]
    },
    description: "Hand-woven using the traditional Cayman Silver Thatch Palm weaving technique (Cayman Islands' National Tree). Extremely durable, eco-friendly, and perfect for resort or beach strolls."
  },
  {
    id: "p-3",
    vendor_id: "v-102",
    vendor_name: "Seven Mile Surf & Watersports",
    title: "Pro Snorkel Set with Anti-Fog Panoramic Mask",
    slug: "pro-snorkel-set",
    price: 58.00,
    price_usd: 69.60,
    category_id: "cat-2",
    category_name: "Beach & Watersports",
    sku: "SURF-SNK-101",
    stock_count: 19,
    status: "active",
    featured: true,
    sponsored: true,
    images: [
      "/product_snorkel_mask.jpg"
    ],
    variations: {
      color: ["Ocean Blue", "Reef Yellow", "Stealth Black"],
      size: ["Adult M/L", "Adult S/M"]
    },
    description: "High-definition tempered glass mask offering 180° crystal clear underwater view for Stingray City and Barrier Reef diving. Dry-top snorkel prevents water entry."
  },
  {
    id: "p-4",
    vendor_id: "v-102",
    vendor_name: "Seven Mile Surf & Watersports",
    title: "Reef-Safe SPF 50 Mineral Sunscreen (Organic)",
    slug: "reef-safe-mineral-sunscreen",
    price: 18.00,
    price_usd: 21.60,
    category_id: "cat-2",
    category_name: "Beach & Watersports",
    sku: "SURF-SUN-004",
    stock_count: 35,
    status: "active",
    featured: false,
    sponsored: false,
    images: [
      "/product_reef_sunscreen.jpg"
    ],
    variations: {
      scent: ["Coconut Vanilla", "Unscented Tropical"]
    },
    description: "100% Non-nano Zinc Oxide mineral sunscreen that protects Cayman's delicate coral reefs. Water-resistant for up to 80 minutes."
  },
  {
    id: "p-5",
    vendor_id: "v-103",
    vendor_name: "Rum Point Gourmet & Spices",
    title: "Original Cayman Rum Cake 16oz (Tortuga Style)",
    slug: "original-cayman-rum-cake-16oz",
    price: 24.00,
    price_usd: 28.80,
    category_id: "cat-3",
    category_name: "Gourmet Food & Rum",
    sku: "RUM-CAKE-501",
    stock_count: 25,
    status: "active",
    featured: true,
    sponsored: false,
    images: [
      "/product_tortuga_rum_cake.jpg"
    ],
    variations: {
      flavor: ["Original Golden Rum", "Coconut Rum", "Chocolate Fudge Rum", "Key Lime Rum"]
    },
    description: "Baked fresh daily in Grand Cayman using 5-year aged oak-barrel Caribbean rum. Vacuum-sealed to lock in rich, moist flavor."
  },
  {
    id: "p-6",
    vendor_id: "v-103",
    vendor_name: "Rum Point Gourmet & Spices",
    title: "Fiery Scotch Bonnet Island Hot Sauce (200ml)",
    slug: "scotch-bonnet-hot-sauce",
    price: 12.00,
    price_usd: 14.40,
    category_id: "cat-3",
    category_name: "Gourmet Food & Rum",
    sku: "RUM-HOT-002",
    stock_count: 40,
    status: "active",
    featured: false,
    sponsored: true,
    images: [
      "/product_scotch_bonnet_sauce.jpg"
    ],
    variations: {
      heat_level: ["Medium Spice", "Extra Fiery Scotch Bonnet"]
    },
    description: "Authentic Cayman Island recipe with fresh Scotch Bonnet peppers, island mango, garlic, and wild mustard seeds. Perfect accompaniment for seafood and jerk BBQ."
  },
  {
    id: "p-7",
    vendor_id: "v-104",
    vendor_name: "Georgetown Duty-Free Gems",
    title: "Genuine Caribbean Larimar & Silver Compass Necklace",
    slug: "larimar-silver-compass-necklace",
    price: 120.00,
    price_usd: 144.00,
    category_id: "cat-4",
    category_name: "Duty-Free Luxury",
    sku: "GEM-LAR-901",
    stock_count: 5,
    status: "active",
    featured: true,
    sponsored: false,
    images: [
      "/product_larimar_necklace.jpg"
    ],
    variations: {
      finish: [".925 Sterling Silver", "14k Gold Plated Silver"]
    },
    description: "Featuring rare natural blue Larimar stone resembling the sparkling waters of Seven Mile Beach. Includes nautical compass rose border and duty-free certificate of authenticity."
  },
  {
    id: "p-8",
    vendor_id: "v-105",
    vendor_name: "Bodden Town Coral Crafts",
    title: "Hand-Poured Coconut Wax Candle - Seven Mile Breeze",
    slug: "coconut-wax-candle-seven-mile",
    price: 16.00,
    price_usd: 19.20,
    category_id: "cat-6",
    category_name: "Cayman Souvenirs",
    sku: "BOD-CND-012",
    stock_count: 12,
    status: "active",
    featured: false,
    sponsored: false,
    images: [
      "/product_coconut_candle.jpg"
    ],
    variations: {
      size: ["8 oz Glass Jar", "12 oz Ceramic Bowl"]
    },
    description: "Infused with organic coconut wax, sea salt, driftwood, and wild hibiscus notes. Hand-poured in small batches in Bodden Town."
  },
  {
    id: "p-9",
    vendor_id: "v-102",
    vendor_name: "Seven Mile Surf & Watersports",
    title: "Cayman Breeze Pure Linen Resort Guayabera Shirt",
    slug: "cayman-breeze-pure-linen-shirt",
    price: 65.00,
    price_usd: 78.00,
    category_id: "cat-5",
    category_name: "Island Apparel",
    sku: "SURF-APP-009",
    stock_count: 18,
    status: "active",
    featured: true,
    sponsored: false,
    images: [
      "/product_linen_shirt.jpg"
    ],
    variations: {
      size: ["Small", "Medium", "Large", "XL"],
      color: ["Crisp Resort White", "Breezy Sky Blue"]
    },
    description: "Crafted from 100% natural breathable European linen with mother-of-pearl buttons. Tailored specifically for warm Caribbean ocean breezes and Seven Mile Beach evening dining."
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9801",
    customer_name: "David Sterling",
    customer_phone: "+1 (345) 926-5544",
    customer_email: "david.s@example.com",
    type: "PICKUP", // "COD" or "PICKUP"
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    items: [
      {
        product_id: "p-1",
        title: "Hand-Polished Caymanite Gemstone Pendant",
        price: 45.00,
        qty: 1,
        image: "/product_caymanite_pendant.jpg"
      }
    ],
    total_amount: 45.00,
    commission_amount: 4.50, // 10%
    currency: "KYD",
    status: "Ready for Pickup", // Pending -> Packing -> Ready for Pickup -> Completed
    pin_code: "4829",
    qr_code: "CAYMAN-PICKUP-ORD-9801-4829",
    hold_until: "2026-10-11T18:00:00Z",
    created_at: "2026-10-09T09:30:00Z",
    pickup_location: "Cardinall Avenue, Craft Market Stall #4, Georgetown, Grand Cayman"
  },
  {
    id: "ORD-9802",
    customer_name: "David Sterling",
    customer_phone: "+1 (345) 916-7711",
    customer_email: "david.s@example.com",
    type: "COD",
    vendor_id: "v-102",
    vendor_name: "Seven Mile Surf & Watersports",
    items: [
      {
        product_id: "p-3",
        title: "Pro Snorkel Set with Anti-Fog Panoramic Mask",
        price: 58.00,
        qty: 1,
        image: "/product_snorkel_mask.jpg"
      },
      {
        product_id: "p-4",
        title: "Reef-Safe SPF 50 Mineral Sunscreen",
        price: 18.00,
        qty: 1,
        image: "/product_reef_sunscreen.jpg"
      }
    ],
    delivery_address: "The Westin Grand Cayman Resort, Room 314, Seven Mile Beach",
    total_amount: 76.00,
    commission_amount: 7.60,
    currency: "KYD",
    status: "Out for Delivery", // Pending -> Packing -> Ready for Dispatch -> Out for Delivery -> Completed
    created_at: "2026-10-09T08:15:00Z"
  }
];

export const INITIAL_LEDGER = [
  {
    id: "LED-101",
    vendor_id: "v-101",
    type: "DEPOSIT",
    description: "Initial Vendor Wallet Top-Up",
    amount: 150.00,
    order_id: null,
    created_at: "2026-10-01T10:00:00Z"
  },
  {
    id: "LED-102",
    vendor_id: "v-101",
    type: "COMMISSION_DEDUCTION",
    description: "Commission for Completed Order ORD-9750",
    amount: -4.50,
    order_id: "ORD-9750",
    created_at: "2026-10-05T14:20:00Z"
  },
  {
    id: "LED-103",
    vendor_id: "v-102",
    type: "DEPOSIT",
    description: "Vendor Wallet Credit Top-up",
    amount: 250.00,
    order_id: null,
    created_at: "2026-10-02T11:00:00Z"
  }
];

export const INITIAL_ADS = [
  {
    id: "ad-501",
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    type: "featured_store",
    title: "Hand-Carved Caymanite Jewelry & Woven Thatch Art",
    budget_type: "per_day",
    daily_budget: 10.00,
    balance_credit: 45.00,
    impressions: 1420,
    clicks: 185,
    status: "active"
  },
  {
    id: "ad-502",
    vendor_id: "v-103",
    vendor_name: "Rum Point Gourmet & Spices",
    type: "sponsored_product",
    product_id: "p-6",
    title: "Fiery Scotch Bonnet Island Hot Sauce",
    budget_type: "per_click",
    daily_budget: 5.00,
    balance_credit: 25.00,
    impressions: 890,
    clicks: 94,
    status: "active"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-201",
    order_id: "ORD-9750",
    product_id: "p-1",
    product_title: "Hand-Polished Caymanite Gemstone Pendant",
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    stall_number: "Stall #04",
    author: "Jessica Miller",
    rating: 5,
    comment: "Absolutely gorgeous Caymanite pendant! Picked it up at the Georgetown craft market with my 4-digit PIN. Sarah was so friendly and explained the natural layers of the stone.",
    created_at: "2026-10-18T14:32:00Z",
    verified_purchase: true,
    vendor_reply: {
      text: "Thank you so much Jessica! We are thrilled you love the Caymanite layers. Visit us again next time you are in Georgetown!",
      replied_at: "2026-10-19T09:15:00Z"
    },
    is_flagged: false,
    flag_reason: null,
    status: "published"
  },
  {
    id: "rev-202",
    order_id: "ORD-9751",
    product_id: "p-3",
    product_title: "Pro Snorkel Set with Anti-Fog Panoramic Mask",
    vendor_id: "v-102",
    vendor_name: "Seven Mile Surf & Watersports",
    stall_number: "Stall #12",
    author: "Michael Henderson",
    rating: 5,
    comment: "Crystal clear visibility out on Coral Gardens reef! The dry-top snorkel worked flawlessly. Best gear on Seven Mile Beach.",
    created_at: "2026-10-20T11:10:00Z",
    verified_purchase: true,
    vendor_reply: null,
    is_flagged: false,
    flag_reason: null,
    status: "published"
  },
  {
    id: "rev-203",
    order_id: "ORD-9752",
    product_id: "p-6",
    product_title: "Fiery Scotch Bonnet Island Hot Sauce",
    vendor_id: "v-103",
    vendor_name: "Rum Point Gourmet & Spices",
    stall_number: "Stall #18",
    author: "Liam Thorne",
    rating: 5,
    comment: "Incredible tropical kick! Perfect blend of papaya and scotch bonnet heat. Ordered 3 more bottles for friends back home.",
    created_at: "2026-10-21T16:45:00Z",
    verified_purchase: true,
    vendor_reply: {
      text: "Much appreciation Liam! Island heat crafted fresh right at Rum Point. Cheers!",
      replied_at: "2026-10-22T08:30:00Z"
    },
    is_flagged: false,
    flag_reason: null,
    status: "published"
  },
  {
    id: "rev-204",
    order_id: "ORD-9753",
    product_id: "p-2",
    product_title: "Woven Silver Thatch Palm Beach Tote",
    vendor_id: "v-101",
    vendor_name: "Grand Cayman Artisan Hub",
    stall_number: "Stall #04",
    author: "Anonymous Shopper",
    rating: 1,
    comment: "Fake bag completely broken in 2 hours terrible seller do not buy from this market",
    created_at: "2026-10-22T19:20:00Z",
    verified_purchase: false,
    vendor_reply: null,
    is_flagged: true,
    flag_reason: "Competitor spam / abusive review: This buyer never placed this order or visited our stall.",
    status: "published"
  }
];
