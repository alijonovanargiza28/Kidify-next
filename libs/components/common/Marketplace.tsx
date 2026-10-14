import { Money } from './Currency';
import useUiText from '../../hooks/useUiText';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Alert, Button, Pagination, Skeleton } from '@mui/material';
import { REACT_APP_API_URL } from '../../config';
export const imageUrl = (src?: string) =>
	!src
		? ''
		: /^(https?:|data:|blob:)/.test(src)
		? src
		: src.startsWith('/img/')
		? src
		: `${REACT_APP_API_URL}/${src.replace(/^\//, '')}`;
export const money = (n: number) => <Money amount={n} />;
export function Photo({ src, alt = '', ...props }: any) {
 const uiText = useUiText();

	const [failed, setFailed] = React.useState(false);
	React.useEffect(() => setFailed(false), [src]);
	return src && !failed ? (
		<img {...props} src={imageUrl(src)} alt={alt} onError={() => setFailed(true)} />
	) : (
		<div className="photo-fallback" role="img" aria-label={alt || 'Image unavailable'}>
			{uiText("Kidify")}</div>
	);
}
export function State({ query, empty, children }: any) {
 const uiText = useUiText();

	if (query.loading && !query.value)
		return (
			<div className="loading-grid">
				{[0, 1, 2, 3].map((x) => (
					<Skeleton key={x} variant="rounded" height={220} />
				))}
			</div>
		);
	if (query.error)
		return (
			<Alert severity="error" action={<Button onClick={() => query.refetch()}>{uiText("Retry")}</Button>}>
				{query.error.message}
			</Alert>
		);
	if (empty) return <div className="empty-state">{uiText("Nothing here yet.")}</div>;
	return <>{children}</>;
}
export function Pager({ value, page, onChange, limit = 12 }: any) {
	const count = Math.ceil((value?.metaCounter?.[0]?.total || 0) / limit);
	return count > 1 ? (
		<Pagination shape="rounded" color="primary" count={count} page={page} onChange={(_, n) => onChange(n)} />
	) : null;
}
export function PageTitle({ title, subtitle }: any) {
 const uiText = useUiText();

	return (
		<div className="page-title">
			<p className="eyebrow">
				<Link href="/">{uiText("Home")}</Link> / {title}
			</p>
			<h1>{title}</h1>
			{subtitle && <p>{subtitle}</p>}
		</div>
	);
}
export function RequireMember({ user, children, roles }: any) {
 const uiText = useUiText();

	const router = useRouter();
	if (!user?._id)
		return (
			<div className="empty-state">
				<h2>{uiText("Welcome to Kidify")}</h2>
				<p>{uiText("Sign in to continue.")}</p>
				<Button
					variant="contained"
					onClick={() => router.push({ pathname: '/account/join', query: { returnTo: router.asPath } })}
				>
					{uiText("Sign in")}</Button>
			</div>
		);
	if (roles && !roles.includes(user.memberType))
		return <Alert severity="warning">{uiText("You do not have access to this page.")}</Alert>;
	return <>{children}</>;
}
