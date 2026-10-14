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
