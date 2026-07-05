"use client"

import * as React from "react"

export type CartVariant = "piece" | "pack"

export type CartItem = {
  /** Stable identity for a product+variant line. */
  key: string
  productId: string
  name: string
  variant: CartVariant
  /** Human label for the variant, e.g. "Single bottle", "24 pack". */
  variantLabel: string
  unitPrice: number
  qty: number
  image: string
}

type AddItemInput = Omit<CartItem, "qty" | "key"> & { qty?: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  addItem: (item: AddItemInput) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

const STORAGE_KEY = "nurture-cart"

function keyFor(productId: string, variant: CartVariant) {
  return `${productId}:${variant}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const hydrated = React.useRef(false)

  // Hydrate from localStorage once, after mount (deferred to avoid a
  // setState-in-effect cascade; mirrors the pattern in use-scroll.ts).
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[]
          if (Array.isArray(parsed)) setItems(parsed)
        }
      } catch {
        // ignore malformed storage
      }
      hydrated.current = true
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // Persist after hydration so we never overwrite stored data with the
  // initial empty state.
  React.useEffect(() => {
    if (!hydrated.current) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage may be unavailable (private mode) — non-fatal
    }
  }, [items])

  const addItem = React.useCallback((input: AddItemInput) => {
    const key = keyFor(input.productId, input.variant)
    const addQty = input.qty ?? 1
    setItems((prev) => {
      const existing = prev.find((it) => it.key === key)
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, qty: it.qty + addQty } : it
        )
      }
      return [...prev, { ...input, key, qty: addQty }]
    })
  }, [])

  const removeItem = React.useCallback((key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key))
  }, [])

  const setQty = React.useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.key !== key)
        : prev.map((it) => (it.key === key ? { ...it, qty } : it))
    )
  }, [])

  const clear = React.useCallback(() => {
    setItems([])
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])
  const openCart = React.useCallback(() => setIsOpen(true), [])
  const closeCart = React.useCallback(() => setIsOpen(false), [])

  const count = items.reduce((sum, it) => sum + it.qty, 0)
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0)

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      addItem,
      removeItem,
      setQty,
      clear,
      openCart,
      closeCart,
    }),
    [items, count, subtotal, isOpen, addItem, removeItem, setQty, clear, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
