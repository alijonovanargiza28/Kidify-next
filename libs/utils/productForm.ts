import { ageRange } from './productVariants';
import { backendEnums } from '../types/marketplace';

// The backend stores an optional string per variant; these are UI choices, not a new enum.
export const productColors = [
	{ name: 'White', hex: '#ffffff' },
	{ name: 'Black', hex: '#202020' },
	{ name: 'Pink', hex: '#f5d9de' },
	{ name: 'Blue', hex: '#8fadc7' },
	{ name: 'Beige', hex: '#e8dbc4' },
	{ name: 'Brown', hex: '#805a43' },
	{ name: 'Gray', hex: '#9b9b9b' },
	{ name: 'Yellow', hex: '#f0d675' },
];
export function validateImageSelection(files: readonly { type: string; size: number }[], existing: number, max = 5) {
	if (!files.length) return;
	if (existing + files.length > max) throw new Error(`Upload up to ${max} images. Remove an image before adding more.`);
	for (const file of files) {
		if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type))
			throw new Error('Please choose JPEG or PNG images. These are the formats supported by the server.');
		if (file.size <= 0 || file.size > 15000000)
			throw new Error('Each image must be non-empty and no larger than 15 MB.');
	}
}
export function validateProductInput(input: any, imageCount: number, creating: boolean) {
	if (!input.productName?.trim() || input.productName.length > 150)
		throw new Error('Product name is required and must be 150 characters or fewer.');
	if (input.productDesc?.length > 10000) throw new Error('Description must be 10,000 characters or fewer.');
	if (typeof input.productPrice !== 'number' || !Number.isFinite(input.productPrice) || input.productPrice < 0)
		throw new Error('Price must be a valid number of zero or more.');
	if (imageCount < 1 || imageCount > 5) throw new Error('Please select between 1 and 5 product images.');
	for (const [field, kind] of [
		['productType', 'ProductType'],
		['productCategory', 'ProductCategory'],
		['productCollection', 'ProductCollection'],
	]) {
		if (field === 'productCollection' && !input[field]) continue;
		if (!(backendEnums as any)[kind].includes(input[field]))
			throw new Error(`Please select a valid ${field.replace('product', '').toLowerCase()}.`);
	}
	if (input.productBrandId && !/^[a-f\d]{24}$/i.test(input.productBrandId))
		throw new Error('Please select a valid brand.');
	if (
		input.productDiscount != null &&
		(!Number.isInteger(input.productDiscount) || input.productDiscount < 0 || input.productDiscount > 100)
	)
		throw new Error('Discount must be a whole number between 0 and 100.');
	if (
		Boolean(input.saleStart) !== Boolean(input.saleEnd) ||
		(input.saleStart && +new Date(input.saleStart) >= +new Date(input.saleEnd))
	)
		throw new Error('Choose both sale dates, with the end after the start.');
	const variants = input.productVariants;
	if (!Array.isArray(variants) || variants.length < 1 || variants.length > 100)
		throw new Error('Add between 1 and 100 variants.');
	const seen = new Set<string>();
	for (const variant of variants) {
		if (!Number.isInteger(variant.stock) || variant.stock < 0 || variant.stock > 2147483647)
			throw new Error('Every variant needs a whole-number stock of zero or more.');
		for (const field of ['color', 'size', 'sku'])
			if (variant[field] != null && (typeof variant[field] !== 'string' || variant[field].length > 80))
				throw new Error('Color, size and SKU must be 80 characters or fewer.');
		const range = ageRange(variant);
		if (
			(variant.ageMinMonths == null) !== (variant.ageMaxMonths == null) ||
			(range && (!range.every(Number.isInteger) || range[0] < 0 || range[1] > 240 || range[0] > range[1]))
		)
			throw new Error('Enter a valid month interval between 0 and 240.');
		const key = JSON.stringify([
			(variant.color ?? '').toLowerCase(),
			variant.ageMinMonths ?? variant.size ?? '',
			variant.ageMaxMonths ?? '',
		]);
		if (seen.has(key)) throw new Error('Each color and size combination must be unique.');
		seen.add(key);
	}
	for (let i = 0; i < variants.length; i++)
		for (let j = 0; j < i; j++) {
			const a = variants[i],
				b = variants[j],
				ar = ageRange(a),
				br = ageRange(b);
			if (
				(a.color || '').toLowerCase() === (b.color || '').toLowerCase() &&
				ar &&
				br &&
				ar[0] <= br[1] &&
				br[0] <= ar[1]
			)
				throw new Error('Month intervals for the same color must not overlap.');
		}
	if (creating && !variants.some((variant: any) => variant.stock > 0))
		throw new Error('At least one variant must have stock greater than zero.');
}
