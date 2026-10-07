import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import { State, Pager } from '../../libs/components/common/Marketplace';
import FilterInput from '../../libs/components/common/FilterInput';
import TrustRow from '../../libs/components/common/TrustRow';
import SellerCard from '../../libs/components/seller/MarketplaceSellerCard';
import { stitchSellerBanner } from '../../libs/components/homepage/stitch-assets';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Sellers() {
	const router = useRouter(),
		page = Math.max(1, Math.floor(Number(router.query.page) || 1)),
		text = String(router.query.text || ''),
		sort = String(router.query.sort || 'createdAt');
	const q = useMarketplace(
		'getSellers',
		{ input: { page, limit: 10, sort, direction: 'DESC', search: { text } } },
		!router.isReady,
	);
	const change = (key: string, value: string | number) =>
		router.push(
			{ pathname: '/sellers', query: { ...router.query, [key]: value, ...(key === 'page' ? {} : { page: 1 }) } },
			undefined,
			{ shallow: true },
		);
	return (
		<>
			<section
				className="sellers-hero"
				style={{ backgroundImage: `linear-gradient(#24151acc,#120b0dcc),url('${stitchSellerBanner}')` }}
			>
				<h1>Artisans & Sellers</h1>
				<p>
					<Link href="/">Home</Link> / Sellers
				</p>
			</section>
			<div className="result-toolbar seller-toolbar">
				<FilterInput label="Search sellers" value={text} onChange={(value: string) => change('text', value)} />
				<label className="sort-label">
					Sort by
					<select value={sort} onChange={(e) => change('sort', e.target.value)}>
						<option value="createdAt">Recent</option>
						<option value="memberLikes">Most Popular</option>
						<option value="memberProducts">Most Products</option>
						<option value="averageRating">Highest Rated</option>
					</select>
				</label>
			</div>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="sellers-grid">
					{q.value?.list?.map((seller: any) => (
						<SellerCard key={seller._id} seller={seller} />
					))}
				</div>
			</State>
			<div className="result-toolbar">
				<p>{q.value?.metaCounter?.[0]?.total || 0} sellers available</p>
				<Pager value={q.value} page={page} limit={10} onChange={(n: number) => change('page', n)} />
			</div>
			<TrustRow />
		</>
	);
}
export default withLayout(Sellers);
