import styles from './OrderSummary.module.scss';
import { useTranslation } from 'next-i18next';
import { AddOutlined, InfoOutlined, LocationOnOutlined } from '@mui/icons-material';
import { SettlementNote } from '../../libs/components/common/Currency';
import useUiText from '../../libs/hooks/useUiText';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, MenuItem, Alert, InputAdornment } from '@mui/material';
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
 const uiText = useUiText();
 const {t}=useTranslation('common');

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
			<PageTitle title={uiText("Shopping Bag")} subtitle={uiText("Your carefully chosen little treasures.")} />
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
										{uiText("Remove")}</Button>
									<Button onClick={() => void action('moveCartItemToFavorite', { itemId: i._id }).catch(() => {})}>
										{uiText("Move to Wishlist")}</Button>
									{!i.available && (
										<Alert severity="warning">{uiText("This option is no longer available in the requested quantity.")}</Alert>
									)}
								</div>
								<strong>{money(i.lineTotal)}</strong>
							</article>
						))}
						<Button onClick={() => router.push('/products')}>{uiText("Continue Shopping")}</Button>
					</section>
					<aside className={`cart-summary ${styles.summary}`}>
						<header className={styles.header}><h2>{uiText("Order Summary")}</h2><SettlementNote /></header>
						<div className="summary-line">
							<span>{uiText("Subtotal")} <small>({q.value?.items?.reduce((count:number,item:any)=>count+item.quantity,0) || 0} {t('cartSummary.items')})</small></span>
							<strong>{money(q.value?.subtotal)}</strong>
						</div>
                        <div className="summary-line"><span>{t('cartSummary.deliveryFee')}</span><small>{t('cartSummary.atOrder')}</small></div>
                        <div className="summary-line"><span>{t('cartSummary.discount')}</span><small>{t('cartSummary.atOrder')}</small></div>
                        <div className={styles.total}><span>{t('cartSummary.itemsTotal')}</span><strong>{money(q.value?.subtotal)}</strong></div>
                        <div className={styles.field}>
                        <label htmlFor="cart-coupon">{uiText("Coupon code")}</label>
						<TextField
                            id="cart-coupon"
                            size="small"
							fullWidth
                            placeholder={t('cartSummary.couponPlaceholder')}
                            inputProps={{'aria-label':uiText("Coupon code")}}
							value={coupon}
							onChange={(e) => {
								setCoupon(e.target.value);
								requestId.current = '';
							}}
						/>
                        </div>
                        <p className={styles.hint}><small>{uiText("Any coupon and delivery fee are calculated when the order is placed.")}</small></p>
                        <div className={styles.field}>
                        <label htmlFor="cart-address">{uiText("Delivery address")}</label>
                        <div className={styles.addressRow}>
						<TextField id="cart-address" size="small" InputLabelProps={{htmlFor:undefined}} InputProps={{startAdornment:<InputAdornment position="start"><LocationOnOutlined/></InputAdornment>}} SelectProps={{displayEmpty:true}}
							select
							fullWidth
							inputProps={{'aria-label':uiText("Delivery address")}}
							value={selected}
							onChange={(e) => {
								setAddress(e.target.value);
								requestId.current = '';
							}}
						>
							<MenuItem value="">{uiText("Select address")}</MenuItem>
							{addresses.value?.map((a: any) => (
								<MenuItem key={a._id} value={a._id}>
									{a.recipientName} — {a.street}
								</MenuItem>
							))}
						</TextField>
						<Button variant="outlined" startIcon={<AddOutlined/>} onClick={() => setNewAddress(!newAddress)}>{uiText("Add address")}</Button>
                        </div></div>
						<Button
                            className={styles.placeOrder}
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
							{uiText("Place order")}</Button>
                        <p className={styles.demoNote}><InfoOutlined/><small>{uiText("Payment is currently in demo mode. No real payment is collected.")}</small></p>
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
