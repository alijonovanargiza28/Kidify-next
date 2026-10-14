import { sweetMixinSuccessAlert } from '../../sweetAlert';
import { useProductFavorite } from '../../hooks/useProductFavorite';
import useUiText from '../../hooks/useUiText';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { userVar } from '../../../apollo/store';
import { useAction } from '../../hooks/useMarketplace';
import { Photo, money } from '../common/Marketplace';
import { colorImages, purchaseAgeOptions } from '../../utils/productVariants';
import { colorPaint } from '../common/ColorSelector';
export default function ProductCard({ product: p, selectedColor }: any) {
 const uiText = useUiText();

	const purchaseLock=useRef(false);
 const action = useAction(),
		router = useRouter(),
		user = useReactiveVar(userVar),
		[busy, setBusy] = useState(false);
	const favorite = useProductFavorite(p, user._id);
	const [color, setColor] = useState(selectedColor || ''),
		[quantity, setQuantity] = useState(1),
		[option, setOption] = useState(''),
		[added, setAdded] = useState(false),
		[optionsOpen, setOptionsOpen] = useState(false);
	const variants = p.productVariants || [];
	const choices = purchaseAgeOptions(variants, color || undefined);
	const availableChoices = choices.filter(v => v.available);
	const chosen = choices.find(v => v.key === option && v.available) || (!option && availableChoices.length === 1 ? availableChoices[0] : undefined);
	useEffect(() => {
		setColor(selectedColor || '');
		setOption('');
		setAdded(false);
	}, [selectedColor, p._id]);
	const images = colorImages(p, color);
	const target = { pathname: '/products/detail', query: { id: p._id, ...(color ? { color } : {}) } };
	const colors = Array.from(new Set<string>((p.productVariants || []).map((v: any) => v.color).filter(Boolean)));
	const addToCart = async () => {
		if (!optionsOpen) {
            setColor(color || variants.find((v:any)=>v.stock>0)?.color || '');
			setOptionsOpen(true);
			return;
		}
		if (purchaseLock.current || !chosen?.variant || quantity > chosen.variant.stock || busy) return;
        if (!user._id) {
			router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
			return;
		}
		purchaseLock.current=true;setBusy(true);
		try {
			await action('addToCart', {
				input: {
					productId: p._id,
					variantId: chosen.variant._id,
					quantity,
					...(chosen.month != null ? { ageMonth: chosen.month } : {}),
				},
			});
			setAdded(false);
            setQuantity(1);
			setOptionsOpen(false);
            void sweetMixinSuccessAlert(uiText('Added to your bag.'));
		} catch {
		} finally {
            purchaseLock.current=false;
			setBusy(false);
		}
	};
	return (
		<article className="kidify-product">
			<div className="product-photo">
				<Link href={target} className="product-image-link">
					<Photo src={images[0]} alt={p.productName} />
					<span className="product-badges">
						{p.badges?.map((b: string) => (
							<span key={b}>{b.replace(/_/g, ' ')}</span>
						))}
					</span>
				</Link>
				<Button
					className="card-cart-overlay"
					variant="contained"
					disabled={busy || p.productStatus !== 'ACTIVE' || !variants.some((v: any) => v.stock > 0)}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void addToCart();
					}}
				>
					{added ? 'Added to Cart' : 'Add to Cart'}
				</Button>
			</div>
			<IconButton
				className="favorite"
                sx={{ color: '#90495F' }}
				aria-label={`${favorite.liked ? 'Remove from' : 'Add to'} wishlist: ${p.productName}`}
				aria-pressed={favorite.liked}
				disabled={busy || favorite.busy}
				onClick={async (e) => {
					e.stopPropagation();
					if (!user._id) {
						router.push({ pathname: '/account/join', query: { returnTo: router.asPath } });
						return;
					}
					await favorite.toggle();
				}}
			>
				{favorite.liked ? <Favorite /> : <FavoriteBorder />}
			</IconButton>
			<div className="product-copy">
				<p className="eyebrow">{p.productCollection?.replace(/_/g, ' ') || p.productType?.replace(/_/g, ' ')}</p>
				<Link href={target}>
					<h3>{p.productName}</h3>
				</Link>
				<div className="product-rating">
					<span aria-label={`${p.averageRating || 0} out of 5`}>★ {Number(p.averageRating || 0).toFixed(1)}</span>
					<span>({p.productReviews || 0} {uiText("reviews)")}</span>
				</div>
				<div className="card-price-row">
					<div className="price">
						{money(p.finalPrice)} {p.productOldPrice != null && <del>{money(p.productOldPrice)}</del>}
					</div>
					<div className="card-colors" aria-label={uiText("Available colors")}>
						{colors.slice(0, 5).map((swatch) => (
							<button
								type="button"
								key={swatch}
								title={swatch}
								aria-label={`Show ${swatch}`}
								aria-pressed={color === swatch}
								onClick={(e) => {
									e.stopPropagation();
									setColor(swatch);
									setOption('');
									setAdded(false);
								}}
								style={{ backgroundColor: colorPaint(swatch) }}
							/>
						))}
						{colors.length > 5 && <small>+{colors.length - 5}</small>}
					</div>
				</div>
				<Dialog open={optionsOpen} onClose={() => setOptionsOpen(false)} fullWidth maxWidth="xs">
					<DialogTitle>{uiText("Choose options")}</DialogTitle>
                    <DialogContent className="product-option-dialog">
                      <p>{p.productName}</p><h4>{uiText('Color')}</h4>
                      <div className="option-colors">{colors.map(c => <button key={c} type="button" aria-pressed={c===color} onClick={()=>{setColor(c);setOption('');setQuantity(1);}}><Photo src={colorImages(p,c)[0]} alt={c} /><span>{c}</span></button>)}</div>
                      <h4>{uiText('Month / Age')}</h4>
                      <div className="option-ages">{choices.map(c => <button type="button" key={c.key} disabled={!c.available} aria-pressed={chosen?.key===c.key} onClick={()=>{setOption(c.key);setQuantity(1);}}>{c.label.replace(/months|years|year/g, unit => uiText(unit))}</button>)}</div>
                      <div className="option-quantity"><span>{uiText('Quantity')}</span><Button disabled={quantity<=1} onClick={()=>setQuantity(quantity-1)}>−</Button><strong>{quantity}</strong><Button disabled={!chosen || quantity>=chosen.variant.stock} onClick={()=>setQuantity(quantity+1)}>+</Button></div>
                    </DialogContent>
					<DialogActions>
						<Button onClick={() => setOptionsOpen(false)}>{uiText("Cancel")}</Button>
						<Button variant="contained" disabled={busy || !chosen || chosen.variant.stock < quantity} onClick={addToCart}>
							{uiText("Add to Cart")}</Button>
					</DialogActions>
				</Dialog>
			</div>
		</article>
	);
}
