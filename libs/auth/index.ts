import { getAccessToken, sessionManager, cookieMutation } from './session';
import { initializeApollo } from '../../apollo/client';
import { userVar, emptyUser } from '../../apollo/store';
import { getMe } from '../../apollo/user/marketplace-query';
import { login, signup } from '../../apollo/user/marketplace-mutation';
export const getJwtToken = getAccessToken;
export function setJwtToken(token: string) { sessionManager.set(token); }
export const updateStorage = ({ jwtToken }: { jwtToken: string }) => setJwtToken(jwtToken);
export async function restoreAuthentication() {
 if (typeof window === 'undefined') return false;
 // Remove legacy credentials once; never read or migrate a long-lived stored token.
 localStorage.removeItem('accessToken'); localStorage.removeItem('login');
 const token = await sessionManager.restore();
 return token ? updateUserInfo(token) : false;
}
export const updateUserInfo = async (token: string) => {
	if (!token) return false;
	try {
		const { data } = await initializeApollo().query({ query: getMe, fetchPolicy: 'network-only' });
		userVar({ ...userVar(), ...data.getMe });
		return true;
	} catch (e: any) {
		const unauthorized =
			e.graphQLErrors?.some(
				(error: any) => error.extensions?.code === 'UNAUTHENTICATED' || /unauthorized/i.test(error.message),
			) || e.networkError?.statusCode === 401;
		if (unauthorized) {
			clearSession();
			return false;
		}
		throw e;
	}
};
export async function logIn(nick: string, password: string): Promise<void> {
	const { data } = await initializeApollo().mutate({
		mutation: login,
		variables: { input: { memberNick: nick, memberPassword: password } },
	});
	updateStorage({ jwtToken: data.login.accessToken });
	if (!(await updateUserInfo(data.login.accessToken))) throw new Error('Please sign in again.');
}
export async function signUp(
	nick: string,
	password: string,
	phone: string,
	_type: string,
	sellerCode?: string,
): Promise<void> {
	const { data } = await initializeApollo().mutate({
		mutation: signup,
		variables: {
			input: { memberNick: nick, memberPassword: password, memberPhone: phone, ...(sellerCode ? { sellerCode } : {}) },
		},
	});
	updateStorage({ jwtToken: data.signup.accessToken });
	if (!(await updateUserInfo(data.signup.accessToken))) throw new Error('Please sign in again.');
}
export function clearSession() {
 sessionManager.clear();
 if (typeof window !== 'undefined') { localStorage.removeItem('accessToken'); localStorage.removeItem('login'); }
 userVar({ ...emptyUser });
 void initializeApollo().clearStore();
}
export async function logOut() {
 clearSession();
 try { await cookieMutation('mutation LogoutKidifySession { logout }'); }
 finally { if (typeof window !== 'undefined') window.location.assign('/account/join'); }
}
