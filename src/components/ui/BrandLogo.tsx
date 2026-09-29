'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  /**
   * 'light': Charcoal text with refined gold monogram (for light backgrounds)
   * 'dark': White text with radiant gold monogram (for dark backgrounds)
   * 'auto': Uses current text color with gold accent
   */
  variant?: 'light' | 'dark' | 'auto';
  shape?: 'circle' | 'rounded-square';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  href?: string | null;
}

export function BrandLogo({
  variant = 'light',
  shape = 'circle',
  size = 'md',
  showTagline = false,
  taglineText = 'LUXURY FORMULATION STUDIO',
  className = '',
  href = '/',
}: BrandLogoProps) {
  // Color configuration
  const isDark = variant === 'dark';
  const isAuto = variant === 'auto';

  // Gold colors
  const goldColor = isDark ? '#D4AF37' : '#C5A059';
  const goldTextClass = isDark ? 'text-[#FFE088]' : 'text-[#C5A059]';

  // Primary text colors
  const textPrimaryClass = isDark
    ? 'text-[#FFFFFF]'
    : isAuto
    ? 'text-current'
    : 'text-[#1A1615]';

  // Monogram SVG text color
  const monogramTextColor = isDark
    ? '#FFFFFF'
    : isAuto
    ? 'currentColor'
    : '#1A1615';

  // Tagline color
  const taglineColorClass = isDark ? 'text-[#D4C5B9]' : 'text-[#7F7572]';

  // Size configurations
  let monogramDimension = 38;
  let wordmarkEbaSize = 'text-[18px] sm:text-[20px]';
  let wordmarkSkinCareSize = 'text-[18px] sm:text-[20px]';
  let gapClass = 'gap-2.5 sm:gap-3';

  if (size === 'sm') {
    monogramDimension = 32;
    wordmarkEbaSize = 'text-[15px] sm:text-[16px]';
    wordmarkSkinCareSize = 'text-[15px] sm:text-[16px]';
    gapClass = 'gap-2';
  } else if (size === 'lg') {
    monogramDimension = 46;
    wordmarkEbaSize = 'text-[22px] sm:text-[26px]';
    wordmarkSkinCareSize = 'text-[22px] sm:text-[26px]';
    gapClass = 'gap-3 sm:gap-3.5';
  }

  const content = (
    <div
      className={`inline-flex items-center ${gapClass} select-none group transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Monogram: The letters "EBA" set inside a thin circle or rounded square in gold */}
      <div className="shrink-0 flex items-center justify-center">
        <svg
          width={monogramDimension}
          height={monogramDimension}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        >
          {shape === 'circle' ? (
            <>
              {/* Outer refined thin gold circle */}
              <circle
                cx="22"
                cy="22"
                r="20"
                stroke={goldColor}
                strokeWidth="1.25"
                opacity="0.95"
              />
              {/* Inner subtle concentric accent ring */}
              <circle
                cx="22"
                cy="22"
                r="17.5"
                stroke={goldColor}
                strokeWidth="0.5"
                strokeDasharray="1.5 2.5"
                opacity="0.65"
              />
            </>
          ) : (
            <>
              {/* Outer refined thin gold rounded square */}
              <rect
                x="2"
                y="2"
                width="40"
                height="40"
                rx="8"
                stroke={goldColor}
                strokeWidth="1.25"
                opacity="0.95"
              />
              {/* Inner delicate concentric rounded square */}
              <rect
                x="5"
                y="5"
                width="34"
                height="34"
                rx="6"
                stroke={goldColor}
                strokeWidth="0.5"
                strokeDasharray="1.5 2.5"
                opacity="0.65"
              />
            </>
          )}

          {/* Initials EBA inside outline */}
          <text
            x="22"
            y="26.5"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="12.5"
            fontWeight="600"
            fill={monogramTextColor}
            letterSpacing="1.2"
            textAnchor="middle"
          >
            EBA
          </text>
        </svg>
      </div>

      {/* Refined serif wordmark: "EBA Skin Care" */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className={`font-serif font-bold tracking-[0.16em] uppercase ${textPrimaryClass} ${wordmarkEbaSize}`}
          >
            EBA
          </span>
          <span
            className={`font-serif italic font-normal tracking-[0.04em] ${goldTextClass} ${wordmarkSkinCareSize}`}
          >
            Skin Care
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-label-uppercase text-[8px] sm:text-[8.5px] font-semibold tracking-[0.24em] uppercase mt-1 ${taglineColorClass}`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="EBA Skin Care Home" className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
