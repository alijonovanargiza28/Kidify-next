import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, IconButton } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { userVar } from '../../../apollo/store';
import { useAction } from '../../hooks/useMarketplace';
import { Photo, money } from '../common/Marketplace';
import { colorPaint } from '../common/ColorSelector';
export default function ProductCard({ product: p }: any) {
	const action = useAction(),
		router = useRouter(),
		user = useReactiveVar(userVar),
		[busy, setBusy] = useState(false);
	const target = { pathname: '/products/detail', query: { id: p._id } };
	const colors = Array.from(new Set<string>((p.productVariants || []).map((v: any) => v.color).filter(Boolean)));
	return (
		<article className="kidify-product">
			<Link href={target} className="product-photo">
				<Photo src={p.productImages?.[0]} alt={p.productName} />
				<span className="product-badges">
					{p.badges?.map((b: string) => (
						<span key={b}>{b.replace(/_/g, ' ')}</span>
					))}
				</span>
			</Link>
			<IconButton
				className="favorite"
				aria-label={`${p.meLiked?.length ? 'Remove from' : 'Add to'} wishlist: ${p.productName}`}
				aria-pressed={Boolean(p.meLiked?.length)}
				disabled={busy}
				onClick={async () => {
					if (!user._id) {
						router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
						return;
					}
					setBusy(true);
					try {
						await action('favoriteProduct', { productId: p._id });
					} catch {
					} finally {
						setBusy(false);
					}
				}}
			>
				{p.meLiked?.length ? <Favorite /> : <FavoriteBorder />}
			</IconButton>
			<div className="product-copy">
				<p className="eyebrow">{p.productCollection?.replace(/_/g, ' ') || p.productType?.replace(/_/g, ' ')}</p>
				<Link href={target}>
					<h3>{p.productName}</h3>
				</Link>
				<div className="product-rating">
					<span aria-label={`${p.averageRating || 0} out of 5`}>★ {Number(p.averageRating || 0).toFixed(1)}</span>
					<span>({p.productReviews || 0} reviews)</span>
				</div>
				<div className="card-price-row">
					<div className="price">
						{money(p.finalPrice)} {p.productOldPrice != null && <del>{money(p.productOldPrice)}</del>}
					</div>
					<div className="card-colors" aria-label="Available colors">
						{colors.slice(0, 5).map((color) => (
							<span key={color} title={color} aria-label={color} style={{ backgroundColor: colorPaint(color) }} />
						))}
						{colors.length > 5 && <small>+{colors.length - 5}</small>}
					</div>
				</div>
				<Button variant="outlined" fullWidth onClick={() => router.push(target)}>
					View product →
				</Button>
			</div>
		</article>
	);
}
