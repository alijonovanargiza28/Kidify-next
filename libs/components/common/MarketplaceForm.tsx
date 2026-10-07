import React, { useEffect, useId, useRef, useState } from 'react';
import { Button, TextField, MenuItem, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { inputTypes, backendEnums } from '../../types/marketplace';
import { useAction } from '../../hooks/useMarketplace';
import { Photo } from './Marketplace';
import { validateProductInput, validateImageSelection, productColors } from '../../utils/productForm';
const labels: Record<string, string> = {
	memberNick: 'Nickname',
	memberPhone: 'Phone',
	memberFullName: 'Full name',
	memberDesc: 'About you',
	memberAddress: 'Address',
	memberPassword: 'Password',
	productName: 'Product name',
	productPrice: 'Price',
	productDesc: 'Description',
	productImages: 'Product images',
	productType: 'Type',
	productCategory: 'Category',
	productCollection: 'Collection',
	productBrandId: 'Brand',
	productDiscount: 'Discount (%)',
	productVariants: 'Variants',
	articleTitle: 'Title',
	articleContent: 'Article',
	articleCategory: 'Category',
	articleImage: 'Article image',
	brandName: 'Brand name',
	brandDescription: 'Description',
	brandImage: 'Brand image',
	recipientName: 'Recipient name',
	isDefault: 'Default address',
	careInstructions: 'Care instructions',
	deliveryReturnInfo: 'Delivery and returns',
	minimumOrder: 'Minimum order',
	maximumDiscount: 'Maximum discount',
	discountValue: 'Discount value',
	discountType: 'Discount type',
	usageLimit: 'Usage limit',
	sellerCode: 'Seller invitation code',
	relatedOrderId: 'Related order ID',
};
export const fieldLabel = (s: string) =>
	labels[s] || s.replace(/([A-Z])/g, ' $1').replace(/^./, (x) => x.toUpperCase());
export default function MarketplaceForm({
	type,
	initial = {},
	fields,
	hidden = [],
	onSubmit,
	submitLabel = 'Save',
	uploadTarget,
	brands = [],
	brandsLoading = false,
	brandsError,
	retryBrands,
}: any) {
	const formId = useId();
	const isProduct = type === 'ProductInput' || type === 'ProductUpdate';
	const [pendingImages, setPendingImages] = useState<{ file: File; url: string }[]>([]);
	const previewUrls = useRef(new Set<string>());
	const saving = useRef(false);
	useEffect(
		() => () => {
			previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
		},
		[],
	);
	const definitions: any = (inputTypes as any)[type] || {};
	const [values, setValues] = useState<any>(() =>
			Object.fromEntries(
				Object.keys(definitions).map((k) => [
					k,
					initial[k] ??
						definitions[k].default ??
						(k === 'productVariants'
							? [{ color: '', size: '', stock: '', sku: '' }]
							: definitions[k].type.includes('[')
							? []
							: ''),
				]),
			),
		),
		[busy, setBusy] = useState(false),
		[error, setError] = useState('');
	const action = useAction();
	const set = (k: string, v: any) => setValues((s: any) => ({ ...s, [k]: v }));
	async function upload(k: string, files: FileList | null) {
		if (!files || saving.current) return;
		setError('');
		const selected = Array.from(files);
		try {
			validateImageSelection(
				selected,
				k === 'productImages' ? (values[k] || []).length + pendingImages.length : 0,
				k === 'productImages' ? 5 : 10,
			);
		} catch (e: any) {
			setError(e.message);
			return;
		}
		if (k === 'productImages') {
			const added = selected.map((file) => {
				const url = URL.createObjectURL(file);
				previewUrls.current.add(url);
				return { file, url };
			});
			setPendingImages((previous) => [...previous, ...added]);
			return;
		}
		saving.current = true;
		setBusy(true);
		try {
			const result = await action('imagesUploader', { files: Array.from(files), target: uploadTarget });
			set(k, definitions[k].type.includes('[') ? [...(values[k] || []), ...result] : result[0]);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setBusy(false);
			saving.current = false;
		}
	}
	return (
		<form
			className="panel"
			onSubmit={async (e) => {
				e.preventDefault();
				if (saving.current) return;
				saving.current = true;
				setBusy(true);
				setError('');
				try {
					const input: any = {};
					for (const k of Object.keys(definitions)) {
						if (hidden.includes(k) || (fields && !fields.includes(k))) continue;
						let v = values[k];
						const t = definitions[k].type;
						if (v === '' || v == null) {
							if (t.endsWith('!') && definitions[k].default === undefined)
								throw new Error(fieldLabel(k) + ' is required');
							continue;
						}
						if (t.startsWith('Int') || t.startsWith('Float')) {
							v = Number(v);
							if (!Number.isFinite(v) || (t.startsWith('Int') && !Number.isInteger(v)))
								throw new Error(fieldLabel(k) + ' must be a valid number');
						}
						if (t.startsWith('DateTime')) v = new Date(v).toISOString();
						if (k === 'productVariants')
							v = v.map((x: any) => ({
								color: x.color || undefined,
								size: x.size || undefined,
								stock: x.stock === '' || x.stock == null ? NaN : Number(x.stock),
								sku: x.sku || undefined,
							}));
						input[k] = v;
					}
					if (isProduct) {
						validateProductInput(
							input,
							(input.productImages || []).length + pendingImages.length,
							type === 'ProductInput',
						);
						if (pendingImages.length) {
							const paths = await action('imagesUploader', {
								files: pendingImages.map((image) => image.file),
								target: 'product',
							});
							if (!Array.isArray(paths) || paths.length !== pendingImages.length)
								throw new Error('Image upload failed. Please try again.');
							input.productImages = [...(input.productImages || []), ...paths];
							set('productImages', input.productImages);
							pendingImages.forEach((image) => {
								URL.revokeObjectURL(image.url);
								previewUrls.current.delete(image.url);
							});
							setPendingImages([]);
						}
					}
					await onSubmit(input);
				} catch (e: any) {
					setError(e.message || 'Unable to save');
				} finally {
					setBusy(false);
					saving.current = false;
				}
			}}
		>
			<fieldset className="form-grid" disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
				{(fields || Object.keys(definitions))
					.filter((k: string) => !hidden.includes(k) && k !== '_id')
					.map((k: string) => {
						const d = definitions[k];
						if (!d) return null;
						const t = d.type.replace(/[!\[\]]/g, ''),
							required = d.type.endsWith('!') && d.default === undefined;
						const options = (backendEnums as any)[t];
						if (k === 'productVariants')
							return (
								<div className="full" key={k}>
									<h3>Sizes, colors & stock</h3>
									{values[k]?.map((v: any, i: number) => (
										<div className="array-row" key={i}>
											<div className="variant-colors" role="group" aria-label={`Variant ${i + 1} color`}>
												<span id={`${formId}-color-${i}`}>Color{v.color ? ` — ${v.color}` : ''}</span>
												<div className="color-swatches">
													{[
														...productColors,
														...(v.color && !productColors.some((c) => c.name === v.color)
															? [{ name: v.color, hex: '#d7c1c4' }]
															: []),
													].map((color) => (
														<button
															key={color.name}
															type="button"
															className="color-swatch"
															style={{ backgroundColor: color.hex }}
															aria-label={color.name}
															title={color.name}
															aria-pressed={v.color === color.name}
															onClick={() =>
																set(
																	k,
																	values[k].map((x: any, j: number) => (j === i ? { ...x, color: color.name } : x)),
																)
															}
														/>
													))}
												</div>
												<Button
													type="button"
													size="small"
													onClick={() =>
														set(
															k,
															values[k].map((x: any, j: number) => (j === i ? { ...x, color: '' } : x)),
														)
													}
												>
													No color
												</Button>
											</div>
											{['size', 'stock', 'sku'].map((f) => (
												<TextField
													key={f}
													id={`${formId}-${k}-${i}-${f}`}
													label={fieldLabel(f)}
													type={f === 'stock' ? 'number' : 'text'}
													required={f === 'stock'}
													inputProps={{ min: 0, step: 1 }}
													value={v[f] ?? ''}
													onChange={(e) =>
														set(
															k,
															values[k].map((x: any, j: number) => (j === i ? { ...x, [f]: e.target.value } : x)),
														)
													}
												/>
											))}
											<Button
												onClick={() =>
													set(
														k,
														values[k].filter((_: any, j: number) => i !== j),
													)
												}
											>
												Remove
											</Button>
										</div>
									))}
									<Button
										disabled={(values[k] || []).length >= 100}
										onClick={() => set(k, [...(values[k] || []), { color: '', size: '', stock: '', sku: '' }])}
									>
										Add variant
									</Button>
								</div>
							);
						if (/Image|images/.test(k) && uploadTarget)
							return (
								<div className="full image-upload-area" key={k}>
									<label htmlFor={`${formId}-${k}`}>{fieldLabel(k)}</label>
									{k === 'productImages' && (
										<p id={`${formId}-${k}-help`}>
											Upload up to 5 images. At least 1 image is required. JPEG or PNG, up to 15 MB each.
										</p>
									)}
									<div className="thumbnails">
										{(Array.isArray(values[k]) ? values[k] : values[k] ? [values[k]] : []).map(
											(src: string, i: number) => (
												<div key={i}>
													<Photo src={src} alt={fieldLabel(k)} />
													<Button
														onClick={() =>
															set(k, Array.isArray(values[k]) ? values[k].filter((_: any, j: number) => i !== j) : '')
														}
													>
														Remove
													</Button>
												</div>
											),
										)}
										{k === 'productImages' &&
											pendingImages.map((image, i) => (
												<div key={image.url}>
													<Photo src={image.url} alt={`Selected image ${i + 1}`} />
													<Button
														type="button"
														aria-label={`Remove selected image ${i + 1}`}
														onClick={() => {
															URL.revokeObjectURL(image.url);
															previewUrls.current.delete(image.url);
															setPendingImages((previous) => previous.filter((item) => item.url !== image.url));
														}}
													>
														Remove
													</Button>
												</div>
											))}
									</div>
									<input
										type="file"
										id={`${formId}-${k}`}
										aria-describedby={k === 'productImages' ? `${formId}-${k}-help` : undefined}
										accept="image/*"
										multiple={d.type.includes('[')}
										disabled={busy}
										onChange={(e) => {
											void upload(k, e.target.files);
											e.target.value = '';
										}}
									/>
								</div>
							);
						if (t === 'Boolean')
							return (
								<FormControlLabel
									key={k}
									label={fieldLabel(k)}
									control={<Checkbox checked={Boolean(values[k])} onChange={(e) => set(k, e.target.checked)} />}
								/>
							);
						if (k === 'productBrandId')
							return (
								<TextField
									select
									key={k}
									id={`${formId}-${k}`}
									InputLabelProps={{ htmlFor: undefined }}
									disabled={brandsLoading}
									error={Boolean(brandsError)}
									helperText={
										brandsError
											? 'Unable to load brands. Retry below.'
											: brandsLoading
											? 'Loading brands…'
											: brands.length
											? undefined
											: 'No brands yet. An administrator can add them in My Page → Brands.'
									}
									label="Brand"
									value={values[k] || ''}
									onChange={(e) => set(k, e.target.value)}
								>
									<MenuItem value="">No brand</MenuItem>
									{brands.map((b: any) => (
										<MenuItem value={b._id} key={b._id}>
											{b.brandName}
										</MenuItem>
									))}
								</TextField>
							);
						return (
							<TextField
								key={k}
								id={`${formId}-${k}`}
								label={fieldLabel(k)}
								required={required}
								select={Boolean(options)}
								multiline={!options && /Desc|description|Content|message|instructions|text|answer|Info/i.test(k)}
								minRows={/Content|description|message|answer/.test(k) ? 4 : undefined}
								type={
									options
										? 'text'
										: t === 'DateTime'
										? 'datetime-local'
										: /Int|Float/.test(t)
										? 'number'
										: /Password/.test(k)
										? 'password'
										: 'text'
								}
								InputLabelProps={{
									...(t === 'DateTime' ? { shrink: true } : {}),
									...(options ? { htmlFor: undefined } : {}),
								}}
								inputProps={/Int|Float/.test(t) ? { min: 0, step: t === 'Int' ? 1 : 'any' } : undefined}
								value={t === 'DateTime' && values[k] ? String(values[k]).slice(0, 16) : values[k] ?? ''}
								onChange={(e) => set(k, e.target.value)}
							>
								{options && [
									<MenuItem key="none" value="">
										Select
									</MenuItem>,
									...options.map((v: string) => (
										<MenuItem key={v} value={v}>
											{v.replace(/_/g, ' ')}
										</MenuItem>
									)),
								]}
							</TextField>
						);
					})}
			</fieldset>
			{isProduct && brandsError && (
				<Button type="button" onClick={retryBrands}>
					Retry brands
				</Button>
			)}
			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}
			<div className="form-actions">
				<Button type="submit" variant="contained" disabled={busy}>
					{busy ? 'Saving…' : submitLabel}
				</Button>
			</div>
		</form>
	);
}
