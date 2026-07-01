"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  IconChevronDown,
  IconShoppingBag,
  IconMenu2,
  IconX,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { useCart } from "@/components/nurture/cart-context"

const CATEGORY_ITEMS = [
  { label: "Shop", href: "/shop", tag: "All products" },
  { label: "Nurture Still water", href: "/shop#still", tag: "pH 8.0" },
  { label: "Nurture Sparkling water", href: "/shop#sparkling", tag: "pH 7.7" },
  // { label: "Nurture lifestyle", href: "#lifestyle", tag: "The edit" },
  { label: "Apparel", href: "/shop#apparel", tag: "T-shirt / Hat" },
]

function NavLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-mono-brand text-xs font-medium tracking-[0.12em] text-nurture-primary uppercase",
        "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-nurture-secondary",
        "after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full",
        "outline-none focus-visible:text-nurture-secondary",
        className
      )}
    >
      {children}
    </Link>
  )
}

function CategoriesMenu() {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 font-mono-brand text-xs font-medium tracking-[0.12em] text-nurture-primary uppercase outline-none focus-visible:text-nurture-secondary"
      >
        Shop
        <IconChevronDown
          size={14}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "absolute top-full left-0 mt-4 w-64 origin-top rounded-2xl border border-nurture-ice bg-white p-2 shadow-[0_20px_60px_rgba(0,71,199,0.15)] transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        {CATEGORY_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-nurture-ice"
          >
            <span className="font-body text-sm font-medium text-nurture-primary">
              {item.label}
            </span>
            <span className="font-mono-brand text-[0.625rem] tracking-wider text-nurture-sky uppercase">
              {item.tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { count, openCart } = useCart()

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-[clamp(1rem,5vw,3rem)] py-5">
        {/* Logo */}
        <Link href="/" aria-label="Nurture — home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Nurture"
            width={140}
            height={96}
            priority
            unoptimized
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <CategoriesMenu />
          <NavLink href="/#sustainability">Sustainability</NavLink>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
            onClick={openCart}
            className="relative grid size-11 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice focus-visible:bg-nurture-ice"
          >
            <IconShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-nurture-secondary px-1 font-mono-brand text-[0.625rem] font-bold text-white tabular-nums">
                {count}
              </span>
            )}
          </button>

          <Link
            href="/shop"
            className="hidden rounded-full bg-nurture-primary px-6 py-3 font-mono-brand text-xs font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)] sm:inline-block"
          >
            Shop Now
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice md:hidden"
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          "mx-4 overflow-hidden rounded-3xl border border-nurture-ice bg-white shadow-[0_20px_60px_rgba(0,71,199,0.15)] transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          <span className="px-3 py-2 font-mono-brand text-[0.625rem] tracking-[0.2em] text-nurture-sky uppercase">
            Categories
          </span>
          {CATEGORY_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-nurture-ice"
            >
              <span className="font-body text-sm font-medium text-nurture-primary">
                {item.label}
              </span>
              <span className="font-mono-brand text-[0.625rem] tracking-wider text-nurture-sky uppercase">
                {item.tag}
              </span>
            </Link>
          ))}
          <Link
            href="/#sustainability"
            onClick={() => setMobileOpen(false)}
            className="mt-1 rounded-xl px-3 py-3 font-mono-brand text-xs tracking-[0.12em] text-nurture-primary uppercase transition-colors hover:bg-nurture-ice"
          >
            Sustainability
          </Link>
        </nav>
      </div>
    </header>
  )
}
