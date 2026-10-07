import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject, from } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { REACT_APP_API_GRAPHQL_URL } from '../libs/config';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
let apolloClient: ApolloClient<NormalizedCacheObject>;
function createApolloClient() {
	const authLink = new ApolloLink((operation, forward) => {
		const token = getJwtToken();
		operation.setContext(({ headers = {} }) => ({
			headers: {
				...headers,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				'Apollo-Require-Preflight': 'true',
			},
		}));
		return forward(operation);
	});
	// The backend has no refresh-token operation. Preserve the existing link as a no-op.
	const refresh = new TokenRefreshLink({
		accessTokenField: 'accessToken',
		isTokenValidOrUndefined: () => true,
		handleFetch: () => {},
		fetchAccessToken: () => Promise.reject(new Error('Please sign in again')),
	});
	const errors = onError(({ graphQLErrors }) => {
		if (graphQLErrors?.some((e) => e.message === 'UNAUTHORIZED') && typeof window !== 'undefined')
			window.dispatchEvent(new Event('kidify:unauthorized'));
	});
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: from([errors, refresh, authLink, createUploadLink({ uri: REACT_APP_API_GRAPHQL_URL })]),
		cache: new InMemoryCache(),
	});
}
export function initializeApollo(initialState: any = null) {
	const client = apolloClient ?? createApolloClient();
	if (initialState) client.cache.restore(initialState);
	if (typeof window !== 'undefined') apolloClient = client;
	return client;
}
export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
