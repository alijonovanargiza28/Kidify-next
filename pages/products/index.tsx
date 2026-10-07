import React from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, MenuItem } from '@mui/material';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import FilterInput from '../../libs/components/common/FilterInput';
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
	const router = useRouter();
	const q = router.query;
	const page = Math.max(1, Math.floor(Number(q.page) || 1));
	const search: any = {};
	['category', 'collection', 'type', 'brandId', 'sellerId', 'color', 'size', 'text'].forEach((k) => {
		if (typeof q[k] === 'string' && q[k]) search[k] = q[k];
	});
	['minPrice', 'maxPrice', 'discount'].forEach((k) => {
		if (q[k] !== undefined && q[k] !== '' && Number.isFinite(Number(q[k]))) search[k] = Number(q[k]);
	});
	if (q.saleOnly === 'true') search.saleOnly = true;
	const query = useMarketplace(
		'getProducts',
		{ input: { page, limit: 12, sort: q.sort || 'NEWEST', search } },
		!router.isReady,
	);
	const brands = useMarketplace('getBrands', { input: { page: 1, limit: 100 } });
	const chosenBrand = useMarketplace('getBrand', { id: q.brandId }, typeof q.brandId !== 'string' || !q.brandId);
	const set = (key: string, value: any) => {
		const next: any = { ...q, [key]: value, page: 1 };
		if (value === '') delete next[key];
		router.push({ pathname: '/products', query: next }, undefined, { shallow: true });
	};
	const select = (key: string, label: string, values: readonly string[]) => (
		<TextField
			InputLabelProps={{ htmlFor: undefined }}
			select
			label={label}
			value={q[key] || (key === 'sort' ? 'NEWEST' : '')}
			onChange={(e) => set(key, e.target.value)}
			fullWidth
			size="small"
		>
			{key !== 'sort' && <MenuItem value="">All</MenuItem>}
			{values.map((v) => (
				<MenuItem key={v} value={v}>
					{v.replace(/_/g, ' ')}
				</MenuItem>
			))}
		</TextField>
	);
	return (
		<>
			<PageTitle title="Discover Little Things" subtitle="Beautiful essentials for every little moment." />
			<div className="catalog-layout">
				<aside className="filter-panel">
					<div className="section-heading">
						<h2>Filter By</h2>
						<Button onClick={() => router.push('/products')}>Clear All</Button>
					</div>
					<FilterInput
						label="Search"
						value={q.text || ''}
						onChange={(value: string) => set('text', value)}
						size="small"
					/>
					<fieldset className="filter-group">
						<legend>Collection</legend>
						{backendEnums.ProductCollection.map((value) => (
							<label key={value}>
								<input
									type="radio"
									name="collection-filter"
									value={value}
									checked={q.collection === value}
									onChange={() => set('collection', value)}
								/>
								{value.replace(/_/g, ' ')}
							</label>
						))}
						<Button onClick={() => set('collection', '')}>All collections</Button>
					</fieldset>
					{select('type', 'Type', backendEnums.ProductType)}
					{select('category', 'Category', backendEnums.ProductCategory)}
					<fieldset className="filter-group">
						<legend>Brand</legend>
						<label>
							<input type="radio" name="brand-filter" checked={!q.brandId} onChange={() => set('brandId', '')} />
							All brands
						</label>
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
							<Button onClick={() => brands.refetch()}>Retry brands</Button>
						) : (
							!brands.loading && !brands.value?.list?.length && <small>No brands available yet.</small>
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
					<fieldset className="filter-group">
						<legend>Size</legend>
						<div className="size-options">
							{['0-3M', '3-6M', '6-12M', '1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y+'].map((size) => (
								<Button
									key={size}
									aria-pressed={q.size === size}
									onClick={() => set('size', q.size === size ? '' : size)}
								>
									{size}
								</Button>
							))}
						</div>
					</fieldset>
					{['size', 'minPrice', 'maxPrice'].map((k) => (
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
						<legend>Discount (exact %)</legend>
						<FilterInput
							label="Discount percentage"
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
						Only show sale products
					</label>
					<Button onClick={() => router.push('/products')}>Clear filters</Button>
				</aside>
				<section className="catalog-results">
					<div className="result-toolbar">
						<span>{query.value?.metaCounter?.[0]?.total || 0} products</span>
						{select('sort', 'Sort', backendEnums.ProductSort)}
					</div>
					<State query={query} empty={query.value?.list?.length === 0}>
						<div className="product-grid">
							{query.value?.list?.map((p: any) => (
								<ProductCard key={p._id} product={p} />
							))}
						</div>
					</State>
					<Pager
						value={query.value}
						page={page}
						onChange={(p: number) =>
							router.push({ pathname: '/products', query: { ...q, page: p } }, undefined, { shallow: true })
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
