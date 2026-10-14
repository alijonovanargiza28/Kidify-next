// Public endpoints are embedded at build time. Fail closed instead of shipping localhost.
const production = process.env.NODE_ENV === 'production';
const api = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const graphql = process.env.REACT_APP_API_GRAPHQL_URL || (api ? `${api}/graphql` : '');
const websocket = process.env.REACT_APP_API_WS || (api ? api.replace(/^http/, 'ws') : '');
if (production) {
  for (const [name, value, protocol] of [['REACT_APP_API_URL', api, 'https:'], ['REACT_APP_API_GRAPHQL_URL', graphql, 'https:'], ['REACT_APP_API_WS', websocket, 'wss:']]) {
    let url;
    try { url = new URL(value); } catch { throw new Error(`${name} must be configured before a production build`); }
    if (url.protocol !== protocol || url.username || url.password || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error(`${name} must use a public ${protocol} endpoint`);
  }
}
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
    poweredByHeader: false,
    async headers() { return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ] }]; },
	// Isolate production verification from concurrently running development servers.
	distDir: process.env.KIDIFY_BUILD_DIR || '.next',
	env: {
        NEXT_PUBLIC_KIDIFY_CANONICAL_CURRENCY: process.env.KIDIFY_CANONICAL_CURRENCY || 'USD',
		REACT_APP_API_URL: api || undefined,
		REACT_APP_API_GRAPHQL_URL: graphql || undefined,
		REACT_APP_API_WS: websocket || undefined,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
