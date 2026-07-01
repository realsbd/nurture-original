export const CAN_FEATURES = [
  {
    title: "Infinitely Recyclable",
    body: "Aluminum can be recycled again and again without losing quality, making it one of the most sustainable beverage packaging options available.",
  },
  {
    title: "Higher Recycling Rates",
    body: "Aluminum cans are among the most recycled beverage containers in the world, helping reduce waste and support a circular economy.",
  },
  {
    title: "Lower Transportation Impact",
    body: "Lightweight and efficient to transport, cans require less energy to move from production facilities to store shelves, reducing carbon emissions.",
  },
  {
    title: "Keeps Drinks Fresher Longer",
    body: "Aluminum protects sparkling water from light and oxygen, preserving the crisp taste and carbonation consumers love.",
  },
] as const

/** Canadian Harmonized Sales Tax applied at checkout. */
export const HST_RATE = 0.13

/** Formats a number as Canadian dollars, e.g. 19.99 → "$19.99 CAD". */
export function formatCAD(amount: number) {
  return `$${amount.toFixed(2)} CAD`
}

export type Product = {
  id: string
  name: string
  volume: string
  ph: string
  /** Pack label, e.g. "24 pack" / "12 pack". Products are sold only in packs. */
  pack: string
  /** Display price string for the pack, used by the home grid. */
  price: string
  description: string
  /** Carousel images — first is the primary/pack shot. */
  images: string[]
  /** Compact thumbnail used in the cart + order summary. */
  thumb: string
  packPrice: number
  packCount: number
  nutrition: { label: string; value: string }[]
  accent: "primary" | "sky" | "spring"
}

export const PRODUCTS: Product[] = [
  {
    id: "still",
    name: "Natural Alkaline Spring Water",
    volume: "500 mL",
    ph: "pH 8.0",
    pack: "24 pack",
    price: "$19.99 CAD",
    description:
      "Sourced from a protected Canadian spring and naturally filtered through the earth to deliver a crisp, refreshing taste. With a naturally alkaline pH of 8.0 and naturally occurring minerals, Nurture provides pure hydration for your everyday lifestyle. Bottled at the source and proudly Canadian.",
    images: ["/pack-still.jpeg", "/bottle-still.png", "/bottle-3d.png"],
    thumb: "/bottle-still.png",
    packPrice: 19.99,
    packCount: 24,
    nutrition: [
      { label: "Calories", value: "0" },
      { label: "Fat / Lipides", value: "0 g · 0%" },
      { label: "Carbohydrate / Glucides", value: "0 g · 0%" },
      { label: "Protein / Protéines", value: "0 g" },
      { label: "Calcium", value: "1%" },
    ],
    accent: "primary",
  },
  {
    id: "sparkling",
    name: "Nurture Sparkling Water",
    volume: "355 mL",
    ph: "pH 7.7",
    pack: "12 pack",
    price: "$24.99 CAD",
    description:
      "Enjoy pure refreshment with Nurture Sparkling Water. Made from premium Canadian spring water and infused with crisp carbonation, this 355 mL can delivers a clean, refreshing taste with zero calories, no sugar, and no artificial ingredients. Simply pure sparkling hydration, proudly Canadian.",
    images: ["/pack-sparkling.jpeg", "/can-sparkling.png", "/can-blue.png"],
    thumb: "/can-sparkling.png",
    packPrice: 24.99,
    packCount: 12,
    nutrition: [
      { label: "Calories", value: "0" },
      { label: "Fat / Lipides", value: "0 g · 0%" },
      { label: "Sodium / Sodium", value: "1 mg · 0%" },
      { label: "Carbohydrates / Glucides", value: "0 g · 0%" },
      { label: "Protein / Protéines", value: "0 g" },
      { label: "Calcium", value: "2%" },
      { label: "Fluoride / Fluorure", value: "< 0.01%" },
    ],
    accent: "sky",
  },
  {
    id: "lemon-lime",
    name: "Lemon & Lime Sparkling Water",
    volume: "355 mL",
    ph: "pH 7.7",
    pack: "12 pack",
    price: "$24.99 CAD",
    description:
      "Crafted without sugar, sweeteners, or artificial colours, Nurture Lemon & Lime Sparkling Water offers a refreshing alternative to sugary soft drinks while maintaining the pure quality and taste you expect from Nurture.",
    images: ["/pack-lemon-lime.jpeg", "/nurture-can-green.jpeg", "/can-green.jpeg"],
    thumb: "/nurture-can-green.jpeg",
    packPrice: 24.99,
    packCount: 12,
    nutrition: [
      { label: "Calories", value: "0" },
      { label: "Fat / Lipides", value: "0 g · 0%" },
      { label: "Sodium / Sodium", value: "1 mg · 0%" },
      { label: "Carbohydrates / Glucides", value: "0 g · 0%" },
      { label: "Protein / Protéines", value: "0 g" },
      { label: "Calcium", value: "2%" },
      { label: "Fluoride / Fluorure", value: "< 0.01%" },
    ],
    accent: "spring",
  },
]

export type ApparelItem = {
  id: string
  name: string
  price: number
}

export const APPAREL: ApparelItem[] = [
  { id: "tshirt", name: "Nurture T-Shirt", price: 24.99 },
  { id: "hat", name: "Nurture Hat", price: 29.99 },
]

export type SubscriptionPlan = {
  id: string
  cadence: string
  save: string
  /** Discount fraction applied at checkout. */
  discount: number
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: "7", cadence: "Every 7 days", save: "Save 5%", discount: 0.05 },
  { id: "14", cadence: "Every 14 days", save: "Save 7%", discount: 0.07 },
  { id: "30", cadence: "Every 30 days", save: "Save 10%", discount: 0.1 },
]
