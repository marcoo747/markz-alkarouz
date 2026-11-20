# Markaz Alkarouz — InfinityFree Deployment Report

## 1. Latest Deployment Status (`audit-fixes` @ `da15d70`)
- **Status:** **Code, Build Assets & Configuration Uploaded and Verified via FTP (`0` Failures; Awaiting 1-Step phpMyAdmin SQL Import)**
- **Live URL:** https://markz-alkarooz.free.je
- **Git Branch & Commit:** `audit-fixes` (`da15d70`), encompassing all 62 resolved audit issues (`AUDIT-001`..`AUDIT-062` + `MOBILE-OVERFLOW-001`, documented in `AUDIT_FIX_REPORT.md`) plus the latest UI updates:
  - Restored circular St. Mark's Church emblem logo (`879x895`) in `NavBar`, auth pages, and `?v=2` browser favicon (`imgs/icon.png?v=2`, `imgs/AlkaroozCom.png`).
  - Decluttered mobile top NavBar (`<= 1000px`): Profile link and Language Switcher moved into the hamburger drawer (`#main-navigation`), leaving Logo + Cart (when signed in) + Hamburger button in the top bar.
  - Added mobile NavBar background scroll lock (`nav-scroll-locked` on `<html>`, `touch-none` backdrop, Escape key & Inertia navigation auto-close/unlock, and scrollable menu drawer on short viewports).
  - Hardened server-side security headers (`SecurityHeaders`), `can_go_outside` visibility scope (`HasOutsideVisibility`), row-locked request lifecycle (`RequestLifecycleService`), server-computed cart/request totals, and fixed `404` fallback (`Errors/404`) + `/manifest.json` + `/sw.js` PWA icons.

## 2. Hosting Configuration
- **Account Username:** `if0_43485573`
- **Hosting Volume & Home Path:** `vol14_2` (`/home/vol14_2/infinityfree.com/if0_43485573`)
- **Web Root:** `/htdocs` (`markz-alkarooz.free.je`, Website IP `185.27.134.126`)
- **FTP Host:** `ftpupload.net:21`
- **Root `.htaccess` (`deploy-infinityfree/htdocs/.htaccess`):**
  - Blocks direct HTTP access to `.env`, `.git`, `composer.json`, `composer.lock`, `artisan`, `phpunit.xml`, `package.json`, `package-lock.json`, `vite.config.js`, and internal directories `app/`, `bootstrap/`, `config/`, `database/`, `resources/`, `routes/`, `tests/`, `vendor/`, and `storage/(app|framework|logs)/`.
  - Preserves `/.well-known/` for ACME SSL challenges and rewrites remaining requests into `public/`.
- **Storage Workaround & Hardening (`deploy-infinityfree/htdocs/config/filesystems.php` & `public/storage/.htaccess`):**
  - Staging-only `public` disk `'root'` uses `public_path('storage')` with real directories under `/htdocs/public/storage/` (no symlinks).
  - Added `/htdocs/public/storage/.htaccess` denying PHP execution (`\.(php|phtml|php[0-9]|phar)$`) inside `public/storage/`.
- **Production `.env` (Deployed to `/htdocs/.env`, Secrets Redacted):**
  - `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://markz-alkarooz.free.je`, `ASSET_URL=https://markz-alkarooz.free.je`, `APP_TIMEZONE=Africa/Cairo`, `LOG_LEVEL=error`, `DB_CONNECTION=mysql`, `DB_HOST=sql108.infinityfree.com`, `DB_PORT=3306`, `DB_DATABASE=if0_43485573_markaz_alkarouz`, `DB_USERNAME=if0_43485573`, `DB_PASSWORD=***`, `SESSION_DRIVER=database`, `SESSION_LIFETIME=120`, `SESSION_ENCRYPT=true`, `SESSION_SECURE_COOKIE=true`, `SESSION_HTTP_ONLY=true`, `SESSION_SAME_SITE=lax`, `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `MAIL_MAILER=log`.
- **Upload Footprint & InfinityFree Compliance (`deploy-infinityfree/htdocs/`):**
  - `7,510` staged files in `deploy-infinityfree/htdocs/`.
  - `0` symlinks (`public/hot` excluded and removed remotely).
  - Largest script (`.php`/`.js`/`.css`/`.html`): `vendor/composer/autoload_static.php` (`766,778` bytes `< 1 MB` limit); largest Vite JS chunk `app-CPlC9b8F.js` (`546.84 kB`).
  - Largest file overall: `public/build/assets/shopping-BMOKy8B1.webp` / `public/imgs/shopping.webp` (`1,226,081` bytes `< 10 MB` limit).

## 3. Deployment Steps & Observed FTP Verification (`task-1956`)
1. **Staging Sync & Build (`vite v7.3.8`, `10.14s`, exit `0`):**
   - Synced `41` added/modified server and static files from `audit-fixes` (`da15d70`) into `deploy-infinityfree/htdocs/`, removed `3` dead PHP files (`ProfileUpdateRequest.php`, `UpdateRequestStatus.php`, `RequestStatusUpdated.php`), created `public/storage/.htaccess`, and compiled clean Vite assets with `--base=/build/ --outDir="deploy-infinityfree/htdocs/public/build"`.
2. **FTP Upload (`ftpupload.net:21`, exit `0`):**
   - `BUILD_ASSETS_UPLOADED=59` (uploaded before `manifest.json`), `BUILD_MANIFEST_UPLOADED=1`.
   - `CORE_AND_CONFIG_UPLOADED=43` (`41` changed/added app/config/route/migration/view/static files + `public/storage/.htaccess` + updated `.env`).
   - `MEDIA_CHECKED=35` (`categories/`, `main_categories/`, `products/`, `icons/`), `MEDIA_UPLOADED=0` (all `35` media & PWA icon files already present on remote `/htdocs`).
   - `CLEANUP stale_assets=45 dead_or_hot=3 blade_views=1` (removed all `45` stale prior build hashes in `/htdocs/public/build/assets/`, removed `public/hot` or dead PHP files, cleared compiled Blade cache so `app.blade.php` recompiles immediately).
3. **Remote Verification (`failures=0`):**
   - **Exact Byte-Size Parity (`21` files):** `.env`, `.htaccess`, `bootstrap/app.php`, `routes/web.php`, `routes/console.php`, `config/app.php`, `config/session.php`, `config/filesystems.php`, `SecurityHeaders.php`, `RequestLifecycleService.php`, `HasOutsideVisibility.php`, `app.blade.php`, `public/build/manifest.json`, `public/manifest.json`, `public/sw.js`, `public/storage/.htaccess`, and all `5` `2026_11_20_*` migration files matched local sizes identically.
   - **Build Assets Set Match:** Remote `/htdocs/public/build/assets/` contains the exact `59` built asset files (`0` stale files remaining).
   - **Raster Image Re-encoding Behavior on InfinityFree:** Confirmed via FTP `RETR` that `ftpupload.net` automatically runs server-side lossless re-encoding after `STOR` on raster images (e.g., `AlkaroozCom-5NbpYdaH.png` went from `802,667` to `753,761` bytes while retaining valid `IHDR`/`IEND` chunks and exact `879x895` dimensions); verified `3/3` circular PNG emblems (`public/imgs/icon.png`, `public/imgs/AlkaroozCom.png`, `public/build/assets/AlkaroozCom-5NbpYdaH.png`) remotely with `879x895` dimensions and valid PNG signatures.

## 4. Incremental Database Migration SQL (`2026_11_20_audit_migrations.sql`)
- Generated non-destructive idempotent MariaDB `11.4` SQL script at `deploy-infinityfree/database/2026_11_20_audit_migrations.sql` (`8,142` bytes, UTF-8 without BOM) covering the `5` new `2026_11_20_*` Laravel migrations:
  1. `2026_11_20_100000_add_shortfall_reason_to_request_products_table` (`request_products.shortfall_reason VARCHAR(30) NULL`)
  2. `2026_11_20_110000_change_users_osra_fk_to_set_null` (`users_osra_id_foreign` -> `ON DELETE SET NULL ON UPDATE CASCADE`)
  3. `2026_11_20_110100_fix_schema_fks_collations_and_duplicate_index` (`utf8mb4_unicode_ci` on `carousel_photos`, `main_categories`, `missings`; drop duplicate `osra_code_2`; proper `SET NULL` FKs on `cart_products`, `request_products`, `requests`, `missings`, `terms_and_penalties`)
  4. `2026_11_20_110200_add_performance_indexes_and_unsigned_inventory` (`INT UNSIGNED` `inventory_quantity`, `6` query indexes, `users_mobile_unique`)
  5. `2026_11_20_120000_fix_catalog_copy_typos_and_deactivate_junk_terms` (`Speakers` and Arabic description typo cleanup + deactivating junk `terms_and_penalties` rows)
  6. Inserts idempotent tracking rows into `migrations` (batch `4`).
- Because InfinityFree blocks remote MySQL access from outside the hosting network, apply this SQL file manually once via **VistaPanel -> phpMyAdmin -> `if0_43485573_markaz_alkarouz` -> Import** (see `deployment-report/MANUAL_ACTIONS_REQUIRED.md`).

## 5. Previously Documented Baseline Issues Resolved in This Deployment
- `routes/web.php` fallback `Inertia::render('404')` HTTP 500 -> fixed to `Errors/404` with JSON support.
- `resources/views/app.blade.php` relative `href="manifest.json"` -> fixed to `/manifest.json` + `?v=2` circular favicon links.
- `public/sw.js` missing `/icons/icon192.png` precache -> updated to precache existing `/icons/icon512_maskable.png` and `/icons/icon512_rounded.png`.
- Missing `/storage/*` files from baseline deployment -> all `33` media files (`4` categories, `2` main categories, `27` products) verified present on `/htdocs/public/storage/`.
- `/sign_up` password visibility toggle accessibility & `PasswordChecklist` i18n -> fixed and built into Vite assets.

## 6. Verification Scope & Hosting Limitations
- **Local Pre-Deploy Tests (`audit-fixes`):** `php artisan test` passed (`59 passed, 644 assertions, 19 skipped`), and local `npm run build` exited `0`.
- **Live HTTP/Browser Check Note:** InfinityFree enforces its `?i=1` JavaScript anti-bot challenge on uncookied clients, and the previous mobile scroll-lock browser verification subagent was canceled mid-run before completion; after importing `2026_11_20_audit_migrations.sql`, perform a hard reload (`Ctrl+F5`) on `https://markz-alkarooz.free.je` directly in your browser to verify the live site.
- **InfinityFree Free Tier Scheduler Note:** InfinityFree does not provide system cron for `php artisan schedule:run` (`requests:process-delayed`); expired pending requests will remain `pending` unless `ProcessDelayedRequests` is invoked via HTTP or an authorized scheduled trigger.
