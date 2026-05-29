import { CACHE_TTL_SECONDS, FLIP_TARGETS } from "@/lib/flip/assets";

const formulas = [
  {
    label: "Progress",
    expression: "BTC market cap / target market cap * 100",
    description:
      "Shows how close Bitcoin is to matching the selected target asset by market capitalization.",
  },
  {
    label: "Gap",
    expression: "max(target market cap - BTC market cap, 0)",
    description:
      "Shows the remaining market-cap distance. Once BTC passes a target, the gap is reported as zero.",
  },
  {
    label: "Required BTC price",
    expression: "BTC price * target market cap / BTC market cap",
    description:
      "Estimates the BTC price needed to match the target, assuming BTC supply is approximately unchanged.",
  },
  {
    label: "24h gap change",
    expression: "current gap - previous gap",
    description:
      "Shows whether the distance to the target expanded or compressed over the last available 24h window.",
  },
  {
    label: "Next target",
    expression: "nearest configured target with market cap above BTC",
    description:
      "Picks the smallest configured target market cap that is still above Bitcoin.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 md:py-16">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
            BTC Hits Methodology
          </p>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            How BTC flippening images are calculated
          </h1>
          <p className="mt-5 text-base leading-7 text-gray-300 md:text-lg">
            BTC Hits compares Bitcoin market capitalization against a small set
            of global assets and companies. The goal is to create images and API
            responses that are credible enough to cite, simple enough to share,
            and explicit about their assumptions.
          </p>
        </header>

        <section className="grid gap-4 border-y border-gray-800 py-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Refresh interval</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-500">
              {CACHE_TTL_SECONDS / 60} min
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Base asset</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-500">
              Bitcoin
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Target count</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-500">
              {FLIP_TARGETS.length}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Configured targets</h2>
          <div className="mt-4 overflow-hidden border border-gray-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-900 text-xs uppercase tracking-[0.16em] text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {FLIP_TARGETS.map((target) => (
                  <tr key={target.slug} className="bg-gray-950">
                    <td className="px-4 py-4 font-medium text-white">
                      {target.name}
                    </td>
                    <td className="px-4 py-4 text-yellow-500">
                      {target.symbol}
                    </td>
                    <td className="px-4 py-4 capitalize text-gray-300">
                      {target.type}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {target.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Formulas</h2>
          <div className="mt-4 grid gap-4">
            {formulas.map((formula) => (
              <div
                key={formula.label}
                className="border border-gray-800 bg-gray-900/50 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <h3 className="text-base font-semibold text-yellow-500">
                    {formula.label}
                  </h3>
                  <code className="max-w-full overflow-x-auto whitespace-nowrap text-sm text-gray-300">
                    {formula.expression}
                  </code>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {formula.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-white">Sources</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Bitcoin market data comes from CoinGecko. Equity market caps come
              from Financial Modeling Prep. Gold and silver market caps are
              estimated from MetalPriceAPI spot prices and fixed above-ground
              supply assumptions used by BTC Hits.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Limitations</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Required BTC price is a mechanical estimate, not an investment
              forecast. Equity prices may be delayed depending on upstream
              providers. Commodity supply estimates are approximations and may
              differ from other published methodologies.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
