import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { Button } from '@mui/material';
import { userVar } from '../../apollo/store';
import { logOut } from '../../libs/auth';
import withLayout from '../../libs/components/layout/LayoutBasic';
import { RequireMember, Photo, PageTitle } from '../../libs/components/common/Marketplace';
import Favorites from '../../libs/components/mypage/MarketplaceFavorites';
import Orders from '../../libs/components/mypage/MarketplaceOrders';
import Manage, { Members } from '../../libs/components/mypage/MarketplaceManage';
import {
	Profile,
	Addresses,
	Followings,
	LikedArticles,
	Dashboard,
	Delivery,
} from '../../libs/components/mypage/MarketplaceAccount';
import Support from '../../libs/components/cs/MarketplaceSupport';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
const common = [
	['profile', 'My Profile'],
	['favorites', 'My Favorites'],
	['followings', 'My Followings'],
	['visited', 'Recently Visited'],
	['likes', 'Likes'],
	['orders', 'My Orders'],
	['addresses', 'Addresses'],
	['support', 'Support'],
];
const roleNav: any = {
	USER: [],
	SELLER: [
		['dashboard', 'Overview'],
		['products', 'All Products'],
		['sellerOrders', 'Seller Orders'],
		['articles', 'My Articles'],
	],
	ADMIN: [
		['dashboard', 'Overview'],
		['users', 'All Users'],
		['sellers', 'All Sellers'],
		['cs', 'CS Members'],
		['products', 'All Products'],
		['adminOrders', 'All Orders'],
		['delivery', 'Delivery'],
		['faq', 'FAQ'],
		['articles', 'Article Management'],
		['events', 'Event Management'],
		['brands', 'Brands'],
		['coupons', 'Coupons'],
		['codes', 'dinaBaby'],
	],
	CS: [['delivery', 'Delivery']],
};
function MyPage() {
	const router = useRouter(),
		user = useReactiveVar(userVar);
	const nav = [...(roleNav[user.memberType] || []), ...common],
		requested = String(router.query.category || 'profile'),
		aliases: any = {
			myProfile: 'profile',
			myFavorites: 'favorites',
			recentlyVisited: 'visited',
			myArticles: 'articles',
			writeArticle: 'articles',
			myProperties: 'products',
			addProperty: 'products',
		};
	const category = aliases[requested] || requested;
	const permitted = nav.some(([k]) => k === category) || (category === 'delivery' && router.query.id);
	let content: React.ReactNode = <p>Select an item from your account menu.</p>;
	if (permitted) {
		switch (category) {
			case 'profile':
				content = <Profile user={user} />;
				break;
			case 'favorites':
				content = <Favorites />;
				break;
			case 'visited':
				content = <Favorites visited />;
				break;
			case 'followings':
				content = <Followings />;
				break;
			case 'likes':
				content = <LikedArticles />;
				break;
			case 'addresses':
				content = <Addresses />;
				break;
			case 'orders':
				content = <Orders />;
				break;
			case 'sellerOrders':
				content = <Orders role="SELLER" />;
				break;
			case 'adminOrders':
				content = <Orders role="ADMIN" />;
				break;
			case 'support':
				content = <Support user={user} />;
				break;
			case 'delivery':
				content = <Delivery staff={['ADMIN', 'CS'].includes(user.memberType)} />;
				break;
			case 'dashboard':
				content = <Dashboard role={user.memberType} />;
				break;
			case 'users':
			case 'sellers':
			case 'cs':
				content = <Members type={category === 'sellers' ? 'SELLER' : category === 'cs' ? 'CS' : undefined} />;
				break;
			default:
				content = <Manage section={category} user={user} />;
		}
	}
	return (
		<RequireMember user={user}>
			<PageTitle title="My Page" subtitle="Your little world, thoughtfully organized." />
			{user._id && (
				<div className="account-layout">
					<aside className="account-sidebar">
						<Photo src={user.memberImage} alt={user.memberNick} />
						<div>
							<h3>{user.memberNick}</h3>
							<small>{user.memberType}</small>
						</div>
						{nav.map(([k, label]) => (
							<Link
								key={k}
								className={category === k ? 'active' : ''}
								href={{ pathname: '/mypage', query: { category: k } }}
							>
								{label}
							</Link>
						))}
						<Link href="/messages">Messages</Link>
						<Link href="/notifications">Notifications</Link>
						<Button onClick={logOut}>Sign out</Button>
					</aside>
					<section className="account-content" key={category}>
						{content}
					</section>
				</div>
			)}
		</RequireMember>
	);
}
export default withLayout(MyPage);
