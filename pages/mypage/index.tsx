import { HomeOutlined, Inventory2Outlined, LayersOutlined, StarOutline, BarChartOutlined, ChatBubbleOutline, ReceiptLongOutlined, ArticleOutlined, PersonOutline, FavoriteBorder, PeopleOutline, HistoryOutlined, ThumbUpOutlined, ShoppingCartOutlined, LocationOnOutlined, HeadsetMicOutlined } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { SellerCollections, SellerReviews, SellerStatistics, SellerDashboard } from '../../libs/components/mypage/SellerPanels';
import useUiText from '../../libs/hooks/useUiText';
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
	['followers', 'My Followers'],
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
		['products', 'My Products'],
        ['collections', 'Product Collections'],
        ['reviews', 'Reviews'],
        ['statistics', 'Statistics'],
        ['messages', 'Messages'],
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
const connectionNavIcons:any = {dashboard:HomeOutlined,products:Inventory2Outlined,collections:LayersOutlined,reviews:StarOutline,statistics:BarChartOutlined,messages:ChatBubbleOutline,sellerOrders:ReceiptLongOutlined,articles:ArticleOutlined,profile:PersonOutline,favorites:FavoriteBorder,followers:PeopleOutline,followings:PeopleOutline,visited:HistoryOutlined,likes:ThumbUpOutlined,orders:ShoppingCartOutlined,addresses:LocationOnOutlined,support:HeadsetMicOutlined};
function MyPage() {
 const uiText = useUiText();
 const {t}=useTranslation('common');

	const router = useRouter(),
		user = useReactiveVar(userVar);
	const personal = ['ADMIN', 'CS'].includes(user.memberType)
		? common.filter(([key]) => ['profile', 'support'].includes(key))
		: common;
	const nav = [...(roleNav[user.memberType] || []), ...personal],
		requested = String(router.query.category || (user.memberType === 'SELLER' ? 'dashboard' : 'profile')),
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
 const connectionsPage = ['followers', 'followings'].includes(category);
	const permitted = [...nav, ...common].some(([k]) => k === category) || (category === 'delivery' && router.query.id);
	let content: React.ReactNode = <p>{uiText("Select an item from your account menu.")}</p>;
	if (permitted) {
		switch (category) {
			case 'collections': content=<SellerCollections user={user}/>;break;
            case 'reviews': content=<SellerReviews user={user}/>;break;
            case 'statistics': content=<SellerStatistics/>;break;
            case 'messages': content=<><h2>{uiText('Messages')}</h2><div id="seller-chat-host" /></>;break;
			case 'profile':
				content = <Profile user={user} />;
				break;
			case 'favorites':
				content = <Favorites />;
				break;
			case 'visited':
				content = <Favorites visited />;
				break;
			case 'followers':
				content = <Followings followers />;
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
				content = user.memberType==='SELLER' ? <SellerDashboard/> : <Dashboard role={user.memberType} />;
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
			{!connectionsPage && <PageTitle title={uiText("My Page")} subtitle={uiText("Your little world, thoughtfully organized.")} />}
			{user._id && (
				<div className={`account-layout ${user.memberType==='SELLER' ? 'seller-workspace' : ''} ${connectionsPage ? 'connections-workspace' : ''}`}>
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
								{connectionsPage && React.createElement(connectionNavIcons[k] || PersonOutline, {fontSize:'small', 'aria-hidden':true})}
								{k === 'followers' ? t('connections.followers') : user.memberType==='SELLER' ? t(`sellerRef.nav.${k}`,{defaultValue:uiText(label)}) : uiText(label)}
							</Link>
						))}
						{user.memberType==='SELLER' && <Link href={{pathname:'/sellers/detail',query:{id:user._id}}}>{uiText('Visit Boutique →')}</Link>}
                        <Link href="/messages">{uiText("Messages")}</Link>
						<Link href="/notifications">{uiText("Notifications")}</Link>
						<Button onClick={logOut}>{uiText("Sign out")}</Button>
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
