# Kidify frontend

Next.js marketplace for baby and kids products, with EN/KO translations, seller accounts, variant galleries, cart/orders, reviews, support and private WebSocket chat.

## Development

Use Node.js 20 and Yarn Classic (the existing `yarn.lock` is retained).

```sh
yarn install --frozen-lockfile
yarn dev -p 3016
```

Configure the existing API environment names in local, untracked environment files:
- `REACT_APP_API_URL` (default `http://localhost:3007`)
- `REACT_APP_API_GRAPHQL_URL` (default API URL + `/graphql`)
- `REACT_APP_API_WS` (default API URL using `ws`/`wss`)

These names remain supported for current deployments. Do not put credentials in frontend environment variables. Server-side exchange-rate configuration remains in `libs/server/exchangeRates.ts`; database prices and order settlement remain USD.

## Validation

```sh
yarn typecheck
yarn test
KIDIFY_BUILD_DIR=.next-cleanup yarn build
```

`pages/` are runtime routes; `libs/components/product/MarketplaceProductCard.tsx` is the active product card. Old `/property`, `/agent`, and `/_admin` entry points deliberately remain as Kidify compatibility routes. All authentication, commerce and upload behavior is retained.

See `docs/CLEANUP.md` for the import audit, removal inventory and retained compatibility/data references. Historical commit URLs in `CHANGELOG.md` are immutable provenance and are not rewritten.

Production setup: [DEPLOYMENT.md](docs/DEPLOYMENT.md).
