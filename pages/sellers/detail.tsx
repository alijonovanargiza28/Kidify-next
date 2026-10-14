import styles from '../../libs/components/common/MarketplaceRedesign.module.scss';
import { Inventory2Outlined, FavoriteBorder, VisibilityOutlined, PeopleOutline, StarOutline, ChatBubbleOutline } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import useUiText from '../../libs/hooks/useUiText';
import FollowButton from '../../libs/components/seller/FollowButton';
import ReviewCard from '../../libs/components/common/ReviewCard';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button } from '@mui/material';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace } from '../../libs/hooks/useMarketplace';
import { State, Photo, Pager, PageTitle } from '../../libs/components/common/Marketplace';
import FilterInput from '../../libs/components/common/FilterInput';
import TrustRow from '../../libs/components/common/TrustRow';
import { backendEnums } from '../../libs/types/marketplace';
import ProductCard from '../../libs/components/product/MarketplaceProductCard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
export function Seller({ member = false }: any) {
 const uiText = useUiText();
 const { t } = useTranslation('common');
 const tr = (key: string) => t(`redesign.${key}`);

	const router = useRouter(),
		id = String(router.query.id || router.query.agentId || router.query.memberId || ''),
		user = useReactiveVar(userVar),
		page = Math.max(1, Math.floor(Number(router.query.page) || 1)),
		text = String(router.query.text || ''),
		sort = String(router.query.sort || 'NEWEST');
	const q = useMarketplace(member ? 'getMember' : 'getSeller', member ? { memberId: id } : { sellerId: id }, !id),
		products = useMarketplace(
			'getProducts',
			{ input: { page, limit: 12, sort, search: { sellerId: id, text } } },
			!id || member,
		),
		s = q.value;
	const reviews = useMarketplace('getSellerTopReviews', { sellerId: id }, !id || member);
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
					{member ? <PageTitle title={s.memberNick} /> : <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">{uiText("Home")}</Link><span>/</span><Link href="/sellers">{uiText("Our Sellers")}</Link><span>/</span><span>{s.memberNick}</span></nav>}
					{member ? (<section className="boutique-hero">
						<Photo src={s.memberImage} alt={s.memberNick} />
						<div>
							<p className="eyebrow">{member ? 'Community member' : 'The Boutique'}</p>
							<h1>{s.memberNick}</h1>
							<p>{s.memberDesc}</p>
							<p>
								{s.memberFollowers} {uiText("followers ·")}{s.averageRating} / 5<br />
								{s.memberProducts} {uiText("products ·")}{s.memberLikes} {uiText("likes ·")}{s.memberViews} {uiText("views")}</p>
							{user._id !== id && (
								<>
<FollowButton seller={s} contained />
									<Button onClick={() => router.push({ pathname: '/messages', query: { peerId: id } })}>
										{member ? 'Send message' : 'Contact Seller'}
									</Button>
								</>
							)}
						</div>
					</section>) : (<section className={styles.boutique}>
 <div className={styles.boutiqueIdentity}><Photo src={s.memberImage} alt={s.memberNick} /><div>
 <p className="eyebrow">{tr('The Boutique')}</p><h1>{s.memberNick}</h1><p>{s.memberDesc}</p>
 <div className={styles.boutiqueSocial}><span><PeopleOutline />{s.memberFollowers} {uiText('followers')}</span><span><StarOutline />{Number(s.averageRating || 0).toFixed(1)} / 5</span></div>
 </div></div>
 <div className={styles.boutiqueStats}>
 {[[Inventory2Outlined, s.memberProducts, 'products'], [FavoriteBorder, s.memberLikes, 'Likes'], [VisibilityOutlined, s.memberViews, 'Views']].map(([Icon, value, label]: any) => <div key={label}><Icon /><strong>{value ?? 0}</strong><span>{uiText(label)}</span></div>)}
 </div>
 {user._id !== id && <div className={styles.boutiqueActions}><FollowButton seller={s} contained /><Button variant="outlined" startIcon={<ChatBubbleOutline />} onClick={() => router.push({ pathname: '/messages', query: { peerId: id } })}>{tr('Contact Seller')}</Button></div>}
 </section>)}
					{!member && (
						<section className="home-section">
							<div className="section-heading">
								<h2>{uiText("Shop the Collection")}</h2>
								<span>{products.value?.metaCounter?.[0]?.total || 0} {uiText("products")}</span>
							</div>
							<div className="result-toolbar">
								<FilterInput
									label={uiText("Search this boutique")}
									value={text}
									onChange={(value: string) => change('text', value)}
								/>
								<label className="sort-label">
									{uiText("Sort")}<select value={sort} onChange={(e) => change('sort', e.target.value)}>
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
							<p className="eyebrow">{uiText("Boutique Guestbook")}</p>
							<h2>{uiText("What Families Say About")}{s.memberNick}</h2>
							<p>{uiText("Top liked verified product reviews")}</p>
							<State query={reviews} empty={reviews.value?.list?.length === 0}>
								<div className="editorial-grid">
									{reviews.value?.list?.slice(0, 3).map((review: any) => (
										<ReviewCard key={review._id} review={review} sellerId={id} />
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
