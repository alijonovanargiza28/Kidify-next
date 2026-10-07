import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Alert } from '@mui/material';
import withLayout from '../../libs/components/layout/LayoutFull';
import { logIn, signUp } from '../../libs/auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});
function Join() {
	const router = useRouter(),
		register = router.query.mode === 'signup';
	const [busy, setBusy] = useState(false),
		[error, setError] = useState('');
	return (
		<div className="auth-panel">
			<p className="eyebrow">Welcome to Kidify</p>
			<h1>{register ? 'Create Account' : 'Welcome Back'}</h1>
			<p>{register ? 'Join our community of thoughtful families.' : 'Sign in to your account.'}</p>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setError('');
					setBusy(true);
					const f = new FormData(e.currentTarget);
					try {
						if (register)
							await signUp(
								String(f.get('nick')),
								String(f.get('password')),
								String(f.get('phone')),
								'USER',
								String(f.get('sellerCode') || ''),
							);
						else await logIn(String(f.get('nick')), String(f.get('password')));
						const ret = String(router.query.returnTo || '/mypage');
						await router.push(ret.startsWith('/') && !ret.startsWith('//') ? ret : '/mypage');
					} catch (e: any) {
						setError(e.message);
					} finally {
						setBusy(false);
					}
				}}
			>
				<TextField
					name="nick"
					label="Nickname"
					required
					inputProps={{ minLength: 3, maxLength: 12 }}
					autoComplete="username"
				/>
				{register && <TextField name="phone" label="Phone" required autoComplete="tel" />}
				<TextField
					name="password"
					label="Password"
					type="password"
					required
					inputProps={{ minLength: 5, maxLength: 12 }}
					autoComplete={register ? 'new-password' : 'current-password'}
				/>
				{register && <TextField name="sellerCode" label="Seller invitation code (optional)" />}
				{error && <Alert severity="error">{error}</Alert>}
				<Button disabled={busy} type="submit" variant="contained">
					{register ? 'Create account' : 'Sign in'}
				</Button>
				<Button
					onClick={() =>
						router.push({ pathname: '/account/join', query: { ...router.query, mode: register ? 'login' : 'signup' } })
					}
				>
					{register ? 'Already have an account? Sign in' : 'New here? Create an account'}
				</Button>
			</form>
		</div>
	);
}
export default withLayout(Join);
