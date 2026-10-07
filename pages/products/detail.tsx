import React, { useEffect, useState } from 'react';
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
import Comments from '../../libs/components/common/Comments';
import ColorSelector from '../../libs/components/common/ColorSelector';
import ProductCard from '../../libs/components/property/MarketplaceProductCard';
import TrustRow from '../../libs/components/common/TrustRow';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Detail() {
	const router = useRouter(),
		id = String(router.query.id || router.query.propertyId || ''),
		user = useReactiveVar(userVar),
		q = useMarketplace('getProduct', { productId: id }, !id),
		p = q.value;
	const [reviewPage, setReviewPage] = useState(1),
		[commentsOpen, setCommentsOpen] = useState(false),
		[relatedSort, setRelatedSort] = useState('NEWEST');
	const seller = useMarketplace('getSeller', { sellerId: p?.productSellerId }, !p?.productSellerId),
		related = useMarketplace(
			'getRelatedProducts',
			{ productId: id, input: { page: 1, limit: 6, sort: relatedSort } },
			!id,
		),
		reviews = useMarketplace(
			'getReviews',
			{ group: 'PRODUCT', targetId: id, input: { page: reviewPage, limit: 10 } },
			!id || !commentsOpen,
		);
	const action = useAction(),
		[variantId, setVariant] = useState(''),
		[quantity, setQuantity] = useState(1),
		[photo, setPhoto] = useState(0),
		[busy, setBusy] = useState(false),
		[added, setAdded] = useState(false);
	useEffect(() => {
		setVariant('');
		setPhoto(0);
		setQuantity(1);
		setAdded(false);
		setCommentsOpen(false);
		setReviewPage(1);
	}, [id]);
	const variants: any[] = p?.productVariants || [],
		variant =
			variants.find((v) => v._id === variantId) ||
			(!variantId ? variants.find((v) => v.stock > 0) || variants[0] : undefined);
	const colors = Array.from(new Set<string>(variants.map((v) => v.color || ''))),
		sizes = Array.from(new Set<string>(variants.map((v) => v.size || '')));
	const choose = (next: any) => {
		setVariant(next?._id || '');
		setQuantity(1);
		setAdded(false);
	};
	const favorite = async () => {
		if (!user._id) {
			router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
			return;
		}
		setBusy(true);
		try {
			await action('favoriteProduct', { productId: id });
		} catch {
		} finally {
			setBusy(false);
		}
	};
	return (
		<State query={q}>
			{p && (
				<>
					<PageTitle title={p.productName} />
					<div className="detail-layout">
						<div className="gallery">
							<div className="main-product-photo">
								<Photo src={p.productImages?.[photo] || p.productImages?.[0]} alt={p.productName} />
								<IconButton
									className="gallery-favorite"
									aria-label="Toggle wishlist"
									aria-pressed={Boolean(p.meLiked?.length)}
									disabled={busy}
									onClick={favorite}
								>
									{p.meLiked?.length ? <Favorite /> : <FavoriteBorder />}
								</IconButton>
							</div>
							<div className="thumbnails product-thumbnails" aria-label="Product images">
								{p.productImages?.map((src: string, i: number) => (
									<button
										type="button"
										key={src + i}
										onClick={() => setPhoto(i)}
										aria-label={`Image ${i + 1}`}
										aria-pressed={photo === i}
									>
										<Photo src={src} alt={`${p.productName} — image ${i + 1}`} />
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
										Comments & Reviews{' '}
										<small>
											({p.productReviews} reviews · {p.productComments} comments)
										</small>
									</span>
									<span>{commentsOpen ? 'Hide Comments' : 'View Comments'}</span>
								</Button>
								{commentsOpen && (
									<div id="product-comments">
										<h2>Verified Purchase Reviews</h2>
										<p>Reviews can be written from a paid, delivered order.</p>
										<Link href="/mypage?category=orders">Review a purchase →</Link>
										<State query={reviews} empty={reviews.value?.list?.length === 0}>
											{reviews.value?.list?.map((r: any) => (
												<article className="comment" key={r._id}>
													<strong>★ {r.rating} / 5</strong>
													<small> Verified purchase · {new Date(r.createdAt).toLocaleDateString()}</small>
													<p>{r.text}</p>
												</article>
											))}
											<Pager value={reviews.value} page={reviewPage} limit={10} onChange={setReviewPage} />
										</State>
										<Comments id={id} group="PRODUCT" />
									</div>
								)}
							</section>
						</div>
						<div className="detail-copy">
							<Link className="eyebrow" href={{ pathname: '/sellers/detail', query: { id: p.productSellerId } }}>
								{seller.value?.memberNick || 'Visit boutique'}
							</Link>
							<h1>{p.productName}</h1>
							<p className="product-rating">
								★ {Number(p.averageRating || 0).toFixed(1)} <span>({p.productReviews} reviews)</span> · {p.productViews}{' '}
								views · {p.productFavorites} favorites
							</p>
							<p className="detail-price">
								{money(p.finalPrice)} {p.productOldPrice != null && <del>{money(p.productOldPrice)}</del>}
								{p.productDiscount > 0 && <span className="discount-label">−{p.productDiscount}%</span>}
							</p>
							{colors.some(Boolean) && (
								<ColorSelector
									colors={colors}
									value={variant?.color || ''}
									disabledColors={colors.filter((c) => !variants.some((v) => (v.color || '') === c && v.stock > 0))}
									onChange={(color) =>
										choose(
											variants.find(
												(v) => (v.color || '') === color && (v.size || '') === (variant?.size || '') && v.stock > 0,
											) || variants.find((v) => (v.color || '') === color && v.stock > 0),
										)
									}
								/>
							)}
							{sizes.some(Boolean) && (
								<div role="group" aria-label="Size">
									<p>
										Size: <strong>{variant?.size || 'Standard'}</strong>
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
							<small>{variant ? `${variant.stock} available` : 'Choose an available option'}</small>
							<div className="purchase-actions">
								<div className="quantity-control">
									<Button
										aria-label="Decrease quantity"
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
										label="Quantity"
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
										aria-label="Increase quantity"
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
									onClick={async () => {
										if (!user._id) {
											router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
											return;
										}
										setBusy(true);
										try {
											await action('addToCart', { input: { productId: id, variantId: variant._id, quantity } });
											setAdded(true);
										} catch {
										} finally {
											setBusy(false);
										}
									}}
								>
									Add to Cart
								</Button>
							</div>
							{added && (
								<Alert severity="success">
									Added to your bag. <Link href="/cart">View bag</Link>
								</Alert>
							)}
							<div className="seller-inline">
								<Photo src={seller.value?.memberImage} alt={seller.value?.memberNick} />
								<div>
									<Link href={{ pathname: '/sellers/detail', query: { id: p.productSellerId } }}>
										{seller.value?.memberNick || 'Visit seller'}
									</Link>
									<Button
										onClick={() =>
											router.push({ pathname: '/messages', query: { peerId: p.productSellerId, productId: id } })
										}
									>
										Ask Seller
									</Button>
								</div>
							</div>
							<details open>
								<summary>Description</summary>
								<p>{p.productDesc || 'No description supplied.'}</p>
							</details>
							<details>
								<summary>Material</summary>
								<p>{p.material || 'No material information supplied.'}</p>
							</details>
							<details>
								<summary>Washing & Care</summary>
								<p>{p.careInstructions || 'Contact the seller for care instructions.'}</p>
							</details>
							<details>
								<summary>Delivery & Returns</summary>
								<p>{p.deliveryReturnInfo || 'Contact the seller for details.'}</p>
							</details>
						</div>
					</div>
					<section className="home-section recommendation-section">
						<div className="section-heading">
							<h2>You May Also Like</h2>
							<label className="sort-label">
								Sort
								<select value={relatedSort} onChange={(e) => setRelatedSort(e.target.value)}>
									<option value="NEWEST">Newest</option>
									<option value="PRICE_LOW_TO_HIGH">Price: Low to High</option>
									<option value="PRICE_HIGH_TO_LOW">Price: High to Low</option>
								</select>
							</label>
						</div>
						<State query={related} empty={related.value?.list?.length === 0}>
							<div className="product-grid recommendation-grid">
								{related.value?.list?.slice(0, 6).map((product: any) => (
									<ProductCard key={product._id} product={product} />
								))}
							</div>
						</State>
					</section>
					<section className="home-section recommendation-section">
						<p className="eyebrow">Curated for today</p>
						<h2>Today's Recommendations</h2>
						<div className="empty-state">Today's recommendations are not available yet.</div>
					</section>
					<TrustRow />
				</>
			)}
		</State>
	);
}
export default withLayout(Detail);
