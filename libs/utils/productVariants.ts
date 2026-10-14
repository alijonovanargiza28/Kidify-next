export function ageRange(v: any): number[] | undefined {
	if (v.ageMinMonths != null && v.ageMaxMonths != null) return [v.ageMinMonths, v.ageMaxMonths];
	const m = /^(?=.*(?:[-–]|[a-zA-Z]))(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?\s*(M|MO|MONTHS?|Y|YEARS?)?$/i.exec((v.size || '').trim());
	if (!m) return;
	const factor = /^Y/i.test(m[3]) ? 12 : 1;
	return [Number(m[1]) * factor, Number(m[2] ?? m[1]) * factor];
}
export function supportsMonth(v: any, month: number) {
	const r = ageRange(v);
	return !!r && month >= r[0] && month <= r[1];
}
export function productMonths(variants: any[]) {
	return Array.from(
		new Set<number>(
			variants.flatMap((v) => {
				const r = ageRange(v);
				return r && r[0] >= 0 && r[1] <= 240 && r[0] <= r[1]
					? Array.from({ length: r[1] - r[0] + 1 }, (_, i) => r[0] + i)
					: [];
			}),
		),
	).sort((a, b) => a - b);
}
export function colorImages(p: any, color?: string) {
	const matched = (p.productVariants || []).filter(
		(v: any) => (v.color || '').trim().toLowerCase() === (color || '').trim().toLowerCase(),
	);
	const images = Array.from(new Set<string>(matched.flatMap((v: any) => v.images || []).filter((src: unknown): src is string => typeof src === 'string' && src.trim().length > 0)));
	// Legacy product images have no known color relationship. Never label a different color photo as matching.
	return images.length ? images : color ? [] : p.productImages || [];
}

/** Each option corresponds to an actual seller-configured stock pool. */
export function configuredAgeOptions(variants: any[], color?: string) {
 return variants.filter(v => color == null || (v.color || '') === color).map(v => {
  const range = ageRange(v);
  return { variant:v, key:String(v._id), month:range?.[0], label:range ? (range[0] === range[1] ? `${range[0]} months` : `${range[0]}–${range[1]} months`) : v.size || 'Standard' };
 });
}

/** Purchase choices retain the seller's variant ID and shared stock pool. */
export function purchaseAgeOptions(variants: any[], color?: string) {
 const sameColor = variants.filter(v => color == null || (v.color || '') === color);
 const annual = (v: any) => {
  const range = ageRange(v);
  // Age units are stored as months. Whole-year endpoints can be displayed in years.
  return !!range && range[0] >= 12 && range[0] % 12 === 0 && range[1] % 12 === 0;
 };
 const monthly = sameColor.filter(v => !annual(v));
 const options: {key: string; label: string; month?: number; variant?: any; available: boolean}[] = [];
 const add = (key: string, label: string, candidates: any[], month?: number) => {
  const variant = candidates.find(v => v.stock > 0) || candidates[0];
  options.push({key, label, month, variant, available: !!variant && variant.stock > 0});
 };
 for (const [min, max] of [[0, 3], [3, 6], [6, 9], [9, 12]]) {
  add(`months-${min}-${max}`, `${min}–${max} months`, monthly.filter(v => {
   const range = ageRange(v);
   return range && range[0] <= min && range[1] >= max;
  }), min);
 }
 // Preserve nonstandard ranges, individual months and non-age sizes exactly as entered.
 for (const option of configuredAgeOptions(monthly)) {
  if (!options.some(o => o.variant?._id === option.variant._id && o.month === option.month && o.label === option.label))
   add(`variant-${option.key}`, option.label, [option.variant], option.month);
 }
 const annualVariants = variants.filter(annual);
 if (annualVariants.length) {
  const maximum = Math.min(20, Math.max(6, ...annualVariants.map(v => ageRange(v)![1] / 12)));
  for (let year = 1; year <= maximum; year++) {
   add(`year-${year}`, `${year} ${year === 1 ? 'year' : 'years'}`, sameColor.filter(v => annual(v) && supportsMonth(v, year * 12)), year * 12);
  }
 }
 return options;
}
