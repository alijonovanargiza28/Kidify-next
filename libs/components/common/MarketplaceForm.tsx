import styles from './MarketplaceRedesign.module.scss';
import { useTranslation } from 'next-i18next';
import { CameraAltOutlined, ShoppingBagOutlined, ArrowBack, SaveOutlined } from '@mui/icons-material';
import useUiText from '../../hooks/useUiText';
import React, { useEffect, useId, useRef, useState } from 'react';
import { Button, TextField, MenuItem, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { inputTypes, backendEnums } from '../../types/marketplace';
import { useAction } from '../../hooks/useMarketplace';
import { Photo } from './Marketplace';
import { ageRange } from '../../utils/productVariants';
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
	saleStart: 'Sale starts',
	saleEnd: 'Sale ends',
	productInstructions: 'Product instructions',
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
	onImageRemove,
	onCancel,
	submitLabel = 'Save',
	uploadTarget,
	brands = [],
	brandsLoading = false,
	brandsError,
	retryBrands,
}: any) {
 const uiText = useUiText();
 const { t: translate } = useTranslation('common');
 const tr = (key: string) => translate(`redesign.${key}`);

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
					(definitions[k].type.startsWith('DateTime') && initial[k]
						? new Date(new Date(initial[k]).getTime() - new Date(initial[k]).getTimezoneOffset() * 60000)
								.toISOString()
								.slice(0, 16)
						: initial[k]) ??
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
    const productGroups = [
        ['Product Images', 'productImages'],
        ['Basic Information', 'productName', 'productPrice', 'productType', 'productCategory', 'productCollection', 'productBrandId'],
        ['Product Description', 'productDesc'],
        ['Colors, Sizes & Stock', 'productVariants'],
        ['Material & Care', 'material', 'careInstructions'],
        ['Additional Information', 'productInstructions', 'deliveryReturnInfo'],
        ['Sale/Discount Settings', 'productDiscount', 'saleStart', 'saleEnd'],
    ];
    const availableFields: string[] = fields || Object.keys(definitions);
    const fieldKeys = isProduct ? [...productGroups.flatMap(([title, ...keys]) => {
        const shown = keys.filter(k => availableFields.includes(k) && !hidden.includes(k));
        return shown.length ? ['__section:' + title, ...shown] : [];
    }), ...availableFields.filter(k => !productGroups.some(g => g.slice(1).includes(k)))] : availableFields;
	const action = useAction();
	const set = (k: string, v: any) => setValues((s: any) => ({ ...s, [k]: v }));
	async function upload(k: string, files: FileList | null) {
		if (!files || saving.current) return;
		setError('');
		const selected = Array.from(files);
		try {
			validateImageSelection(
				selected,
				k === 'productImages' ? (values[k] || []).length + pendingImages.length : (Array.isArray(values[k]) ? values[k].length : 0),
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
 const renderField = (k: string) => {
						
						const d = definitions[k];
						if (!d) return null;
						const t = d.type.replace(/[!\[\]]/g, ''),
							required = d.type.endsWith('!') && d.default === undefined;
						const options = (backendEnums as any)[t];
						if (k === 'productVariants')
							return (
								<div className="full" key={k}>
									
									<p>
										{translate('productAge.hint')}</p>
									{values[k]?.map((v: any, i: number) => (
										<div className="array-row" key={i} data-variant-card={i + 1}>
											<div className="variant-colors" role="group" aria-label={`Variant ${i + 1} color`}>
												<span id={`${formId}-color-${i}`}>{uiText("Color")}{v.color ? ` — ${v.color}` : ''}</span>
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
																	values[k].map((x: any, j: number) => (j === i ? { ...x, color: color.name, images: x.color === color.name ? (x.images || []) : [] } : x)),
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
															values[k].map((x: any, j: number) => (j === i ? { ...x, color: '', images: x.color ? [] : (x.images || []) } : x)),
														)
													}
												>
													{uiText("No color")}</Button>
											</div>
											<TextField select size="small" label={translate('productAge.unit')} value={v._ageUnit || 'months'} onChange={e => set(k, values[k].map((x:any,j:number)=>j === i ? {...x,_ageUnit:e.target.value} : x))}>
                                                <MenuItem value="months">{translate('productAge.months')}</MenuItem>
                                                <MenuItem value="years">{translate('productAge.years')}</MenuItem>
                                            </TextField>
                                            {['size', 'ageMinMonths', 'ageMaxMonths', 'stock', 'sku'].map((f) => (
												<TextField size={isProduct ? "small" : "medium"}
													key={f}
													id={`${formId}-${k}-${i}-${f}`}
													label={v._ageUnit === 'years' && ['ageMinMonths','ageMaxMonths'].includes(f) ? translate(f === 'ageMinMonths' ? 'productAge.minYears' : 'productAge.maxYears') : tr(f)}
													type={['stock', 'ageMinMonths', 'ageMaxMonths'].includes(f) ? 'number' : 'text'}
													required={f === 'stock'}
													inputProps={{ min: 0, step: v._ageUnit === 'years' && ['ageMinMonths','ageMaxMonths'].includes(f) ? 'any' : 1, ...(['ageMinMonths','ageMaxMonths'].includes(f) ? {max:v._ageUnit === 'years' ? 20 : 240} : {}) }}
													value={v[f] === '' || v[f] == null ? '' : v._ageUnit === 'years' && ['ageMinMonths','ageMaxMonths'].includes(f) ? Number(v[f]) / 12 : v[f]}
													onChange={(e) =>
														set(
															k,
															values[k].map((x: any, j: number) => (j === i ? { ...x, [f]: e.target.value === '' ? '' : v._ageUnit === 'years' && ['ageMinMonths','ageMaxMonths'].includes(f) ? Number(e.target.value) * 12 : e.target.value } : x)),
														)
													}
												/>
											))}
											<div className="variant-image-choice">
												<span>{uiText("Images for")}{v.color || 'this variant'} {uiText("(select explicitly)")}</span>
                                                {v.color && !v.images?.length && <small>{uiText("Choose matching photos for this color. Changing the color clears its image selection.")}</small>}
												{[...(values.productImages || []), ...pendingImages.map((image) => image.url)].map(
													(src: string) => (
														<label key={src}>
															<input
																type="checkbox"
																aria-label={`Use image for variant ${i + 1}: ${src}`}
																checked={(v.images || []).includes(src)}
																onChange={(e) => {
																	const images = e.target.checked
																		? [...(v.images || []), src]
																		: (v.images || []).filter((s: string) => s !== src);
																	set(
																		k,
																		values[k].map((x: any, j: number) =>
																			(v.color && x.color === v.color) || i === j ? { ...x, images } : x,
																		),
																	);
																}}
															/>
															<Photo src={src} alt="Variant image" />
														</label>
													),
												)}
											</div>
											<Button
												onClick={() =>
													set(
														k,
														values[k].filter((_: any, j: number) => i !== j),
													)
												}
											>
												{uiText("Remove")}</Button>
										</div>
									))}
									<Button
										disabled={(values[k] || []).length >= 100}
										onClick={() => set(k, [...(values[k] || []), { color: '', size: '', stock: '', sku: '' }])}
									>
										{uiText("Add variant")}</Button>
								</div>
							);
						if (/Image|images/.test(k) && uploadTarget)
							return (
								<div className="full image-upload-area" key={k}>
									<label htmlFor={`${formId}-${k}`}>{uiText(fieldLabel(k))}</label>
									{k === 'productImages' && (
										<p id={`${formId}-${k}-help`}>
											{uiText("Upload up to 5 images. At least 1 image is required. JPEG or PNG, up to 15 MB each.")}</p>
									)}
									<div className="thumbnails">
										{(Array.isArray(values[k]) ? values[k] : values[k] ? [values[k]] : []).map(
											(src: string, i: number) => (
												<div key={i}>
													<Photo src={src} alt={uiText(fieldLabel(k))} />
													<Button
														disabled={busy}
                                                onClick={async () => {
                                                    if (saving.current) return;
                                                    if (k === 'memberImage' && onImageRemove) {
                                                        saving.current = true; setBusy(true); setError('');
                                                        try { await onImageRemove(); set(k, ''); }
                                                        catch (err: any) { setError(err.message || 'Unable to remove image'); }
                                                        finally { saving.current = false; setBusy(false); }
                                                        return;
                                                    }
                                                    set(k, Array.isArray(values[k]) ? values[k].filter((_: any, j: number) => i !== j) : '');
                                                    if (isProduct) set('productVariants', values.productVariants.map((v: any) => ({ ...v, images: (v.images || []).filter((s: string) => s !== src) })));
                                                }}
													>
														{uiText("Remove")}</Button>
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
															set(
																'productVariants',
																values.productVariants.map((v: any) => ({
																	...v,
																	images: (v.images || []).filter((s: string) => s !== image.url),
																})),
															);
															URL.revokeObjectURL(image.url);
															previewUrls.current.delete(image.url);
															setPendingImages((previous) => previous.filter((item) => item.url !== image.url));
														}}
													>
														{uiText("Remove")}</Button>
												</div>
											))}
									</div>
									{isProduct && <label className={styles.uploadButton} htmlFor={`${formId}-${k}`}><CameraAltOutlined />{tr("Add Images")}</label>}
									<input
                                        className={isProduct ? styles.fileInput : undefined}
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
									label={uiText(fieldLabel(k))}
									control={<Checkbox checked={Boolean(values[k])} onChange={(e) => set(k, e.target.checked)} />}
								/>
							);
						if (k === 'productBrandId')
							return (
								<TextField size={isProduct ? "small" : "medium"}
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
									label={uiText("Brand")}
									value={values[k] || ''}
									onChange={(e) => set(k, e.target.value)}
								>
									<MenuItem value="">{uiText("No brand")}</MenuItem>
									{brands.map((b: any) => (
										<MenuItem value={b._id} key={b._id}>
											{b.brandName}
										</MenuItem>
									))}
								</TextField>
							);
						if (!options && /Desc|description|Content|message|instructions|text|answer|Info|material/i.test(k))
							return (
								<label className={isProduct && k !== "productDesc" ? "field-above" : "field-above full"} key={k} htmlFor={`${formId}-${k}`}>
									{uiText(fieldLabel(k))}
									{required ? ' *' : ''}
                                    {k === 'articleContent' && <small>{translate('formErrors.articleContent')} ({String(values[k] || '').length}/250)</small>}
									<textarea
										id={`${formId}-${k}`}
										required={required}
										value={values[k] ?? ''}
										onChange={(e) => set(k, e.target.value)}
										rows={isProduct ? 2 : 5}
										maxLength={k === 'productDesc' ? 10000 : k === 'articleContent' ? 250 : undefined}
                                        minLength={k === 'articleContent' ? 3 : undefined}
									/>
								</label>
							);
						return (
							<TextField size={isProduct ? "small" : "medium"}
								key={k}
								id={`${formId}-${k}`}
								label={uiText(fieldLabel(k))}
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
								inputProps={/Int|Float/.test(t) ? { min: k === 'usageLimit' ? 1 : 0, step: t === 'Int' ? 1 : 'any' } : k === 'articleTitle' ? {minLength:3,maxLength:50} : undefined}
                                helperText={k === 'code' && type === 'SellerCodeInput' ? translate('formErrors.codeHelp') : undefined}
								value={t === 'DateTime' && values[k] ? String(values[k]).slice(0, 16) : values[k] ?? ''}
								onChange={(e) => set(k, e.target.value)}
							>
								{options && [
									<MenuItem key="none" value="">
										{uiText("Select")}</MenuItem>,
									...options.map((v: string) => (
										<MenuItem key={v} value={v}>
											{uiText(v.replace(/_/g, ' '))}
										</MenuItem>
									)),
								]}
							</TextField>
						);
					
 };

	return (
		<form
			className={isProduct ? `panel compact-product-form ${styles.editor}` : "panel"}
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
 if(type === 'MemberUpdate' && k === 'memberImage'){input[k]='';continue;}
 if(type==='ProductUpdate' && ['saleStart','saleEnd','productBrandId','productCollection'].includes(k)){input[k]=null;continue;}
 if(type==='ProductUpdate' && ['productDesc','material','careInstructions','productInstructions','deliveryReturnInfo'].includes(k)){input[k]='';continue;}
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
								ageMinMonths: x.ageMinMonths === '' || x.ageMinMonths == null ? undefined : Number(x.ageMinMonths),
								ageMaxMonths: x.ageMaxMonths === '' || x.ageMaxMonths == null ? undefined : Number(x.ageMaxMonths),
								images: x.images || [],
							}));
						input[k] = v;
					}
					if (type.startsWith('BoardArticle')) {
                        if (input.articleTitle != null && (input.articleTitle.trim().length < 3 || input.articleTitle.trim().length > 50)) throw new Error(translate('formErrors.articleTitle'));
                        if (input.articleContent != null && (input.articleContent.trim().length < 3 || input.articleContent.trim().length > 250)) throw new Error(translate('formErrors.articleContent'));
                    }
                    if (type === 'SellerCodeInput' && input.code != null) {
                        input.code = input.code.trim();
                        if (input.code.length < 8 || input.code.length > 128) throw new Error(translate('formErrors.sellerCode'));
                    }
                    if (type === 'CouponInput') {
                        input.code = input.code.trim().toUpperCase();
                        if (!input.code || input.code.length > 80) throw new Error(translate('formErrors.couponCode'));
                        if (input.discountType === 'PERCENT' && input.discountValue > 100) throw new Error(translate('formErrors.percent'));
                        if (input.usageLimit != null && input.usageLimit < 1) throw new Error(translate('formErrors.usageLimit'));
                        if (input.startAt && input.endAt && input.startAt >= input.endAt) throw new Error(translate('formErrors.dateRange'));
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
							const uploadMap = new Map<string, string>(pendingImages.map((image, index) => [image.url, paths[index]]));
							input.productVariants = input.productVariants.map((v: any) => ({
								...v,
								images: (v.images || []).map((src: string) => uploadMap.get(src) || src),
							}));
							set('productVariants', input.productVariants);
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
			{isProduct && <header className={styles.editorHeader}>
 <ShoppingBagOutlined /><div><h2>{tr(type === 'ProductInput' ? 'Add Product' : 'Edit Product')}</h2><p>{tr('Fill in the product information below.')}</p></div>
 {onCancel && <Button type="button" variant="outlined" startIcon={<ArrowBack />} disabled={busy} onClick={onCancel}>{tr('Back to Products')}</Button>}
 </header>}
 <fieldset className={isProduct ? styles.sections : "form-grid"} disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
{isProduct ? productGroups.map(([title, ...keys], index) => {
 const shown = keys.filter(k => availableFields.includes(k) && !hidden.includes(k));
 return shown.length ? <section className={styles.formSection} key={title} aria-label={tr(title)}>
  <h3><span>{index + 1}</span>{tr(title)}</h3>
  <div className="form-grid">{shown.map(renderField)}</div>
 </section> : null;
}) : fieldKeys.filter(k => !hidden.includes(k) && k !== '_id').map(renderField)}
			</fieldset>
			{isProduct && brandsError && (
				<Button type="button" onClick={retryBrands}>
					{uiText("Retry brands")}</Button>
			)}
			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{uiText(error)}
				</Alert>
			)}
			<div className="form-actions">
                {isProduct && onCancel && <Button type="button" variant="outlined" disabled={busy} onClick={onCancel}>{uiText("Cancel")}</Button>}
				<Button type="submit" variant="contained" disabled={busy}>
					{busy ? tr('Saving…') : isProduct ? tr('Save Product') : submitLabel}
				</Button>
			</div>
		</form>
	);
}
