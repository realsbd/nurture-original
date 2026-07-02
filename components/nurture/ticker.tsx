const TICKER_ITEMS = [
  "NATURALLY ALKALINE",
  "PH 8.0+",
  "SOURCE-PROTECTED SPRING WATER",
  "SUBSCRIBE AND SAVE UP TO 10%",
  "ZERO ADDITIVES",
  "AWARDED BRONZE MEDAL FOR WORLD'S BEST TASTING WATER",
  "100% NATURAL",
  "YOUTHFUL HYDRATION",
]

export function Ticker() {
  // Duplicate the list so the -50% scroll loops seamlessly.
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="overflow-hidden border-y-2 border-nurture-secondary bg-nurture-primary py-3">
      <div className="ticker-track flex gap-8">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-sm font-bold tracking-[0.12em] whitespace-nowrap text-white uppercase"
          >
            <span className="text-nurture-sky">•</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
