export interface HeroSectionConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryImage: string; // Women formulation visual
  secondaryImage: string; // Men formulation visual
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  overlayOpacity: number; // 0 to 90
}

export interface PageBannerConfig {
  id: string;
  pageKey: 'women' | 'men' | 'shop';
  pageName: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  overlayOpacity: number;
}

export interface PromoRibbonConfig {
  text: string;
  link: string;
  isActive: boolean;
}

export interface BannerStoreState {
  homeHero: HeroSectionConfig;
  pageBanners: Record<'women' | 'men' | 'shop', PageBannerConfig>;
  promoRibbon: PromoRibbonConfig;
}

export const DEFAULT_BANNERS: BannerStoreState = {
  homeHero: {
    badge: 'Clinique Botanica • South Asia',
    title: 'High-Performance Radiance,',
    titleHighlight: 'Tailored for Every Skin.',
    subtitle:
      'Clinically proven botanical formulations engineered for South Asian climates. Dermatologically tested, cruelty-free, and meticulously calibrated for Men and Women.',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlOJoPgKGYUTFyrU6Zkru90zysTKfNIA4WC0fjWWHRJmUI181UrP1n64fpKiIZ3rMJr6HhkDWyTrC53gMDjEcXGh1SXlC4ZlCKX8FFMEV8Q7E872J-un1b7RAwbBaMqbjKDcYJ5DLdji-2WfzWnFoR6t9lN-uKhDrKpeqJITYrEZU3ZGkD5QkHH1PSRhBr_GNkxRHIvAzbt4s_WpNr25tYizGsnxp_2nU-oUVqZxEZn95dhwawTgezCw',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWdjQaMELbJx4Huf2UMZsszy_ANpp09ABiY8lcItAUlA4ruXHAoBRm7pTW0Z_hn3UGNDH-eQLub5BqroLcHqDYKI78drAb9I2DOOjdnGuIjxXB2uFz_weBpGtYujNDSZe8pE0eeDezriMDEgS_Bz9VcGAInXpBK9dllvmUMUE0065H5wR0yK2fA1TXmz5NvDvsTiZ6Qi3gFoZfYoMHTVAfsJHaTpWRWjO8KpF2SJHQnL-JwZknuUIUkw',
    primaryCtaLabel: 'Shop Women Collection',
    primaryCtaUrl: '/women',
    secondaryCtaLabel: 'Shop Men Collection',
    secondaryCtaUrl: '/men',
    overlayOpacity: 30,
  },
  pageBanners: {
    women: {
      id: 'banner-women',
      pageKey: 'women',
      pageName: 'Women Collection Page',
      badge: 'The Women Formulation Line',
      title: 'Bespoke Botanical Radiance,',
      titleHighlight: 'Infused with 24K Essence.',
      subtitle:
        'Meticulously calibrated botanical elixirs, damask rose hydrosols, and multi-peptides engineered to fortify cellular resilience against intense heat, urban smog, and humidity across Pakistan.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlOJoPgKGYUTFyrU6Zkru90zysTKfNIA4WC0fjWWHRJmUI181UrP1n64fpKiIZ3rMJr6HhkDWyTrC53gMDjEcXGh1SXlC4ZlCKX8FFMEV8Q7E872J-un1b7RAwbBaMqbjKDcYJ5DLdji-2WfzWnFoR6t9lN-uKhDrKpeqJITYrEZU3ZGkD5QkHH1PSRhBr_GNkxRHIvAzbt4s_WpNr25tYizGsnxp_2nU-oUVqZxEZn95dhwawTgezCw',
      primaryCtaLabel: 'Explore Formulations',
      primaryCtaUrl: '#products',
      overlayOpacity: 20,
    },
    men: {
      id: 'banner-men',
      pageKey: 'men',
      pageName: 'Men Collection Page',
      badge: 'The Men Fortitude Line',
      title: 'Obsidian Slate Fortitude,',
      titleHighlight: 'High-Performance Purity.',
      subtitle:
        'Engineered specifically for male dermal thickness and active lifestyle exposure. Activated volcanic charcoal, clinical Niacinamide, and antioxidant shields that defeat grease, humidity, and pollution.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCWdjQaMELbJx4Huf2UMZsszy_ANpp09ABiY8lcItAUlA4ruXHAoBRm7pTW0Z_hn3UGNDH-eQLub5BqroLcHqDYKI78drAb9I2DOOjdnGuIjxXB2uFz_weBpGtYujNDSZe8pE0eeDezriMDEgS_Bz9VcGAInXpBK9dllvmUMUE0065H5wR0yK2fA1TXmz5NvDvsTiZ6Qi3gFoZfYoMHTVAfsJHaTpWRWjO8KpF2SJHQnL-JwZknuUIUkw',
      primaryCtaLabel: 'Explore Formulations',
      primaryCtaUrl: '#products',
      overlayOpacity: 40,
    },
    shop: {
      id: 'banner-shop',
      pageKey: 'shop',
      pageName: 'All Products / Shop Page',
      badge: 'Complete Botanical Apothecary',
      title: 'Clinical Formulation Studio,',
      titleHighlight: 'Calibrated for Resiliency.',
      subtitle:
        'Pure cellular nutrition, cruelty-free botanicals, and high-potency actives tailored for South Asian dermal resilience under sun, dust, and arid urban climates.',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDXTANK53uj18t1_ILPGUQbZzqMFr5OWJTagkxfISowoC8Emq_mQL1Rw2QCBTc10w3sKIC8htMRZ-VuZvMZcP_V0S121SkywotnqyoStnDBvdIf9V4yp3iJIw3yO0VdTi_vgKTBToYxU50XG9uPjCtLM_Xb7jsyoSBfakl0SnErdcglo0l-p0b7_t5BMDkS6gNhiiRAyr1EfVaSsnv6NYzC3vyuKATYk3PvU0Af-XBk-ro6_IgMOUUzYQ',
      primaryCtaLabel: 'View All Formulations',
      primaryCtaUrl: '#all-products',
      overlayOpacity: 25,
    },
  },
  promoRibbon: {
    text: '✦ COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 3,500 ACROSS PAKISTAN ✦',
    link: '/shop',
    isActive: true,
  },
};

const STORAGE_KEY = 'eba_custom_banners';

/**
 * Compresses an uploaded image file using HTML5 Canvas to prevent LocalStorage quota exhaustion
 */
export async function compressImageFile(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return reject(new Error('Empty file content'));

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(src); // fallback to original
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function getCustomBanners(): BannerStoreState {
  if (typeof window === 'undefined') return DEFAULT_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BANNERS;
    const parsed = JSON.parse(raw);
    return {
      homeHero: { ...DEFAULT_BANNERS.homeHero, ...parsed.homeHero },
      pageBanners: {
        women: { ...DEFAULT_BANNERS.pageBanners.women, ...(parsed.pageBanners?.women || {}) },
        men: { ...DEFAULT_BANNERS.pageBanners.men, ...(parsed.pageBanners?.men || {}) },
        shop: { ...DEFAULT_BANNERS.pageBanners.shop, ...(parsed.pageBanners?.shop || {}) },
      },
      promoRibbon: { ...DEFAULT_BANNERS.promoRibbon, ...parsed.promoRibbon },
    };
  } catch {
    return DEFAULT_BANNERS;
  }
}

export function saveCustomBanners(banners: BannerStoreState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(banners);
    localStorage.setItem(STORAGE_KEY, serialized);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event('eba_banners_updated'));
    return true;
  } catch (err) {
    console.warn('LocalStorage quota or write error, attempting sessionStorage fallback:', err);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
      window.dispatchEvent(new Event('eba_banners_updated'));
      return true;
    } catch (sessionErr) {
      console.error('Failed to save custom banners in both localStorage and sessionStorage:', sessionErr);
      return false;
    }
  }
}
