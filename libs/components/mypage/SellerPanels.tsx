import { Dashboard } from './MarketplaceAccount';
import React,{useState} from 'react';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {useMarketplace} from '../../hooks/useMarketplace';
import {State,Photo,Pager,money} from '../common/Marketplace';
import ReviewCard from '../common/ReviewCard';
import {backendEnums} from '../../types/marketplace';
export function SellerCollections({user}:any){
 const {t}=useTranslation('common');
 const [page,setPage]=useState(1);const q=useMarketplace('getMyProducts',{input:{page,limit:100,search:{}}});
 return <><h2>{t('sellerRef.collections')}</h2><p>{t('sellerRef.collectionHelp')}</p><State query={q} empty={!q.value?.list?.length}><div className="seller-collections">{backendEnums.ProductCollection.map(c=>{
 const products=q.value?.list?.filter((p:any)=>p.productCollection===c)||[];
 return <Link key={c} className="panel" href={{pathname:'/products',query:{collection:c,sellerId:user._id}}}><Photo src={products[0]?.productImages?.[0]} alt={c}/><h3>{c.replace(/_/g,' ')}</h3><small>{products.length} {t('sellerRef.productsOnPage')}</small></Link>;
 })}</div><Pager value={q.value} page={page} limit={100} onChange={setPage}/></State></>;
}
export function SellerReviews({user}:any){
 const {t}=useTranslation('common');const [target,setTarget]=useState(''),[page,setPage]=useState(1);
 const products=useMarketplace('getMyProducts',{input:{page:1,limit:100,search:{}}});
 const q=useMarketplace('getReviews',{group:target?'PRODUCT':'SELLER',targetId:target||user._id,input:{page,limit:10}});
 return <><h2>{t('sellerRef.reviews')}</h2><select aria-label={t('sellerRef.reviews')} value={target} onChange={e=>{setTarget(e.target.value);setPage(1)}}><option value="">{t('sellerRef.storeReviews')}</option>{products.value?.list?.map((p:any)=><option key={p._id} value={p._id}>{p.productName}</option>)}</select><State query={q} empty={!q.value?.list?.length}>{q.value?.list?.map((r:any)=><ReviewCard key={r._id} review={r} sellerId={user._id}/>)}<Pager value={q.value} page={page} limit={10} onChange={setPage}/></State></>;
}
export function SellerStatistics(){
 const {t}=useTranslation('common');const [page,setPage]=useState(1);const q=useMarketplace('getSellerOrders',{input:{page,limit:100}});
 const rows=q.value?.list||[];
 const days=new Map<string,number>();for(const order of rows){if(order.paymentStatus!=='PAID')continue;const day=new Date(order.createdAt).toISOString().slice(0,10);days.set(day,(days.get(day)||0)+order.items.reduce((sum:number,i:any)=>sum+i.finalItemPrice,0));}
 const entries=Array.from(days).sort((a,b)=>a[0].localeCompare(b[0]));const max=Math.max(1,...entries.map(x=>x[1]));
 return <><h2>{t('sellerRef.statistics')}</h2><p>{t('sellerRef.pageStats')}</p><State query={q} empty={!rows.length}><section className="panel"><h3>{t('sellerRef.sales')}</h3>{entries.length?<div className="seller-sales-chart">{entries.map(([day,value])=><div key={day}><small>{day}</small><span style={{width:`${Math.max(1,value/max*100)}%`}}/><strong>{money(value)}</strong></div>)}</div>:<p>{t('sellerRef.noPaidOrders')}</p>}</section><Pager value={q.value} page={page} limit={100} onChange={setPage}/></State></>;
}

export function SellerDashboard(){
 const {t}=useTranslation('common');const orders=useMarketplace('getSellerOrders',{input:{page:1,limit:5}});
 return <><Dashboard role="SELLER"/><SellerStatistics/><section className="panel"><h3>{t('sellerRef.recentOrders')}</h3><State query={orders} empty={!orders.value?.list?.length}><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('sellerRef.order')}</th><th>{t('sellerRef.total')}</th><th>{t('sellerRef.status')}</th><th>{t('sellerRef.details')}</th></tr></thead><tbody>{orders.value?.list?.map((o:any)=><tr key={o._id}><td>#{o._id.slice(-8)}</td><td>{money(o.items.reduce((sum:number,i:any)=>sum+i.finalItemPrice,0))}</td><td>{o.status}</td><td><Link href={{pathname:'/mypage',query:{category:'sellerOrders',orderId:o._id}}}>{t('sellerRef.details')}</Link></td></tr>)}</tbody></table></div></State></section></>;
}
