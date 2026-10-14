import styles from '../../libs/components/common/MarketplaceRedesign.module.scss';
import { VisibilityOutlined, StarRounded, PeopleOutline, ChatBubbleOutline, Inventory2Outlined, DescriptionOutlined, SpaOutlined, WaterDropOutlined, LocalShippingOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useProductFavorite } from '../../libs/hooks/useProductFavorite';
import useUiText from '../../libs/hooks/useUiText';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, Alert, IconButton } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace, useAction } from '../../libs/hooks/useMarketplace';
import { userVar } from '../../apollo/store';
import { State, Photo, PageTitle, money, Pager } from '../../libs/components/common/Marketplace';
import ReviewCard from '../../libs/components/common/ReviewCard';
import { ageRange, productMonths, supportsMonth, configuredAgeOptions } from '../../libs/utils/productVariants';
import Comments from '../../libs/components/common/Comments';
import ColorSelector from '../../libs/components/common/ColorSelector';
import ProductDetailPhoto from '../../libs/components/common/ProductDetailPhoto';
import { detailImages, productDetailGallery } from '../../libs/utils/productDetailImages';
import ProductCard from '../../libs/components/property/MarketplaceProductCard';
import TrustRow from '../../libs/components/common/TrustRow';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Detail() {
 const uiText = useUiText();
 const { t } = useTranslation('common');
 const tr = (key: string) => t(`redesign.${key}`);

	const router = useRouter(),
		id = String(router.query.id || router.query.propertyId || ''),
		user = useReactiveVar(userVar),
		q = useMarketplace('getProduct', { productId: id }, !id),
		p = q.value;
	const favoriteState = useProductFavorite(p, user._id);
	const [reviewPage, setReviewPage] = useState(1),
		[commentsOpen, setCommentsOpen] = useState(false),
		[relatedSort, setRelatedSort] = useState('NEWEST');
	const today = useMarketplace('getTodayRecommendations');
	const seller = useMarketplace('getSeller', { sellerId: p?.productSellerId }, !p?.productSellerId),
		related = useMarketplace(
			'getRelatedProducts',
			{ productId: id, input: { page: 1, limit: 8, sort: relatedSort } },
			!id,
		),
		reviews = useMarketplace(
			'getReviews',
			{ group: 'PRODUCT', targetId: id, input: { page: reviewPage, limit: 10 } },
			!id || !commentsOpen,
		);
	const purchaseLock=useRef(false);
 const action = useAction(),
		[variantId, setVariant] = useState(''),
        [ageChoice, setAgeChoice] = useState(''),
        [reviewTab, setReviewTab] = useState('reviews'),
		[month, setMonth] = useState<number | undefined>(),
		[clock, setClock] = useState(Date.now()),
		[quantity, setQuantity] = useState(1),
		[photo, setPhoto] = useState(0),
		[busy, setBusy] = useState(false),
		[added, setAdded] = useState(false);
	useEffect(() => {
		setVariant(''); setAgeChoice('');
		setMonth(undefined);
		setPhoto(0);
		setQuantity(1);
		setAdded(false);
		setCommentsOpen(false);
		setReviewPage(1);
	}, [id]);
	useEffect(() => {
		const timer = setInterval(() => {
			setClock(Date.now());
			if (p?.saleEnd && +new Date(p.saleEnd) <= Date.now() && p.badges?.includes('SALE')) q.refetch();
		}, 60000);
		return () => clearInterval(timer);
	}, [p?.saleEnd, p?.badges?.join(',')]);
	const variants: any[] = p?.productVariants || [],
		variant =
			variants.find((v) => v._id === variantId) ||
			(!variantId
				? variants.find(
						(v) =>
							router.query.color &&
							(v.color || '').toLowerCase() === String(router.query.color).toLowerCase() &&
							v.stock > 0,
				  ) ||
				  variants.find((v) => v.stock > 0) ||
				  variants[0]
				: undefined);
	const colors = Array.from(new Set<string>(variants.map((v) => v.color || ''))),
		sizes = Array.from(new Set<string>(variants.filter((v) => !ageRange(v)).map((v) => v.size || '')));
	const months = productMonths(variants),
		selectedMonth = month ?? ageRange(variant || {})?.[0];
	const originalImages = detailImages(p?.productImages);
	const gallery = productDetailGallery(p || {}, variantId || router.query.color ? variant?.color : undefined);
	const remaining = p?.badges?.includes('SALE') && p?.saleEnd ? Math.max(0, +new Date(p.saleEnd) - clock) : 0;
	const choose = (next: any) => {
		setVariant(next?._id || ''); setAgeChoice('');
		setPhoto(0);
		setMonth(ageRange(next || {})?.[0]);
		setQuantity(1);
		setAdded(false);
	};
	const favorite = async () => {
		if (!user._id) {
			router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
			return;
		}
		await favoriteState.toggle();
	};
 const purchase = async (buyNow=false) => {
  if(purchaseLock.current || busy || !variant || variant.stock < quantity || p?.productStatus !== 'ACTIVE') return;
  if(!user._id){router.push({pathname:'/account/join',query:{returnTo:router.asPath}});return;}
  purchaseLock.current=true;setBusy(true);
  try{await action('addToCart',{input:{productId:id,variantId:variant._id,quantity,...(selectedMonth != null ? {ageMonth:selectedMonth}:{})}});setAdded(true);if(buyNow)await router.push('/cart');}catch{}finally{purchaseLock.current=false;setBusy(false);}
 };

	return (
		<State query={q}>
			{p && (
				<>
					<nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">{uiText("Home")}</Link><span>/</span><Link href={{ pathname: '/products', query: { type: p.productType } }}>{uiText(p.productType?.replace(/_/g, ' ') || 'products')}</Link><span>/</span><span>{p.productName}</span></nav>
					<div className={`detail-layout ${styles.detail}`}>
						<div className="gallery">
							<div className="main-product-photo">
								<ProductDetailPhoto key={id} src={gallery[photo] || gallery[0]} originals={originalImages} alt={p.productName} />
								<IconButton
									className="gallery-favorite"
                                    sx={{ color: '#90495F' }}
									aria-label={uiText("Toggle wishlist")}
									aria-pressed={favoriteState.liked}
									disabled={busy || favoriteState.busy}
									onClick={favorite}
								>
									{favoriteState.liked ? <Favorite /> : <FavoriteBorder />}
								</IconButton>
 {gallery.length > 1 && <><IconButton className={styles.previous} aria-label={tr('Previous image')} onClick={() => setPhoto((photo + gallery.length - 1) % gallery.length)}><ChevronLeft /></IconButton><IconButton className={styles.next} aria-label={tr('Next image')} onClick={() => setPhoto((photo + 1) % gallery.length)}><ChevronRight /></IconButton></>}
 </div>
 <div className="thumbnails product-thumbnails" aria-label={uiText("Product images")}>
								{gallery.map((src: string, i: number) => (
									<button
										type="button"
										key={src + i}
										onClick={() => setPhoto(i)}
										aria-label={`Image ${i + 1}`}
										aria-pressed={photo === i}
									>
										<ProductDetailPhoto key={id} src={src} originals={originalImages} alt={`${p.productName} — image ${i + 1}`} />
									</button>
								))}
							</div>

<section className="reviews-accordion">
								<Button
									className="comments-toggle"
									aria-expanded={commentsOpen}
									aria-controls="product-comments"
									onClick={() => setCommentsOpen(!commentsOpen)}
								>
									<span>
										{uiText("Comments & Reviews")}{' '}
										<small>
											({p.productReviews} {uiText("reviews ·")}{p.productComments} {uiText("comments)")}</small>
									</span>
									<span>{uiText(commentsOpen ? 'Hide Comments' : 'View Comments')}</span>
								</Button>
								{commentsOpen && (
									<div id="product-comments">
										<div className="rating-summary"><div><strong>{Number(p.averageRating || 0).toFixed(1)}</strong><span> ★★★★★</span><p>{p.productReviews} {uiText("reviews")}</p></div><div className="rating-breakdown">{[5,4,3,2,1].map(star => { const count = reviews.value?.ratingBreakdown?.find((r:any) => r.rating === star)?.count || 0; return <label key={star}>{star} ★ <progress value={count} max={Math.max(1,p.productReviews || 0)} /> {count}</label>; })}</div></div>
                                        <div role="tablist" aria-label={uiText("Reviews and comments")}><Button role="tab" aria-selected={reviewTab === 'reviews'} onClick={() => setReviewTab('reviews')}>{uiText("Reviews (")}{p.productReviews})</Button><Button role="tab" aria-selected={reviewTab === 'comments'} onClick={() => setReviewTab('comments')}>{uiText("Comments (")}{p.productComments})</Button></div>
										
										<Link href="/mypage?category=orders">{uiText("Write a review →")}</Link>
										{reviewTab === 'reviews' && <State query={reviews} empty={reviews.value?.list?.length === 0}>
											{reviews.value?.list?.map((r: any) => (
												<ReviewCard key={r._id} review={r} sellerId={p.productSellerId} />
											))}
											<Pager value={reviews.value} page={reviewPage} limit={10} onChange={setReviewPage} />
										</State>}
										{reviewTab === 'comments' && <Comments id={id} group="PRODUCT" sellerId={p.productSellerId} />}
									</div>
								)}
							</section>

						</div>
						<div className="detail-copy">
							<Link className="eyebrow" href={{ pathname: '/sellers/detail', query: { id: p.productSellerId } }}>
								{seller.value?.memberNick || 'Visit boutique'}
							</Link>
							<h1>{p.productName}</h1>
							<div className={styles.productStats}>
 <span><StarRounded />{Number(p.averageRating || 0).toFixed(1)} ({p.productReviews} {uiText('reviews')})</span>
 <span><VisibilityOutlined />{p.productViews} {uiText('views')}</span>
 <span><FavoriteBorder />{p.productFavorites} {uiText('favorites')}</span>
 </div>
<p className="detail-price">
								{money(p.finalPrice)} {p.productOldPrice != null && <del>{money(p.productOldPrice)}</del>}
								{p.badges?.includes('SALE') && <span className="discount-label">−{p.productDiscount}%</span>}
							</p>
							{remaining > 0 && remaining < 86400000 && (
								<p className="sale-countdown">
									{uiText("Sale ends in")}{Math.floor(remaining / 3600000)}h {Math.floor(remaining / 60000) % 60}m
								</p>
							)}
							{colors.some(Boolean) && (
								<ColorSelector label={uiText("Color")}
									colors={colors}
									value={variant?.color || ''}
									disabledColors={[]}
									onChange={(color) =>
										choose(
											variants.find(
												(v) =>
													(v.color || '') === color &&
													(selectedMonth != null
														? supportsMonth(v, selectedMonth)
														: (v.size || '') === (variant?.size || '')) &&
													v.stock > 0,
											) ||
												variants.find((v) => (v.color || '') === color && v.stock > 0) ||
												variants.find((v) => (v.color || '') === color),
										)
									}
								/>
							)}
                            {months.length > 0 && (
                                <label className="month-selector">{uiText("Month / Age")}<select aria-label={uiText("Month / Age")} value={ageChoice || (variant && ageRange(variant) ? `${variant._id}:${ageRange(variant)![0]}` : '')} onChange={e => {
                                        const [key, age] = e.target.value.split(':');
                                        const match = variants.find(v => v._id === key && v.stock > 0 && supportsMonth(v, Number(age)));
                                        if(match) { choose(match); setMonth(Number(age)); setAgeChoice(e.target.value); }
                                    }}>
                                        <option value="" disabled>{uiText("Select Month / Age")}</option>
                                        {configuredAgeOptions(variants, variant?.color || '').filter(option => option.month != null).map(option => <option key={option.key} value={`${option.key}:${option.month}`} disabled={option.variant.stock < 1}>{option.label.replace('months', uiText('months'))}{option.variant.stock < 1 ? ' — '+uiText('Sold out') : ''}</option>)}
                                    </select>
                                </label>
                            )}
							{sizes.some(Boolean) && (
								<div role="group" aria-label={uiText("Size")}>
									<p>
										{uiText("Size:")}<strong>{variant?.size || 'Standard'}</strong>
									</p>
									<div className="size-options">
										{sizes.map((size) => (
											<Button
												key={size}
												aria-pressed={(variant?.size || '') === size}
												disabled={
													!variants.some(
														(v) => (v.color || '') === (variant?.color || '') && (v.size || '') === size && v.stock > 0,
													)
												}
												onClick={() =>
													choose(
														variants.find((v) => (v.color || '') === (variant?.color || '') && (v.size || '') === size),
													)
												}
											>
												{size || 'Standard'}
											</Button>
										))}
									</div>
								</div>
							)}
							<small className={styles.stock}><Inventory2Outlined />{variant ? `${variant.stock} ${tr('available')}` : tr('Choose an available option')}</small>
							<div className="purchase-actions">
								<div className="quantity-control">
									<Button
										aria-label={uiText("Decrease quantity")}
										disabled={quantity <= 1 || busy}
										onClick={() => {
											setQuantity(quantity - 1);
											setAdded(false);
										}}
									>
										−
									</Button>
									<TextField
										id="product-quantity"
										label={uiText("Quantity")}
										type="number"
										size="small"
										value={quantity}
										onChange={(e) => {
											setQuantity(Number(e.target.value));
											setAdded(false);
										}}
										inputProps={{ min: 1, max: variant?.stock || 1, step: 1 }}
									/>
									<Button
										aria-label={uiText("Increase quantity")}
										disabled={!variant || quantity >= variant.stock || busy}
										onClick={() => {
											setQuantity(quantity + 1);
											setAdded(false);
										}}
									>
										+
									</Button>
								</div>
								<Button
									variant="contained"
									disabled={
										busy ||
										!variant ||
										p.productStatus !== 'ACTIVE' ||
										quantity < 1 ||
										!Number.isInteger(quantity) ||
										quantity > variant.stock
									}
                                    onClick={() => purchase()}

								>
									{uiText("Add to Cart")}</Button>
                                <Button variant="contained" disabled={busy || !variant || variant.stock < quantity || p.productStatus !== 'ACTIVE'} onClick={() => purchase(true)}>{uiText("Buy Now")}</Button>
							</div>
							{added && (
								<Alert severity="success">
									{uiText("Added to your bag.")}<Link href="/cart">{uiText("View bag")}</Link>
								</Alert>
							)}
							<div className="seller-inline">
 <Photo src={seller.value?.memberImage} alt={seller.value?.memberNick || ''} />
 <div className={styles.sellerInfo}><span className="eyebrow">{tr('The Boutique')}</span>
 <Link href={{ pathname: '/sellers/detail', query: { id: p.productSellerId } }}>{seller.value?.memberNick || tr('Visit boutique')}</Link>
 <p>{seller.value?.memberDesc}</p>
 {seller.value && <small><PeopleOutline /> {seller.value.memberFollowers} {uiText('followers')} · <StarRounded /> {Number(seller.value.averageRating || 0).toFixed(1)} · {seller.value.memberProducts} {uiText('products')}</small>}
 </div>
 <Button variant="outlined" startIcon={<ChatBubbleOutline />} onClick={() => router.push({ pathname: '/messages', query: { peerId: p.productSellerId, productId: id } })}>{uiText('Ask Seller')}</Button>
 </div>
							<details>
								<summary><DescriptionOutlined />{uiText("Description")}</summary>
								<p>{p.productDesc || uiText('No description supplied.')}</p>
							</details>
							<details>
								<summary><SpaOutlined />{uiText("Material &amp; Care")}</summary>
								<p>{p.material || uiText('No material information supplied.')}</p>
							</details>
							<details>
								<summary><WaterDropOutlined />{uiText("Washing &amp; Care Instructions")}</summary>
								<p>{p.careInstructions || uiText('Contact the seller for care instructions.')}</p>
								{p.productInstructions && <p>{p.productInstructions}</p>}
							</details>
							<details>
								<summary><LocalShippingOutlined />{uiText("Delivery & Returns")}</summary>
								<p>{p.deliveryReturnInfo || uiText('Contact the seller for details.')}</p>
							</details>
						</div>
					</div>
												<section className="home-section recommendation-section">
						<div className="section-heading">
							<h2>{uiText("You May Also Like")}</h2>
							<label className="sort-label">
								{uiText("Sort")}<select value={relatedSort} onChange={(e) => setRelatedSort(e.target.value)}>
									<option value="NEWEST">{uiText("Newest")}</option>
									<option value="PRICE_LOW_TO_HIGH">{uiText("Price: Low to High")}</option>
									<option value="PRICE_HIGH_TO_LOW">{uiText("Price: High to Low")}</option>
								</select>
							</label>
						</div>
						<State query={related} empty={related.value?.list?.length === 0}>
							<div className="product-grid recommendation-grid related-grid">
								{related.value?.list?.slice(0, 8).map((product: any) => (
									<ProductCard key={product._id} product={product} />
								))}
							</div>
						</State>
					</section>
					<section className="home-section recommendation-section">
						<p className="eyebrow">{uiText("Curated for today")}</p>
						<h2>{uiText("Today's Recommendations")}</h2>
						<State query={today} empty={today.value?.list?.length === 0}>
							<div className="product-grid recommendation-grid">
								{today.value?.list?.slice(0, 6).map((product: any) => (
									<ProductCard key={product._id} product={product} />
								))}
							</div>
						</State>
					</section>
					<TrustRow />
				</>
			)}
		</State>
	);
}
export default withLayout(Detail);
