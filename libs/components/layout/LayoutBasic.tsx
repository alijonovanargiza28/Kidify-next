import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Button } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';
import { restoreAuthentication, clearSession } from '../../auth';
export default function withLayout(Component: any) {
	return function KidifyLayout(props: any) {
		const [ready, setReady] = useState(false);
		const [error, setError] = useState('');
		useEffect(() => {
			let active = true;
			(async () => {
				try {
					const authenticated = await restoreAuthentication();
                    if (!authenticated && /^\/(?:en\/|ko\/|uz\/)?(?:mypage|cart|checkout|_admin)(?:\/|$)/.test(window.location.pathname)) window.location.replace('/account/join?returnTo=' + encodeURIComponent(window.location.pathname + window.location.search));
				} catch (e: any) {
					if (active) setError(e.message || 'Unable to restore your session');
				}
				if (active) setReady(true);
			})();
			const clear = () => clearSession();
			window.addEventListener('kidify:unauthorized', clear);
			return () => {
				active = false;
				window.removeEventListener('kidify:unauthorized', clear);
			};
		}, []);
		return (
			<div id="pc-wrap" className="kidify">
				<Head>
					<title>Kidify — Children's Marketplace</title>
					<meta
						name="description"
						content="Shop clothing, baby essentials and thoughtful gifts from independent sellers."
					/>
				</Head>
				<Top />
				<main className="kidify-container kidify-main">
					{error ? (
						<Alert severity="error" action={<Button onClick={() => window.location.reload()}>Retry</Button>}>
							{error}
						</Alert>
					) : ready ? (
						<Component {...props} />
					) : (
						<div className="empty-state">Loading…</div>
					)}
				</main>
				<Footer />
			</div>
		);
	};
}
