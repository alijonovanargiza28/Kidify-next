# Kidify frontend deployment

Use Node.js 20 and Yarn Classic. The clean source archive contains current working-tree files, including untracked Kidify changes. It excludes local environment files, Git history, dependencies, generated builds, caches and logs. All public assets and tests are retained.

Create `.env.production.local` on the server using `.env.example`. Set real `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL` and `REACT_APP_API_WS` endpoints (HTTPS/WSS) before building; these values are embedded into the browser build. Keep `KIDIFY_CANONICAL_CURRENCY=USD`. Never include backend secrets.

```sh
yarn install --frozen-lockfile
yarn build
yarn start -p 3016
```

Run under a persistent process manager/service with the frontend directory as working directory, behind an HTTPS proxy. The backend CORS configuration must allow this exact frontend origin. The `.cache` exchange-rate folder is regenerable and should be writable. Display currencies: USD/KRW; languages: EN/KO.

Build on the target server. Do not upload Mac `node_modules`, `.next*`, caches, `.git` or local `.env` files. No target server/domain was deployed or configured during this cleanup.
