 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: markaz_alkarouz
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;

--
-- Table structure for table `carousel_photos`
--

DROP TABLE IF EXISTS `carousel_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousel_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousel_photos`
--

/*!40000 ALTER TABLE `carousel_photos` DISABLE KEYS */;
INSERT INTO `carousel_photos` VALUES
(10,'carousel_photos/0wJ0EJNNhJqd7GfWDFoKj4Seh3fMtZ4g1Kib7i51.png','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(11,'carousel_photos/NDiNPC92ors3ycfGpleZMPuNoYDIqNY94nEmHPNI.jpg','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(12,'carousel_photos/nFR67z7C1AfrUF3rYxp3WSz2gRx80aq7pSZDHFha.png','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(13,'carousel_photos/6gCqSm5aFjzfXHZ7Zo47BAfAZSsWss0a90NQw7A5.png','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(14,'carousel_photos/0DPdzevi8fcU4XPpQkKjFYcYhjtZB0izhhqGl4Ri.png','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(16,'carousel_photos/Qfrez6eivmj53iT8r72HytnItJbU8AjdGHwuxz33.png','2026-05-28 01:16:05','2026-05-28 01:16:05'),
(17,'carousel_photos/jrBC9wjrhbMkZIJf1HuKPzVPl2rNR7JPsgzXK11O.png','2026-05-28 01:16:05','2026-05-28 01:16:05');
/*!40000 ALTER TABLE `carousel_photos` ENABLE KEYS */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `cart_user_id_foreign` (`user_id`),
  CONSTRAINT `cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES
(2,10,'2025-12-24 00:28:52','2025-12-24 00:28:52'),
(3,20,'2026-05-28 02:00:50','2026-05-28 02:00:50');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

--
-- Table structure for table `cart_products`
--

DROP TABLE IF EXISTS `cart_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_products` (
  `cart_product_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) unsigned DEFAULT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cart_product_id`),
  KEY `cart_products_cart_id_foreign` (`cart_id`),
  KEY `cart_products_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_products_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_products`
--

/*!40000 ALTER TABLE `cart_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_products` ENABLE KEYS */;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `colors` (
  `color_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`color_id`),
  KEY `colors_product_id_foreign` (`product_id`),
  CONSTRAINT `colors_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
INSERT INTO `failed_jobs` VALUES
(1,'ad2fccf4-f99e-4d71-968c-984d8182382a','database','default','{\"uuid\":\"ad2fccf4-f99e-4d71-968c-984d8182382a\",\"displayName\":\"App\\\\Jobs\\\\ProcessRequest\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRequest\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRequest\\\":1:{s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:02:25.216440\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781733728,\"delay\":17}','ErrorException: Undefined property: App\\Jobs\\ProcessRequest::$request in E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php:29\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#1 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php(29): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\ProcessRequest->handle()\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\ProcessRequest), false)\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\ProcessRequest))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#36 {main}','2026-06-17 19:02:26'),
(2,'1d3cb8c2-2791-482d-8acb-ba1c0c1129c1','database','default','{\"uuid\":\"1d3cb8c2-2791-482d-8acb-ba1c0c1129c1\",\"displayName\":\"App\\\\Jobs\\\\ProcessRequest\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRequest\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRequest\\\":1:{s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:05:55.614508\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781733937,\"delay\":18}','ErrorException: Undefined property: App\\Jobs\\ProcessRequest::$request in E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php:29\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#1 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php(29): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\ProcessRequest->handle()\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\ProcessRequest), false)\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\ProcessRequest))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#36 {main}','2026-06-17 19:05:57'),
(3,'c1513498-4e90-4e87-82c5-ddf416343565','database','default','{\"uuid\":\"c1513498-4e90-4e87-82c5-ddf416343565\",\"displayName\":\"App\\\\Jobs\\\\ProcessRequest\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRequest\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRequest\\\":1:{s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:12:01.314977\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781734303,\"delay\":18}','ErrorException: Undefined property: App\\Jobs\\ProcessRequest::$request in E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php:29\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#1 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php(29): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\ProcessRequest->handle()\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\ProcessRequest), false)\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\ProcessRequest))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#36 {main}','2026-06-17 19:12:02'),
(4,'a09877f2-4194-43f1-bc09-017d5d80484c','database','default','{\"uuid\":\"a09877f2-4194-43f1-bc09-017d5d80484c\",\"displayName\":\"App\\\\Jobs\\\\ProcessRequest\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRequest\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRequest\\\":1:{s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:13:22.874434\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781734384,\"delay\":18}','ErrorException: Undefined property: App\\Jobs\\ProcessRequest::$request in E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php:29\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#1 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php(29): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\ProcessRequest->handle()\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\ProcessRequest), false)\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\ProcessRequest))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#36 {main}','2026-06-17 19:13:23'),
(5,'8045c6a3-4844-4a4c-9906-37dd67504493','database','default','{\"uuid\":\"8045c6a3-4844-4a4c-9906-37dd67504493\",\"displayName\":\"App\\\\Jobs\\\\ProcessRequest\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessRequest\",\"command\":\"O:23:\\\"App\\\\Jobs\\\\ProcessRequest\\\":1:{s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:15:01.838051\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781734483,\"delay\":18}','ErrorException: Undefined property: App\\Jobs\\ProcessRequest::$request in E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php:29\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#1 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\app\\Jobs\\ProcessRequest.php(29): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined prope...\', \'E:\\\\rojeh\\\\xampp\\\\...\', 29)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Jobs\\ProcessRequest->handle()\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(App\\Jobs\\ProcessRequest), false)\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(App\\Jobs\\ProcessRequest))\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(App\\Jobs\\ProcessRequest))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#36 {main}','2026-06-17 19:15:03'),
(6,'c0608c31-3f10-4958-bbba-30f0c1769688','database','default','{\"uuid\":\"c0608c31-3f10-4958-bbba-30f0c1769688\",\"displayName\":\"Closure (RequestController.php:128)\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Queue\\\\CallQueuedClosure\",\"command\":\"O:34:\\\"Illuminate\\\\Queue\\\\CallQueuedClosure\\\":2:{s:7:\\\"closure\\\";O:47:\\\"Laravel\\\\SerializableClosure\\\\SerializableClosure\\\":1:{s:12:\\\"serializable\\\";O:46:\\\"Laravel\\\\SerializableClosure\\\\Serializers\\\\Signed\\\":2:{s:12:\\\"serializable\\\";s:507:\\\"O:46:\\\"Laravel\\\\SerializableClosure\\\\Serializers\\\\Native\\\":5:{s:3:\\\"use\\\";a:0:{}s:8:\\\"function\\\";s:287:\\\"function(){\\n                if($userRequest->request_status == \'pending\' && now()->greaterThanOrEqualTo($userRequest->expiry_time)){\\n                    $userRequest->update([\\n                        \'request_status\' => \'accepted\',\\n                    ]);\\n                }\\n            }\\\";s:5:\\\"scope\\\";s:38:\\\"App\\\\Http\\\\Controllers\\\\RequestController\\\";s:4:\\\"this\\\";N;s:4:\\\"self\\\";s:32:\\\"00000000000005e70000000000000000\\\";}\\\";s:4:\\\"hash\\\";s:44:\\\"kmNndiPJn\\/7UEPJ3Tpd6CoQBAnjjkD9cqlqf7AjDINY=\\\";}}s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2026-06-17 22:23:05.532427\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"},\"createdAt\":1781734967,\"delay\":18}','ErrorException: Undefined variable $userRequest in laravel-serializable-closure://function(){\n                if($userRequest->request_status == \'pending\' && now()->greaterThanOrEqualTo($userRequest->expiry_time)){\n                    $userRequest->update([\n                        \'request_status\' => \'accepted\',\n                    ]);\n                }\n            }:3\nStack trace:\n#0 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(258): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, \'Undefined varia...\', \'laravel-seriali...\', 3)\n#1 laravel-serializable-closure://function(){\n                if($userRequest->request_status == \'pending\' && now()->greaterThanOrEqualTo($userRequest->expiry_time)){\n                    $userRequest->update([\n                        \'request_status\' => \'accepted\',\n                    ]);\n                }\n            }(3): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, \'Undefined varia...\', \'laravel-seriali...\', 3)\n#2 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): App\\Http\\Controllers\\RequestController::{closure}(Object(Illuminate\\Queue\\CallQueuedClosure))\n#3 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#4 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(84): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#5 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Object(Closure), Object(Closure))\n#6 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Object(Closure), Array, NULL)\n#7 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedClosure.php(75): Illuminate\\Container\\Container->call(Object(Closure), Array)\n#8 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\CallQueuedClosure->handle(Object(Illuminate\\Foundation\\Application))\n#9 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#10 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#11 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#12 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#13 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(129): Illuminate\\Container\\Container->call(Array)\n#14 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Queue\\CallQueuedClosure))\n#15 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Queue\\CallQueuedClosure))\n#16 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(133): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#17 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Queue\\CallQueuedClosure), false)\n#18 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(180): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Queue\\CallQueuedClosure))\n#19 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(137): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Queue\\CallQueuedClosure))\n#20 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#21 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\CallQueuedClosure))\n#22 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#23 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(487): Illuminate\\Queue\\Jobs\\Job->fire()\n#24 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(437): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#25 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(201): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#26 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#27 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#28 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#29 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#30 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#31 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#32 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#33 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#34 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#35 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#36 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(1102): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#37 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#38 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#39 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#40 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#41 E:\\rojeh\\xampp\\htdocs\\markaz_alkarouz\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#42 {main}','2026-06-17 19:23:07');
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;

--
-- Table structure for table `main_categories`
--

DROP TABLE IF EXISTS `main_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `main_categories` (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `category_description` text DEFAULT NULL,
  `category_photo` varchar(255) DEFAULT NULL,
  `can_go_outside` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_categories`
--

/*!40000 ALTER TABLE `main_categories` DISABLE KEYS */;
INSERT INTO `main_categories` VALUES
(7,'electronics','جميع الاكترونيات مركز وسائل الايضاح','main_categories/CDDs6wyzu5fpJ8KrVWCCueyi0IXOciSiqINdedyc.jpg',0,'2026-05-28 02:07:23','2026-05-28 02:07:23'),
(8,'clothes and tools','جميع الملابس و الادوات الموجوده في مركز وسائل الايضاح','main_categories/TurA2XVuQagc0ocPkiLm3WG3ONvnmzinXo2w1Muo.jpg',1,'2026-05-28 02:09:39','2026-05-28 02:09:39');
/*!40000 ALTER TABLE `main_categories` ENABLE KEYS */;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `material_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `material_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  KEY `materials_product_id_foreign` (`product_id`),
  CONSTRAINT `materials_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000001_create_cache_table',1),
(2,'0001_01_01_000002_create_jobs_table',1),
(3,'2025_12_18_021907_create_osra_table',1),
(4,'2025_12_18_021918_create_users_table',1),
(5,'2025_12_18_021925_create_categories_table',1),
(6,'2025_12_18_021931_create_products_table',1),
(7,'2025_12_18_021937_create_brands_table',1),
(8,'2025_12_18_021942_create_colors_table',1),
(9,'2025_12_18_021947_create_materials_table',1),
(10,'2025_12_18_021953_create_sizes_table',1),
(11,'2025_12_18_021958_create_pr_photos_table',1),
(12,'2025_12_18_022003_create_cart_table',1),
(13,'2025_12_18_022008_create_cart_products_table',1),
(14,'2025_12_18_022013_create_requests_table',1),
(15,'2025_12_18_022018_create_request_products_table',1),
(16,'2025_12_25_123255_create_permission_tables',2),
(17,'2026_03_27_131925_create_terms_and_penalties_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

--
-- Table structure for table `missings`
--

DROP TABLE IF EXISTS `missings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `missings` (
  `missings_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) unsigned DEFAULT NULL,
  `osra_code` varchar(50) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `quantity` bigint(20) unsigned DEFAULT NULL,
  `comment` text DEFAULT NULL,
  PRIMARY KEY (`missings_id`),
  KEY `fk_request` (`request_id`),
  KEY `fk_user` (`user_id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_request` FOREIGN KEY (`request_id`) REFERENCES `requests` (`request_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missings`
--

/*!40000 ALTER TABLE `missings` DISABLE KEYS */;
INSERT INTO `missings` VALUES
(1,72,'1234',10,23,2,NULL),
(2,72,'1234',10,24,3,NULL),
(3,72,'1234',10,23,5,NULL),
(4,72,'1234',10,24,3,NULL),
(5,72,'1234',10,23,1,NULL),
(6,72,'1234',10,24,3,'hiiii');
/*!40000 ALTER TABLE `missings` ENABLE KEYS */;

--
-- Table structure for table `osra`
--

DROP TABLE IF EXISTS `osra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `osra` (
  `osra_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `osra_name` varchar(255) DEFAULT NULL,
  `osra_place` varchar(60) DEFAULT NULL,
  `osra_time` varchar(60) DEFAULT NULL,
  `example_date` date DEFAULT NULL,
  `example_time` time DEFAULT NULL,
  `osra_code` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`osra_id`),
  UNIQUE KEY `osra_code` (`osra_code`),
  UNIQUE KEY `osra_code_2` (`osra_code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `osra`
--

/*!40000 ALTER TABLE `osra` DISABLE KEYS */;
INSERT INTO `osra` VALUES
(4,'أبطال الإيمان','الدور الأرضي','الخميس الساعة 7','2026-03-05','19:00:00','1234','2025-12-24 21:12:35','2025-12-24 21:12:35'),
(14,'ملايكه','الخامس','يوم الجمعه الساعه 9 صباحا بعد القداس','2026-05-29',NULL,'1','2026-05-28 03:21:44','2026-05-28 03:22:21');
/*!40000 ALTER TABLE `osra` ENABLE KEYS */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;

--
-- Table structure for table `pr_photos`
--

DROP TABLE IF EXISTS `pr_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pr_photos` (
  `photo_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `pr_photos_product_id_foreign` (`product_id`),
  CONSTRAINT `pr_photos_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pr_photos`
--

/*!40000 ALTER TABLE `pr_photos` DISABLE KEYS */;
INSERT INTO `pr_photos` VALUES
(12,23,'products/swtZZFrRBcBHjYszUoE6BsUzMElnFpNPLnNJYKhQ.jpg','2026-05-28 02:22:06','2026-05-28 02:22:06'),
(13,24,'products/knIP8SB8U2wdCa5P7r10ALicHgGiBYhBIKYC4N4e.jpg','2026-05-28 02:24:49','2026-05-28 02:24:49'),
(14,25,'products/PDkVpoJRemmB9sxalwenu3qckY5OnenlZp6nNMw9.jpg','2026-05-28 02:25:02','2026-05-28 02:25:02'),
(15,26,'products/mzXEEH8anD51jitEkXDDw1v2ORVb8hZkGLtaACuM.jpg','2026-05-28 02:26:37','2026-05-28 02:26:37'),
(16,27,'products/4XKpzwnGlggYFUNi6nYW6XVUIIa9ZKiuRsyRI0EB.jpg','2026-05-28 02:28:25','2026-05-28 02:28:25'),
(17,28,'products/OO56B8SWgjHROtzgai1rFad08nzyOmSIjOKyTzUG.jpg','2026-05-28 03:01:02','2026-05-28 03:01:02'),
(18,29,'products/7h5NQLaVA7bNqgk1t537jmhPT1mpfoENTQw2j9zK.jpg','2026-05-28 03:01:47','2026-05-28 03:01:47'),
(19,30,'products/eypQvFpZdDtEqEALW7TS8t9gmD4FH5DWFDipDjqA.jpg','2026-05-28 03:02:22','2026-05-28 03:02:22'),
(21,50,'products/cJSAwCR9ffJiGU9reEWNj6rdkzs7YCskzNTOmnxc.jpg','2026-05-28 03:04:45','2026-05-28 03:04:45'),
(22,32,'products/jSt1kxuTZBHJM6TLj0EGrtvCdIUHLhZQC2UUuaIv.jpg','2026-05-28 03:05:02','2026-05-28 03:05:02'),
(23,49,'products/oJbpUHnr5S4tMVgK4xeW4tPVgHwL3Gacy8T8V77N.jpg','2026-05-28 03:05:26','2026-05-28 03:05:26'),
(24,45,'products/GUxie9HQTVOu3oJx3wA46Dl907eHnBk4LdpG29uI.jpg','2026-05-28 03:05:42','2026-05-28 03:05:42'),
(25,46,'products/HHYxKsMgMhGH4dbM9GPiAExxRFSKVsGPrwr8ykJN.jpg','2026-05-28 03:05:53','2026-05-28 03:05:53'),
(26,44,'products/iW0zs2sos16PviJS49QZd8ROmPg7ofE7ERgcKDRx.jpg','2026-05-28 03:06:14','2026-05-28 03:06:14'),
(27,43,'products/eaJroYqpxmHCp07DoWLNVGRvWHMNxl3mHjS34KCs.jpg','2026-05-28 03:06:27','2026-05-28 03:06:27'),
(28,48,'products/QaepOswxCR06rRH1dE9oiubPGntsmIz4aJRUi0hG.jpg','2026-05-28 03:06:39','2026-05-28 03:06:39'),
(29,42,'products/p490YzyVJXdd8dlSvwHAnMzLUk7pcbQKCzpvuAFY.jpg','2026-05-28 03:06:52','2026-05-28 03:06:52'),
(30,47,'products/j9xIL9HDqwQtAQ1ZAo2wcdmS2zg3hfTxFR8jUlDe.jpg','2026-05-28 03:07:05','2026-05-28 03:07:05'),
(31,33,'products/NEHRzPSDyQjGDgHO2355LC4TlIThaXOhiLcxik7y.jpg','2026-05-28 03:07:27','2026-05-28 03:07:27'),
(32,34,'products/YzKgEVFFPX4ZEUG8NhbL2yTBKJQupC4H0CoBeVMq.jpg','2026-05-28 03:07:39','2026-05-28 03:07:39'),
(33,35,'products/khO5mjQQoucZIdxPxOL3Xb2fPGXnwIczeMX5Kn53.jpg','2026-05-28 03:07:50','2026-05-28 03:07:50'),
(34,36,'products/lKLCR6r6aO01qDmKdUxYxOTlf3mpkHGDwOfi5daM.jpg','2026-05-28 03:09:07','2026-05-28 03:09:07'),
(35,37,'products/dQKKTjpjQKiS5vdLyUgTXiDmXGEWMlxKe5CPABqK.jpg','2026-05-28 03:09:24','2026-05-28 03:09:24'),
(36,38,'products/6eRM04o7YiEISdykGzw9eZaGHVMmjBW40jtB7bBX.jpg','2026-05-28 03:09:37','2026-05-28 03:09:37'),
(37,39,'products/bGFsGawTsn5dcf8aS4KnqoUu33ZDbDTjmVk77mz9.jpg','2026-05-28 03:09:48','2026-05-28 03:09:48'),
(38,40,'products/frtDlnUKYyiOTjav4s9UFlqlkkg3eckmacaSgmgt.jpg','2026-05-28 03:09:58','2026-05-28 03:09:58'),
(39,41,'products/1NntczqU66b0pFpt1RywMyHmM2GspecexqR4Y3OV.jpg','2026-05-28 03:10:11','2026-05-28 03:10:11');
/*!40000 ALTER TABLE `pr_photos` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `main_category_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) unsigned DEFAULT NULL,
  `pr_name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `pr_description` text DEFAULT NULL,
  `pr_price` decimal(10,2) DEFAULT NULL,
  `inventory_quantity` int(3) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `fk_products_main_category` (`main_category_id`),
  CONSTRAINT `fk_products_main_category` FOREIGN KEY (`main_category_id`) REFERENCES `main_categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `sub_categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(23,7,10,'لابتوب الدور الارضي','dell','الابتوب الخاص بتشغيل بروجكتور الدور الارضي',50.00,7,'2026-05-28 02:21:17','2026-06-20 14:10:55'),
(24,7,10,'لابتوب الدور التاني','dell','الابتوب الخاص بتشغيل بروجكتور الدور التاني',50.00,4,'2026-05-28 02:21:17','2026-06-20 14:10:55'),
(25,7,10,'لابتوب الدور الخامس','dell','الابتوب الخاص بتشغيل بروجكتور الدور الخامس',50.00,1,'2026-05-28 02:21:17','2026-05-28 02:24:38'),
(26,7,11,'مايكات بسلك','no brand','مايكات تعمل عن طريق السلك',6.00,20,'2026-05-28 02:26:07','2026-05-28 02:26:07'),
(27,7,12,'سماعه بلوتوث','carol','مكبر صةت يعمل عن طريق البلوتوث يسهل توصيله بالهاتف و اللاب توب',95.00,2,'2026-05-28 02:28:16','2026-05-28 02:28:16'),
(28,8,13,'النحلة الشقية','ماسك','ليه لبس اصفر فى اسود',0.00,2,'2026-05-28 02:38:57','2026-05-28 02:38:57'),
(29,8,13,'سوبر ماريو','ماسك','لي اللبس الخاص بيه',0.00,1,'2026-05-28 02:39:44','2026-05-28 05:59:20'),
(30,8,13,'ميكى ماوس','ماسك','ليه لبس سالوبت اسود و جاكيت احمر',0.00,1,'2026-05-28 02:40:31','2026-05-28 05:59:20'),
(32,8,13,'سبونج بوب','ماسك','لي اللبس الخاص بيه',0.00,1,'2026-05-28 02:42:02','2026-05-28 05:59:20'),
(33,8,13,'ماسك بابا سنفور','ماسك','ليه لبس ازرق',0.00,1,'2026-05-28 02:42:30','2026-05-28 02:42:30'),
(34,8,13,'ماسك قطة','ماسك','ليها لبس ابيض',0.00,1,'2026-05-28 02:43:00','2026-05-28 02:43:00'),
(35,8,13,'ماسك سمكة  او حوت','ماسك','ليه لبس اورنج',0.00,1,'2026-05-28 02:43:32','2026-05-28 02:43:32'),
(36,8,13,'ماسك الأرنب','ماسك','ليه لبس رمادي',1.00,2,'2026-05-28 02:43:59','2026-07-09 13:37:01'),
(37,8,13,'ماسك الاسد','ماسك','ليه لبس من نفس لونه',1.00,1,'2026-05-28 02:44:31','2026-05-28 02:44:31'),
(38,8,13,'ماسك الام','ماسك','متاح تختار اى جلابية ام من المركز',1.00,1,'2026-05-28 02:45:03','2026-05-28 02:45:03'),
(39,8,13,'ماسك البنت','ماسك','متاح تختار ليها اى لبس من المركز',1.00,1,'2026-05-28 02:45:44','2026-05-28 02:45:44'),
(40,8,13,'ماسك الولد','ماسك','متاح تختار له لبس من المركز',1.00,1,'2026-05-28 02:46:20','2026-05-28 02:46:20'),
(41,8,13,'ماسك الاب','ماسك','متاح تختار له لبس من المركز',1.00,1,'2026-05-28 02:46:51','2026-05-28 02:46:51'),
(42,8,13,'ماسك الفيل','ماسك','ليه لبس من مفس لونه',0.00,2,'2026-05-28 02:47:35','2026-05-28 02:47:35'),
(43,8,13,'ماسك جيرى','ماسك','ليه لبس من مفس لونه',0.00,1,'2026-05-28 02:48:00','2026-05-28 03:51:38'),
(44,8,13,'ماسك السيد المسيح','ماسك','ليه لبس جلابية بيضاء و وشاح احمر',0.00,1,'2026-05-28 02:48:34','2026-05-28 03:23:34'),
(45,8,13,'ماسك عمو','ماسك','متاح تختار له لبس من المركز',0.00,1,'2026-05-28 02:48:57','2026-05-28 02:48:57'),
(46,8,13,'ماسك سنفور عادى','ماسك','ليه لبس ازرق نفس لونه',0.00,1,'2026-05-28 02:49:23','2026-05-28 02:49:23'),
(47,8,13,'ماسك البقرة','ماسك','ليها لبس نفس لونها ابيض فى اسود',0.00,1,'2026-05-28 02:50:05','2026-05-28 02:50:05'),
(48,8,13,'ماسك الديناصورة','ماسك','ليه لبس من نفس لونها',0.00,3,'2026-05-28 02:50:45','2026-07-09 13:37:01'),
(49,8,13,'ماسك الحمار','ماسك','لبسه من نفس لونه',0.00,1,'2026-05-28 02:51:06','2026-05-28 02:51:06'),
(50,8,13,'ميمي ماوس','ماسك','ليها سالوبت اسود و جيبة فستان ملون',0.00,1,'2026-05-28 03:04:29','2026-05-28 03:51:38');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `request_products`
--

DROP TABLE IF EXISTS `request_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_products` (
  `request_product_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) unsigned DEFAULT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `checked_qnty` int(11) DEFAULT NULL,
  `unchecked_qnty` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  PRIMARY KEY (`request_product_id`),
  KEY `request_products_request_id_foreign` (`request_id`),
  KEY `request_products_product_id_foreign` (`product_id`),
  CONSTRAINT `request_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `request_products_request_id_foreign` FOREIGN KEY (`request_id`) REFERENCES `requests` (`request_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_products`
--

/*!40000 ALTER TABLE `request_products` DISABLE KEYS */;
INSERT INTO `request_products` VALUES
(89,58,50,NULL,NULL,1,'2026-06-17 18:27:34','2026-06-17 18:27:34',1,NULL,NULL),
(90,58,46,NULL,NULL,1,'2026-06-17 18:27:34','2026-06-17 18:27:34',1,NULL,NULL),
(91,58,45,NULL,NULL,1,'2026-06-17 18:27:34','2026-06-17 18:27:34',1,NULL,NULL),
(92,59,44,NULL,NULL,1,'2026-06-17 18:42:41','2026-06-17 18:42:41',1,NULL,NULL),
(93,61,46,NULL,NULL,1,'2026-06-17 18:43:36','2026-06-17 18:43:36',1,NULL,NULL),
(94,63,48,NULL,NULL,1,'2026-06-17 18:54:18','2026-06-17 18:54:18',1,NULL,NULL),
(96,65,49,NULL,NULL,1,'2026-06-17 19:02:07','2026-06-17 19:02:07',1,NULL,NULL),
(97,66,49,NULL,NULL,1,'2026-06-17 19:05:37','2026-06-17 19:05:37',1,NULL,NULL),
(98,67,50,NULL,NULL,1,'2026-06-17 19:11:43','2026-06-17 19:11:43',1,NULL,NULL),
(99,68,49,NULL,NULL,1,'2026-06-17 19:13:04','2026-06-17 19:13:04',1,NULL,NULL),
(100,69,50,NULL,NULL,1,'2026-06-17 19:14:43','2026-06-17 19:14:43',1,NULL,NULL),
(101,70,48,NULL,NULL,1,'2026-06-17 19:22:47','2026-06-17 19:22:47',1,NULL,NULL),
(102,71,23,NULL,NULL,1,'2026-06-18 10:16:06','2026-06-18 10:16:06',1,NULL,NULL),
(103,71,24,NULL,NULL,1,'2026-06-18 10:16:06','2026-06-18 10:16:06',1,NULL,NULL),
(104,72,23,NULL,NULL,1,'2026-06-20 12:47:18','2026-06-20 12:47:18',1,NULL,NULL),
(105,72,24,NULL,NULL,4,'2026-06-20 12:47:18','2026-06-20 12:47:18',1,3,'hiiii'),
(106,73,48,NULL,NULL,1,'2026-06-20 16:46:26','2026-06-20 16:46:26',0,1,NULL),
(107,73,36,NULL,NULL,1,'2026-06-20 16:46:26','2026-06-20 16:46:26',0,1,NULL),
(108,74,28,NULL,NULL,1,'2026-06-20 16:52:51','2026-07-09 14:25:56',1,0,'this is missing'),
(109,75,50,NULL,NULL,1,'2026-07-22 04:16:30','2026-07-22 04:16:30',0,1,NULL),
(110,76,49,NULL,NULL,1,'2026-07-22 04:38:00','2026-07-22 04:38:00',0,1,NULL),
(111,77,49,NULL,NULL,1,'2026-07-22 04:38:51','2026-07-22 04:38:51',0,1,NULL),
(112,78,48,NULL,NULL,1,'2026-07-22 04:49:51','2026-07-22 04:49:51',0,1,NULL),
(113,79,48,NULL,NULL,2,'2026-07-22 05:06:36','2026-07-22 05:06:36',0,2,NULL);
/*!40000 ALTER TABLE `request_products` ENABLE KEYS */;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `request_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `osra_code` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `osra_time` varchar(60) DEFAULT NULL,
  `osra_date` date DEFAULT NULL,
  `osra_numeric_time` time DEFAULT NULL,
  `request_status` varchar(60) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expiry_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `requests_user_id_foreign` (`user_id`),
  CONSTRAINT `requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES
(58,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 18:27:34','2026-06-20 12:49:04','2026-06-17 18:37:34'),
(59,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','rejected',0.00,'2026-06-17 18:42:41','2026-06-20 12:46:53','2026-06-17 18:45:41'),
(60,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 18:42:55','2026-06-20 12:46:53','2026-06-17 18:45:55'),
(61,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 18:43:36','2026-06-20 12:46:53','2026-06-17 18:43:54'),
(63,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 18:54:18','2026-06-20 12:46:53','2026-06-17 18:54:36'),
(65,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 19:02:07','2026-06-20 12:46:53','2026-06-17 19:02:25'),
(66,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 19:05:37','2026-06-20 12:46:53','2026-06-17 19:05:55'),
(67,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 19:11:43','2026-06-20 12:46:53','2026-06-17 19:12:01'),
(68,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 19:13:04','2026-06-20 12:46:53','2026-06-17 19:13:22'),
(69,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','accepted',0.00,'2026-06-17 19:14:43','2026-06-20 12:46:53','2026-06-17 19:15:01'),
(70,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-18','19:00:00','done',0.00,'2026-06-17 19:22:47','2026-06-18 10:14:19','2026-06-17 19:23:05'),
(71,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-25','19:00:00','accepted',100.00,'2026-06-18 10:16:06','2026-06-20 12:46:53','2026-06-18 10:16:24'),
(72,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-25','19:00:00','done',100.00,'2026-06-20 12:47:18','2026-06-20 14:10:55','2026-06-20 12:47:36'),
(73,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-25','19:00:00','rejected',1.00,'2026-06-20 16:46:26','2026-07-09 13:37:01','2026-06-20 16:56:26'),
(74,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-06-25','19:00:00','done',0.00,'2026-06-20 16:52:51','2026-07-09 14:23:38','2026-06-20 17:02:51'),
(75,10,'1234',NULL,NULL,NULL,NULL,'الخميس الساعة 7','2026-07-22','19:00:00','accepted',0.00,'2026-07-22 04:16:30','2026-07-22 04:27:40','2026-07-22 04:26:30'),
(76,10,NULL,'2026-07-23','10:26:00','2026-07-23','11:01:00',NULL,NULL,NULL,'accepted',0.00,'2026-07-22 04:38:00','2026-07-22 04:49:28','2026-07-22 04:48:00'),
(77,10,NULL,'2026-07-23','10:26:00','2026-07-23','11:01:00',NULL,NULL,NULL,'accepted',0.00,'2026-07-22 04:38:51','2026-07-22 04:49:28','2026-07-22 04:48:51'),
(78,10,NULL,'2026-07-23','10:26:00','2026-07-23','11:01:00',NULL,NULL,NULL,'accepted',0.00,'2026-07-22 04:49:51','2026-07-22 05:01:53','2026-07-22 04:59:51'),
(79,10,NULL,'2026-07-23','10:26:00','2026-07-23','11:00:00',NULL,NULL,NULL,'accepted',0.00,'2026-07-22 05:06:36','2026-07-22 05:17:05','2026-07-22 05:16:36');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `size_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`size_id`),
  KEY `sizes_product_id_foreign` (`product_id`),
  CONSTRAINT `sizes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `category_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `main_category_id` bigint(20) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_description` text DEFAULT NULL,
  `category_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `fk_main_category` (`main_category_id`),
  CONSTRAINT `fk_main_category` FOREIGN KEY (`main_category_id`) REFERENCES `main_categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES
(10,7,'laptops','اجهزه الكمبيوتر المحموله الخاصه بالكنيسه','categories/nCaSaxibxTiztFPJWOsIqKTTQUEb5PjEnrUadj24.jpg','2026-05-28 02:11:42','2026-05-28 02:11:42'),
(11,7,'mics','جميع المايكات الخاصه بالكنيسه','categories/hmJxT9kZgIuRMcM2VAxeJr08NOmEPe2JAQLS4GSG.jpg','2026-05-28 02:13:13','2026-05-28 02:13:13'),
(12,7,'speackers','سماعات و مكبرات صوت','categories/z5YSMUML6As7DSslYKmz91Z2sZ889yYpo2Wdu6is.jpg','2026-05-28 02:14:59','2026-05-28 02:14:59'),
(13,8,'ماسكات','ماسكات كامله للبس','categories/9wlepWNWZIWev1nnhpuA9lfReZRcKs7D52zWCp9K.jpg','2026-05-28 02:37:30','2026-05-28 02:37:30');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;

--
-- Table structure for table `terms_and_penalties`
--

DROP TABLE IF EXISTS `terms_and_penalties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms_and_penalties` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('terms','penalty') NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `terms_and_penalties_created_by_foreign` (`created_by`),
  KEY `terms_and_penalties_updated_by_foreign` (`updated_by`),
  CONSTRAINT `terms_and_penalties_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `terms_and_penalties_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms_and_penalties`
--

/*!40000 ALTER TABLE `terms_and_penalties` DISABLE KEYS */;
INSERT INTO `terms_and_penalties` VALUES
(2,'Booking Policy','All bookings must be made through the official platform. Direct bookings are not permitted. Cancellations must be made at least 24 hours in advance.','terms',NULL,1,10,10,'2026-03-27 11:21:54','2026-03-27 11:21:54'),
(3,'Payment Terms','All payments must be completed before service usage. Late payments may result in service suspension.','terms',NULL,1,10,10,'2026-03-27 11:21:54','2026-03-27 11:21:54'),
(4,'2','1','penalty',3.00,1,10,10,'2026-03-27 11:21:54','2026-03-27 11:30:45'),
(5,'No-Show Penalty','Failure to appear for a confirmed booking without prior notice will result in a penalty charge.','penalty',100.00,1,10,10,'2026-03-27 11:21:54','2026-03-27 11:21:54'),
(6,'Equipment Damage Fee','Any damage to church property or equipment will result in repair or replacement costs being charged to the responsible party.','penalty',NULL,1,10,10,'2026-03-27 11:21:54','2026-03-27 11:21:54'),
(7,'4','5','terms',NULL,1,10,10,'2026-03-27 11:31:00','2026-03-27 11:31:00');
/*!40000 ALTER TABLE `terms_and_penalties` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `osra_id` bigint(20) unsigned DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_osra_id_foreign` (`osra_id`),
  CONSTRAINT `users_osra_id_foreign` FOREIGN KEY (`osra_id`) REFERENCES `osra` (`osra_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(10,4,'manager','Rojeh Samy','01220017941','peposamy59@gmail.com','$2y$12$eOGIOapXV3r5QUNNanMz6OiV6rxv0EY9hb7DFDpA6nffZjJIG7vJK','profile_photos/tvqvfCAU2SDu9syrWG451mxqAtgzI1buNrKxTmzl.jpg','2025-12-24 00:26:23','2026-01-08 23:12:58'),
(19,4,'manager','try','01111111111','try@gmail.com','$2y$12$.OzflzxueezUUdyIBxonEe2n9ZDEeP5JgG0QzqQcslXSLbZw/o2CS','user_photos/JfhAspTXq5cP7qpJ7OS4BbcAnQbKfEjrEfIuNFBg.jpg','2026-03-27 11:02:39','2026-03-27 11:02:39'),
(20,4,'manager','Marco makram','01204948360','erenymkrm@gmail.com','$2y$12$28mLfO1.umaw50T4vUckGuj/s1RVdTLf/pHKcyLcCsZK7FKid11je',NULL,'2026-05-28 00:52:34','2026-05-28 00:52:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-20  1:01:46

 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: markaz_alkarouz
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_foreign` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`),
  CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-20  1:01:46
