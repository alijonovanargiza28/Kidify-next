import { CurrencySelector } from './common/Currency';
import useUiText from '../hooks/useUiText';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { IconButton, Dialog, TextField, Button, Badge, Select, MenuItem, Menu, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import { logOut } from '../auth';
import { imageUrl } from './common/Marketplace';
import { userVar } from '../../apollo/store';
import { useMarketplace } from '../hooks/useMarketplace';
const nav = [
	['HOME', '/'],
	['PRODUCTS', '/products'],
	['SELLERS', '/sellers'],
	['COMMUNITY', '/community'],
	['MY PAGE', '/mypage'],
	['CS', '/cs'],
];
export default function Top() {
 const uiText = useUiText();

	const router = useRouter(),
		{ t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
	const [open, setOpen] = useState(false),
		[text, setText] = useState('');
	const cart = useMarketplace('getMyCart', {}, !user._id),
		notifications = useMarketplace('getUnreadNotificationCount', {}, !user._id);
	return (
		<header className="kidify-header">
			<div className="kidify-container nav-inner">
				<Link className="wordmark" href="/">
					{uiText("Kidify")}</Link>
				<nav>
					{nav.map(([n, p]) => (
						<Link key={p} href={p} className={router.pathname === p ? 'active' : ''}>
							{t(n, n)}
						</Link>
					))}
				</nav>
				<div className="nav-actions">
					<IconButton aria-label={uiText("Search")} onClick={() => setOpen(true)}>
						<SearchIcon />
					</IconButton>
					<IconButton aria-label={uiText("Wishlist")} onClick={() => router.push('/wishlist')}>
						<FavoriteBorder />
					</IconButton>
					<IconButton aria-label={uiText("Cart")} onClick={() => router.push('/cart')}>
						<Badge badgeContent={cart.value?.items?.length || 0} color="primary">
							<ShoppingBagOutlined />
						</Badge>
					</IconButton>
					{user._id && (
						<IconButton aria-label={uiText("Notifications")} onClick={() => router.push('/notifications')}>
							<Badge badgeContent={notifications.value || 0} color="primary">
								<NotificationsNone />
							</Badge>
						</IconButton>
					)}
					<IconButton
						aria-label={uiText("Account menu")}
						aria-haspopup="menu"
						aria-controls={accountAnchor ? 'account-menu' : undefined}
						aria-expanded={Boolean(accountAnchor)}
						onClick={(e) => setAccountAnchor(e.currentTarget)}
					>
						<Avatar
							src={user._id ? imageUrl(user.memberImage) : undefined}
							alt={user.memberNick || 'Account'}
							sx={{ width: 30, height: 30, bgcolor: '#f5d9de', color: '#8c4655', fontSize: 13 }}
						>
							{user.memberNick?.slice(0, 1).toUpperCase() || undefined}
						</Avatar>
					</IconButton>
					<Menu
						id="account-menu"
						anchorEl={accountAnchor}
						open={Boolean(accountAnchor)}
						onClose={() => setAccountAnchor(null)}
					>
						{(user._id
							? [
									['My Profile', '/mypage?category=profile'],
									['My Orders', '/mypage?category=orders'],
									['Wishlist', '/wishlist'],
									['Messages', '/messages'],
									...(['SELLER', 'ADMIN'].includes(user.memberType)
										? [['Dashboard', '/mypage?category=dashboard']]
										: []),
							  ]
							: [
									['Sign in', '/account/join'],
									['Create account', '/account/join?mode=signup'],
							  ]
						).map(([label, href]) => (
							<MenuItem
								key={href}
								onClick={() => {
									setAccountAnchor(null);
									router.push(href);
								}}
							>
								{uiText(label)}
							</MenuItem>
						))}
						{user._id && (
							<MenuItem
								onClick={() => {
									setAccountAnchor(null);
									logOut();
								}}
							>
								{uiText("Sign out")}</MenuItem>
						)}
					</Menu>
                    <CurrencySelector />
					<Select
						inputProps={{ 'aria-label': 'Language' }}
						size="small"
						value={router.locale || 'en'}
						onChange={(e) => {
                            document.cookie = `NEXT_LOCALE=${e.target.value}; Path=/; Max-Age=31536000; SameSite=Lax`;
                            router.push(router.asPath, router.asPath, { locale: e.target.value });
                        }}
					>
						{['en', 'ko', 'uz'].map((l) => (
							<MenuItem key={l} value={l}>
								<span aria-hidden="true">{{ en: '🇬🇧', ko: '🇰🇷', uz: '🇺🇿' }[l]}</span> {l.toUpperCase()}
							</MenuItem>
						))}
					</Select>
				</div>
			</div>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<form
					className="search-dialog"
					onSubmit={(e) => {
						e.preventDefault();
						setOpen(false);
						router.push({ pathname: '/products', query: { text } });
					}}
				>
					<h2>{uiText("Search products")}</h2>
					<TextField autoFocus label={uiText("Product name")} value={text} onChange={(e) => setText(e.target.value)} />
					<Button type="submit" variant="contained">
						{uiText("Search")}</Button>
				</form>
			</Dialog>
		</header>
	);
}
