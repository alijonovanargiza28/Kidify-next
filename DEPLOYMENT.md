# Kidify-next deployment after the security migration

Prepared 2026-10-14. Frontend only; backend deployment/configuration is maintained in the backend repository and was not modified. No push or deployment was performed.

## Release gate

Next.js 16.4.0 and Swiper 14.3.0 are installed and locally verified. Production audit now has **0 critical / 0 high**, but **DOMPurify moderate findings remain** through Toast UI. The full dependency audit also retains a development-only high braces finding. Read PRODUCTION_READINESS.md before public release; the frontend is not cleared until remaining security and live acceptance gates are handled.

Do not upload older frontend source archives: they contain the previous Next 14 dependency tree. Use the current reviewed source and Yarn lockfile when preparing a new package. Keep .env secrets, package-lock.json, .git, node_modules, tests/fixtures, .next* builds and caches out of the deployment package. The pre-existing npm lockfile remains unchanged locally; Yarn is authoritative.

## Vercel settings

- Project: Kidify-next frontend directory.
- Framework preset: Next.js.
- Runtime: Node.js 24 (local verification used 24.19.0).
- Install: `yarn install --frozen-lockfile` (Yarn Classic 1.22).
- Build: `yarn build` — runs ESLint first, then `next build --webpack`; TypeScript checks remain enabled.
- Output directory: `.next`.
- Leave KIDIFY_BUILD_DIR unset on Vercel. It is for isolated local verification only.
- Preserve the existing Pages Router, React 18 and next-i18next EN/KO/UZ routes. Do not enable React Compiler or change bundlers as a deployment workaround.

Configure public values BEFORE building:

```env
REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com
REACT_APP_API_GRAPHQL_URL=https://YOUR-BACKEND.onrender.com/graphql
REACT_APP_API_WS=wss://YOUR-BACKEND.onrender.com
KIDIFY_CANONICAL_CURRENCY=USD
```

Keep the currency consistent with stored catalog/order amounts. These endpoints are embedded into the browser bundle; a change requires a new build. GraphQL/WS can derive from the API base when omitted, but explicit real values are easiest to review. Production validation continues to reject missing, localhost, HTTP and WS endpoints. The local fixture `https://api.kidify.example` is not a real backend.

Never set backend Mongo/JWT/AI secrets in public frontend variables. Vercel's disposable exchange-rate cache stays in /tmp; images and native WebSocket service remain on the backend. Public hosting HTTPS subdomains can be used without buying a domain.

## Backend connection acceptance

Have the backend operator configure the exact stable frontend HTTPS origin in CORS_ORIGINS. Use explicit intended preview origins. For cross-site vercel.app/onrender.com refresh cookies, the backend needs SameSite=None/Secure; browser third-party-cookie policies can still block them. Prefer same-site custom domains or a separately reviewed same-origin design when necessary. This migration did not change backend variables or cookies.

Verify /graphql and /uploads/... over HTTPS and authenticated native WebSockets over WSS. The application uses native ws; it does not speak Socket.IO protocol. Existing backend disk/Atlas/index/AI configuration and unresolved backend security risks need the backend's own deployment review.

## Checks in the full development checkout

```bash
yarn install --frozen-lockfile
yarn lint
yarn typecheck
env -u REACT_APP_API_URL -u REACT_APP_API_GRAPHQL_URL -u REACT_APP_API_WS NODE_ENV=test yarn test
yarn audit --groups dependencies --json
yarn audit --json
```

Yarn audit returns nonzero while findings remain; retain and review the JSON output. Production-only and development-inclusive audits are both reported. No ignored advisory allowlist or forced major dependency workaround is used.

For an isolated local production check, supply reviewed HTTPS/WSS endpoints and set `KIDIFY_BUILD_DIR=.next-production-check yarn build`. For the actual Vercel build, use the real endpoints and leave that variable unset. Lint is a build gate; its 12 existing warnings are visible. Do not add ignoreBuildErrors/skip-lint settings to bypass a failed check.

## Live release acceptance

- [ ] Resolve or explicitly review DOMPurify/Toast UI sanitizer risks with hostile-content tests; no risk exemption currently exists.
- [ ] Review the development-only braces advisory and lint-tool support risks.
- [ ] Validate real origins/TLS/CORS and supported-browser refresh cookies.
- [ ] Test USER/SELLER/ADMIN/CS signup/login, refresh after reload, logout and access boundaries with staging accounts.
- [ ] Verify real product lists/filters, image upload and durable retrieval, color/age variants and gallery controls.
- [ ] Compare hero fade/loop/autoplay/hover pause/navigation/pagination and category scrolling on desktop/mobile.
- [ ] Verify EN/KO/UZ routes, language switching and translations.
- [ ] Test cart selection/quantity, checkout, wishlist/likes, reviews, seller fulfillment and admin/CS flows against staging data.
- [ ] Verify native chat authentication/reconnect at the deployed WSS endpoint.
- [ ] Check existing community content and HTML sanitization; real payment/refund/courier integrations remain separate requirements.
- [ ] Review mobile/browser appearance, logs, monitoring, backups and rollback before public release.

Local browser checks used mocked API/WebSocket responses and temporary test data. They verify migrated frontend behavior, not deployed persistence or browser acceptance of real cross-site cookies. Backend remained untouched.

References: [Next 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16), [Next support policy](https://nextjs.org/support-policy), [Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs), [Swiper React](https://swiperjs.com/react).
