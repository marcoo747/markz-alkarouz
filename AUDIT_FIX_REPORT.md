# Markaz Alkarouz — Complete Audit Verification & Fix Report (`AUDIT_FIX_REPORT.md`)

- **Repository:** `d:\projects\xampp\htdocs\markz-alkarouz`
- **Branch:** `audit-fixes`
- **Source Audit Report:** `website-audit/WEBSITE_AUDIT_REPORT.md` (`AUDIT-001`..`AUDIT-067` + `MOBILE-OVERFLOW-001`)
- **Automated Test Suite Result:** `59 passed (644 assertions), 19 skipped` (`php artisan test` against isolated MariaDB `markaz_alkarouz_test`)
- **Frontend Production Build Result:** `vite build` exit code `0` (`npm audit`: `0 vulnerabilities`)
- **Live Browser Verification:** 3-round skeptical verification in live Chrome (`http://127.0.0.1:8000`) across Guest, User, and Manager roles, in English (`LTR`) and Arabic (`RTL`), at mobile (`375×812` / Chrome min window `502×812` + Lighthouse mobile emulation), tablet (`768×1024`), and desktop (`1366×768`).

---

## 1. Executive Summary

| Metric | Count | Details |
|---|---:|---|
| Total Issues Reviewed | **68** | `AUDIT-001`..`AUDIT-067` + `MOBILE-OVERFLOW-001` |
| Confirmed / Partial & Fixed (`FIXED`) | **63** | All 62 code/security/UX/DB/SEO/perf/cleanup issues (`AUDIT-001`..`AUDIT-062`) + `MOBILE-OVERFLOW-001` |
| Optional Roadmap Items Skipped (`SKIPPED-OPTIONAL`) | **5** | `AUDIT-063`..`AUDIT-067` (future product roadmap features) |
| False Positives (`FALSE`) | **0** | Every reported defect in `AUDIT-001`..`AUDIT-062` was reproduced or partially confirmed in code/runtime |
| Failed / Blocked (`FAILED` / `BLOCKED`) | **0** | Zero unresolved blockers |
| Atomic Git Commits on `audit-fixes` | **65** | 1 test-DB baseline commit + 62 per-issue `fix(AUDIT-XXX)` commits + 2 Re-Audit polish commits |

---

## 2. Complete Issue Matrix (`AUDIT-001` .. `AUDIT-067` + `MOBILE-OVERFLOW-001`)

| ID | Original Severity | Verdict | Status | Commit Hash | Automated Test / Verification |
|---|---|---|---|---|---|
| `AUDIT-001` | Critical | `CONFIRMED` | `FIXED` | `59a15de` | `tests/Feature/Audit/RequestAuthorizationTest.php` |
| `AUDIT-002` | Critical | `CONFIRMED` | `FIXED` | `f90d74e` | `tests/Feature/Audit/CanGoOutsideVisibilityTest.php` + Live Chrome Round 1 & 2 |
| `AUDIT-003` | Critical | `CONFIRMED` | `FIXED` | `f74e62c` | `tests/Feature/Audit/TermsAndPenaltiesAuthTest.php` |
| `AUDIT-004` | Critical | `CONFIRMED` | `FIXED` | `82fa8a4` | `tests/Feature/Audit/InventoryLifecycleTest.php` + `inventory:report-drift` |
| `AUDIT-005` | Critical | `CONFIRMED` | `FIXED` | `4871ef3` | `tests/Feature/Audit/ServerPricingTest.php` |
| `AUDIT-006` | Critical | `CONFIRMED` | `FIXED` | `a79d25f` | `tests/Feature/Audit/RequestAuthorizationTest.php` |
| `AUDIT-007` | Critical | `CONFIRMED` | `FIXED` | `067acb6` | `tests/Feature/Audit/ErrorHandlingTest.php` |
| `AUDIT-008` | Critical | `CONFIRMED` | `FIXED` | `47e7134` | `tests/Feature/Audit/NotFoundTest.php` |
| `AUDIT-009` | Critical | `CONFIRMED` | `FIXED` | `d1422aa` | `tests/Feature/Audit/CarouselUploadTest.php` |
| `AUDIT-010` | Critical | `CONFIRMED` | `FIXED` | `515f088` | `tests/Feature/Audit/SignUpFlowTest.php` |
| `AUDIT-011` | Critical | `CONFIRMED` | `FIXED` | `d715ca5` | `tests/Feature/Audit/DatabaseIntegrityTest.php` |
| `AUDIT-012` | High | `CONFIRMED` | `FIXED` | `2bac0ba` | `tests/Feature/Audit/ProductCrudTest.php` |
| `AUDIT-013` | High | `CONFIRMED` | `FIXED` | `bc52442`, `74fd724` | `tests/Feature/Audit/SecurityHeadersTest.php` + Live Chrome Round 2 |
| `AUDIT-014` | High | `CONFIRMED` | `FIXED` | `a795ede` | `npm audit` (`0 vulnerabilities`) + `composer.json` |
| `AUDIT-015` | High | `CONFIRMED` | `FIXED` | `42a4e22` | `tests/Feature/Audit/OsraAndProfileValidationTest.php` |
| `AUDIT-016` | High | `CONFIRMED` | `FIXED` | `9f7f3d2` | `tests/Feature/Audit/RoleMiddlewareTest.php` |
| `AUDIT-017` | High | `CONFIRMED` | `FIXED` | `f11b27a`, `56ec6a1` | `tests/Feature/Audit/RelationAndStorageSafetyTest.php` + Live Chrome Round 3 |
| `AUDIT-018` | High | `CONFIRMED` | `FIXED` | `36c1716` | `tests/Feature/Audit/AvailabilityAndCartVariantsTest.php` |
| `AUDIT-019` | High | `CONFIRMED` | `FIXED` | `66ab516` | `vite build` + Live Chrome Round 1 & 2 |
| `AUDIT-020` | High | `CONFIRMED` | `FIXED` | `609237a` | `vite build` + Live Chrome Round 2 & 3 (`/cart`) |
| `AUDIT-021` | High | `CONFIRMED` | `FIXED` | `9381b7e` | `vite build` + Live Chrome Round 1 & 2 |
| `AUDIT-022` | High | `CONFIRMED` | `FIXED` | `4399a0d` | `vite build` + Live Chrome Round 2 & 3 |
| `AUDIT-023` | High | `CONFIRMED` | `FIXED` | `3070ed2` | Live Chrome Round 1 & 2 (`/categories/13`, `/users`, `scrollWidth <= innerWidth`) |
| `MOBILE-OVERFLOW-001` | High | `CONFIRMED` | `FIXED` | `3070ed2` | Live Chrome Round 1 & 2 (`scrollWidth <= innerWidth` + Lighthouse `content-width` pass) |
| `AUDIT-024` | High | `CONFIRMED` | `FIXED` | `b609dec` | Live Chrome Round 2 (`/doneRequest/79`, `/missings` EN LTR & AR RTL) |
| `AUDIT-025` | High | `CONFIRMED` | `FIXED` | `54110c4` | Live Chrome Round 1 (`/search?query=ماسك` multi-column grid) |
| `AUDIT-026` | High | `CONFIRMED` | `FIXED` | `b429d84` | `tests/Feature/Audit/OsraAndProfileValidationTest.php` + `ProductCrudTest.php` |
| `AUDIT-027` | High | `CONFIRMED` | `FIXED` | `913171d` | `vite build` + `resources/js/utils/colorName.js` |
| `AUDIT-028` | High | `CONFIRMED` | `FIXED` | `f33a578` | `vite build` + Live Chrome Round 2 (`/doneRequest/79`) |
| `AUDIT-029` | High | `CONFIRMED` | `FIXED` | `a149ce8` | Live Chrome Round 1 & 2 (WCAG AA contrast + `OsraTimeBar` icon visibility) |
| `AUDIT-030` | High | `CONFIRMED` | `FIXED` | `32f451a` | Live Chrome Round 1 & 2 (`NavBar` ARIA + keyboard-reachable cards) |
| `AUDIT-031` | High | `CONFIRMED` | `FIXED` | `7e79bbf` | Live Chrome Round 1 & 2 (`44px` touch targets, modal `Escape` / `role="dialog"`) |
| `AUDIT-032` | High | `CONFIRMED` | `FIXED` | `9f23229` | Live Chrome Round 1 & 2 (`/login` & `/sign_up` RTL eye icons, `Carousel` LTR counter) |
| `AUDIT-033` | High | `CONFIRMED` | `FIXED` | `584474d` | Live Chrome Round 2 (`/register` `<NavBar>` & Back link, cart-clear warning) |
| `AUDIT-034` | High | `CONFIRMED` | `FIXED` | `19629b3` | `tests/Feature/Audit/InventoryLifecycleTest.php` (`shortfall_reason` persistence) |
| `AUDIT-035` | Medium | `CONFIRMED` | `FIXED` | `6170694` | Live Chrome Round 2 (`/doneRequest/79` inline filter pills) |
| `AUDIT-036` | Medium | `CONFIRMED` | `FIXED` | `e207f0b` | `AlkaroozCom.png` `751.66 kB -> 70.41 kB` (-90.6%), `img1.jpg` `593.89 kB -> 212.94 kB` (-64.1%) |
| `AUDIT-037` | Medium | `CONFIRMED` | `FIXED` | `609c811` | `tests/Feature/Audit/QueryEfficiencyTest.php` |
| `AUDIT-038` | Medium | `CONFIRMED` | `FIXED` | `2639d75` | `tests/Feature/Audit/SeoAndPwaTest.php` |
| `AUDIT-039` | Medium | `CONFIRMED` | `FIXED` | `0c95b17` | Live Chrome Round 1 (`LoginMessage` session dismissal, local date helper, dead hook deleted) |
| `AUDIT-040` | Medium | `CONFIRMED` | `FIXED` | `be0f00b` | Live Chrome Round 1 & 2 (`/missings` subtitle, `/sign_up` CTA, currency i18n, DB typos migration) |
| `AUDIT-041` | Medium | `CONFIRMED` | `FIXED` | `92ceba3` | Live Chrome Round 1 & 2 (equal card heights & image aspect ratios) |
| `AUDIT-042` | Medium | `CONFIRMED` | `FIXED` | `58afbd9` | Live Chrome Round 1 & 2 (`<main#main-content>`, `<footer[role="contentinfo"]>`, breadcrumbs) |
| `AUDIT-043` | Medium | `CONFIRMED` | `FIXED` | `98b434f` | `tests/Feature/Audit/SeoAndPwaTest.php` + Live Chrome Round 1 (`/sitemap.xml`) |
| `AUDIT-044` | Medium | `CONFIRMED` | `FIXED` | `8a5417c` | Live Chrome Round 1 & 2 (`htmlFor`/`id` form labels & heading hierarchy) |
| `AUDIT-045` | Medium | `CONFIRMED` | `FIXED` | `e2823a7` | `vite build` (optional file selection guards, `@inertiajs/inertia` removed) |
| `AUDIT-046` | Medium | `CONFIRMED` | `FIXED` | `46aa994` | `vite build` (`ManagersModal` DOM props, `EditUserModal` object URL cleanup) |
| `AUDIT-047` | Medium | `CONFIRMED` | `FIXED` | `8e4e472` | `tests/Feature/Audit/DatabaseIntegrityTest.php` |
| `AUDIT-048` | Medium | `CONFIRMED` | `FIXED` | `fd482bd` | `tests/Feature/Audit/DatabaseIntegrityTest.php` |
| `AUDIT-049` | Medium | `CONFIRMED` | `FIXED` | `a2c08d0` | 6 verified unreferenced dead files deleted + `routes/web.php` cleaned |
| `AUDIT-050` | Medium | `CONFIRMED` | `FIXED` | `37038cb` | `vite.config.js` (`base: process.env.VITE_BASE_URL \|\| "/build/"`) + scratch file removed |
| `AUDIT-051` | Low | `CONFIRMED` | `FIXED` | `519c941` | Live Chrome Round 1 (`/home` at `768×1024` centered `max-w-2xl` hero) |
| `AUDIT-052` | Low | `CONFIRMED` | `FIXED` | `9224379` | `tests/Feature/Audit/PaginationBoundsTest.php` (`per_page` clamped `[1, 48]`) |
| `AUDIT-053` | Low | `CONFIRMED` | `FIXED` | `c86df4b` | `tests/Feature/Audit/FileLifecycleTest.php` |
| `AUDIT-054` | Low | `CONFIRMED` | `FIXED` | `4744310` | Live Chrome Round 2 & 3 (inline modal validation, empty-cart & 403 CTAs) |
| `AUDIT-055` | Low | `CONFIRMED` | `FIXED` | `1161951` | Live Chrome Round 1 & 2 (`.site-logo` mobile width & transparent background) |
| `AUDIT-056` | Low | `CONFIRMED` | `FIXED` | `4bee6bd` | `vite build` + `en.json` / `ar.json` / `ProductPage.jsx` |
| `AUDIT-057` | Low | `CONFIRMED` | `FIXED` | `fd4c855` | `NavBar.jsx` query sync + `ProfilePage.jsx` locale-aware dates |
| `AUDIT-058` | Low | `CONFIRMED` | `FIXED` | `5044680` | `DeleteUserModal.jsx` & `UsersPage.jsx` (`userName` prop) |
| `AUDIT-059` | Low | `CONFIRMED` | `FIXED` | `db52747` | Deleted unreferenced `NotFound.module.css` & duplicate `resources/css/bootstrap.min.css` |
| `AUDIT-060` | Low | `CONFIRMED` | `FIXED` | `aa37ac1` | `tests/Feature/ExampleTest.php` (`301` redirect `/` -> `/home`) |
| `AUDIT-061` | Low | `CONFIRMED` | `FIXED` | `85d0aa4` | `config/app.php` (`'timezone' => env('APP_TIMEZONE', 'Africa/Cairo')`) |
| `AUDIT-062` | Low | `CONFIRMED` | `FIXED` | `9745aa0` | Removed unreferenced `docs/returns-feature-prompt.md` & updated `.gitignore` |
| `AUDIT-063` | Optional | `SKIPPED-OPTIONAL` | `SKIPPED` | — | Optional future feature (Real-time reservation calendar view) |
| `AUDIT-064` | Optional | `SKIPPED-OPTIONAL` | `SKIPPED` | — | Optional future feature (Automated WhatsApp/SMS notifications) |
| `AUDIT-065` | Optional | `SKIPPED-OPTIONAL` | `SKIPPED` | — | Optional future feature (QR/Barcode scanner check-in/out) |
| `AUDIT-066` | Optional | `SKIPPED-OPTIONAL` | `SKIPPED` | — | Optional future feature (Bilingual database columns for catalog names) |
| `AUDIT-067` | Optional | `SKIPPED-OPTIONAL` | `SKIPPED` | — | Optional future feature (Analytics dashboard & utilization exports) |

---

## 3. Database Backup, New Migrations & Live Drift Audit

### 3.1 Live Database Backup (Safety Rule 2)
Before any database or schema operation, a full SQL dump of `markaz_alkarouz` was created and verified:
- **Backup File:** `backups/markaz_alkarouz_20261120_100655.sql` (`108,159` bytes)
- **Test Database Isolation:** Created dedicated `markaz_alkarouz_test` database and pointed `phpunit.xml` (`DB_CONNECTION=mysql`, `DB_DATABASE=markaz_alkarouz_test`) to it so `php artisan test` never touches live data.

### 3.2 New Additive Migrations Applied (Safety Rule 3)
Each migration was previewed with `php artisan migrate --pretend --path=...` and applied individually with `--path=...` on both `markaz_alkarouz` and `markaz_alkarouz_test`:
1. `database/migrations/2026_11_20_100000_add_shortfall_reason_to_request_products_table.php` (`AUDIT-034`):
   - Added nullable `shortfall_reason` (`VARCHAR(20)`) to `request_products` to persist `missing` vs `damaged` classifications across return reconciliations.
2. `database/migrations/2026_11_20_110000_change_users_osra_fk_to_set_null.php` (`AUDIT-011`):
   - Changed `users.osra_id` foreign key (`fk_users_osra`) from `ON DELETE CASCADE` to `ON DELETE SET NULL` so deleting a family (`Osra`) never cascades into deleting its users and their historical requests.
3. `database/migrations/2026_11_20_110100_fix_schema_fks_collations_and_duplicate_index.php` (`AUDIT-047`):
   - Converted `terms_and_penalties` and `carousel_photos` to `utf8mb4_general_ci`, dropped duplicate index `osra_code` on `osra` (keeping `osra_code_unique`), and added `ON DELETE SET NULL` foreign keys on `cart_products.color_id`, `cart_products.size_id`, `request_products.color_id`, and `request_products.size_id`.
4. `database/migrations/2026_11_20_110200_add_performance_indexes_and_unsigned_inventory.php` (`AUDIT-048`):
   - Converted `products.inventory_quantity` to `INT UNSIGNED NOT NULL DEFAULT 0`, added `users_mobile_unique` on `users.mobile`, and added composite query indexes `requests_status_dates_idx`, `requests_status_expiry_idx`, `products_cat_main_idx`, and `missings_req_prod_idx`.
5. `database/migrations/2026_11_20_120000_fix_catalog_copy_typos_and_deactivate_junk_terms.php` (`AUDIT-040`):
   - Fixed catalog typos (`speackers` -> `Speakers`, `الاكترونيات` -> `الإلكترونيات`, `الابتوب` -> `لابتوب`, `مكبر صةت` -> `مكبر صوت`, `من مفس لونه` -> `من نفس لونه`) and deactivated placeholder test rows (`title IN ('2','4')`) in `terms_and_penalties`.

> **Note on 4 Legacy Pending Migrations:** Four historical migrations in `database/migrations/` (`2025_01_01_000000_create_terms_and_penalties_table.php`, `2026_03_27_122658_create_carousel_photos_table.php`, `2026_06_20_000000_add_next_osra_fields_to_osra_table.php`, `2026_06_25_225209_add_can_go_outside_to_main_categories_table.php`) correspond to tables/columns that were previously created manually in the live database without entries in the `migrations` table. Per Safety Rule 3 and Safety Rule 5, those files were left untouched and unscoped `php artisan migrate` was not run.

### 3.3 Verbatim Output of Read-Only Inventory Drift Audit (`php artisan inventory:report-drift`)
Created read-only Artisan command `app/Console/Commands/ReportInventoryDrift.php` (`AUDIT-004`). Running `php artisan inventory:report-drift` on the live `markaz_alkarouz` database produced:
```text
=== Markaz Alkarouz Inventory & Request Drift Report (Read-Only) ===
1. Products with NULL or negative inventory_quantity: 0
2. Pending requests past expiry_time: 0
3. Accepted requests updated at/after expiry_time (candidates for historical auto-accept without stock deduction): 15
   - request_id=58 user_id=10 created_at=2026-06-11 08:50:19 expiry_time=2026-06-11 09:00:19 updated_at=2026-06-11 10:15:01
   - request_id=60 user_id=10 created_at=2026-06-11 10:25:17 expiry_time=2026-06-11 10:35:17 updated_at=2026-06-12 03:54:04
   - request_id=61 user_id=10 created_at=2026-06-12 03:54:55 expiry_time=2026-06-12 04:04:55 updated_at=2026-06-12 05:24:31
   - request_id=63 user_id=10 created_at=2026-06-12 06:06:16 expiry_time=2026-06-12 06:16:16 updated_at=2026-06-18 11:25:21
   - request_id=65 user_id=10 created_at=2026-06-22 10:17:17 expiry_time=2026-06-22 10:27:17 updated_at=2026-06-22 10:42:34
   - request_id=66 user_id=10 created_at=2026-06-22 10:42:58 expiry_time=2026-06-22 10:52:58 updated_at=2026-06-22 10:54:57
   - request_id=67 user_id=10 created_at=2026-06-22 10:57:04 expiry_time=2026-06-22 11:07:04 updated_at=2026-06-22 11:46:44
   - request_id=68 user_id=10 created_at=2026-06-22 11:48:23 expiry_time=2026-06-22 11:58:23 updated_at=2026-06-22 12:12:44
   - request_id=69 user_id=10 created_at=2026-06-22 12:15:15 expiry_time=2026-06-22 12:25:15 updated_at=2026-06-22 12:26:12
   - request_id=71 user_id=10 created_at=2026-06-22 12:34:47 expiry_time=2026-06-22 12:44:47 updated_at=2026-06-23 02:34:16
   - request_id=75 user_id=16 created_at=2026-06-25 09:00:54 expiry_time=2026-06-25 09:10:54 updated_at=2026-06-25 09:20:41
   - request_id=76 user_id=16 created_at=2026-06-25 09:44:27 expiry_time=2026-06-25 09:54:27 updated_at=2026-06-25 10:02:13
   - request_id=77 user_id=18 created_at=2026-06-25 10:25:20 expiry_time=2026-06-25 10:35:20 updated_at=2026-06-25 10:53:46
   - request_id=78 user_id=10 created_at=2026-06-25 10:56:04 expiry_time=2026-06-25 11:06:04 updated_at=2026-06-26 02:49:10
   - request_id=79 user_id=10 created_at=2026-06-26 02:51:04 expiry_time=2026-06-26 03:01:04 updated_at=2026-06-26 03:38:04
4. Malformed request_products quantity/checked/unchecked rows: 0
5. Missings vs request_products unchecked_qnty discrepancies (or duplicate missing rows): 2
   - 72:23 missings_sum=8 (rows=3) vs request_products.unchecked_sum=0
   - 72:24 missings_sum=9 (rows=3) vs request_products.unchecked_sum=3
```

---

## 4. Deleted Dead Files (Safety Rule 5)

Every deleted file below was explicitly identified as dead/unreferenced in the audit report and confirmed via repository-wide search (`Select-String`) to have **0 active references** before removal:

1. `resources/js/Components/useTimeFilteredProducts.js` (`AUDIT-039`, commit `0c95b17`)
2. `app/Jobs/UpdateRequestStatus.php` (`AUDIT-049`, commit `a2c08d0`)
3. `app/Notifications/RequestStatusUpdated.php` (`AUDIT-049`, commit `a2c08d0`)
4. `app/Http/Requests/ProfileUpdateRequest.php` (`AUDIT-049`, commit `a2c08d0`)
5. `resources/js/Components/CheckoutModal.jsx` (`AUDIT-049`, commit `a2c08d0`)
6. `resources/js/Components/FloatingSettingsButton.jsx` (`AUDIT-049`, commit `a2c08d0`)
7. `resources/js/Pages/404notFound.jsx` (`AUDIT-049`, commit `a2c08d0`)
8. `New Text Document.txt` (`AUDIT-050`, untracked root scratch file removed)
9. `resources/css/NotFound.module.css` (`AUDIT-059`, commit `db52747`)
10. `resources/css/bootstrap.min.css` (`AUDIT-059`, commit `db52747` — duplicate 10,786-line file; `app.jsx` imports `bootstrap/dist/css/bootstrap.min.css` from `node_modules`)
11. `docs/returns-feature-prompt.md` (`AUDIT-062`, commit `9745aa0`)

---

## 5. Final Multi-Round Live Browser Re-Audit Summary

### Round 1 (Guest Verification & CSP Discovery)
- Verified Guest routes (`/home`, `/categories`, `/categories/13`, `/items/28`, `/search?query=ماسك`, `/login`, `/sign_up`, `/sitemap.xml`) in English `LTR` and Arabic `RTL` across desktop (`1366×768`), tablet (`768×1024`), and mobile (`502×812` + Lighthouse mobile emulation).
- Confirmed `document.documentElement.scrollWidth <= window.innerWidth` on every route and Lighthouse mobile `content-width` pass (`SEO: 100`, `Best Practices: 92`, `Accessibility: 96`).
- Confirmed `can_go_outside = 0` resources (`/main_categories/7`, `/categories/10`, `/items/23`) return **HTTP 404** (`Errors/404`, not `403` and not data) for guests, and are excluded from `/api/available-products`, `/search?query=لابتوب`, and `/sitemap.xml`.
- Discovered that a stale `public/hot` file was pointing Laravel at `http://127.0.0.1:5173/build` while `SecurityHeaders` CSP `img-src` omitted the local Vite dev origin, and `PasswordChecklist.jsx` had hardcoded English criteria. Fixed in commit `74fd724`.

### Round 2 (Full Guest + Manager Verification)
- Verified that removing `public/hot` and allowing local Vite dev origin in `SecurityHeaders` eliminated all CSP errors (`AlkaroozCom-CGeoI2Od.png` and `search-BO8K9sZF.svg` loaded with `0` CSP errors), and `PasswordChecklist` rendered Arabic criteria on `/sign_up`.
- Logged in as Manager (`01111111111`) and verified HTTP `200` access to `can_go_outside = 0` resources (`/main_categories/7`, `/categories/10`, `/items/23`) as well as `/cart`, `/profile`, `/requests`, `/doneRequest/79`, `/doneRequest/72`, `/missings`, `/users`, `/register`, and `/osras` in English `LTR` and Arabic `RTL`.
- Confirmed `/doneRequest/79` and `/missings` switch direction cleanly in English `LTR` (no hardcoded `dir="rtl"`), `/doneRequest/79` filter pills render as compact inline pills, and numeric counters (`returned / rented` and `returnQty`) are locked to `dir="ltr"`.
- Discovered 2 remaining issues on authenticated manager pages: `/cart` rendered literal `"cart.review_subtitle"` key, and `HandleInertiaRequests` shared `auth.user.user_photo` without checking `Storage::disk('public')->exists(...)`, causing a `403` on `/storage/user_photos/...` in `NavBar`. Fixed in commit `56ec6a1`.

### Round 3 (Targeted Verification of Round 2 Fixes)
- Re-verified `/cart`, `/profile`, and `/users` in live Chrome as Manager (`01111111111`):
  - `/cart` subtitle rendered `"Review your items before proceeding to checkout"` (EN) and `"راجع المنتجات المختارة قبل تأكيد الطلب"` (AR), and the mobile AR cart badge rendered cleanly at `-top-1 -end-1`.
  - `/profile` and `/users` made `0` requests to missing `/storage/user_photos/...` files, `ProfilePage` fallback avatar centered cleanly with `object-contain`, and Chrome DevTools recorded **`0` console errors, `0` uncaught JS errors, `0` HTTP 403 errors, and `0` HTTP 500 responses**.

---

## 6. Production Deployment Checklist (Safety Rule 4)

Per Safety Rule 4, `.env` secrets and local environment settings were not modified. Apply the following checklist when deploying to production:

1. **`.env` Production Variables:**
   ```dotenv
   APP_NAME="Markaz Alkarooz"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-production-domain.example
   APP_TIMEZONE=Africa/Cairo

   SESSION_DRIVER=database
   SESSION_LIFETIME=120
   SESSION_ENCRYPT=true
   SESSION_SECURE_COOKIE=true
   SESSION_HTTP_ONLY=true
   SESSION_SAME_SITE=lax
   ```
2. **PHP (`php.ini`) Hardening & Extensions:**
   - Set `expose_php = Off` in `php.ini` so PHP does not emit the `X-Powered-By` header at the SAPI layer.
   - Enable `extension=intl` and `extension=gd` in `php.ini`.
3. **Storage Symlink & Permissions:**
   - Run `php artisan storage:link` on the production host and ensure the web server denies PHP script execution inside `public/storage/`.
4. **Laravel Scheduler (Replaces Per-Request Middleware Auto-Accept):**
   - Configure a system cron job (or Windows Task Scheduler task) running every minute:
     ```cron
     * * * * * cd /path/to/markz-alkarouz && php artisan schedule:run >> /dev/null 2>&1
     ```
   - This runs `requests:process-delayed` every minute (`routes/console.php`) through `RequestLifecycleService::processExpiredPendingRequests()`, atomically deducting inventory inside a row-locked DB transaction.
5. **Build & Cache Optimization Commands:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci && npm run build
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
