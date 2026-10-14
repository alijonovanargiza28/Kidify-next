import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject, Observable, from } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { onError } from '@apollo/client/link/error';
import { getAccessToken, sessionManager, expireAuthentication, isInvalidSession } from '../libs/auth/session';
import { REACT_APP_API_GRAPHQL_URL } from '../libs/config';
let apolloClient: ApolloClient<NormalizedCacheObject>;
export const isUnauthenticated = (errors: readonly any[] | undefined, networkError?: any) =>
 !!errors?.some(e => e.extensions?.code === 'UNAUTHENTICATED' || e.code === 'UNAUTHENTICATED' || e.message === 'UNAUTHORIZED' || e.message === 'Unauthorized') || networkError?.statusCode === 401;
function createApolloClient() {
 const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => {
   const { Authorization, authorization, ...safeHeaders } = headers;
   return { kidifyTokenUsed: token, headers: { ...safeHeaders, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Apollo-Require-Preflight': 'true', 'X-Kidify-CSRF': '1' } };
  });
  return forward(operation);
 });
 const errors = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (!isUnauthenticated(graphQLErrors, networkError) || typeof window === 'undefined' || operation.getContext().kidifyRetried) return;
  const definition: any = operation.query.definitions.find((d: any) => d.kind === 'OperationDefinition' && (!operation.operationName || d.name?.value === operation.operationName));
  // Retrying a multi-field mutation could repeat an already successful sibling write.
  if (definition?.operation === 'mutation' && (definition.selectionSet.selections.length !== 1 || definition.selectionSet.selections[0].kind !== 'Field')) return;
  // Retry only a guard-level authentication rejection, never arbitrary network failures.
  return new Observable(observer => {
   let subscription: any, cancelled = false;
   const previous = operation.getContext().kidifyTokenUsed;
   const refreshed = getAccessToken() && getAccessToken() !== previous ? Promise.resolve(getAccessToken()) : sessionManager.refresh();
   refreshed.then(() => {
    if (cancelled) return;
    operation.setContext({ kidifyRetried: true });
    subscription = forward(operation).subscribe({
     next(result) { if (isUnauthenticated(result.errors)) expireAuthentication(); observer.next(result); },
     error(error) { if (isUnauthenticated(undefined, error)) expireAuthentication(); observer.error(error); },
     complete() { observer.complete(); },
    });
   }).catch(error => { if (!cancelled) { if (isInvalidSession(error)) expireAuthentication(); observer.error(error); } });
   return () => { cancelled = true; subscription?.unsubscribe(); };
  });
 });
 return new ApolloClient({ ssrMode: typeof window === 'undefined', link: from([errors, authLink, createUploadLink({ uri: REACT_APP_API_GRAPHQL_URL, credentials: 'include' })]), cache: new InMemoryCache({ typePolicies: { Product: { fields: { meLiked: { merge: false } } } } }) });
}
export function initializeApollo(initialState: any = null) {
 const client = apolloClient ?? createApolloClient();
 if (initialState) client.cache.restore(initialState);
 if (typeof window !== 'undefined') apolloClient = client;
 return client;
}
export function useApollo(initialState: any) { return useMemo(() => initializeApollo(initialState), [initialState]); }
