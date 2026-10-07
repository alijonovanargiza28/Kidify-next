import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, TextField, MenuItem } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager, Photo, money } from '../common/Marketplace';
import MarketplaceForm from '../common/MarketplaceForm';
export default function Orders({ role = 'USER' }: any) {
	const [page, setPage] = useState(1),
		[status, setStatus] = useState(''),
		[review, setReview] = useState<any>(null);
	const name = role === 'ADMIN' ? 'getAllOrdersByAdmin' : role === 'SELLER' ? 'getSellerOrders' : 'getMyOrders';
	const router = useRouter(),
		orderId = typeof router.query.orderId === 'string' ? router.query.orderId : '';
	const list = useMarketplace(
			name,
			{ input: { page, limit: 10, ...(status ? { status } : {}) } },
			!!orderId && role !== 'SELLER',
		),
		detail = useMarketplace('getOrder', { orderId }, !orderId || role === 'SELLER'),
		sellerMatch = list.value?.list?.find((order: any) => order._id === orderId),
		moreSellerPages =
			!!orderId && role === 'SELLER' && !sellerMatch && page * 10 < (list.value?.metaCounter?.[0]?.total || 0),
		q = orderId
			? role === 'SELLER'
				? {
						...list,
						loading: list.loading || moreSellerPages,
						value: list.loading || moreSellerPages ? undefined : { list: sellerMatch ? [sellerMatch] : [] },
				  }
				: { ...detail, value: detail.value ? { list: [detail.value] } : undefined }
			: list,
		action = useAction();
	useEffect(() => {
		setPage(1);
		setStatus('');
	}, [orderId]);
	useEffect(() => {
		if (moreSellerPages && !list.loading && !list.error) setPage((current) => current + 1);
	}, [moreSellerPages, list.loading, list.error, page]);
	return (
		<>
			<h2>{role === 'SELLER' ? 'Seller Orders' : 'Orders'}</h2>
			{orderId && (
				<Button
					onClick={() =>
						router.replace({
							pathname: '/mypage',
							query: { category: role === 'ADMIN' ? 'adminOrders' : role === 'SELLER' ? 'sellerOrders' : 'orders' },
						})
					}
				>
					All orders
				</Button>
			)}
			<TextField InputLabelProps={{htmlFor:undefined}}
				disabled={!!orderId}
				select
				label="Status"
				value={status}
				fullWidth
				onChange={(e) => {
					setStatus(e.target.value);
					setPage(1);
				}}
			>
				<MenuItem value="">All orders</MenuItem>
				{[
					'PENDING',
					'CONFIRMED',
					'PREPARING',
					'READY_FOR_DELIVERY',
					'SHIPPED',
					'DELIVERED',
					'CANCELLED',
					'REFUNDED',
				].map((s) => (
					<MenuItem key={s} value={s}>
						{s.replace(/_/g, ' ')}
					</MenuItem>
				))}
			</TextField>
			<State query={q} empty={q.value?.list?.length === 0}>
				{q.value?.list?.map((o: any) => (
					<section className="panel" key={o._id}>
						<div className="section-heading">
							<div>
								<h3>Order {o._id.slice(-8)}</h3>
								<small>{new Date(o.createdAt).toLocaleString()}</small>
							</div>
							<span>
								{o.status.replace(/_/g, ' ')} · {o.paymentStatus}
							</span>
						</div>
						{o.items?.map((i: any) => (
							<div className="cart-item" key={i._id}>
								<Link href={{ pathname: '/products/detail', query: { id: i.productId } }}>
									<Photo src={i.productImage} alt={i.productName} />
								</Link>
								<div className="item-copy">
									<Link href={{ pathname: '/products/detail', query: { id: i.productId } }}>
										<h3>{i.productName}</h3>
									</Link>
									<p>
										{[i.color, i.size].filter(Boolean).join(' / ')} · {i.quantity} × {money(i.finalUnitPrice)}
									</p>
									<small>{i.status.replace(/_/g, ' ')}</small>
									{role === 'SELLER' && o.paymentStatus === 'PAID' && ['CONFIRMED', 'PREPARING'].includes(i.status) && (
										<Button
											onClick={() =>
												void action('updateSellerOrderItemStatus', {
													orderId: o._id,
													itemId: i._id,
													status: i.status === 'CONFIRMED' ? 'PREPARING' : 'READY_FOR_DELIVERY',
												}).catch(() => {})
											}
										>
											{i.status === 'CONFIRMED' ? 'Start preparing' : 'Ready for delivery'}
										</Button>
									)}
									{role === 'USER' && o.status === 'DELIVERED' && o.paymentStatus === 'PAID' && (
										<>
											<Button onClick={() => setReview({ orderId: o._id, targetId: i.productId, group: 'PRODUCT' })}>
												Review product
											</Button>
											<Button onClick={() => setReview({ orderId: o._id, targetId: i.sellerId, group: 'SELLER' })}>
												Review seller
											</Button>
										</>
									)}
								</div>
								<strong>{money(i.finalItemPrice)}</strong>
							</div>
						))}
						{o.total != null && (
							<div className="summary-line total">
								<span>Total</span>
								<strong>{money(o.total)}</strong>
							</div>
						)}
						{o.shippingAddress && (
							<p>
								Deliver to {o.shippingAddress.recipientName}, {o.shippingAddress.street}, {o.shippingAddress.city}
							</p>
						)}
						<div className="row-actions">
							{role === 'USER' && (
								<>
									{o.status === 'PENDING' && ['PENDING', 'FAILED'].includes(o.paymentStatus) && (
										<Button
											variant="contained"
											onClick={() => void action('payOrderDemo', { paymentId: o.paymentId }).catch(() => {})}
										>
											Pay — Demo
										</Button>
									)}
									{['PENDING', 'CONFIRMED'].includes(o.status) &&
										o.items.every((i: any) => ['PENDING', 'CONFIRMED'].includes(i.status)) && (
											<Button onClick={() => void action('cancelOrder', { orderId: o._id }).catch(() => {})}>
												Cancel order
											</Button>
										)}
									<Button onClick={() => void action('buyAgain', { orderId: o._id }).catch(() => {})}>Buy again</Button>
								</>
							)}
							{role === 'ADMIN' && (
								<>
									{['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_DELIVERY'].includes(o.status) && (
										<Button onClick={() => void action('cancelOrder', { orderId: o._id }).catch(() => {})}>
											Cancel
										</Button>
									)}
									{o.status === 'DELIVERED' && o.paymentStatus === 'PAID' && (
										<Button
											onClick={() =>
												void action('updateOrderStatusByAdmin', { orderId: o._id, status: 'REFUNDED' }).catch(() => {})
											}
										>
											Refund — Demo
										</Button>
									)}
								</>
							)}
							{o.deliveryId && (
								<Link href={{ pathname: '/mypage', query: { category: 'delivery', id: o.deliveryId } }}>
									Delivery details →
								</Link>
							)}
						</div>
					</section>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
			{review && (
				<>
					<MarketplaceForm
						key={review.targetId}
						type="ReviewInput"
						initial={review}
						fields={['rating', 'text']}
						onSubmit={async (input: any) => {
							await action('createReview', { input: { ...input, ...review } });
							setReview(null);
						}}
					/>
					<Button onClick={() => setReview(null)}>Close review</Button>
				</>
			)}
		</>
	);
}
