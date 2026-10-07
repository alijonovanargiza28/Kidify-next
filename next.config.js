/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Isolate production verification from concurrently running development servers.
	distDir: process.env.KIDIFY_BUILD_DIR || '.next',
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
