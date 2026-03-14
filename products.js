// ============================================================
//  products.js  —  Fix-It Forward Shop · Product Data
// ============================================================

const products = [

  // ─────────────────────────────────────────
  //  ELECTRONICS  (ids 1–10)
  // ─────────────────────────────────────────
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium sound with 30hr battery life and active noise cancellation.",
    price: 89.99,
    comparePrice: 129.99,
    stock: 12,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
  },
  {
    id: 2,
    name: "Mechanical Keyboard TKL",
    description: "Tenkeyless layout with tactile brown switches and RGB backlight.",
    price: 109.99,
    comparePrice: 149.99,
    stock: 5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80"
  },
  {
    id: 3,
    name: "4K Webcam Ultra HD",
    description: "Crystal-clear 4K video with auto-focus and built-in ring light.",
    price: 74.99,
    comparePrice: 99.99,
    stock: 9,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80"
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    description: "360° surround sound, waterproof IPX7, 20hr playtime.",
    price: 59.99,
    comparePrice: 79.99,
    stock: 14,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80"
  },
  {
    id: 5,
    name: "Smart LED Desk Lamp",
    description: "Touch-dimming, colour temperature control, USB-C charging port built in.",
    price: 44.99,
    comparePrice: null,
    stock: 20,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?w=400&q=80"
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    description: "15W fast-charge compatible with all Qi devices. Sleek matte finish.",
    price: 29.99,
    comparePrice: 39.99,
    stock: 22,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&q=80"
  },
  {
    id: 7,
    name: "USB-C Hub 7-in-1",
    description: "HDMI 4K, 3× USB-A, SD card, PD 100W pass-through in one slim hub.",
    price: 49.99,
    comparePrice: 64.99,
    stock: 17,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1625948515397-be3caf7e7d4c?w=400&q=80"
  },
  {
    id: 8,
    name: "Smart Watch Series X",
    description: "Health tracking, GPS, 5-day battery, customisable watch faces.",
    price: 199.99,
    comparePrice: 249.99,
    stock: 7,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  },
  {
    id: 9,
    name: "Noise-Isolating Earbuds",
    description: "True wireless earbuds with 8hr playtime and transparency mode.",
    price: 69.99,
    comparePrice: null,
    stock: 11,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
  },
  {
    id: 10,
    name: "Mini Projector HD",
    description: "1080p native resolution, built-in speaker, HDMI & USB input.",
    price: 149.99,
    comparePrice: 199.99,
    stock: 4,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80"
  },

  // ─────────────────────────────────────────
  //  KITCHEN  (ids 11–20)
  // ─────────────────────────────────────────
  {
    id: 11,
    name: "Ceramic Pour-Over Coffee Set",
    description: "Handcrafted ceramic dripper with matching mug. Makes the perfect cup.",
    price: 54.00,
    comparePrice: 70.00,
    stock: 8,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"
  },
  {
    id: 12,
    name: "Cast Iron Skillet 10\"",
    description: "Pre-seasoned cast iron. Even heat distribution, oven-safe to 500°F.",
    price: 39.99,
    comparePrice: 54.99,
    stock: 15,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1620788108921-d18e9a9f5b89?w=400&q=80"
  },
  {
    id: 13,
    name: "Bamboo Cutting Board Set",
    description: "Set of 3 organic bamboo boards with juice grooves and non-slip feet.",
    price: 32.00,
    comparePrice: null,
    stock: 19,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1584990347449-39cb5f6e5b60?w=400&q=80"
  },
  {
    id: 14,
    name: "Electric Milk Frother",
    description: "Four frothing modes, heats and froths milk in under 2 minutes.",
    price: 24.99,
    comparePrice: 34.99,
    stock: 23,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=80"
  },
  {
    id: 15,
    name: "Spice Rack Organiser",
    description: "Rotating 3-tier rack holds 18 jars. Saves counter space beautifully.",
    price: 27.99,
    comparePrice: null,
    stock: 12,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
  },
  {
    id: 16,
    name: "Silicone Utensil Set (6pc)",
    description: "Heat-resistant to 480°F. Non-scratch, dishwasher safe, BPA-free.",
    price: 21.99,
    comparePrice: 29.99,
    stock: 30,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80"
  },
  {
    id: 17,
    name: "Glass Meal Prep Containers",
    description: "Set of 5 airtight borosilicate glass containers, microwave & oven safe.",
    price: 36.99,
    comparePrice: 48.00,
    stock: 16,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=400&q=80"
  },
  {
    id: 18,
    name: "Handheld Immersion Blender",
    description: "500W motor, stainless steel blade, 5-speed dial, easy-clean detachable shaft.",
    price: 44.99,
    comparePrice: 59.99,
    stock: 10,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80"
  },
  {
    id: 19,
    name: "Marble Rolling Pin",
    description: "Solid marble with wooden handles. Stays cool for perfect pastry.",
    price: 29.99,
    comparePrice: null,
    stock: 9,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1600857544200-b2f468e9f5d8?w=400&q=80"
  },
  {
    id: 20,
    name: "Digital Kitchen Scale",
    description: "Accurate to 1g, 11lb capacity, tare function, slim stainless platform.",
    price: 18.99,
    comparePrice: 24.99,
    stock: 28,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=400&q=80"
  },

  // ─────────────────────────────────────────
  //  MAKE UP  (ids 21–30)
  // ─────────────────────────────────────────
  {
    id: 21,
    name: "Velvet Matte Lipstick",
    description: "Long-wearing formula in 12 rich shades. Hydrating and transfer-proof.",
    price: 18.99,
    comparePrice: 24.99,
    stock: 35,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf4cbc?w=400&q=80"
  },
  {
    id: 22,
    name: "Full-Coverage Foundation",
    description: "Buildable coverage, SPF 30, 24hr wear. Available in 40 shades.",
    price: 32.00,
    comparePrice: null,
    stock: 20,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1631214524020-3c69b7781a0b?w=400&q=80"
  },
  {
    id: 23,
    name: "Eyeshadow Palette — Neutrals",
    description: "18 blendable shades from matte to glitter, 72hr pigment lock.",
    price: 44.99,
    comparePrice: 59.99,
    stock: 14,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80"
  },
  {
    id: 24,
    name: "Precision Brow Pencil",
    description: "Micro-tip pencil with spoolie. Fills, defines and sets brows all day.",
    price: 14.99,
    comparePrice: null,
    stock: 40,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80"
  },
  {
    id: 25,
    name: "Volumising Mascara",
    description: "Curved brush, clump-free formula. Adds 5× volume in one coat.",
    price: 16.99,
    comparePrice: 21.99,
    stock: 28,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1631214500004-8f6c79cf8bfd?w=400&q=80"
  },
  {
    id: 26,
    name: "Liquid Highlighter",
    description: "Buildable luminous glow. Mix with foundation or wear on top.",
    price: 22.99,
    comparePrice: null,
    stock: 18,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"
  },
  {
    id: 27,
    name: "Makeup Brush Set (12pc)",
    description: "Synthetic vegan bristles. Includes face, eye and blending brushes.",
    price: 38.00,
    comparePrice: 52.00,
    stock: 11,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80"
  },
  {
    id: 28,
    name: "Setting Spray — Dewy Finish",
    description: "100ml mist locks makeup for 16hrs and adds a fresh skin-like glow.",
    price: 19.99,
    comparePrice: 26.99,
    stock: 22,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80"
  },
  {
    id: 29,
    name: "Contour & Blush Duo",
    description: "Pressed powder palette with cool contour and warm blush shades.",
    price: 27.99,
    comparePrice: null,
    stock: 16,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80"
  },
  {
    id: 30,
    name: "Lip Gloss — Glass Effect",
    description: "Non-sticky plumping gloss in 8 shades. Hyaluronic acid infused.",
    price: 13.99,
    comparePrice: 17.99,
    stock: 33,
    category: "Make Up",
    image: "https://images.unsplash.com/photo-1595341595379-cf1cd0ed7ad1?w=400&q=80"
  },

  // ─────────────────────────────────────────
  //  CLOTHES  (ids 31–40)
  // ─────────────────────────────────────────
  {
    id: 31,
    name: "Classic White Oxford Shirt",
    description: "100% Egyptian cotton, slim fit, mother-of-pearl buttons.",
    price: 54.99,
    comparePrice: 74.99,
    stock: 18,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"
  },
  {
    id: 32,
    name: "High-Rise Straight Jeans",
    description: "Stretch denim, vintage wash, 5-pocket style. Sizes 24–34.",
    price: 69.99,
    comparePrice: 89.99,
    stock: 14,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80"
  },
  {
    id: 33,
    name: "Oversized Knit Sweater",
    description: "Cosy ribbed knit in oat, sage and charcoal. Drop-shoulder cut.",
    price: 62.00,
    comparePrice: null,
    stock: 10,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80"
  },
  {
    id: 34,
    name: "Linen Wide-Leg Trousers",
    description: "Breathable pure linen, elasticated waist, relaxed summer cut.",
    price: 58.00,
    comparePrice: 72.00,
    stock: 9,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4283?w=400&q=80"
  },
  {
    id: 35,
    name: "Satin Slip Dress",
    description: "Bias-cut, adjustable straps, side slit. Wear it day or night.",
    price: 74.99,
    comparePrice: 99.99,
    stock: 7,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80"
  },
  {
    id: 36,
    name: "Structured Blazer",
    description: "Single-breasted, notch lapel, fully lined. Office-to-evening ready.",
    price: 119.99,
    comparePrice: 159.99,
    stock: 6,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80"
  },
  {
    id: 37,
    name: "Graphic Tee — Vintage Print",
    description: "Washed 100% cotton, relaxed unisex fit, screen-printed graphic.",
    price: 28.99,
    comparePrice: null,
    stock: 25,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
  },
  {
    id: 38,
    name: "Trench Coat Classic",
    description: "Waterproof cotton blend, detachable belt, storm flap. Timeless cut.",
    price: 189.99,
    comparePrice: 240.00,
    stock: 5,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80"
  },
  {
    id: 39,
    name: "Ribbed Bralette",
    description: "Soft stretchy rib fabric, longline cut, removable padding.",
    price: 22.99,
    comparePrice: 29.99,
    stock: 20,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80"
  },
  {
    id: 40,
    name: "Fleece Zip-Up Hoodie",
    description: "Heavyweight fleece, kangaroo pockets, YKK zip. Available in 6 colours.",
    price: 64.99,
    comparePrice: 84.99,
    stock: 13,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80"
  },

  // ─────────────────────────────────────────
  //  ACCESSORIES  (ids 41–50)
  // ─────────────────────────────────────────
  {
    id: 41,
    name: "Minimalist Leather Wallet",
    description: "Slim RFID-blocking wallet. Holds up to 8 cards and cash.",
    price: 34.99,
    comparePrice: null,
    stock: 25,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80"
  },
  {
    id: 42,
    name: "Tortoiseshell Sunglasses",
    description: "UV400 protection, acetate frame, polarised lenses.",
    price: 49.99,
    comparePrice: 65.00,
    stock: 17,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80"
  },
  {
    id: 43,
    name: "Canvas Tote Bag",
    description: "Heavy-duty 12oz canvas, inner zip pocket, natural leather handles.",
    price: 26.99,
    comparePrice: null,
    stock: 30,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
  },
  {
    id: 44,
    name: "Beaded Bracelet Set",
    description: "Set of 5 handmade stone bead bracelets. Mix and stack.",
    price: 19.99,
    comparePrice: 27.99,
    stock: 40,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80"
  },
  {
    id: 45,
    name: "Silk Neck Scarf",
    description: "100% silk twill, 70×70cm, hand-rolled edges, vibrant print.",
    price: 38.00,
    comparePrice: 50.00,
    stock: 12,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1601924351433-3d7678a8c5c8?w=400&q=80"
  },
  {
    id: 46,
    name: "Leather Card Holder",
    description: "Full-grain leather, 6-card capacity, slim 4mm profile.",
    price: 22.99,
    comparePrice: null,
    stock: 22,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1606503153255-59d5e417c8a2?w=400&q=80"
  },
  {
    id: 47,
    name: "Gold Hoop Earrings",
    description: "14k gold-filled, 30mm diameter, lightweight all-day wear.",
    price: 29.99,
    comparePrice: 39.99,
    stock: 18,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"
  },
  {
    id: 48,
    name: "Woven Straw Hat",
    description: "Natural seagrass weave, adjustable inner band, wide 6cm brim.",
    price: 31.99,
    comparePrice: null,
    stock: 9,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=80"
  },
  {
    id: 49,
    name: "Leather Belt — Tan",
    description: "Full-grain tan leather, 35mm width, solid brass pin buckle.",
    price: 44.99,
    comparePrice: 58.00,
    stock: 14,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=80"
  },
  {
    id: 50,
    name: "Mini Crossbody Bag",
    description: "Vegan leather, adjustable strap, magnetic snap closure, 3 compartments.",
    price: 56.99,
    comparePrice: 74.99,
    stock: 8,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
  },

  // ─────────────────────────────────────────
  //  FITNESS  (ids 51–60)
  // ─────────────────────────────────────────
  {
    id: 51,
    name: "Yoga Mat Pro",
    description: "6mm thick non-slip mat with alignment lines. Eco-friendly material.",
    price: 42.00,
    comparePrice: null,
    stock: 18,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1601925228843-f3e1b60afb8a?w=400&q=80"
  },
  {
    id: 52,
    name: "Stainless Steel Water Bottle",
    description: "Double-walled 500ml bottle. Keeps drinks cold 24hrs, hot 12hrs.",
    price: 27.99,
    comparePrice: 35.00,
    stock: 30,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"
  },
  {
    id: 53,
    name: "Resistance Band Set (5pc)",
    description: "5 resistance levels from 10–50lb. Anti-snap latex with fabric cover.",
    price: 24.99,
    comparePrice: 34.99,
    stock: 22,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917afae?w=400&q=80"
  },
  {
    id: 54,
    name: "Adjustable Dumbbell 20kg",
    description: "Quick-select dial adjusts from 2kg to 20kg. Space-saving design.",
    price: 129.99,
    comparePrice: 169.99,
    stock: 6,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80"
  },
  {
    id: 55,
    name: "Jump Rope — Speed Cable",
    description: "Ball-bearing handles, adjustable steel cable, 360° rotation.",
    price: 16.99,
    comparePrice: null,
    stock: 35,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&q=80"
  },
  {
    id: 56,
    name: "Foam Roller Deep Tissue",
    description: "High-density EVA foam, 33cm length, textured surface for trigger points.",
    price: 22.99,
    comparePrice: 29.99,
    stock: 20,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80"
  },
  {
    id: 57,
    name: "Gym Duffle Bag",
    description: "45L capacity, wet/dry compartment, shoe pocket, padded shoulder strap.",
    price: 54.99,
    comparePrice: 69.99,
    stock: 13,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
  },
  {
    id: 58,
    name: "Ab Wheel Roller",
    description: "Extra-wide dual wheel, ergonomic foam handles, non-slip mat included.",
    price: 19.99,
    comparePrice: null,
    stock: 17,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80"
  },
  {
    id: 59,
    name: "Compression Leggings",
    description: "4-way stretch fabric, high waist, moisture-wicking, squat-proof.",
    price: 44.99,
    comparePrice: 58.00,
    stock: 16,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80"
  },
  {
    id: 60,
    name: "Pull-Up Bar Doorframe",
    description: "No-screw design, fits doors 62–92cm, holds up to 150kg.",
    price: 34.99,
    comparePrice: 44.99,
    stock: 10,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80"
  }

];