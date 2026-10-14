# Kidify-next production readiness

Reviewed 2026-10-14T17:51:47+00:00. This report covers the frontend migration only. Backend source, dependencies, documentation and data were not changed.

## Release decision

**Next.js/Swiper critical and high production findings are resolved. The frontend is NOT yet cleared for public production release.** Production still has moderate DOMPurify XSS/sanitization advisories through Toast UI. Live cookies, real API/storage/checkout, supported-browser acceptance and operational checks remain. Nothing was pushed or deployed.

| Audit scope | Critical affected packages | High | Moderate | Low |
| --- | --- | --- | --- | --- |
| Production before migration | 2 | 1 | 1 | 0 |
| Production after migration | 0 | 0 | 1 | 0 |
| Production plus development after compatible patches | 0 | 1 | 1 | 1 |

Exact advisory IDs, ranges, package paths and raw repeated Yarn counts are retained in `docs/security-audit.json`. Current production raw counts are 0 critical / 0 high / 26 moderate / 8 low advisory instances; these are repeated findings for the single DOMPurify package, not 34 affected packages. Full audit retains the development-only high braces finding and low @tootallnate/once finding. These are reported separately, not discarded.

## Migration implemented

- Next.js 14.2.35 -> **16.4.0**, matching eslint-config-next 16.4.0. Next 16 is Active LTS; Next 14 is unsupported. The existing **Pages Router, React/React DOM 18.2.0, Apollo Client 3, GraphQL operations and authentication** are preserved. No App Router/React 19 rewrite was performed.
- Webpack is explicitly retained in development and production (`--webpack`) to preserve the established Sass/Page Router build. Production `build` explicitly runs `yarn lint` before Next compilation; Next 16 no longer supplies `next lint` or automatic linting. TypeScript checks remain enabled in Next's build.
- TypeScript 4.9.5 -> **5.9.3**; Next's required `moduleResolution: bundler` and `jsx: react-jsx` changes are retained. Strict checking and all existing routes remain. Before/after build manifests contain the same 30 page entries (no routes removed/added). Different static-generation totals reflect framework internals rather than removed application routes.
- Swiper 8.4.7 -> **14.3.0**. Module imports moved to `swiper/modules`. Hero fade, four content slides, loop, autoplay, hover pause, clickable pagination, category scrolling and filter links are retained. Swiper's loop implementation no longer needs the old duplicate slide elements.
- Navigation's presentation uses retained, scoped MIT-licensed glyphs/styles, with modern SVG insertion disabled only for these visual icons (`addIcons: false`). The navigation engine and accessibility module stay enabled. Original desktop arrow dimensions/positions/colors match the baseline; mobile and desktop screenshots were visually inspected. Existing stylesheet sources are unchanged; one scoped compatibility stylesheet was added. This is not a claim of pixel-identical rendering across all browsers.
- Sass 1.67.0 -> **1.105.1** within major 1. Its new watcher dependency removes braces from production. The old global Immutable 4 override was removed so Sass uses its declared Immutable 5 dependency. Next's obsolete PostCSS override was removed. No incompatible major dependency was forced under another package's expected range.
- Development dependencies were re-resolved within their existing declared ranges: Handlebars, form-data, lodash, ws, minimatch, brace-expansion and the nested GraphQL 16 branch received compatible patches. This eliminated the full audit's critical findings. Direct runtime GraphQL 15 remains on its existing compatible major.
- The existing frontend npm lockfile is unchanged. Yarn Classic/yarn.lock remains canonical; no npm force/legacy-peer-deps install was used.

## Checks actually completed

Node 24.19.0; Yarn Classic 1.22.22. Source verification used isolated fixtures, not the real backend/Atlas database.

| Check | Result |
| --- | --- |
| Frozen Yarn install | Passed; existing Toast UI React peer warning remains |
| ESLint CLI across pages, libs, Apollo and theme sources | Passed, **0 errors / 12 existing warnings** |
| TypeScript | Passed |
| Production build with explicit lint gate | Passed with HTTPS/WSS fixture endpoints |
| Existing regression runner | All **13 files passed** after final lockfile patches |
| Production dependency audit | 0 critical / 0 high; DOMPurify moderate remains |
| Full dependency audit | 0 critical; braces high remains in development tooling |
| All page route manifests | Same 30 entries before/after |
| Real browser slider checks | Hero next, pagination, category scroll, EN/KO/UZ, desktop/mobile passed |
| Real browser commerce/auth checks | Gallery thumbnail/color changes, anonymous purchase redirect, login return route, signup/getMe, authenticated addToCart payload/CSRF headers and cart render passed |
| Browser credential storage check | No accessToken/login value in localStorage |
| Browser page errors | None in successful final fixture runs |
| Backend integrity | Checked against pre-migration file hashes; no changes |
| Live API/Atlas/payment/browser cookie acceptance | Not deployed or verified |

The broader lint scan exposes four existing raw-image optimization warnings, six hook dependency diagnostics and two anonymous-export warnings. It retains the previous React 18 rules-of-hooks/exhaustive-deps coverage and current Next/Core Web Vitals/React/accessibility/import checks. The app does not enable React Compiler; 29 newly introduced optional compiler diagnostics (refs/effect state/purity) and one JSX entity error were reviewed separately rather than turning this security upgrade into a risky chat/filter/commerce rewrite. The JSX text error was fixed without changing displayed text. Optional React Compiler refactoring remains future work; no dependency security audit/check was disabled. Lint warnings remain visible and are not silently treated as a clean report.

Initial browser failures were traced to fixture CORS/scalar/array response shapes and corrected in the external test harness. No application assertions or security behavior were weakened. The browser uses an isolated WebSocket responder and API fixtures; it does not verify deployed WSS or real persistence. Product gallery/cart/auth tests use production-generated browser code. Source screenshots and temporary harnesses remain outside the repository; verification metadata is in `docs/frontend-migration-verification.json`.

## Remaining risks and exact blockers

1. **DOMPurify 2.5.9 (moderate, with low advisories)** remains through `@toast-ui/editor@3.2.2` / the installed React wrapper 3.2.3. That editor expects DOMPurify major 2; its React wrapper declares React 17 while this established app uses React 18. The current viewer uses custom HTML renderers for iframe/div/big. A blind DOMPurify 3 override or React upgrade is not a reviewed fix. Migrate/update the rich-text integration to a supported sanitizer and React peer range, preserve stored Markdown and current presentation, review allowed iframe origins/HTML attributes, and test hostile HTML, links, event handlers, stored content and sanitization bypasses in a browser. Re-audit the resulting dependency tree. Public release is blocked until this is resolved or reviewed with a concrete, application-specific risk decision; no exemption was granted here.
2. **braces 3.0.3 (high)** now exists only under the development lint toolchain. GHSA-vfj7-8cjw-p6xm affects every published braces version; no patched release is available. Only trusted project file patterns are supplied to lint/build here. Track the upstream fix or migrate the parent toolchain away from that dependency; keep untrusted glob input out. No claim of complete exploitability analysis is made.
3. React 18 is accepted by Next 16's current peer range and passed these checks, but Next emits a deprecation warning for removal in Next 17. Plan a separately tested React 19/MUI/Apollo/rich-text migration before the next framework major.
4. ESLint 9.39.5 is deprecated/upstream unsupported. It is retained to match the declared peer range of Next's React lint plugin, which excludes ESLint 10. Moving the full plugin toolchain to supported ESLint 10 requires compatible peer releases or separately verified replacements; no incompatible plugin override was forced. This is a development maintenance risk, not a production runtime dependency finding.
5. Current Sass emits legacy import/color-function deprecations for existing stylesheets. The build passes and browser comparisons preserve layout. Plan a separate Sass module migration with visual checks; no styles were rewritten just to suppress warnings.
6. Live Vercel/backend-origin cookies, deployed WSS, real image upload/storage, refresh/logout across browsers, Atlas concurrency/checkout and real money/courier integrations remain outside this source-only migration. Backend security findings from the earlier report remain independently open.

## Deployment configuration

Use Vercel with Node 24, install `yarn install --frozen-lockfile`, build `yarn build`, output `.next`; leave KIDIFY_BUILD_DIR unset. Configure actual public HTTPS/WSS endpoints at build time. Current validation, response headers, EN/KO/UZ resources, Apollo credential/CSRF behavior and the Vercel /tmp cache are preserved. See DEPLOYMENT.md.

**Old frontend source archives contain Next 14 and must not be used for this migration.** Package the current reviewed source/lockfile after release blockers are resolved. No deployment archive was refreshed or uploaded in this task.

## Files changed by this migration

Earlier production-preparation changes remain preserved. This migration changed/added only these frontend files:

- `package.json`, `yarn.lock`
- `eslint.config.mjs`; removed obsolete `.eslintrc.json`
- `tsconfig.json`
- `pages/index.tsx`, `pages/_app.tsx`
- `libs/components/layout/LayoutBasic.tsx` (JSX entity, same displayed title)
- `scss/pc/swiper-navigation.scss`
- `public/fonts/kidify-slider-icons.woff`, `public/fonts/kidify-slider-icons.LICENSE.txt`
- `PRODUCTION_READINESS.md`, `DEPLOYMENT.md`
- `docs/security-audit.json`, `docs/frontend-migration-verification.json`

No backend, Git remote, branch, database or existing image data was changed. No push, deployment, force install or destructive Git command was used. Original manifests/configuration were snapshotted outside both repositories before this migration.

## Primary references

- [Next support policy](https://nextjs.org/support-policy)
- [Next 16 migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Swiper React modules](https://swiperjs.com/react)
- [Swiper prototype pollution advisory](https://github.com/nolimits4web/swiper/security/advisories/GHSA-hmx5-qpq5-p643)
- Remaining advisory URLs/ranges: `docs/security-audit.json`
