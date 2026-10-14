import { CurrencyProvider } from '../libs/components/common/Currency';
import dynamic from 'next/dynamic';
const FloatingChat = dynamic(() => import('../libs/components/FloatingChat'), { ssr: false });
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import '../scss/pc/swiper-navigation.scss';
import '../scss/pc/kidify.scss';
import '../scss/pc/kidify-references.scss';

const App = ({ Component, pageProps }: AppProps) => {
	const [theme] = useState(
		createTheme({
			...(light as ThemeOptions),
			palette: { primary: { main: '#8c4655' }, background: { default: '#fbf9f7', paper: '#ffffff' } },
			typography: { fontFamily: 'Inter, sans-serif' },
			shape: { borderRadius: 12 },
		}),
	);
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
                <CurrencyProvider>
				<Component {...pageProps} />
                <FloatingChat />
                </CurrencyProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
