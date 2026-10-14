import { useRouter } from 'next/router';
import useUiText from '../../hooks/useUiText';
import React, { useState, useEffect } from 'react';
import { Button, TextField, Alert } from '@mui/material';
import { useMarketplace, useAction } from '../../hooks/useMarketplace';
import { State, Pager, Photo, money } from '../common/Marketplace';
import MarketplaceForm from '../common/MarketplaceForm';
import { userVar } from '../../../apollo/store';
import { sweetConfirmAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { getBrandsByAdmin } from '../../../apollo/user/marketplace-query';
import { addStarterBrands } from '../../utils/starterBrands';
const configs: any = {
	products: {
		query: 'getMyProducts',
		type: 'ProductInput',
		create: 'createProduct',
		update: 'updateProduct',
		updateType: 'ProductUpdate',
		title: 'Products',
		name: 'productName',
		image: 'productImages',
		upload: 'product',
	},
	articles: {
		query: 'getBoardArticles',
		type: 'BoardArticleInput',
		create: 'createBoardArticle',
		update: 'updateBoardArticle',
		updateType: 'BoardArticleUpdate',
		title: 'Articles',
		name: 'articleTitle',
		image: 'articleImage',
		upload: 'article',
	},
	events: {
		query: 'getEventsByAdmin',
		type: 'EventInput',
		create: 'createEvent',
		update: 'updateEvent',
		remove: 'removeEvent',
		title: 'Events',
		name: 'title',
		image: 'images',
		upload: 'event',
	},
	faq: {
		query: 'getFAQsByAdmin',
		type: 'FAQInput',
		create: 'createFAQ',
		update: 'updateFAQ',
		remove: 'removeFAQ',
		title: 'FAQ',
		name: 'question',
	},
	brands: {
		query: 'getBrandsByAdmin',
		type: 'BrandInput',
		create: 'createBrand',
		update: 'updateBrand',
		remove: 'removeBrand',
		title: 'Brands',
		name: 'brandName',
		image: 'brandImage',
		upload: 'brand',
	},
	coupons: {
		query: 'getCoupons',
		type: 'CouponInput',
		create: 'createCoupon',
		update: 'updateCoupon',
		remove: 'disableCoupon',
		id: 'couponId',
		title: 'Coupons',
		name: 'code',
	},
	codes: {
		query: 'getSellerCodes',
		type: 'SellerCodeInput',
		create: 'createSellerCode',
		remove: 'revokeSellerCode',
		id: 'codeId',
		title: 'Seller Codes',
		name: 'code',
	},
};
export default function Manage({ section, user }: any) {
 const uiText = useUiText();
 const router = useRouter();
 const productStatus = ['ACTIVE','PAUSE','SOLD_OUT','DELETE'].includes(String(router.query.status)) ? String(router.query.status) : '';

	const client = useApolloClient();
	const [seeding, setSeeding] = useState(false),
		[seedMessage, setSeedMessage] = useState('');
	const c = { ...configs[section] };
	if (user.memberType === 'ADMIN' && section === 'products') c.query = 'getAllProductsByAdmin';
	if (user.memberType === 'ADMIN' && section === 'articles') {
		c.query = 'getAllBoardArticlesByAdmin';
		c.update = 'updateBoardArticleByAdmin';
		c.remove = 'removeBoardArticleByAdmin';
		c.id = 'articleId';
	}
	const [search,setSearch]=useState('');
 const [page, setPage] = useState(1),
		[editing, setEditing] = useState<any>(null);
	useEffect(() => setPage(1), [productStatus]);
	const input: any = { page, limit: 10 };
	if (section === 'products') input.search = {...(search.trim() ? {text:search.trim()} : {}),...(productStatus ? {status:productStatus} : {})};
	if (section === 'articles') input.search = user.memberType === 'ADMIN' ? {} : { memberId: user._id };
	const q = useMarketplace(c.query, { input }),
		brands = useMarketplace('getBrands', { input: { page: 1, limit: 100 } }, section !== 'products'),
		action = useAction();
	return (
		<>
			{!(section === 'products' && editing !== null) && <div className="section-heading">
				<h2>{c.title}</h2>
				{!(section === 'products' && user.memberType === 'ADMIN') && (
					<Button variant="contained" onClick={() => setEditing({})}>
						{uiText("Create")}{c.title === 'FAQ' ? 'FAQ' : c.title.toLowerCase().replace(/s$/, '')}
					</Button>
				)}
			</div>}
			{section === 'brands' && user.memberType === 'ADMIN' && (
				<>
					<Button
						disabled={seeding}
						onClick={async () => {
							setSeeding(true);
							setSeedMessage('');
							try {
								const added = await addStarterBrands(
									async (page) => {
										const { data } = await client.query({
											query: getBrandsByAdmin,
											variables: { input: { page, limit: 100 } },
											fetchPolicy: 'network-only',
										});
										return data.getBrandsByAdmin;
									},
									(input) => action('createBrand', { input }),
								);
								setSeedMessage(added ? `${added} starter brands added.` : 'Starter brands already exist.');
								setPage(1);
								await q.refetch();
							} catch {
							} finally {
								setSeeding(false);
							}
						}}
					>
						{seeding ? 'Adding brands…' : 'Add 6 starter brands'}
					</Button>
					{seedMessage && <Alert severity="success">{seedMessage}</Alert>}
				</>
			)}
			{section === 'products' && editing === null && <TextField size="small" label={uiText('Search products')} value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} />}
            {editing !== null && (
				<>
					<MarketplaceForm
						key={editing._id || 'new'}
						type={editing._id ? c.updateType || c.type : c.type}
						initial={editing}
                        onCancel={section === 'products' ? () => setEditing(null) : undefined}
						hidden={['_id']}
						brands={brands.value?.list}
						brandsLoading={brands.loading}
						brandsError={brands.error}
						retryBrands={() => brands.refetch()}
						uploadTarget={c.upload}
						onSubmit={async (input: any) => {
							if (editing._id) {
								const args = c.updateType
									? { input: { ...input, _id: editing._id } }
									: { [c.id || 'id']: editing._id, input };
								await action(c.update, args);
							} else await action(c.create, { input });
							setEditing(null);
						}}
					/>
					{section !== 'products' && <Button onClick={() => setEditing(null)}>{uiText("Cancel editing")}</Button>}
				</>
			)}
			{!(section === 'products' && editing !== null) && <State query={q} empty={q.value?.list?.length === 0}>
				<div className="table-wrap">
					<table className="data-table">
						<thead>
							<tr>
								<th>{c.title}</th>
								{section === 'products' && <><th>{uiText('Category')}</th><th>{uiText('Price')}</th><th>{uiText('Stock')}</th></>}
                                <th>{uiText("Status")}</th>
								<th>{uiText("Actions")}</th>
							</tr>
						</thead>
						<tbody>
							{q.value?.list?.map((item: any) => (
								<tr key={item._id}>
									<td>
										{c.image && (
											<Photo src={Array.isArray(item[c.image]) ? item[c.image][0] : item[c.image]} alt={item[c.name]} />
										)}
										<strong>{item[c.name]}</strong>
									</td>
									{section === 'products' && <><td>{item.productCategory?.replace(/_/g,' ')}</td><td>{money(item.finalPrice ?? item.productPrice)}</td><td>{item.productStock ?? item.productVariants?.reduce((n:number,v:any)=>n+v.stock,0)}</td></>}
                                    <td>{item.productStatus || item.articleStatus || item.brandStatus || item.status || '—'}</td>
									<td>
										<div className="row-actions">
											{c.update && <Button onClick={() => setEditing(item)}>{uiText("Edit")}</Button>}
											{section === 'products' && (
												<>
													<Button
														onClick={() =>
															void action('changeProductStatus', {
																productId: item._id,
																status: item.productStatus === 'PAUSE' ? 'ACTIVE' : 'PAUSE',
															}).catch(() => {})
														}
													>
														{item.productStatus === 'PAUSE' ? 'Activate' : 'Pause'}
													</Button>
													<Button
														onClick={() => {
															if (window.confirm('Delete this product?'))
																void action('changeProductStatus', { productId: item._id, status: 'DELETE' }).catch(
																	() => {},
																);
														}}
													>
														{uiText("Delete")}</Button>
												</>
											)}
											{c.remove && (
												<Button
													onClick={() => {
														if (window.confirm('Confirm this action?'))
															void action(c.remove, { [c.id || 'id']: item._id }).catch(() => {});
													}}
												>
													{section === 'codes' ? 'Revoke' : section === 'coupons' ? 'Disable' : 'Delete'}
												</Button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>}
		</>
	);
}
export function Members({ type }: any) {
 const uiText = useUiText();

	const actor = useReactiveVar(userVar);
    const router=useRouter();
    const memberType=type || (['USER','SELLER','ADMIN','CS'].includes(String(router.query.memberType)) ? String(router.query.memberType) : '');
    const memberStatus=['ACTIVE','BLOCK','DELETE'].includes(String(router.query.memberStatus)) ? String(router.query.memberStatus) : '';
	const [page, setPage] = useState(1),
		[text, setText] = useState('');
    useEffect(()=>setPage(1),[memberType,memberStatus]);
	const q = useMarketplace('getAllMemberByAdmin', {
			input: { page, limit: 10, search: { ...(memberType ? {memberType} : {}), ...(memberStatus ? {memberStatus} : {}), text } },
		}),
		action = useAction();
	return (
		<>
			<h2>{type === 'SELLER' ? 'All Sellers' : type === 'CS' ? 'CS Members' : 'All Users'}</h2>
			<TextField
				label={uiText("Search members")}
				value={text}
				onChange={(e) => {
					setText(e.target.value);
					setPage(1);
				}}
			/>
			<State query={q} empty={q.value?.list?.length === 0}>
				<div className="table-wrap">
					<table className="data-table">
						<thead>
							<tr>
								<th>{uiText("Member")}</th>
								<th>{uiText("Role")}</th>
								<th>{uiText("Status")}</th>
								<th>{uiText("Action")}</th>
							</tr>
						</thead>
						<tbody>
							{q.value?.list?.map((m: any) => (
								<tr key={m._id}>
									<td>{m.memberNick}</td>
									<td>{m.memberType}</td>
									<td>{m.memberStatus}</td>
									<td>
										<Button
											onClick={() =>
												void action('updateMemberByAdmin', {
													input: { _id: m._id, memberStatus: m.memberStatus === 'BLOCK' ? 'ACTIVE' : 'BLOCK' },
												}).catch(() => {})
											}
										>
											{m.memberStatus === 'BLOCK' ? 'Unblock' : 'Block'}
										</Button>
										{m.memberStatus !== 'DELETE' && (
											<Button
												color="error"
												disabled={m._id === actor._id}
												onClick={async () => {
													if (m._id === actor._id) return;
													if (
														!(await sweetConfirmAlert(
															`Delete ${m.memberNick}? Their account will be disabled; order and other records will be preserved.`,
														))
													)
														return;
													try {
														await action('updateMemberByAdmin', { input: { _id: m._id, memberStatus: 'DELETE' } });
														await q.refetch();
														await sweetMixinSuccessAlert('Member deleted');
													} catch {}
												}}
											>
												{uiText("Delete")}</Button>
										)}
										{m.memberType === 'USER' && (
											<Button
												onClick={() =>
													void action('updateMemberByAdmin', { input: { _id: m._id, memberType: 'CS' } }).catch(
														() => {},
													)
												}
											>
												{uiText("Assign CS")}</Button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Pager value={q.value} page={page} limit={10} onChange={setPage} />
			</State>
		</>
	);
}
