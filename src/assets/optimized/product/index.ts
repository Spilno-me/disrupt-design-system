// Product Hero Frame
import productHeroFrameAvif from './product-hero-frame.avif'
import productHeroFrameWebp from './product-hero-frame.webp'
import productHeroFramePng from './product-hero-frame.png'
import productHeroPlaceholder from '../placeholders/product-hero-frame-placeholder.webp'

export const productImages = {
  productHero: {
    // Using the same image for all breakpoints since only one size exists
    mobile: {
      avif: productHeroFrameAvif,
      webp: productHeroFrameWebp,
      fallback: productHeroFramePng,
    },
    tablet: {
      avif: productHeroFrameAvif,
      webp: productHeroFrameWebp,
      fallback: productHeroFramePng,
    },
    desktop: {
      avif: productHeroFrameAvif,
      webp: productHeroFrameWebp,
      fallback: productHeroFramePng,
    },
    placeholder: productHeroPlaceholder,
  },
}
