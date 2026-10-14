import { userVar, emptyUser } from '../../apollo/store';
import { REACT_APP_API_GRAPHQL_URL } from '../config';
export const isInvalidSession = (error: any) => error?.message === 'UNAUTHORIZED';
/** Tokens are intentionally confined to this module's memory, never browser storage. */
export function createSessionManager(transport: () => Promise<string>) {
 let accessToken = '', generation = 0, pending: Promise<string> | null = null, restored = false, refreshBlocked = false;
 return {
  get: () => accessToken,
  set(token: string) { accessToken = token; restored = true; refreshBlocked = false; generation++; },
  clear() { accessToken = ''; restored = true; refreshBlocked = true; generation++; },
  async waitForRefresh() { try { await pending; } catch { /* A cleared session rejects stale refresh results. */ } },
  refresh(): Promise<string> {
   if (refreshBlocked) return Promise.reject(new Error('AUTH_SESSION_CHANGED'));
   if (pending) return pending;
   const started = generation;
   pending = transport().then(token => {
    if (generation !== started) throw new Error('AUTH_SESSION_CHANGED');
    if (!token) throw new Error('UNAUTHORIZED');
    accessToken = token; restored = true;
    return token;
   }).catch(error => { if (generation === started && isInvalidSession(error)) { accessToken = ''; restored = true; } throw error; }).finally(() => { pending = null; });
   return pending;
  },
  async restore(): Promise<string> {
   if (pending) { try { return await pending; } catch (error) { if (isInvalidSession(error)) return ''; throw error; } }
   if (accessToken || restored) return accessToken;
   try { return await this.refresh(); } catch (error) { if (isInvalidSession(error)) return ''; throw error; }
  },
 };
}
export async function cookieMutation(query: string) {
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), 10000);
 try {
 const response = await fetch(REACT_APP_API_GRAPHQL_URL, {
  signal: controller.signal, method: 'POST', credentials: 'include', cache: 'no-store',
  headers: { 'Content-Type': 'application/json', 'X-Kidify-CSRF': '1', 'Apollo-Require-Preflight': 'true' },
  body: JSON.stringify({ query }),
 });
 const body = await response.json().catch(() => null);
 const invalid = response.status === 401 || body?.errors?.some((error: any) => error.extensions?.code === 'UNAUTHENTICATED' || ['UNAUTHORIZED', 'Unauthorized'].includes(error.message));
 if (invalid) throw new Error('UNAUTHORIZED');
 if (!response.ok || !body || body.errors?.length) throw new Error('Session temporarily unavailable. Please try again.');
 return body.data;
 } finally { clearTimeout(timeout); }
}
async function fetchFreshAccess() {
 const request = async () => (await cookieMutation('mutation RefreshKidifySession { refreshToken { accessToken } }')).refreshToken.accessToken as string;
 // Serialize rotation across same-origin tabs as well as requests within this tab.
 const locks = typeof navigator !== 'undefined' ? (navigator as any).locks : undefined;
 return locks ? locks.request('kidify-refresh-session', request) : request();
}
export const sessionManager = createSessionManager(fetchFreshAccess);
export const getAccessToken = () => typeof window === 'undefined' ? '' : sessionManager.get();
let redirecting = false;
export function expireAuthentication() {
 if (redirecting) return;
 redirecting = true;
 sessionManager.clear();
 userVar({ ...emptyUser });
 if (typeof window !== 'undefined') {
  window.dispatchEvent(new Event('kidify:unauthorized'));
  if (window.location && !window.location.pathname.endsWith('/account/join')) {
   const locale = /^\/(ko|uz)(?:\/|$)/.exec(window.location.pathname)?.[1];
   window.location.replace((locale ? '/' + locale : '') + '/account/join?returnTo=' + encodeURIComponent(window.location.pathname + window.location.search));
  }
 }
}
