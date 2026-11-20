# Manual Actions Required

All updated application files (`audit-fixes` @ `da15d70`), hardened `.env`, and newly compiled Vite production assets (`59` asset files + `manifest.json`) have been uploaded and verified via FTP on `https://markz-alkarooz.free.je`.

## 1. Required: Apply Incremental Database Migrations via phpMyAdmin (1 Step)
InfinityFree blocks external MySQL connections, so the 5 new schema/integrity migrations cannot be executed remotely from CLI. Apply them safely without losing any existing data:

1. Log into your InfinityFree Client Area / **VistaPanel** and open **phpMyAdmin** for database `if0_43485573_markaz_alkarouz`.
2. Select database `if0_43485573_markaz_alkarouz` in the left sidebar and click the **Import** tab.
3. Choose the local SQL file:
   `d:\projects\xampp\htdocs\markz-alkarouz\deploy-infinityfree\database\2026_11_20_audit_migrations.sql`
4. Keep format **SQL** and click **Go / Import**.
   - Adds `request_products.shortfall_reason`, updates foreign keys to `ON DELETE SET NULL` (including `users.osra_id`, `requests.osra_code`, `missings.osra_code`, `cart_products`, `request_products`, `terms_and_penalties`), converts `carousel_photos` / `main_categories` / `missings` to `utf8mb4_unicode_ci`, drops duplicate `osra_code_2`, adds performance indexes + `users_mobile_unique`, converts `products.inventory_quantity` to `INT UNSIGNED`, cleans catalog typos, deactivates test term rows `2`/`4`, and records all 5 migrations in `migrations`.

## 2. Verify Live Website in Your Browser
- Because InfinityFree serves a `?i=1` JS anti-bot check to cold automated HTTP clients, please open `https://markz-alkarooz.free.je/home` in your browser after completing Step 1 and press `Ctrl+F5` (hard refresh) to confirm:
  - Circular St. Mark's Church logo (`879x895`) renders in the NavBar and browser tab favicon (`imgs/icon.png?v=2`).
  - On mobile width (`<= 1000px`), the top bar shows only Logo + Cart (when signed in) + Hamburger, Profile & Language Switcher live inside the drawer, and background scrolling locks while the hamburger menu is open.

## 3. Optional / Hosting Notes
- **Scheduled Pending Request Expiration:** `routes/console.php` schedules `requests:process-delayed` every minute, which replaces the old per-request middleware mutation. Because InfinityFree Free Tier does not provide Linux CLI cron jobs, auto-expiring overdue pending requests will not run automatically every minute unless moved to a host with `php artisan schedule:run` cron support.
- **Credential Hygiene:** Remember to keep your VistaPanel/DB credentials out of git and rotate them in `https://dash.infinityfree.com/accounts/if0_43485573` (plus `/htdocs/.env`) if desired.
