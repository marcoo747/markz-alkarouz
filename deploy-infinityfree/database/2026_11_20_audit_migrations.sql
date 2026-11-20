-- Markaz Alkarouz — Incremental Non-Destructive Audit Migrations (MariaDB 11.4 / phpMyAdmin)
-- Applies the 5 new schema/data integrity migrations (2026_11_20_100000 .. 2026_11_20_120000)
-- Safely preserves all existing rows, users, requests, and catalog items.

SET NAMES utf8mb4;

-- 1) 2026_11_20_100000_add_shortfall_reason_to_request_products_table
ALTER TABLE `request_products`
    ADD COLUMN IF NOT EXISTS `shortfall_reason` VARCHAR(30) NULL AFTER `unchecked_qnty`;

-- 2) 2026_11_20_110000_change_users_osra_fk_to_set_null
UPDATE `users` u
LEFT JOIN `osra` o ON u.`osra_id` = o.`osra_id`
SET u.`osra_id` = NULL
WHERE u.`osra_id` IS NOT NULL AND o.`osra_id` IS NULL;

ALTER TABLE `users`
    DROP FOREIGN KEY IF EXISTS `users_osra_id_foreign`;

ALTER TABLE `users`
    ADD CONSTRAINT `users_osra_id_foreign`
        FOREIGN KEY (`osra_id`) REFERENCES `osra` (`osra_id`)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- 3) 2026_11_20_110100_fix_schema_fks_collations_and_duplicate_index
ALTER TABLE `carousel_photos` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `main_categories` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `missings` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP INDEX IF EXISTS `osra_code_2` ON `osra`;

UPDATE `cart_products` cp
LEFT JOIN `colors` c ON cp.`color_id` = c.`color_id`
SET cp.`color_id` = NULL
WHERE cp.`color_id` IS NOT NULL AND c.`color_id` IS NULL;

UPDATE `cart_products` cp
LEFT JOIN `sizes` s ON cp.`size_id` = s.`size_id`
SET cp.`size_id` = NULL
WHERE cp.`size_id` IS NOT NULL AND s.`size_id` IS NULL;

ALTER TABLE `cart_products`
    DROP FOREIGN KEY IF EXISTS `cart_products_color_id_foreign`,
    DROP FOREIGN KEY IF EXISTS `cart_products_size_id_foreign`;

ALTER TABLE `cart_products`
    MODIFY COLUMN `color_id` BIGINT UNSIGNED NULL,
    MODIFY COLUMN `size_id` BIGINT UNSIGNED NULL;

ALTER TABLE `cart_products`
    ADD CONSTRAINT `cart_products_color_id_foreign`
        FOREIGN KEY (`color_id`) REFERENCES `colors` (`color_id`)
        ON DELETE SET NULL,
    ADD CONSTRAINT `cart_products_size_id_foreign`
        FOREIGN KEY (`size_id`) REFERENCES `sizes` (`size_id`)
        ON DELETE SET NULL;

UPDATE `request_products` rp
LEFT JOIN `colors` c ON rp.`color_id` = c.`color_id`
SET rp.`color_id` = NULL
WHERE rp.`color_id` IS NOT NULL AND c.`color_id` IS NULL;

UPDATE `request_products` rp
LEFT JOIN `sizes` s ON rp.`size_id` = s.`size_id`
SET rp.`size_id` = NULL
WHERE rp.`size_id` IS NOT NULL AND s.`size_id` IS NULL;

ALTER TABLE `request_products`
    DROP FOREIGN KEY IF EXISTS `request_products_color_id_foreign`,
    DROP FOREIGN KEY IF EXISTS `request_products_size_id_foreign`;

ALTER TABLE `request_products`
    MODIFY COLUMN `color_id` BIGINT UNSIGNED NULL,
    MODIFY COLUMN `size_id` BIGINT UNSIGNED NULL;

ALTER TABLE `request_products`
    ADD CONSTRAINT `request_products_color_id_foreign`
        FOREIGN KEY (`color_id`) REFERENCES `colors` (`color_id`)
        ON DELETE SET NULL,
    ADD CONSTRAINT `request_products_size_id_foreign`
        FOREIGN KEY (`size_id`) REFERENCES `sizes` (`size_id`)
        ON DELETE SET NULL;

UPDATE `requests` r
LEFT JOIN `osra` o ON r.`osra_code` = o.`osra_code`
SET r.`osra_code` = NULL
WHERE r.`osra_code` IS NOT NULL AND o.`osra_code` IS NULL;

ALTER TABLE `requests`
    DROP FOREIGN KEY IF EXISTS `requests_osra_code_foreign`;

ALTER TABLE `requests`
    ADD CONSTRAINT `requests_osra_code_foreign`
        FOREIGN KEY (`osra_code`) REFERENCES `osra` (`osra_code`)
        ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE `missings` m
LEFT JOIN `osra` o ON m.`osra_code` = o.`osra_code`
SET m.`osra_code` = NULL
WHERE m.`osra_code` IS NOT NULL AND o.`osra_code` IS NULL;

ALTER TABLE `missings`
    DROP FOREIGN KEY IF EXISTS `missings_osra_code_foreign`;

ALTER TABLE `missings`
    ADD CONSTRAINT `missings_osra_code_foreign`
        FOREIGN KEY (`osra_code`) REFERENCES `osra` (`osra_code`)
        ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE `terms_and_penalties` tp
LEFT JOIN `users` u1 ON tp.`created_by` = u1.`user_id`
SET tp.`created_by` = NULL
WHERE tp.`created_by` IS NOT NULL AND u1.`user_id` IS NULL;

UPDATE `terms_and_penalties` tp
LEFT JOIN `users` u2 ON tp.`updated_by` = u2.`user_id`
SET tp.`updated_by` = NULL
WHERE tp.`updated_by` IS NOT NULL AND u2.`user_id` IS NULL;

ALTER TABLE `terms_and_penalties`
    DROP FOREIGN KEY IF EXISTS `terms_and_penalties_created_by_foreign`,
    DROP FOREIGN KEY IF EXISTS `terms_and_penalties_updated_by_foreign`;

ALTER TABLE `terms_and_penalties`
    ADD CONSTRAINT `terms_and_penalties_created_by_foreign`
        FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
        ON DELETE SET NULL,
    ADD CONSTRAINT `terms_and_penalties_updated_by_foreign`
        FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`)
        ON DELETE SET NULL;

-- 4) 2026_11_20_110200_add_performance_indexes_and_unsigned_inventory
UPDATE `products`
SET `inventory_quantity` = 0
WHERE `inventory_quantity` IS NULL OR `inventory_quantity` < 0;

ALTER TABLE `products`
    MODIFY COLUMN `inventory_quantity` INT UNSIGNED NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS `requests_status_expiry_idx` ON `requests` (`request_status`, `expiry_time`);
CREATE INDEX IF NOT EXISTS `requests_status_dates_idx` ON `requests` (`request_status`, `start_date`, `end_date`);
CREATE INDEX IF NOT EXISTS `requests_osra_date_idx` ON `requests` (`osra_date`);
CREATE INDEX IF NOT EXISTS `requests_created_at_idx` ON `requests` (`created_at`);
CREATE INDEX IF NOT EXISTS `products_pr_name_idx` ON `products` (`pr_name`);
CREATE INDEX IF NOT EXISTS `products_brand_idx` ON `products` (`brand`);
CREATE UNIQUE INDEX IF NOT EXISTS `users_mobile_unique` ON `users` (`mobile`);

-- 5) 2026_11_20_120000_fix_catalog_copy_typos_and_deactivate_junk_terms
UPDATE `sub_categories`
SET `category_name` = 'Speakers'
WHERE `category_name` = 'speackers';

UPDATE `main_categories`
SET `category_description` = REPLACE(`category_description`, 'الاكترونيات', 'الإلكترونيات')
WHERE `category_description` LIKE '%الاكترونيات%';

UPDATE `products`
SET `pr_description` = REPLACE(`pr_description`, 'الابتوب', 'لابتوب')
WHERE `pr_description` LIKE '%الابتوب%';

UPDATE `products`
SET `pr_description` = REPLACE(`pr_description`, 'مكبر صةت', 'مكبر صوت')
WHERE `pr_description` LIKE '%مكبر صةت%';

UPDATE `products`
SET `pr_description` = REPLACE(`pr_description`, 'من مفس لونه', 'من نفس لونه')
WHERE `pr_description` LIKE '%من مفس لونه%';

UPDATE `terms_and_penalties`
SET `is_active` = 0
WHERE `title` IN ('2', '4') AND `content` IN ('1', '5');

-- Record applied migrations in Laravel migrations table
INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_20_100000_add_shortfall_reason_to_request_products_table', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_20_100000_add_shortfall_reason_to_request_products_table');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_20_110000_change_users_osra_fk_to_set_null', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_20_110000_change_users_osra_fk_to_set_null');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_20_110100_fix_schema_fks_collations_and_duplicate_index', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_20_110100_fix_schema_fks_collations_and_duplicate_index');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_20_110200_add_performance_indexes_and_unsigned_inventory', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_20_110200_add_performance_indexes_and_unsigned_inventory');

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_11_20_120000_fix_catalog_copy_typos_and_deactivate_junk_terms', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `migrations` WHERE `migration` = '2026_11_20_120000_fix_catalog_copy_typos_and_deactivate_junk_terms');
