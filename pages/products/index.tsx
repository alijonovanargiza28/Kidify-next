import useUiText from '../../libs/hooks/useUiText';
import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import PriceRangeFilter from '../../libs/components/common/PriceRangeFilter';
import { useRouter } from 'next/router';
import { Button, TextField, MenuItem } from '@mui/material';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import FilterInput from '../../libs/components/common/FilterInput';
import AgeRangeFilter from '../../libs/components/common/AgeRangeFilter';
import Brands from '../../libs/components/common/Brands';
import TrustRow from '../../libs/components/common/TrustRow';
import ColorSelector from '../../libs/components/common/ColorSelector';
import { productColors } from '../../libs/utils/productForm';
import ProductCard from '../../libs/components/property/MarketplaceProductCard';
import { State, Pager, PageTitle } from '../../libs/components/common/Marketplace';
import { backendEnums } from '../../libs/types/marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Products() {
 const uiText = useUiText();

	const router = useRouter();
	const q = router.query;
 const { t } = useTranslation('common');
 const pending = useRef(q);
 const observed = useRef(q);
 if (observed.current !== q) { observed.current = q; pending.current = q; }
 const patch = (values: Record<string, any>, reset = false) => {
  const next: any = { ...(reset ? {} : pending.current), page: 1, ...values };
  Object.keys(next).forEach(key => { if (next[key] === '' || next[key] == null) delete next[key]; });
  if (Object.keys(next).length === Object.keys(pending.current).length && Object.keys(next).every(key => String(next[key]) === String(pending.current[key]))) return;
  pending.current = next;
  void router.push({ pathname: '/products', query: next }, undefined, { shallow: true, scroll: false });
 };
	const page = Math.max(1, Math.floor(Number(q.page) || 1));
	const search: any = {};
	['category', 'collection', 'type', 'brandId', 'sellerId', 'color', 'size', 'text'].forEach((k) => {
		if (typeof q[k] === 'string' && q[k]) search[k] = q[k];
	});
	['minPrice', 'maxPrice', 'discount', 'ageMonth', 'ageFromMonths', 'ageToMonths'].forEach((k) => {
		if (q[k] !== undefined && q[k] !== '' && Number.isFinite(Number(q[k]))) search[k] = Number(q[k]);
	});
	if (q.saleOnly === 'true') search.saleOnly = true;
	const query = useMarketplace(
		'getProducts',
		{ input: { page, limit: 12, sort: q.sort || 'NEWEST', search } },
		!router.isReady,
	);
	const stableQuery = { ...query, value: query.value ?? query.previousData?.getProducts };
	const brands = useMarketplace('getBrands', { input: { page: 1, limit: 100 } });
	const chosenBrand = useMarketplace('getBrand', { id: q.brandId }, typeof q.brandId !== 'string' || !q.brandId);
	const set = (key: string, value: any) => patch({ [key]: value });
	const select = (key: string, label: string, values: readonly string[]) => (
		<TextField
			InputLabelProps={{ htmlFor: undefined, shrink: true }}
			select
			label={uiText(label)}
			value={q[key] || (key === 'sort' ? 'NEWEST' : '')}
			onChange={(e) => set(key, e.target.value)}
			fullWidth
			size="small"
   SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { maxHeight: 300, maxWidth: 'calc(100vw - 32px)', '& .Mui-selected': { backgroundColor: '#f8e6ec !important' } } } } }}
		>
			{key !== 'sort' && <MenuItem value="">{uiText("All")}</MenuItem>}
			{values.map((v) => (
				<MenuItem key={v} value={v}>
					{key === 'category' ? t(`productFilters.categories.${v}`) : uiText(v.replace(/_/g, ' '))}
				</MenuItem>
			))}
		</TextField>
	);
	return (
		<>
			<PageTitle title={uiText("Discover Little Things")} subtitle={uiText("Beautiful essentials for every little moment.")} />
			<div className="catalog-layout">
				<aside className="filter-panel">
					<div className="section-heading">
						<h2>{uiText("Filter By")}</h2>
						<Button onClick={() => patch({}, true)}>{uiText("Clear All")}</Button>
					</div>
					<FilterInput
						label={uiText("Search")}
						value={q.text || ''}
						onChange={(value: string) => set('text', value)}
						size="small"
					/>
					<fieldset className="filter-group">
						<legend>{uiText("Collection")}</legend>
						{backendEnums.ProductCollection.map((value) => (
							<label key={value}>
								<input
									type="radio"
									name="collection-filter"
									value={value}
									checked={q.collection === value}
									onChange={() => set('collection', value)}
								/>
								{uiText(value.replace(/_/g, ' '))}
							</label>
						))}
						<Button onClick={() => set('collection', '')}>{uiText("All collections")}</Button>
					</fieldset>
					{select('type', 'Type', backendEnums.ProductType)}
					{select('category', 'Category', backendEnums.ProductCategory)}
					<fieldset className="filter-group">
						<legend>{uiText("Brand")}</legend>
						<label>
							<input type="radio" name="brand-filter" checked={!q.brandId} onChange={() => set('brandId', '')} />
							{uiText("All brands")}</label>
						{chosenBrand.value && !brands.value?.list?.some((b: any) => b._id === chosenBrand.value._id) && (
							<label>
								<input type="radio" name="brand-filter" checked readOnly />
								{chosenBrand.value.brandName}
							</label>
						)}
						{brands.value?.list?.map((brand: any) => (
							<label key={brand._id}>
								<input
									type="radio"
									name="brand-filter"
									checked={q.brandId === brand._id}
									onChange={() => set('brandId', brand._id)}
								/>
								{brand.brandName}
							</label>
						))}
						{brands.error ? (
							<Button onClick={() => brands.refetch()}>{uiText("Retry brands")}</Button>
						) : (
							!brands.loading && !brands.value?.list?.length && <small>{uiText("No brands available yet.")}</small>
						)}
					</fieldset>
					<ColorSelector
						colors={Array.from(
							new Set([
								...productColors.map((c) => c.name),
								...(typeof q.color === 'string' && q.color ? [q.color] : []),
							]),
						)}
						value={String(q.color || '')}
						onChange={(value) => set('color', q.color === value ? '' : value)}
					/>
					<AgeRangeFilter
						from={
							q.ageFromMonths != null ? Number(q.ageFromMonths) : q.ageMonth != null ? Number(q.ageMonth) : undefined
						}
						to={q.ageToMonths != null ? Number(q.ageToMonths) : q.ageMonth != null ? Number(q.ageMonth) : undefined}
      onCommit={([from, to]) => patch({ ageFromMonths: from, ageToMonths: to, ageMonth: undefined })}
      onClear={() => patch({ ageMonth: undefined, ageFromMonths: undefined, ageToMonths: undefined })}
     />
     <PriceRangeFilter from={search.minPrice} to={search.maxPrice}
      onCommit={(range: number[]) => patch({ minPrice: range[0], maxPrice: range[1] })}
      onClear={() => patch({ minPrice: undefined, maxPrice: undefined })} />
                    {['size'].map((k) => (
						<FilterInput
							key={k}
							label={k.replace(/([A-Z])/g, ' $1')}
							type={k.includes('Price') ? 'number' : 'text'}
							value={q[k] || ''}
							onChange={(value: string) => set(k, value)}
							size="small"
							inputProps={{ min: 0 }}
						/>
					))}
					<fieldset className="filter-group">
						<legend>{uiText("Discount (exact %)")}</legend>
						<FilterInput
							label={uiText("Discount percentage")}
							type="number"
							value={q.discount || ''}
							onChange={(value: string) => set('discount', value)}
							inputProps={{ min: 0, max: 100, step: 1 }}
						/>
					</fieldset>
					<label className="filter-check">
						<input
							type="checkbox"
							checked={q.saleOnly === 'true'}
							onChange={(e) => set('saleOnly', e.target.checked ? 'true' : '')}
						/>
						{uiText("Only show sale products")}</label>
					<Button onClick={() => patch({}, true)}>{uiText("Clear filters")}</Button>
				</aside>
				<section className="catalog-results">
					<div className="result-toolbar">
						<span>{stableQuery.value?.metaCounter?.[0]?.total || 0} {uiText("products")}</span>
						{select('sort', 'Sort', backendEnums.ProductSort)}
					</div>
					<State query={stableQuery} empty={stableQuery.value?.list?.length === 0}>
						<div className="product-grid">
							{stableQuery.value?.list?.map((p: any) => (
								<ProductCard key={p._id} product={p} selectedColor={q.color} />
							))}
						</div>
					</State>
					<Pager
						value={stableQuery.value}
						page={page}
						onChange={(p: number) =>
							patch({ page: p })
						}
					/>
				</section>
			</div>
			<Brands />
			<TrustRow />
		</>
	);
}
export default withLayout(Products);
