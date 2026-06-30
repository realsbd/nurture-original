"use client"

import * as React from "react"

import { Loader } from "@/components/nurture/loader"
import { Navbar } from "@/components/nurture/navbar"
import { Hero } from "@/components/nurture/hero"
import { Ticker } from "@/components/nurture/ticker"
import { WhyCans } from "@/components/nurture/why-cans"
import { WhoWeAre } from "@/components/nurture/who-we-are"
import { Products } from "@/components/nurture/products"
import { Subscribe } from "@/components/nurture/subscribe"
import { Footer } from "@/components/nurture/footer"

export default function Page() {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <main className="relative bg-white">
      {!loaded && <Loader onFinished={() => setLoaded(true)} />}

      <Navbar />
      <Hero active={loaded} />
      <Ticker />
      <WhyCans />
      <WhoWeAre />
      <Products />
      <Subscribe />
      <Footer />
    </main>
  )
}
