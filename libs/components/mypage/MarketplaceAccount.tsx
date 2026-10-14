import { useTranslation } from 'next-i18next';
import { Inventory2Outlined, ShoppingCartOutlined, LocalShippingOutlined, PeopleOutline, StarOutline, PaidOutlined, ChevronRight } from '@mui/icons-material';
import useUiText from '../../hooks/useUiText';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, TextField, MenuItem } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager, Photo, money } from '../common/Marketplace';
import MarketplaceForm, { fieldLabel } from '../common/MarketplaceForm';
import { updateUserInfo, getJwtToken } from '../../auth';
export function Profile({ user }: any) {
 const uiText = useUiText();

	const action = useAction(),
		[saved, setSaved] = useState(false);
	return (
		<>
			<h2>{uiText("My Profile")}</h2>
			{saved && <p>{uiText("Profile updated.")}</p>}
			<MarketplaceForm
				type="MemberUpdate"
				initial={user}
				fields={['memberNick', 'memberPhone', 'memberFullName', 'memberImage', 'memberAddress', 'memberDesc']}
				uploadTarget="member"
                onImageRemove={async () => {
                    await action('updateMember', { input: { memberImage: '' } });
                    await updateUserInfo(getJwtToken());
                    setSaved(true);
                }}
				onSubmit={async (input: any) => {
					await action('updateMember', { input });
					await updateUserInfo(getJwtToken());
					setSaved(true);
				}}
			/>
		</>
	);
}
export function Addresses() {
 const uiText = useUiText();

	const q = useMarketplace('getMyAddresses'),
		action = useAction(),
		[edit, setEdit] = useState<any>(null);
	return (
		<>
			<div className="section-heading">
				<h2>{uiText("My Addresses")}</h2>
				<Button onClick={() => setEdit({})}>{uiText("Add address")}</Button>
			</div>
			{edit && (
				<>
					<MarketplaceForm
						key={edit._id || 'new'}
						type="AddressInput"
						initial={edit}
						onSubmit={async (input: any) => {
							await action(edit._id ? 'updateAddress' : 'createAddress', {
								...(edit._id ? { addressId: edit._id } : {}),
								input,
							});
							setEdit(null);
						}}
					/>
					<Button onClick={() => setEdit(null)}>{uiText("Cancel")}</Button>
				</>
			)}
			<State query={q} empty={q.value?.length === 0}>
				{q.value?.map((a: any) => (
					<div className="panel" key={a._id}>
						<h3>{a.recipientName}</h3>
						<p>
							{a.street}, {a.city}, {a.region}
						</p>
						<p>{a.phone}</p>
						<div className="row-actions">
							<Button onClick={() => setEdit(a)}>{uiText("Edit")}</Button>
							<Button onClick={() => void action('removeAddress', { addressId: a._id }).catch(() => {})}>{uiText("Remove")}</Button>
							{a.isDefault ? (
								<span>{uiText("Default address")}</span>
							) : (
								<Button onClick={() => void action('setDefaultAddress', { addressId: a._id }).catch(() => {})}>
									{uiText("Set default")}</Button>
							)}
						</div>
					</div>
				))}
			</State>
		</>
	);
}
export { default as Followings } from './MarketplaceConnections';
export function LikedArticles() {
 const uiText = useUiText();

	const [page, setPage] = useState(1),
		q = useMarketplace('getMyLikedArticles', { input: { page, limit: 12 } });
	return (
		<>
			<h2>{uiText("Liked Articles")}</h2>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="editorial-grid">
					{q.value?.list?.map((a: any) => (
						<Link className="editorial-card" key={a._id} href={{ pathname: '/community/detail', query: { id: a._id } }}>
							<Photo src={a.articleImage} alt={a.articleTitle} />
							<div>
								<h3>{a.articleTitle}</h3>
							</div>
						</Link>
					))}
				</div>
				<Pager value={q.value} page={page} onChange={setPage} />
			</State>
		</>
	);
}
export function Dashboard({ role }: any) {
 const {t}=useTranslation('common');
 const uiText = useUiText();

	const cards:any={productCount:[Inventory2Outlined,'Product Count','products'],salesCount:[ShoppingCartOutlined,'Sales Count','sellerOrders'],deliveredCount:[LocalShippingOutlined,'Delivered Count','sellerOrders'],followers:[PeopleOutline,'Followers','followings'],reviewCount:[StarOutline,'Review Count','reviews'],averageRating:[StarOutline,'Average Rating','reviews'],revenue:[PaidOutlined,'Revenue','statistics']};
 const q = useMarketplace(role === 'ADMIN' ? 'getAdminDashboard' : 'getSellerDashboard');
	return (
		<>
			<h2>{uiText("Overview")}</h2>
			<State query={q}>
				<div className={`stats-grid ${role==='SELLER' ? 'seller-overview' : ''}`}>
					{Object.entries(q.value || {})
						.filter(([k, v]) => typeof v === 'number')
                        .map(([k,v])=>{const [Icon,label,target]=cards[k]||[Inventory2Outlined,fieldLabel(k),'dashboard'];return <Link className="stat" key={k} href={{pathname:'/mypage',query:{category:role==='SELLER'?target:'dashboard'}}}><span className="stat-icon"><Icon/></span><div><span>{t(`sellerRef.metrics.${k}`,{defaultValue:uiText(label)})}</span><strong>{/revenue|totalSales/i.test(k)?money(v as number):k==='averageRating'?`${Number(v).toFixed(1)} / 5`:String(v)}</strong></div><ChevronRight/></Link>;})}
				</div>
			</State>
		</>
	);
}
export function Delivery({ staff = false }: any) {
 const uiText = useUiText();

	const router = useRouter(),
		id = String(router.query.id || ''),
		[page, setPage] = useState(1),
		[tracking, setTracking] = useState<Record<string, string>>({});
	const q = useMarketplace(
			id ? 'getDelivery' : 'getDeliveries',
			id ? { deliveryId: id } : { input: { page, limit: 10 } },
			!id && !staff,
		),
		action = useAction();
	return (
		<>
			<h2>{uiText("Delivery")}</h2>
			<State query={q} empty={!id && !q.value?.list?.length}>
				{(id ? [q.value] : q.value?.list || []).filter(Boolean).map((d: any) => (
					<section className="panel" key={d._id}>
						<h3>{uiText("Order")}{d.orderId?.slice(-8)}</h3>
						<p>{d.status.replace(/_/g, ' ')}</p>
						{d.trackingCode && <p>{uiText("Tracking:")}{d.trackingCode}</p>}
						<p>
							{d.shippingAddress?.street}, {d.shippingAddress?.city}
						</p>
						{staff && ['READY_FOR_DELIVERY', 'SHIPPED'].includes(d.status) && (
							<div className="row-actions">
								<TextField
									label={uiText("Tracking code")}
									value={tracking[d._id] ?? d.trackingCode ?? ''}
									onChange={(e) => setTracking({ ...tracking, [d._id]: e.target.value })}
								/>
								<Button
									onClick={() =>
										void action('updateDeliveryStatus', {
											orderId: d.orderId,
											status: d.status === 'READY_FOR_DELIVERY' ? 'SHIPPED' : 'DELIVERED',
											trackingCode: tracking[d._id] || d.trackingCode,
										}).catch(() => {})
									}
								>
									{d.status === 'READY_FOR_DELIVERY' ? 'Mark shipped' : 'Mark delivered'}
								</Button>
							</div>
						)}
					</section>
				))}
				{!id && <Pager value={q.value} page={page} limit={10} onChange={setPage} />}
			</State>
		</>
	);
}
