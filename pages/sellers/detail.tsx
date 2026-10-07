import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button } from '@mui/material';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace, useAction } from '../../libs/hooks/useMarketplace';
import { State, Photo, Pager, PageTitle } from '../../libs/components/common/Marketplace';
import FilterInput from '../../libs/components/common/FilterInput';
import TrustRow from '../../libs/components/common/TrustRow';
import { backendEnums } from '../../libs/types/marketplace';
import ProductCard from '../../libs/components/property/MarketplaceProductCard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
export function Seller({ member = false }: any) {
	const router = useRouter(),
		id = String(router.query.id || router.query.agentId || router.query.memberId || ''),
		user = useReactiveVar(userVar),
		page = Math.max(1, Math.floor(Number(router.query.page) || 1)),
		text = String(router.query.text || ''),
		sort = String(router.query.sort || 'NEWEST'),
		action = useAction();
	const q = useMarketplace(member ? 'getMember' : 'getSeller', member ? { memberId: id } : { sellerId: id }, !id),
		products = useMarketplace(
			'getProducts',
			{ input: { page, limit: 12, sort, search: { sellerId: id, text } } },
			!id || member,
		),
		s = q.value;
	const reviews = useMarketplace(
		'getReviews',
		{ group: 'SELLER', targetId: id, input: { page: 1, limit: 3 } },
		!id || member,
	);
	const change = (key: string, value: string | number) =>
		router.push(
			{
				pathname: router.pathname,
				query: { ...router.query, id, [key]: value, ...(key === 'page' ? {} : { page: 1 }) },
			},
			undefined,
			{ shallow: true },
		);
	return (
		<State query={q}>
			{s && (
				<>
					<PageTitle title={s.memberNick} />
					<section className="boutique-hero">
						<Photo src={s.memberImage} alt={s.memberNick} />
						<div>
							<p className="eyebrow">{member ? 'Community member' : 'The Boutique'}</p>
							<h1>{s.memberNick}</h1>
							<p>{s.memberDesc}</p>
							<p>
								{s.memberFollowers} followers · {s.averageRating} / 5<br />
								{s.memberProducts} products · {s.memberLikes} likes · {s.memberViews} views
							</p>
							{user._id !== id && (
								<>
									<Button
										variant="contained"
										onClick={() =>
											user._id
												? void action(s.meFollowed?.length ? 'unsubscribe' : 'subscribe', { input: id }).catch(() => {})
												: router.push('/account/join')
										}
									>
										{s.meFollowed?.length ? 'Unfollow' : member ? 'Follow' : 'Follow Boutique'}
									</Button>
									<Button onClick={() => router.push({ pathname: '/messages', query: { peerId: id } })}>
										{member ? 'Send message' : 'Contact Seller'}
									</Button>
								</>
							)}
						</div>
					</section>
					{!member && (
						<section className="home-section">
							<div className="section-heading">
								<h2>Shop the Collection</h2>
								<span>{products.value?.metaCounter?.[0]?.total || 0} products</span>
							</div>
							<div className="result-toolbar">
								<FilterInput
									label="Search this boutique"
									value={text}
									onChange={(value: string) => change('text', value)}
								/>
								<label className="sort-label">
									Sort
									<select value={sort} onChange={(e) => change('sort', e.target.value)}>
										{backendEnums.ProductSort.map((value) => (
											<option key={value} value={value}>
												{value.replace(/_/g, ' ')}
											</option>
										))}
									</select>
								</label>
							</div>
							<State query={products} empty={products.value?.list?.length === 0}>
								<div className="product-grid four">
									{products.value?.list?.map((p: any) => (
										<ProductCard key={p._id} product={p} />
									))}
								</div>
							</State>
							<Pager value={products.value} page={page} onChange={(n: number) => change('page', n)} />
						</section>
					)}
					{!member && (
						<section className="boutique-reviews">
							<p className="eyebrow">Boutique Guestbook</p>
							<h2>What Families Say About {s.memberNick}</h2>
							<p>Recent verified purchase reviews</p>
							<State query={reviews} empty={reviews.value?.list?.length === 0}>
								<div className="editorial-grid">
									{reviews.value?.list?.slice(0, 3).map((review: any) => (
										<article className="panel" key={review._id}>
											<strong>★ {review.rating} / 5</strong>
											<p>{review.text}</p>
											<small>Verified purchase · {new Date(review.createdAt).toLocaleDateString()}</small>
										</article>
									))}
								</div>
							</State>
						</section>
					)}
					<TrustRow />
				</>
			)}
		</State>
	);
}
export default withLayout(Seller);
