import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { getMe } from '../../apollo/user/marketplace-query';
import { login, signup } from '../../apollo/user/marketplace-mutation';
export function getJwtToken(): string {
	return typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';
}
export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}
export const updateStorage = ({ jwtToken }: { jwtToken: string }) => {
	setJwtToken(jwtToken);
	localStorage.setItem('login', Date.now().toString());
};
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
	if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
	userVar({ ...userVar(), _id: '', memberType: '', memberNick: '' });
	void initializeApollo().clearStore();
}
export function logOut() {
	clearSession();
	if (typeof window !== 'undefined') window.location.assign('/');
}
