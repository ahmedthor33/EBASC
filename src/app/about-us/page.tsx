import React from 'react';
import Link from 'next/link';
import { FlaskConical, Thermometer, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Our Apothecary Heritage & Story | EBA Skin Care',
  description:
    'Discover EBA Skin Care. Clean, clinical botanical formulations designed specifically for South Asian microclimates across Pakistan.',
};

export default function AboutUsPage() {
  return (
    <div className="w-full bg-[#FDF9F4] text-[#1C1C19] pb-24">
      {/* Editorial Story Hero */}
      <section className="relative w-full bg-[#F7F3EE] border-b border-[#EADECF] py-16 lg:py-24 px-4 sm:px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EADECF] text-xs font-label-uppercase tracking-widest text-[#725B38] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#725B38] animate-pulse" />
            <span>Formulation Laboratory • Est. 2021</span>
          </div>

          <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-[#1C1C19] tracking-tight leading-tight">
            Elevating Skincare Through Botanical Discipline.
          </h1>

          <p className="font-body-lg text-base sm:text-lg text-[#4E4543] leading-relaxed font-light">
            Engineered specifically to solve the distinct dermatological demands of Pakistani microclimates—from the coastal salinity of Karachi to the dense seasonal smog of Lahore and the high UV radiation of Islamabad.
          </p>
        </div>
      </section>

      {/* The 4 Apothecary Pillars */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] uppercase font-bold">
            Guiding Philosophy
          </span>
          <h2 className="font-display-lg text-3xl sm:text-4xl text-[#1C1C19] mt-2">
            The Four Core Apothecary Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mb-6">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="font-label-uppercase text-[11px] text-[#725B38] tracking-widest uppercase font-semibold">
                Pillar 01
              </span>
              <h3 className="font-headline-sm text-xl text-[#1C1C19] mt-1 mb-2 font-semibold">
                Clinical Precision
              </h3>
              <p className="text-xs text-[#4E4543] leading-relaxed">
                Every formulation is calibrated with active percentage concentrations of Niacinamide, Alpha Arbutin, and Peptides verified for stability.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADECF] text-[11px] font-semibold text-[#725B38] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#725B38] shrink-0" />
              <span>Halal Certified Batching</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mb-6">
                <Thermometer className="w-6 h-6" />
              </div>
              <span className="font-label-uppercase text-[11px] text-[#725B38] tracking-widest uppercase font-semibold">
                Pillar 02
              </span>
              <h3 className="font-headline-sm text-xl text-[#1C1C19] mt-1 mb-2 font-semibold">
                Climate-Resilient Bases
              </h3>
              <p className="text-xs text-[#4E4543] leading-relaxed">
                Ultra-light, quick-absorbing non-comedogenic bases calibrated to remain featherlight under 42°C monsoon moisture and airborne particulate layers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADECF] text-[11px] font-semibold text-[#725B38] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#725B38] shrink-0" />
              <span>Breathable Lipid Matrix</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-label-uppercase text-[11px] text-[#725B38] tracking-widest uppercase font-semibold">
                Pillar 03
              </span>
              <h3 className="font-headline-sm text-xl text-[#1C1C19] mt-1 mb-2 font-semibold">
                Ethical & Cruelty-Free
              </h3>
              <p className="text-xs text-[#4E4543] leading-relaxed">
                Never tested on animals. We partner directly with organic farms across Punjab to sustainably distill wild Damask roses and cold-pressed botanical oils.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADECF] text-[11px] font-semibold text-[#725B38] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#725B38] shrink-0" />
              <span>100% Cruelty Free</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-3xl bg-white border border-[#EADECF] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] text-[#725B38] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-label-uppercase text-[11px] text-[#725B38] tracking-widest uppercase font-semibold">
                Pillar 04
              </span>
              <h3 className="font-headline-sm text-xl text-[#1C1C19] mt-1 mb-2 font-semibold">
                Dermal Integrity First
              </h3>
              <p className="text-xs text-[#4E4543] leading-relaxed">
                Certified barrier-restoration protocols. We prioritize skin density, epidermal microbiome health, and deep hydration instead of rapid, hazardous chemical peeling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EADECF] text-[11px] font-semibold text-[#725B38] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#725B38] shrink-0" />
              <span>Dermatologist Supervised</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Disciplines Section */}
      <section className="w-full bg-[#EBE8E3] py-20 px-4 sm:px-6 lg:px-12 border-y border-[#EADECF]">
        <div className="max-w-[1380px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-uppercase text-xs tracking-widest text-[#725B38] uppercase font-bold">
              Two Scientific Streams
            </span>
            <h2 className="font-display-lg text-3xl sm:text-4xl text-[#1C1C19] mt-1">
              The Dual Dermal Ecosystems
            </h2>
            <p className="text-xs text-[#4E4543] mt-2">
              South Asian male and female skin exhibit structural differences in epidermal thickness, pore diameter, and sebaceous responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EED7DC] shadow-sm">
              <span className="px-3 py-1 rounded-full bg-[#B76E79]/15 text-[#B76E79] font-label-uppercase text-[10px] font-bold">
                Atelier Féminin
              </span>
              <h3 className="font-headline-lg text-2xl text-[#3A2A33] mt-4 mb-2">
                Women Luminance Atelier
              </h3>
              <p className="text-xs text-[#6E5362] leading-relaxed mb-6">
                Formulated to address melanin hyper-reactivity under intense Subcontinental UV radiation. Restores the cutaneous lipid mantle while dissolving stubborn post-inflammatory discoloration.
              </p>
              <Link
                href="/women"
                className="inline-flex items-center font-label-ui text-xs font-semibold text-[#B76E79] hover:underline"
              >
                <span>Explore Women Collection</span>
              </Link>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-[#14171C] border border-[#232830] text-white shadow-sm">
              <span className="px-3 py-1 rounded-full bg-[#2F4858] text-[#8AB8D6] font-label-uppercase text-[10px] font-bold">
                Atelier Masculin
              </span>
              <h3 className="font-headline-lg text-2xl text-white mt-4 mb-2">
                Men Obsidian Slate Laboratory
              </h3>
              <p className="text-xs text-[#A5ACB8] leading-relaxed mb-6">
                Calibrated for thicker epidermal stratum corneum, increased sebaceous output, and oxidative smog exposure encountered during city commutes across Pakistan.
              </p>
              <Link
                href="/men"
                className="inline-flex items-center font-label-ui text-xs font-semibold text-[#FFE088] hover:underline"
              >
                <span>Explore Men Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
