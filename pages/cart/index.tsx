import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, MenuItem, Alert } from '@mui/material';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { userVar } from '../../apollo/store';
import { useMarketplace, useAction } from '../../libs/hooks/useMarketplace';
import { PageTitle, Photo, money, State, RequireMember } from '../../libs/components/common/Marketplace';
import MarketplaceForm from '../../libs/components/common/MarketplaceForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Cart() {
	const user = useReactiveVar(userVar),
		q = useMarketplace('getMyCart', {}, !user._id),
		addresses = useMarketplace('getMyAddresses', {}, !user._id),
		action = useAction(),
		router = useRouter();
	const [address, setAddress] = useState(''),
		[coupon, setCoupon] = useState(''),
		[newAddress, setNewAddress] = useState(false),
		[busy, setBusy] = useState(false);
	const requestId = useRef('');
	const selected = address || addresses.value?.find((a: any) => a.isDefault)?._id || addresses.value?.[0]?._id || '';
	return (
		<RequireMember user={user}>
			<PageTitle title="Shopping Bag" subtitle="Your carefully chosen little treasures." />
			<State query={q} empty={q.value?.items?.length === 0}>
				<div className="cart-layout">
					<section>
						{q.value?.items?.map((i: any) => (
							<article className="cart-item" key={i._id}>
								<Link href={{ pathname: '/products/detail', query: { id: i.productId } }}>
									<Photo src={i.product?.productImages?.[0]} alt={i.product?.productName} />
								</Link>
								<div className="item-copy">
									<Link href={{ pathname: '/products/detail', query: { id: i.productId } }}>
										<h3>{i.product?.productName || 'Unavailable product'}</h3>
									</Link>
									<p>{[i.color, i.size].filter(Boolean).join(' / ')}</p>
									<div className="quantity-control">
										<Button
											disabled={busy || i.quantity <= 1}
											onClick={() =>
												void action('updateCartItem', { itemId: i._id, quantity: i.quantity - 1 }).catch(() => {})
											}
										>
											−
										</Button>
										<span>{i.quantity}</span>
										<Button
											disabled={busy || !i.available}
											onClick={() =>
												void action('updateCartItem', { itemId: i._id, quantity: i.quantity + 1 }).catch(() => {})
											}
										>
											+
										</Button>
									</div>
									<Button onClick={() => void action('removeCartItem', { itemId: i._id }).catch(() => {})}>
										Remove
									</Button>
									<Button onClick={() => void action('moveCartItemToFavorite', { itemId: i._id }).catch(() => {})}>
										Move to Wishlist
									</Button>
									{!i.available && (
										<Alert severity="warning">This option is no longer available in the requested quantity.</Alert>
									)}
								</div>
								<strong>{money(i.lineTotal)}</strong>
							</article>
						))}
						<Button onClick={() => router.push('/products')}>Continue Shopping</Button>
					</section>
					<aside className="cart-summary">
						<h2>Order Summary</h2>
						<div className="summary-line">
							<span>Subtotal</span>
							<strong>{money(q.value?.subtotal)}</strong>
						</div>
						<TextField
							fullWidth
							label="Coupon code"
							value={coupon}
							onChange={(e) => {
								setCoupon(e.target.value);
								requestId.current = '';
							}}
						/>
						<p>
							<small>Any coupon and delivery fee are calculated when the order is placed.</small>
						</p>
						<TextField InputLabelProps={{htmlFor:undefined}}
							select
							fullWidth
							label="Delivery address"
							value={selected}
							onChange={(e) => {
								setAddress(e.target.value);
								requestId.current = '';
							}}
						>
							<MenuItem value="">Select address</MenuItem>
							{addresses.value?.map((a: any) => (
								<MenuItem key={a._id} value={a._id}>
									{a.recipientName} — {a.street}
								</MenuItem>
							))}
						</TextField>
						<Button onClick={() => setNewAddress(!newAddress)}>Add address</Button>
						<Button
							variant="contained"
							fullWidth
							disabled={busy || !selected || !q.value?.items?.length || q.value?.items?.some((i: any) => !i.available)}
							onClick={async () => {
								setBusy(true);
								if (!requestId.current) requestId.current = crypto.randomUUID();
								try {
									const order = await action('createOrder', {
										input: {
											addressId: selected,
											requestId: requestId.current,
											...(coupon ? { couponCode: coupon } : {}),
										},
									});
									router.push({ pathname: '/mypage', query: { category: 'orders', orderId: order._id } });
								} catch {
								} finally {
									setBusy(false);
								}
							}}
						>
							Place order
						</Button>
						<p>
							<small>Payment is currently in demo mode. No real payment is collected.</small>
						</p>
					</aside>
				</div>
			</State>
			{newAddress && (
				<MarketplaceForm
					type="AddressInput"
					onSubmit={async (input: any) => {
						const a = await action('createAddress', { input });
						setAddress(a._id);
						setNewAddress(false);
					}}
				/>
			)}
		</RequireMember>
	);
}
export default withLayout(Cart);
