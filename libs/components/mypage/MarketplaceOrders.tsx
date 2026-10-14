import { ShoppingCartOutlined, LocalShippingOutlined, Inventory2Outlined } from '@mui/icons-material';
import { SettlementNote } from '../common/Currency';
import useUiText from '../../hooks/useUiText';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager, Photo, money } from '../common/Marketplace';
import MarketplaceForm from '../common/MarketplaceForm';
export default function Orders({ role = 'USER' }: any) {
 const uiText = useUiText();
 const router = useRouter();
 const queryStatus=['PENDING','CONFIRMED','PREPARING','READY_FOR_DELIVERY','SHIPPED','DELIVERED','CANCELLED','REFUNDED'].includes(String(router.query.status)) ? String(router.query.status) : '';

	const [page, setPage] = useState(1),
		[status, setStatus] = useState(queryStatus),
		[review, setReview] = useState<any>(null),
        [reviewSaving, setReviewSaving] = useState(false),
        [repeatOrderId, setRepeatOrderId] = useState('');
    const repeatLock = useRef(false);
    const fulfillmentLocks = useRef(new Set<string>());
    const [updatingItems,setUpdatingItems] = useState<string[]>([]);
	const name = role === 'ADMIN' ? 'getAllOrdersByAdmin' : role === 'SELLER' ? 'getSellerOrders' : 'getMyOrders';
	const orderId = typeof router.query.orderId === 'string' ? router.query.orderId : '';
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
						value: sellerMatch ? {list:[sellerMatch]} : list.loading || moreSellerPages ? undefined : {list:[]},
				  }
				: { ...detail, value: detail.value ? { list: [detail.value] } : undefined }
			: list,
		action = useAction();
	useEffect(() => {
		setPage(1);
		setStatus(queryStatus);
	}, [orderId,queryStatus]);
	useEffect(() => {
		if (moreSellerPages && !list.loading && !list.error) setPage((current) => current + 1);
	}, [moreSellerPages, list.loading, list.error, page]);
    const updateFulfillment = async (order: any, item: any) => {
        if (fulfillmentLocks.current.has(item._id)) return;
        const nextStatus = ({CONFIRMED:'PREPARING',PREPARING:'READY_FOR_DELIVERY',READY_FOR_DELIVERY:'SHIPPED',SHIPPED:'DELIVERED'} as Record<string,string>)[item.status];
        if (!nextStatus) return;
        fulfillmentLocks.current.add(item._id);
        setUpdatingItems(current=>[...current,item._id]);
        try {
            // The returned Order updates Apollo's normalized cache without refetching the page.
            await action('updateSellerOrderItemStatus',{orderId:order._id,itemId:item._id,status:nextStatus},{refetchActive:false});
            // A status-filtered list may change membership; refresh only that list, retaining its cached content.
            if (status) await list.refetch?.().catch(() => undefined);
        } catch {
            // Keep the existing order visible; useAction shows the server error.
        } finally {
            fulfillmentLocks.current.delete(item._id);
            setUpdatingItems(current=>current.filter(id=>id!==item._id));
        }
    };
    const buyAgain = async (id: string) => {
        if (repeatLock.current) return;
        repeatLock.current = true;
        setRepeatOrderId(id);
        try {
            await action('buyAgain', {orderId: id});
            await router.push('/cart');
        } catch {
            // useAction displays the server error; stay on the order when adding fails.
        } finally {
            repeatLock.current = false;
            setRepeatOrderId('');
        }
    };
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
					{uiText("All orders")}</Button>
			)}
			<TextField InputLabelProps={{htmlFor:undefined}}
				disabled={!!orderId}
				select
				label={uiText("Status")}
				value={status}
				fullWidth
				onChange={(e) => {
					setStatus(e.target.value);
					setPage(1);
				}}
			>
				<MenuItem value="">{uiText("All orders")}</MenuItem>
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
					<section className="panel reference-order" key={o._id}>
						<div className="section-heading">
							<div>
								<h3>{uiText("Order")} #{o._id.slice(-8)}</h3>
								<small>{new Date(o.createdAt).toLocaleString()}</small>
							</div>
							<div className="order-progress">{[ShoppingCartOutlined,Inventory2Outlined,LocalShippingOutlined].map((Icon,i)=><span key={i} className={i===0 || (i===1 && ['SHIPPED','DELIVERED'].includes(o.status)) || (i===2 && o.status==='DELIVERED') ? 'done' : ''}><Icon/><small>{[uiText('Order Placed'),uiText('Shipped'),uiText('Delivered')][i]}</small></span>)}</div>
                            <span className="order-status-badge">
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
									{role === 'SELLER' && o.paymentStatus === 'PAID' && ['CONFIRMED', 'PREPARING', 'READY_FOR_DELIVERY', 'SHIPPED'].includes(i.status) && (
										<Button
                                            type="button"
                                            disabled={updatingItems.includes(i._id)}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                void updateFulfillment(o,i);
                                            }}
										>
											{({ CONFIRMED: 'Start preparing', PREPARING: 'Ready for delivery', READY_FOR_DELIVERY: 'Mark shipped', SHIPPED: 'Mark delivered' } as Record<string,string>)[i.status]}
										</Button>
									)}
									{role === 'USER' && o.status === 'DELIVERED' && i.status === 'DELIVERED' && o.paymentStatus === 'PAID' && (
										<>
											<Button onClick={() => setReview({ orderId: o._id, targetId: i.productId, group: 'PRODUCT' })}>
												{uiText("Review product")}</Button>
											<Button onClick={() => setReview({ orderId: o._id, targetId: i.sellerId, group: 'SELLER' })}>
												{uiText("Review seller")}</Button>
										</>
									)}
								</div>
								<strong>{money(i.finalItemPrice)}</strong>
							</div>
						))}
						{o.total != null && (
							<div className="summary-line total">
								<span>{uiText("Total")}</span>
								<strong>{money(o.total)}</strong><SettlementNote />
							</div>
						)}
						{o.shippingAddress && (
							<p>
								{uiText("Deliver to")}{o.shippingAddress.recipientName}, {o.shippingAddress.street}, {o.shippingAddress.city}
							</p>
						)}
						<div className="row-actions">
                            {!orderId && <Button onClick={()=>router.push({pathname:'/mypage',query:{category:role==='SELLER'?'sellerOrders':role==='ADMIN'?'adminOrders':'orders',orderId:o._id}})}>{uiText('View Details')}</Button>}
							{role === 'USER' && (
								<>
									{o.status === 'PENDING' && ['PENDING', 'FAILED'].includes(o.paymentStatus) && (
										<Button
											className="order-pay-button"
											variant="contained"
											onClick={() => void action('payOrderDemo', { paymentId: o.paymentId }).catch(() => {})}
										>
											{uiText("Pay — Demo")}</Button>
									)}
									{['PENDING', 'CONFIRMED'].includes(o.status) &&
										o.items.every((i: any) => ['PENDING', 'CONFIRMED'].includes(i.status)) && (
											<Button onClick={() => void action('cancelOrder', { orderId: o._id }).catch(() => {})}>
												{uiText("Cancel order")}</Button>
										)}
									<Button disabled={Boolean(repeatOrderId)} onClick={() => void buyAgain(o._id)}>{uiText("Buy again")}</Button>
								</>
							)}
							{role === 'ADMIN' && (
								<>
									{['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_DELIVERY'].includes(o.status) && (
										<Button onClick={() => void action('cancelOrder', { orderId: o._id }).catch(() => {})}>
											{uiText("Cancel")}</Button>
									)}
									{o.status === 'DELIVERED' && o.paymentStatus === 'PAID' && (
										<Button
											onClick={() =>
												void action('updateOrderStatusByAdmin', { orderId: o._id, status: 'REFUNDED' }).catch(() => {})
											}
										>
											{uiText("Refund — Demo")}</Button>
									)}
								</>
							)}
							{role !== 'SELLER' && o.deliveryId && (
								<Link href={{ pathname: '/mypage', query: { category: 'delivery', id: o.deliveryId } }}>
									{uiText("Delivery details →")}</Link>
							)}
						</div>
					</section>
				))}
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
            <Dialog
                open={Boolean(review)}
                container={() => document.getElementById('pc-wrap')}
                onClose={() => { if (!reviewSaving) setReview(null); }}
                disableEscapeKeyDown={reviewSaving}
                fullWidth maxWidth="sm"
                aria-labelledby="order-review-title"
            >
                {review && <>
                    <DialogTitle id="order-review-title">{uiText(review.group === 'PRODUCT' ? 'Review product' : 'Review seller')}</DialogTitle>
                    <DialogContent>
                        <MarketplaceForm
                            key={`${review.group}:${review.targetId}:${review.orderId}`}
                            type="ReviewInput"
                            initial={review}
                            fields={['rating', 'text', 'images']}
                            uploadTarget="review"
                            onSubmit={async (input: any) => {
                                setReviewSaving(true);
                                try {
                                    await action('createReview', {input: {...input, ...review}});
                                    setReview(null);
                                } finally { setReviewSaving(false); }
                            }}
                        />
                    </DialogContent>
                    <DialogActions><Button disabled={reviewSaving} onClick={() => setReview(null)}>{uiText('Close review')}</Button></DialogActions>
                </>}
            </Dialog>
		</>
	);
}
