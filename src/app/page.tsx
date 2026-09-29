import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'EBA Skin Care | High-Performance Radiance for Every Skin',
  description:
    'Clinically proven botanical formulations engineered for South Asian climates. Meticulously calibrated for Men and Women across Pakistan.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Interactive Dual Hero Section */}
      <section className="relative w-full bg-[#F7F3EE] px-4 sm:px-6 lg:px-12 pt-8 pb-20">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Dual CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE8E3] shadow-sm mb-4 border border-[#EADECF]">
              <span className="w-2 h-2 rounded-full bg-[#CCA730] animate-pulse" />
              <span className="font-label-uppercase text-[11px] tracking-widest text-[#4E4543] font-semibold">
                Clinique Botanica • South Asia
              </span>
            </div>

            <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-[#1C1C19] leading-tight tracking-tight mb-4">
              High-Performance Radiance,{' '}
              <span className="italic font-normal text-[#725B38]">
                Tailored for Every Skin.
              </span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-[#4E4543] max-w-xl mb-8 leading-relaxed">
              Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested, cruelty-free, and meticulously calibrated for Men and Women.
            </p>

            {/* Dual Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/women"
                className="group relative px-8 py-4 rounded-full bg-[#725B38] text-white font-label-uppercase text-xs tracking-widest font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Women Collection
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-[#FEDEB2] opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>

              <Link
                href="/men"
                className="group relative px-8 py-4 rounded-full bg-[#1F1B1A] text-white font-label-uppercase text-xs tracking-widest font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Shop Men Collection
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
            </div>

            {/* Metric Highlights Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 mt-8 w-full bg-[#F1EDE8]/60 p-5 rounded-2xl border border-[#EADECF]">
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">98.4%</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Barrier Restoration</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">14 Days</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Visible Radiance</div>
              </div>
              <div>
                <div className="font-price-lg text-xl sm:text-2xl text-[#1C1C19] font-bold">100%</div>
                <div className="font-body-sm text-xs text-[#4E4543] mt-0.5">Halal & Pure</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Dual Montage */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[5/6] rounded-2xl overflow-hidden shadow-2xl bg-[#F1EDE8] border border-[#EADECF]">
              <div className="absolute inset-0 grid grid-cols-2">
                {/* Left Half: Women's Soft Luxury Glow */}
                <Link href="/women" className="relative h-full overflow-hidden group block">
                  <Image
                    src="/images/hero_women.png"
                    alt="EBA Skin Care Women Formulation"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                    <span className="font-label-uppercase text-[10px] text-[#FFE088] tracking-widest font-bold">
                      The Women Line
                    </span>
                    <span className="font-headline-sm text-lg sm:text-xl text-white">
                      Glow & Luminescence
                    </span>
                  </div>
                </Link>

                {/* Right Half: Men's Obsidian Slate */}
                <Link href="/men" className="relative h-full overflow-hidden group block bg-[#14171C]">
                  <Image
                    src="/images/hero_men.png"
                    alt="EBA Skin Care Men Formulation"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                    <span className="font-label-uppercase text-[10px] text-[#6C8EAD] tracking-widest font-bold">
                      The Men Line
                    </span>
                    <span className="font-headline-sm text-lg sm:text-xl text-white">
                      Active Charcoal Fortitude
                    </span>
                  </div>
                </Link>
              </div>

              {/* Floating Clinical Capsule Overlay */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap border border-[#EADECF]">
                <span className="material-symbols-outlined text-[#CCA730] text-[20px]">verified</span>
                <span className="font-label-ui text-xs text-[#1C1C19] font-semibold">
                  Formulated for South Asian Microclimates & Melanin Profiles
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Trust & Benefits Strip */}
      <section className="w-full bg-[#EBE8E3] py-6 shadow-sm border-y border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#725B38] text-[22px]">health_and_safety</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Dermatologist Tested</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">Bio-active purity standards</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#735C00] text-[22px]">verified</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">100% Halal & Pure</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">Cruelty-free botanical extracts</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#725B38] text-[22px]">local_shipping</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Free Nationwide Delivery</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">On all orders over Rs. 3,500</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#EADECF] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#F1EDE8] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#735C00] text-[22px]">payments</span>
              </div>
              <div>
                <div className="font-label-ui text-xs font-semibold text-[#1C1C19]">Cash on Delivery & Raast</div>
                <div className="font-body-sm text-[11px] text-[#4E4543]">JazzCash & EasyPaisa ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gateways Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-[#FDF9F4]">
        <div className="max-w-[1380px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-uppercase text-xs tracking-[0.25em] text-[#725B38] uppercase font-bold">
              Two Dedicated Disciplines
            </span>
            <h2 className="font-display-lg text-3xl sm:text-4xl text-[#1C1C19] mt-2 mb-3">
              Formulated with Distinct Pharmacopeial Intent.
            </h2>
            <p className="font-body-md text-sm text-[#4E4543]">
              Select your personalized regimen tailored with precision for gender-specific epidermal physiology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Women Collection Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#EED7DC] bg-[#FAF0F2] p-8 sm:p-10 flex flex-col justify-between shadow-sm group">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#B76E79]/15 text-[#B76E79] font-label-uppercase text-[10px] tracking-wider font-bold mb-4">
                  Soft Rosé Plum Theme
                </span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl text-[#3A2A33] mb-3">
                  Women Botanical Radiance
                </h3>
                <p className="text-sm text-[#6E5362] leading-relaxed mb-6">
                  Nourishing damask rose hydrosol, 24K gold micro-flecks, multi-molecular hyaluronic acids, and licorice root elixirs that stimulate waking translucence.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-[#3A2A33]">
                    <span className="material-symbols-outlined text-[16px] text-[#B76E79]">check</span>
                    <span>Rosewater & Botanical Cleanser (100ml)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3A2A33]">
                    <span className="material-symbols-outlined text-[16px] text-[#B76E79]">check</span>
                    <span>Beauty Night Whitening Cream (50gm)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3A2A33]">
                    <span className="material-symbols-outlined text-[16px] text-[#B76E79]">check</span>
                    <span>Beauty Glow Serum with 24K Gold (30ml)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/women"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#3A2A33] text-white font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#5A434F] transition-all self-start"
              >
                <span>Enter Women Sanctuary</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Men Collection Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#232830] bg-[#14171C] p-8 sm:p-10 flex flex-col justify-between shadow-sm group text-white">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#2F4858] text-[#8AB8D6] font-label-uppercase text-[10px] tracking-wider font-bold mb-4">
                  Dark Obsidian Slate Theme
                </span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl text-[#F2F2F2] mb-3">
                  Men Obsidian Slate Fortitude
                </h3>
                <p className="text-sm text-[#A5ACB8] leading-relaxed mb-6">
                  Activated volcanic charcoal, Niacinamide 10% + Zinc PCA, and peptide barrier shields engineered to fight humidity, sun exposure, and pollution.
                </p>
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs text-[#F2F2F2]">
                    <span className="material-symbols-outlined text-[16px] text-[#6C8EAD]">check</span>
                    <span>Volcanic Charcoal Detox Face Wash (100ml)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#F2F2F2]">
                    <span className="material-symbols-outlined text-[16px] text-[#6C8EAD]">check</span>
                    <span>Beauty Night Whitening Barrier Cream (50gm)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#F2F2F2]">
                    <span className="material-symbols-outlined text-[16px] text-[#6C8EAD]">check</span>
                    <span>Niacinamide + Peptide Glow Serum (30ml)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/men"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0F1115] font-label-uppercase text-xs tracking-widest font-semibold hover:bg-[#EBE8E3] transition-all self-start"
              >
                <span>Enter Men Sanctuary</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
