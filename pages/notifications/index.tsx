import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button, TextField, MenuItem } from '@mui/material';
import { userVar } from '../../apollo/store';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { useMarketplace, useAction } from '../../libs/hooks/useMarketplace';
import { RequireMember, PageTitle, State, Pager } from '../../libs/components/common/Marketplace';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Notifications() {
	const router = useRouter(),
		user = useReactiveVar(userVar),
		[page, setPage] = useState(1),
		[filter, setFilter] = useState('ALL'),
		action = useAction(),
		q = useMarketplace('getMyNotifications', { input: { page, limit: 20, filter } }, !user._id);
	const open = (n: any) => {
		const route: any = {
			PRODUCT: { pathname: '/products/detail', query: { id: n.targetId } },
			ARTICLE: { pathname: '/community/detail', query: { id: n.targetId } },
			MEMBER: { pathname: '/member', query: { id: n.targetId } },
			ORDER: {
				pathname: '/mypage',
				query: {
					category:
						user.memberType === 'ADMIN' ? 'adminOrders' : user.memberType === 'SELLER' ? 'sellerOrders' : 'orders',
					orderId: n.targetId,
				},
			},
			EVENT: { pathname: '/events', query: { id: n.targetId } },
			MESSAGE: { pathname: '/messages', query: { peerId: n.targetId } },
		};
		if (route[n.notificationGroup] && n.targetId) router.push(route[n.notificationGroup]);
	};
	return (
		<RequireMember user={user}>
			<PageTitle title="Notifications" />
			<div className="result-toolbar">
				<TextField InputLabelProps={{htmlFor:undefined}}
					select
					label="Show"
					value={filter}
					onChange={(e) => {
						setFilter(e.target.value);
						setPage(1);
					}}
				>
					{['ALL', 'UNREAD', 'READ'].map((v) => (
						<MenuItem key={v} value={v}>
							{v}
						</MenuItem>
					))}
				</TextField>
				<Button onClick={() => void action('markAllNotificationsRead').catch(() => {})}>Mark all as read</Button>
			</div>
			<State query={q} empty={!q.value?.list?.length}>
				{q.value?.list?.map((n: any) => (
					<div key={n._id} className={'notification ' + (n.notificationStatus === 'WAIT' ? 'unread' : '')}>
						<div>
							<h3>{n.notificationTitle}</h3>
							<p>{n.notificationDesc}</p>
							<small>{new Date(n.createdAt).toLocaleString()}</small>
						</div>
						<div>
							{n.targetId && n.notificationGroup !== 'PROPERTY' && <Button onClick={() => open(n)}>Open</Button>}
							{n.notificationStatus === 'WAIT' && (
								<Button onClick={() => void action('markNotificationRead', { notificationId: n._id }).catch(() => {})}>
									Mark read
								</Button>
							)}
						</div>
					</div>
				))}
				<Pager value={q.value} page={page} limit={20} onChange={setPage} />
			</State>
		</RequireMember>
	);
}
export default withLayout(Notifications);
