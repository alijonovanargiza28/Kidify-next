export const REACT_APP_API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3007');

export const REACT_APP_API_GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`;

export const REACT_APP_API_WS = process.env.REACT_APP_API_WS || REACT_APP_API_URL.replace(/^http/, 'ws');
