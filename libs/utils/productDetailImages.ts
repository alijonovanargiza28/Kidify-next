import { REACT_APP_API_URL } from '../config';
import { colorImages } from './productVariants';

/** Resolve only usable image references; malformed variant values must not erase the original gallery. */
export function detailImageUrl(value: unknown): string | undefined {
 if (typeof value !== 'string') return;
 const src = value.trim();
 if (!src || /^(?:undefined|null|false)$/i.test(src) || /[\u0000-\u001f]/.test(src)) return;
 if (/^data:image\/(?:png|jpeg|webp|gif|avif);base64,[a-z\d+/=]+$/i.test(src)) return src;
 if (/^blob:https?:\/\//i.test(src)) return src;
 if (/^[a-z][a-z\d+.-]*:/i.test(src) && !/^https?:\/\//i.test(src)) return;
 try {
  const resolved = src.startsWith('//') ? `https:${src}` : /^https?:\/\//i.test(src) ? src : src.startsWith('/img/') ? src : `${REACT_APP_API_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
  const parsed = new URL(resolved, 'http://localhost');
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname === '/' || /\/(?:undefined|null)(?:\/|$)/i.test(parsed.pathname)) return;
  return resolved;
 } catch { return; }
}
export function detailImages(values: unknown): string[] {
 return Array.isArray(values) ? Array.from(new Set(values.map(detailImageUrl).filter((src): src is string => !!src))) : [];
}
export function productDetailGallery(product: any, color?: string): string[] {
 const original = detailImages(product.productImages);
 const assigned = color == null ? [] : detailImages(colorImages(product, color));
 return assigned.length ? assigned : original;
}
