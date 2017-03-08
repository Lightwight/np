-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               5.5.53-0ubuntu0.14.04.1 - (Ubuntu)
-- Server Betriebssystem:        debian-linux-gnu
-- HeidiSQL Version:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Struktur von Tabelle core.admin_menus
DROP TABLE IF EXISTS `admin_menus`;
CREATE TABLE IF NOT EXISTS `admin_menus` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu` varchar(50) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT '0',
  `route_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `icon` varchar(26) NOT NULL DEFAULT 'fa-caret-right',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.admin_menus: ~19 rows (ungefähr)
DELETE FROM `admin_menus`;
/*!40000 ALTER TABLE `admin_menus` DISABLE KEYS */;
INSERT INTO `admin_menus` (`ID`, `menu`, `parent`, `route_id`, `order`, `icon`) VALUES
	(1, 'Benutzerverwaltung', 0, 2, 0, 'fa-caret-down'),
	(2, 'Modelverwaltung', 0, 3, 2, 'fa-caret-right'),
	(3, 'Shopverwaltung', 0, 4, 3, 'fa-caret-down'),
	(4, 'Kategorien', 3, 58, 4, 'fa-caret-right'),
	(5, 'Benutzer', 1, 5, 0, 'fa-caret-right'),
	(6, 'Rollen', 1, 6, 1, 'fa-caret-right'),
	(7, 'Seitenverwaltung', 0, 9, 1, 'fa-caret-right'),
	(8, 'Seiten', 7, 10, 0, 'fa-caret-right'),
	(9, 'Bereiche', 7, 11, 1, 'fa-caret-right'),
	(10, 'Artikel', 3, 61, 0, 'fa-caret-right'),
	(11, 'Artikeleinheiten', 3, 66, 5, 'fa-caret-right'),
	(12, 'Hersteller', 3, 69, 2, 'fa-caret-right'),
	(13, 'Lieferanten', 3, 71, 3, 'fa-caret-right'),
	(14, 'Lagerverwaltung', 3, 73, 6, 'fa-caret-right'),
	(15, 'Steuersätze', 3, 75, 7, 'fa-caret-right'),
	(16, 'Rich Cards/Snippets', 0, 80, 4, 'fa-caret-right'),
	(17, 'Kontakt', 16, 81, 4, 'fa-caret-right'),
	(18, 'Bestellungen', 3, 94, 1, 'fa-caret-right'),
	(19, 'Sonderpreisarten', 3, 99, 8, 'fa-caret-right');
/*!40000 ALTER TABLE `admin_menus` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_attributes
DROP TABLE IF EXISTS `article_attributes`;
CREATE TABLE IF NOT EXISTS `article_attributes` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` varchar(20) NOT NULL,
  `attribute_id` varchar(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `value` varchar(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `attribute` (`article_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_attributes: ~0 rows (ungefähr)
DELETE FROM `article_attributes`;
/*!40000 ALTER TABLE `article_attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_attributes` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_categories
DROP TABLE IF EXISTS `article_categories`;
CREATE TABLE IF NOT EXISTS `article_categories` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `KeyKategorie` int(11) NOT NULL DEFAULT '0',
  `KeyOberKategorie` int(11) NOT NULL DEFAULT '0',
  `KeyName` varchar(50) NOT NULL DEFAULT '0',
  `KeyBeschreibung` varchar(50) NOT NULL DEFAULT '0',
  `Sort` int(11) NOT NULL DEFAULT '0',
  `bookmark` varchar(120) NOT NULL DEFAULT '0',
  `image` varchar(250) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_categories: ~0 rows (ungefähr)
DELETE FROM `article_categories`;
/*!40000 ALTER TABLE `article_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_categories` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_category_rel
DROP TABLE IF EXISTS `article_category_rel`;
CREATE TABLE IF NOT EXISTS `article_category_rel` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `KeyKategorieArtikel` int(11) NOT NULL DEFAULT '0',
  `KeyKategorie` int(11) NOT NULL DEFAULT '0',
  `KeyArtikel` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_category_rel: ~0 rows (ungefähr)
DELETE FROM `article_category_rel`;
/*!40000 ALTER TABLE `article_category_rel` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_category_rel` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_manufacturers
DROP TABLE IF EXISTS `article_manufacturers`;
CREATE TABLE IF NOT EXISTS `article_manufacturers` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `manufacturer_id` bigint(20) NOT NULL,
  `name` varchar(70) NOT NULL,
  `slug` varchar(70) NOT NULL,
  `country` varchar(50) NOT NULL,
  `postal` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `street_number` varchar(50) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `manufacturer_id` (`manufacturer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_manufacturers: ~0 rows (ungefähr)
DELETE FROM `article_manufacturers`;
/*!40000 ALTER TABLE `article_manufacturers` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_manufacturers` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_payments
DROP TABLE IF EXISTS `article_payments`;
CREATE TABLE IF NOT EXISTS `article_payments` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) NOT NULL,
  `gateway_id` bigint(20) NOT NULL,
  `enabled` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `article_id` (`article_id`,`gateway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_payments: ~0 rows (ungefähr)
DELETE FROM `article_payments`;
/*!40000 ALTER TABLE `article_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_payments` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_payment_gateways
DROP TABLE IF EXISTS `article_payment_gateways`;
CREATE TABLE IF NOT EXISTS `article_payment_gateways` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `gateway_id` bigint(20) NOT NULL,
  `prefix` varchar(20) NOT NULL,
  `gateway_name` varchar(120) NOT NULL,
  `checkout_name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `gateway_id` (`gateway_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_payment_gateways: ~0 rows (ungefähr)
DELETE FROM `article_payment_gateways`;
/*!40000 ALTER TABLE `article_payment_gateways` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_payment_gateways` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_prices
DROP TABLE IF EXISTS `article_prices`;
CREATE TABLE IF NOT EXISTS `article_prices` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) DEFAULT NULL,
  `price_netto` decimal(10,5) NOT NULL,
  `price_type` bigint(20) NOT NULL,
  `price_enabled` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_prices: ~0 rows (ungefähr)
DELETE FROM `article_prices`;
/*!40000 ALTER TABLE `article_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_prices` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_pricetypes
DROP TABLE IF EXISTS `article_pricetypes`;
CREATE TABLE IF NOT EXISTS `article_pricetypes` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` mediumtext NOT NULL,
  `user` bigint(20) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_pricetypes: ~2 rows (ungefähr)
DELETE FROM `article_pricetypes`;
/*!40000 ALTER TABLE `article_pricetypes` DISABLE KEYS */;
INSERT INTO `article_pricetypes` (`ID`, `name`, `description`, `user`, `deleted`) VALUES
	(1, 'Aktion', 'Alle Aktionsartikel bekommen einen &#34;Aktionspreis&#34;-Tag!', 0, 0),
	(2, 'Reduziert', 'Alle reduzierten Artikel bekommen ein &#34;Reduziert&#34;-Tag!', 0, 0);
/*!40000 ALTER TABLE `article_pricetypes` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_suppliers
DROP TABLE IF EXISTS `article_suppliers`;
CREATE TABLE IF NOT EXISTS `article_suppliers` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `postal` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `street_number` varchar(20) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `merchant_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_suppliers: ~0 rows (ungefähr)
DELETE FROM `article_suppliers`;
/*!40000 ALTER TABLE `article_suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_suppliers` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_units
DROP TABLE IF EXISTS `article_units`;
CREATE TABLE IF NOT EXISTS `article_units` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `unit_id` bigint(20) NOT NULL,
  `name` varchar(30) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unit_id` (`unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_units: ~1 rows (ungefähr)
DELETE FROM `article_units`;
/*!40000 ALTER TABLE `article_units` DISABLE KEYS */;
INSERT INTO `article_units` (`ID`, `unit_id`, `name`, `deleted`, `user`) VALUES
	(1, 1000, 'Stück', 0, 0);
/*!40000 ALTER TABLE `article_units` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_variations
DROP TABLE IF EXISTS `article_variations`;
CREATE TABLE IF NOT EXISTS `article_variations` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `KeyEigenschaft` int(11) NOT NULL,
  `KeyArtikel` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Waehlbar` varchar(2) NOT NULL,
  `Sort` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_variations: ~0 rows (ungefähr)
DELETE FROM `article_variations`;
/*!40000 ALTER TABLE `article_variations` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_variations` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_variation_value
DROP TABLE IF EXISTS `article_variation_value`;
CREATE TABLE IF NOT EXISTS `article_variation_value` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `KeyEigenschaftWert` int(11) NOT NULL DEFAULT '0',
  `KeyEigenschaft` int(11) NOT NULL DEFAULT '0',
  `Name` varchar(50) NOT NULL DEFAULT '0',
  `Aufpreis` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `Sort` int(11) NOT NULL DEFAULT '0',
  `GewichtDiff` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `Lager` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `ArtikelNr` varchar(50) NOT NULL DEFAULT '0',
  `Packeinheit` int(11) NOT NULL DEFAULT '0',
  `bookmark` varchar(120) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_variation_value: ~0 rows (ungefähr)
DELETE FROM `article_variation_value`;
/*!40000 ALTER TABLE `article_variation_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_variation_value` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.article_warehouses
DROP TABLE IF EXISTS `article_warehouses`;
CREATE TABLE IF NOT EXISTS `article_warehouses` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `warehouse_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.article_warehouses: ~1 rows (ungefähr)
DELETE FROM `article_warehouses`;
/*!40000 ALTER TABLE `article_warehouses` DISABLE KEYS */;
INSERT INTO `article_warehouses` (`ID`, `warehouse_id`, `name`, `deleted`, `user`, `last_modified`) VALUES
	(1, 1000, 'Lager 1', 0, 0, '2016-12-04 10:46:03');
/*!40000 ALTER TABLE `article_warehouses` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.auth_groups
DROP TABLE IF EXISTS `auth_groups`;
CREATE TABLE IF NOT EXISTS `auth_groups` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4001 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.auth_groups: ~4 rows (ungefähr)
DELETE FROM `auth_groups`;
/*!40000 ALTER TABLE `auth_groups` DISABLE KEYS */;
INSERT INTO `auth_groups` (`ID`, `group`) VALUES
	(1, 'Administrator'),
	(2000, 'Redakteur'),
	(3000, 'Customer'),
	(4000, 'Visitor');
/*!40000 ALTER TABLE `auth_groups` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.auth_rights
DROP TABLE IF EXISTS `auth_rights`;
CREATE TABLE IF NOT EXISTS `auth_rights` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `definition_id` int(11) NOT NULL,
  `rights` int(11) NOT NULL DEFAULT '0' COMMENT '1=lesen, 2=schreiben, 3=lesen und schreiben',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `auth_group_id` (`group_id`,`definition_id`)
) ENGINE=InnoDB AUTO_INCREMENT=890 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.auth_rights: ~790 rows (ungefähr)
DELETE FROM `auth_rights`;
/*!40000 ALTER TABLE `auth_rights` DISABLE KEYS */;
INSERT INTO `auth_rights` (`ID`, `group_id`, `definition_id`, `rights`) VALUES
	(1, 1, 1, 3),
	(2, 4000, 1, 1),
	(3, 1, 2, 3),
	(5, 4000, 2, 3),
	(6, 1, 3, 3),
	(7, 4000, 3, 3),
	(8, 1, 4, 3),
	(9, 3000, 4, 3),
	(10, 4000, 4, 1),
	(11, 1, 5, 3),
	(12, 3000, 5, 3),
	(14, 1, 6, 3),
	(15, 3000, 6, 3),
	(16, 1, 7, 3),
	(17, 3000, 7, 3),
	(18, 1, 8, 3),
	(19, 4000, 8, 1),
	(20, 1, 9, 3),
	(21, 3000, 9, 1),
	(22, 1, 10, 3),
	(23, 1, 11, 3),
	(24, 2000, 11, 3),
	(25, 4000, 11, 1),
	(26, 1, 12, 3),
	(27, 2000, 12, 3),
	(28, 4000, 12, 1),
	(29, 1, 13, 3),
	(30, 2000, 13, 3),
	(31, 4000, 13, 1),
	(32, 1, 14, 3),
	(33, 4000, 14, 1),
	(34, 1, 15, 3),
	(35, 4000, 15, 1),
	(36, 1, 16, 3),
	(37, 2000, 16, 3),
	(38, 4000, 16, 1),
	(39, 1, 17, 3),
	(40, 2000, 17, 3),
	(41, 4000, 17, 1),
	(42, 1, 18, 3),
	(43, 2000, 18, 3),
	(45, 4000, 18, 1),
	(46, 1, 19, 3),
	(47, 2000, 19, 3),
	(48, 1, 20, 3),
	(49, 2000, 20, 3),
	(50, 1, 21, 3),
	(51, 2000, 21, 3),
	(52, 1, 22, 3),
	(53, 4000, 22, 1),
	(54, 1, 23, 3),
	(55, 4000, 23, 1),
	(56, 1, 24, 3),
	(57, 2000, 24, 1),
	(58, 4000, 24, 1),
	(59, 1, 25, 3),
	(60, 2000, 25, 3),
	(61, 4000, 25, 1),
	(62, 1, 26, 3),
	(63, 2000, 26, 3),
	(64, 4000, 26, 1),
	(65, 1, 27, 3),
	(66, 2000, 27, 3),
	(67, 4000, 27, 1),
	(68, 1, 28, 3),
	(70, 4000, 28, 1),
	(71, 1, 29, 3),
	(72, 2000, 29, 3),
	(73, 4000, 29, 1),
	(74, 1, 30, 3),
	(75, 4000, 30, 1),
	(76, 1, 31, 3),
	(77, 2000, 31, 3),
	(78, 4000, 31, 1),
	(79, 1, 32, 3),
	(80, 4000, 32, 1),
	(81, 1, 33, 3),
	(82, 4000, 33, 1),
	(83, 1, 34, 3),
	(84, 4000, 34, 3),
	(85, 1, 35, 3),
	(86, 4000, 35, 3),
	(87, 1, 36, 3),
	(88, 4000, 36, 2),
	(89, 4000, 37, 1),
	(90, 4000, 38, 1),
	(91, 4000, 39, 1),
	(92, 4000, 40, 1),
	(93, 4000, 41, 1),
	(94, 4000, 42, 1),
	(95, 4000, 43, 1),
	(96, 4000, 44, 1),
	(97, 1, 46, 1),
	(99, 1, 47, 1),
	(100, 1, 48, 1),
	(101, 1, 49, 1),
	(102, 1, 50, 1),
	(103, 1, 51, 1),
	(104, 1, 52, 3),
	(105, 2000, 52, 3),
	(106, 1, 53, 3),
	(107, 2000, 53, 3),
	(108, 1, 54, 3),
	(109, 2000, 54, 3),
	(110, 1, 55, 3),
	(111, 2000, 55, 3),
	(112, 1, 56, 3),
	(113, 4000, 56, 1),
	(114, 1, 57, 3),
	(115, 4000, 57, 1),
	(116, 1, 58, 3),
	(117, 4000, 58, 1),
	(118, 1, 59, 3),
	(120, 1, 60, 3),
	(121, 1, 61, 3),
	(122, 1, 62, 3),
	(123, 1, 63, 3),
	(124, 1, 64, 3),
	(125, 1, 65, 3),
	(126, 1, 66, 3),
	(127, 2000, 66, 3),
	(128, 4000, 66, 1),
	(129, 1, 67, 3),
	(130, 2000, 67, 3),
	(131, 4000, 67, 1),
	(132, 1, 68, 3),
	(133, 2000, 68, 3),
	(134, 4000, 68, 1),
	(135, 1, 69, 3),
	(136, 2000, 69, 3),
	(138, 4000, 69, 1),
	(139, 1, 70, 3),
	(140, 2000, 70, 3),
	(141, 4000, 70, 1),
	(142, 1, 72, 3),
	(143, 2000, 72, 3),
	(144, 4000, 72, 1),
	(145, 1, 73, 3),
	(146, 4000, 73, 1),
	(148, 1, 74, 3),
	(149, 2000, 74, 3),
	(150, 4000, 74, 1),
	(151, 1, 75, 3),
	(152, 2000, 75, 3),
	(153, 4000, 75, 1),
	(155, 1, 76, 3),
	(156, 2000, 76, 3),
	(157, 4000, 76, 1),
	(158, 1, 77, 3),
	(159, 2000, 77, 3),
	(160, 4000, 77, 1),
	(161, 1, 78, 3),
	(162, 2000, 78, 3),
	(163, 4000, 78, 1),
	(164, 1, 79, 3),
	(165, 2000, 79, 3),
	(166, 4000, 79, 1),
	(170, 1, 82, 3),
	(171, 2000, 82, 3),
	(172, 4000, 82, 1),
	(173, 1, 83, 3),
	(174, 2000, 83, 3),
	(175, 4000, 83, 1),
	(176, 1, 84, 3),
	(177, 2000, 84, 3),
	(178, 4000, 84, 1),
	(179, 1, 85, 3),
	(180, 4000, 85, 1),
	(181, 1, 86, 3),
	(182, 2000, 86, 3),
	(183, 4000, 86, 1),
	(184, 1, 87, 3),
	(185, 2000, 87, 1),
	(186, 1, 88, 3),
	(187, 2000, 88, 1),
	(188, 1, 89, 3),
	(189, 2000, 89, 1),
	(190, 1, 90, 3),
	(191, 2000, 90, 3),
	(192, 4000, 90, 1),
	(193, 1, 91, 3),
	(194, 2000, 91, 3),
	(195, 4000, 91, 1),
	(197, 1, 92, 3),
	(198, 2000, 92, 3),
	(199, 4000, 92, 1),
	(200, 1, 93, 3),
	(201, 2000, 93, 3),
	(202, 4000, 93, 1),
	(203, 1, 94, 3),
	(204, 2000, 94, 3),
	(205, 4000, 94, 1),
	(206, 1, 95, 3),
	(207, 2000, 95, 3),
	(208, 4000, 95, 1),
	(209, 1, 96, 3),
	(210, 2000, 96, 3),
	(211, 4000, 96, 1),
	(212, 1, 97, 3),
	(213, 2000, 97, 3),
	(214, 4000, 97, 1),
	(215, 1, 98, 3),
	(216, 2000, 98, 3),
	(217, 4000, 98, 1),
	(218, 1, 99, 3),
	(219, 2000, 99, 3),
	(221, 4000, 99, 1),
	(222, 1, 100, 3),
	(223, 2000, 100, 3),
	(224, 4000, 100, 1),
	(225, 1, 101, 3),
	(226, 2000, 101, 3),
	(227, 4000, 101, 1),
	(228, 1, 102, 3),
	(229, 2000, 102, 3),
	(230, 4000, 102, 1),
	(231, 1, 103, 3),
	(232, 2000, 103, 3),
	(233, 4000, 103, 1),
	(234, 1, 104, 3),
	(235, 2000, 104, 3),
	(236, 4000, 104, 1),
	(240, 1, 106, 3),
	(241, 2000, 106, 3),
	(242, 4000, 106, 1),
	(243, 1, 107, 3),
	(244, 2000, 107, 3),
	(245, 4000, 107, 3),
	(246, 1, 108, 3),
	(247, 2000, 108, 3),
	(248, 4000, 108, 1),
	(249, 1, 109, 3),
	(250, 2000, 109, 3),
	(251, 4000, 109, 1),
	(252, 1, 110, 3),
	(253, 2000, 110, 3),
	(254, 4000, 110, 1),
	(255, 1, 111, 3),
	(256, 2000, 111, 3),
	(257, 4000, 111, 1),
	(258, 1, 112, 3),
	(259, 2000, 112, 3),
	(260, 4000, 112, 1),
	(261, 1, 113, 3),
	(262, 2000, 113, 3),
	(263, 4000, 113, 1),
	(264, 1, 114, 3),
	(265, 2000, 114, 3),
	(266, 4000, 114, 1),
	(267, 1, 115, 3),
	(268, 2000, 115, 3),
	(269, 4000, 115, 1),
	(270, 1, 116, 3),
	(271, 2000, 116, 3),
	(272, 4000, 116, 1),
	(273, 1, 117, 3),
	(274, 2000, 117, 3),
	(275, 4000, 117, 1),
	(276, 1, 118, 3),
	(277, 2000, 118, 3),
	(278, 4000, 118, 1),
	(279, 1, 119, 3),
	(280, 2000, 119, 3),
	(281, 4000, 119, 1),
	(282, 1, 120, 3),
	(283, 2000, 120, 3),
	(284, 4000, 120, 1),
	(285, 1, 121, 3),
	(286, 2000, 121, 3),
	(287, 4000, 121, 1),
	(288, 1, 122, 3),
	(289, 2000, 122, 3),
	(290, 4000, 122, 1),
	(291, 1, 123, 3),
	(292, 2000, 123, 3),
	(293, 4000, 123, 1),
	(294, 1, 124, 3),
	(295, 2000, 124, 3),
	(296, 4000, 124, 1),
	(297, 1, 125, 3),
	(298, 2000, 125, 3),
	(299, 4000, 125, 1),
	(300, 1, 126, 3),
	(301, 2000, 126, 3),
	(302, 4000, 126, 1),
	(303, 1, 127, 3),
	(304, 2000, 127, 3),
	(305, 4000, 127, 1),
	(306, 1, 128, 3),
	(307, 2000, 128, 3),
	(308, 4000, 128, 1),
	(309, 1, 129, 3),
	(310, 2000, 129, 3),
	(311, 4000, 129, 1),
	(312, 1, 130, 3),
	(313, 2000, 130, 3),
	(314, 4000, 130, 1),
	(315, 1, 131, 3),
	(316, 2000, 131, 3),
	(317, 4000, 131, 1),
	(318, 1, 132, 3),
	(319, 2000, 132, 3),
	(320, 4000, 132, 1),
	(321, 1, 133, 3),
	(322, 2000, 133, 3),
	(323, 4000, 133, 1),
	(324, 1, 134, 3),
	(325, 2000, 134, 3),
	(326, 4000, 134, 1),
	(327, 1, 135, 3),
	(328, 2000, 135, 3),
	(329, 4000, 135, 1),
	(330, 1, 136, 3),
	(331, 2000, 136, 3),
	(332, 4000, 136, 1),
	(333, 1, 137, 3),
	(334, 2000, 137, 3),
	(335, 4000, 137, 1),
	(336, 1, 138, 3),
	(337, 2000, 138, 3),
	(338, 4000, 138, 1),
	(339, 1, 139, 3),
	(340, 2000, 139, 3),
	(341, 4000, 139, 1),
	(342, 1, 140, 3),
	(343, 2000, 140, 3),
	(344, 4000, 140, 1),
	(345, 1, 141, 3),
	(346, 2000, 141, 3),
	(347, 4000, 141, 1),
	(348, 1, 142, 3),
	(349, 2000, 142, 3),
	(350, 4000, 142, 1),
	(351, 1, 143, 3),
	(352, 2000, 143, 3),
	(353, 4000, 143, 3),
	(354, 1, 144, 3),
	(355, 2000, 144, 3),
	(356, 4000, 144, 3),
	(357, 1, 145, 3),
	(358, 2000, 145, 1),
	(359, 4000, 145, 1),
	(360, 1, 146, 3),
	(361, 2000, 146, 1),
	(362, 4000, 146, 1),
	(363, 1, 147, 3),
	(364, 2000, 147, 3),
	(365, 4000, 147, 1),
	(366, 1, 148, 3),
	(367, 2000, 148, 3),
	(368, 4000, 148, 1),
	(369, 1, 149, 3),
	(370, 2000, 149, 3),
	(371, 4000, 149, 1),
	(372, 1, 150, 3),
	(373, 2000, 150, 3),
	(375, 4000, 150, 1),
	(376, 1, 151, 3),
	(377, 2000, 151, 3),
	(378, 4000, 151, 1),
	(379, 1, 152, 3),
	(380, 2000, 152, 3),
	(381, 4000, 152, 1),
	(382, 1, 153, 3),
	(383, 2000, 153, 3),
	(384, 4000, 153, 3),
	(385, 1, 154, 3),
	(386, 2000, 154, 3),
	(387, 4000, 154, 3),
	(388, 1, 155, 3),
	(389, 2000, 155, 3),
	(390, 4000, 155, 3),
	(391, 1, 156, 3),
	(392, 2000, 156, 3),
	(393, 4000, 156, 3),
	(394, 1, 157, 3),
	(395, 2000, 157, 3),
	(396, 4000, 157, 3),
	(397, 1, 158, 3),
	(398, 2000, 158, 3),
	(399, 4000, 158, 3),
	(400, 1, 159, 3),
	(401, 2000, 159, 3),
	(402, 4000, 159, 3),
	(403, 1, 160, 3),
	(404, 2000, 160, 1),
	(405, 4000, 160, 2),
	(406, 1, 161, 3),
	(407, 2000, 161, 1),
	(408, 4000, 161, 2),
	(409, 1, 162, 3),
	(410, 2000, 162, 3),
	(411, 3000, 162, 3),
	(412, 1, 163, 3),
	(413, 2000, 163, 3),
	(414, 3000, 163, 3),
	(415, 1, 164, 3),
	(416, 2000, 164, 3),
	(417, 3000, 164, 3),
	(418, 1, 166, 3),
	(419, 2000, 166, 3),
	(420, 3000, 166, 3),
	(421, 1, 167, 3),
	(422, 2000, 167, 3),
	(423, 3000, 167, 3),
	(424, 1, 168, 3),
	(425, 2000, 168, 3),
	(426, 4000, 168, 3),
	(427, 1, 169, 3),
	(428, 2000, 169, 3),
	(429, 4000, 169, 3),
	(430, 1, 170, 3),
	(431, 2000, 170, 3),
	(432, 4000, 170, 3),
	(433, 1, 171, 3),
	(434, 2000, 171, 3),
	(435, 4000, 171, 3),
	(436, 1, 172, 3),
	(437, 2000, 172, 3),
	(438, 4000, 172, 3),
	(439, 1, 173, 3),
	(440, 2000, 173, 3),
	(441, 4000, 173, 3),
	(442, 1, 174, 3),
	(443, 2000, 174, 3),
	(444, 4000, 174, 3),
	(445, 1, 175, 3),
	(446, 2000, 175, 3),
	(447, 4000, 175, 3),
	(448, 1, 176, 3),
	(449, 2000, 176, 3),
	(450, 4000, 176, 3),
	(451, 1, 177, 3),
	(452, 2000, 177, 3),
	(453, 4000, 177, 3),
	(454, 1, 178, 3),
	(455, 2000, 178, 3),
	(456, 4000, 178, 3),
	(457, 1, 179, 3),
	(458, 2000, 179, 3),
	(459, 4000, 179, 3),
	(460, 1, 180, 3),
	(461, 2000, 180, 3),
	(462, 4000, 180, 3),
	(463, 1, 181, 3),
	(464, 2000, 181, 3),
	(465, 4000, 181, 3),
	(466, 1, 182, 3),
	(467, 2000, 182, 3),
	(468, 4000, 182, 3),
	(469, 1, 183, 3),
	(470, 2000, 183, 3),
	(471, 4000, 183, 3),
	(472, 1, 184, 3),
	(473, 2000, 184, 3),
	(474, 4000, 184, 3),
	(475, 1, 185, 3),
	(476, 2000, 185, 3),
	(477, 4000, 185, 3),
	(478, 1, 186, 3),
	(479, 2000, 186, 3),
	(480, 4000, 186, 3),
	(481, 1, 187, 3),
	(482, 2000, 187, 3),
	(483, 4000, 187, 3),
	(484, 1, 188, 3),
	(485, 2000, 188, 3),
	(486, 4000, 188, 3),
	(487, 1, 189, 3),
	(488, 2000, 189, 3),
	(489, 4000, 189, 3),
	(490, 1, 190, 3),
	(491, 2000, 190, 3),
	(492, 4000, 190, 3),
	(493, 1, 191, 3),
	(494, 2000, 191, 3),
	(495, 4000, 191, 3),
	(496, 1, 192, 3),
	(497, 2000, 192, 3),
	(498, 4000, 192, 3),
	(499, 1, 193, 3),
	(500, 2000, 193, 3),
	(501, 4000, 193, 2),
	(502, 1, 194, 3),
	(503, 2000, 194, 3),
	(504, 4000, 194, 3),
	(505, 1, 195, 3),
	(506, 2000, 195, 3),
	(507, 4000, 195, 3),
	(508, 1, 196, 3),
	(509, 2000, 196, 3),
	(510, 4000, 196, 3),
	(511, 1, 197, 3),
	(512, 2000, 197, 3),
	(513, 4000, 197, 3),
	(514, 1, 198, 3),
	(515, 2000, 198, 3),
	(516, 4000, 198, 3),
	(517, 1, 199, 3),
	(518, 2000, 199, 3),
	(519, 3000, 199, 3),
	(520, 1, 200, 3),
	(521, 2000, 200, 3),
	(522, 3000, 200, 3),
	(523, 1, 201, 3),
	(524, 2000, 201, 3),
	(525, 3000, 201, 3),
	(526, 1, 202, 3),
	(527, 2000, 202, 3),
	(528, 3000, 202, 3),
	(529, 1, 203, 3),
	(530, 2000, 203, 3),
	(531, 3000, 203, 3),
	(532, 1, 204, 3),
	(533, 2000, 204, 3),
	(534, 3000, 204, 3),
	(535, 1, 205, 3),
	(536, 2000, 205, 3),
	(537, 3000, 205, 3),
	(539, 1, 206, 3),
	(540, 2000, 206, 3),
	(541, 3000, 206, 3),
	(542, 1, 207, 3),
	(543, 2000, 207, 3),
	(544, 3000, 207, 3),
	(545, 1, 208, 3),
	(546, 2000, 208, 3),
	(547, 3000, 208, 3),
	(548, 1, 209, 3),
	(549, 2000, 209, 3),
	(550, 4000, 209, 1),
	(551, 1, 210, 3),
	(552, 2000, 210, 3),
	(553, 4000, 210, 1),
	(554, 1, 211, 3),
	(555, 2000, 211, 3),
	(556, 4000, 211, 1),
	(557, 1, 212, 3),
	(558, 2000, 212, 3),
	(559, 4000, 212, 1),
	(560, 1, 213, 3),
	(561, 2000, 213, 3),
	(562, 4000, 213, 1),
	(563, 1, 214, 3),
	(564, 2000, 214, 1),
	(565, 4000, 214, 1),
	(566, 1, 215, 3),
	(567, 2000, 215, 3),
	(568, 4000, 215, 1),
	(569, 1, 216, 3),
	(570, 2000, 216, 3),
	(571, 4000, 216, 1),
	(572, 1, 217, 3),
	(573, 2000, 217, 3),
	(574, 4000, 217, 1),
	(575, 1, 0, 0),
	(576, 1, 218, 3),
	(577, 2000, 218, 3),
	(578, 4000, 218, 1),
	(579, 1, 219, 3),
	(580, 2000, 219, 3),
	(581, 4000, 219, 1),
	(582, 1, 220, 3),
	(583, 2000, 220, 3),
	(584, 4000, 220, 1),
	(586, 1, 221, 3),
	(587, 2000, 221, 3),
	(588, 4000, 221, 1),
	(589, 1, 222, 3),
	(591, 2000, 222, 3),
	(592, 4000, 222, 1),
	(593, 1, 223, 3),
	(594, 2000, 223, 3),
	(595, 4000, 223, 1),
	(596, 1, 224, 3),
	(597, 2000, 224, 3),
	(598, 4000, 224, 1),
	(599, 1, 225, 3),
	(600, 2000, 225, 3),
	(601, 4000, 225, 1),
	(602, 1, 226, 3),
	(603, 2000, 226, 3),
	(604, 4000, 226, 1),
	(605, 1, 227, 3),
	(606, 2000, 227, 3),
	(607, 4000, 227, 1),
	(608, 1, 228, 3),
	(609, 2000, 228, 3),
	(610, 4000, 228, 1),
	(611, 1, 229, 3),
	(612, 2000, 229, 3),
	(613, 4000, 229, 1),
	(614, 1, 230, 3),
	(615, 2000, 230, 3),
	(616, 4000, 230, 1),
	(617, 1, 231, 3),
	(618, 2000, 231, 3),
	(619, 4000, 231, 1),
	(620, 1, 232, 3),
	(621, 2000, 232, 3),
	(622, 4000, 232, 1),
	(623, 1, 233, 3),
	(624, 2000, 233, 3),
	(625, 4000, 233, 1),
	(626, 1, 234, 3),
	(627, 2000, 234, 3),
	(628, 4000, 234, 1),
	(629, 1, 235, 3),
	(630, 2000, 235, 3),
	(631, 4000, 235, 1),
	(632, 1, 236, 3),
	(633, 2000, 236, 3),
	(634, 4000, 236, 1),
	(635, 1, 237, 3),
	(636, 2000, 237, 3),
	(637, 4000, 237, 1),
	(638, 1, 238, 3),
	(639, 2000, 238, 3),
	(640, 1, 239, 3),
	(641, 2000, 239, 3),
	(642, 4000, 239, 1),
	(643, 1, 240, 3),
	(644, 2000, 240, 3),
	(645, 4000, 240, 1),
	(646, 1, 241, 3),
	(647, 2000, 241, 3),
	(648, 4000, 241, 1),
	(649, 1, 242, 3),
	(650, 2000, 242, 3),
	(651, 1, 243, 3),
	(652, 2000, 243, 3),
	(653, 4000, 243, 1),
	(654, 1, 244, 3),
	(655, 2000, 244, 3),
	(656, 4000, 244, 1),
	(657, 1, 245, 3),
	(658, 2000, 245, 3),
	(659, 4000, 245, 1),
	(660, 1, 246, 3),
	(661, 2000, 246, 3),
	(662, 4000, 246, 1),
	(663, 1, 247, 3),
	(664, 2000, 247, 3),
	(665, 4000, 247, 1),
	(666, 1, 248, 3),
	(667, 2000, 248, 3),
	(668, 4000, 248, 1),
	(669, 1, 250, 3),
	(670, 2000, 250, 3),
	(671, 4000, 250, 1),
	(672, 1, 251, 3),
	(673, 2000, 251, 3),
	(675, 1, 252, 3),
	(677, 2000, 252, 3),
	(679, 1, 253, 3),
	(682, 2000, 253, 3),
	(683, 1, 254, 3),
	(684, 2000, 254, 3),
	(685, 1, 255, 3),
	(686, 2000, 255, 3),
	(687, 1, 256, 3),
	(688, 2000, 256, 3),
	(689, 4000, 256, 1),
	(690, 1, 257, 3),
	(691, 2000, 257, 3),
	(692, 4000, 257, 1),
	(694, 1, 259, 3),
	(695, 2000, 259, 3),
	(696, 4000, 259, 1),
	(698, 1, 260, 3),
	(699, 2000, 260, 3),
	(700, 1, 258, 3),
	(701, 2000, 258, 3),
	(702, 4000, 258, 1),
	(703, 1, 261, 3),
	(704, 2000, 261, 3),
	(705, 4000, 261, 1),
	(706, 4000, 6, 1),
	(707, 1, 262, 3),
	(708, 2000, 262, 3),
	(709, 4000, 262, 3),
	(710, 1, 263, 3),
	(711, 2000, 263, 3),
	(712, 4000, 263, 3),
	(713, 1, 264, 3),
	(714, 2000, 264, 3),
	(715, 4000, 264, 3),
	(716, 1, 265, 3),
	(717, 2000, 265, 3),
	(718, 4000, 265, 3),
	(719, 1, 266, 3),
	(720, 2000, 266, 3),
	(721, 4000, 266, 3),
	(722, 1, 267, 3),
	(723, 2000, 267, 3),
	(724, 4000, 267, 3),
	(725, 1, 268, 3),
	(726, 2000, 268, 3),
	(727, 3000, 268, 1),
	(728, 1, 269, 3),
	(730, 2000, 269, 3),
	(731, 4000, 269, 3),
	(732, 1, 270, 3),
	(733, 2000, 270, 3),
	(734, 3000, 270, 3),
	(735, 1, 271, 3),
	(736, 2000, 271, 3),
	(737, 3000, 271, 3),
	(738, 4000, 271, 3),
	(739, 4000, 270, 3),
	(740, 1, 272, 3),
	(741, 2000, 272, 3),
	(742, 3000, 272, 3),
	(743, 4000, 272, 3),
	(744, 1, 273, 3),
	(745, 2000, 273, 3),
	(746, 4000, 273, 1),
	(747, 1, 274, 3),
	(748, 2000, 274, 3),
	(749, 4000, 274, 1),
	(750, 1, 275, 3),
	(751, 2000, 275, 3),
	(752, 4000, 275, 1),
	(753, 1, 276, 3),
	(754, 2000, 276, 3),
	(755, 4000, 276, 1),
	(756, 1, 277, 3),
	(757, 2000, 277, 3),
	(758, 4000, 277, 1),
	(759, 1, 278, 3),
	(760, 2000, 278, 3),
	(761, 4000, 278, 1),
	(762, 1, 279, 3),
	(763, 2000, 279, 3),
	(764, 4000, 279, 1),
	(765, 1, 280, 3),
	(766, 2000, 280, 3),
	(767, 4000, 280, 1),
	(768, 1, 281, 3),
	(769, 2000, 281, 3),
	(770, 4000, 281, 1),
	(771, 1, 282, 3),
	(772, 2000, 282, 3),
	(773, 3000, 282, 1),
	(774, 4000, 282, 1),
	(775, 1, 283, 3),
	(776, 2000, 283, 3),
	(777, 3000, 283, 3),
	(778, 4000, 283, 3),
	(779, 1, 285, 3),
	(780, 2000, 285, 3),
	(781, 3000, 285, 3),
	(782, 4000, 285, 3),
	(783, 1, 286, 3),
	(784, 2000, 286, 3),
	(785, 3000, 286, 3),
	(786, 4000, 286, 3),
	(787, 1, 287, 3),
	(788, 2000, 287, 3),
	(789, 3000, 287, 3),
	(790, 4000, 287, 3),
	(791, 1, 288, 3),
	(792, 2000, 288, 3),
	(793, 3000, 288, 3),
	(794, 4000, 288, 3),
	(795, 1, 289, 3),
	(796, 2000, 289, 3),
	(797, 3000, 289, 3),
	(798, 4000, 289, 3),
	(799, 1, 290, 3),
	(800, 2000, 290, 3),
	(801, 3000, 290, 3),
	(802, 4000, 290, 3),
	(803, 1, 291, 3),
	(804, 2000, 291, 3),
	(805, 3000, 291, 3),
	(806, 4000, 291, 3),
	(807, 1, 292, 3),
	(808, 2000, 292, 3),
	(809, 4000, 292, 1),
	(810, 1, 293, 3),
	(811, 2000, 293, 3),
	(812, 1, 294, 3),
	(813, 2000, 294, 3),
	(814, 1, 295, 3),
	(815, 2000, 295, 3),
	(816, 1, 296, 3),
	(817, 2000, 296, 3),
	(818, 4000, 296, 3),
	(819, 1, 297, 3),
	(820, 2000, 297, 3),
	(821, 4000, 297, 1),
	(822, 1, 298, 3),
	(823, 2000, 298, 3),
	(824, 4000, 298, 1),
	(825, 1, 299, 3),
	(826, 2000, 299, 3),
	(827, 4000, 299, 1),
	(828, 1, 300, 3),
	(829, 2000, 300, 3),
	(830, 4000, 300, 1),
	(831, 1, 301, 3),
	(832, 2000, 301, 3),
	(833, 4000, 301, 1),
	(834, 1, 302, 3),
	(835, 2000, 302, 3),
	(836, 4000, 302, 1),
	(837, 1, 303, 3),
	(839, 2000, 303, 3),
	(840, 4000, 303, 1),
	(841, 1, 304, 3),
	(842, 2000, 304, 3),
	(843, 4000, 304, 1),
	(844, 1, 305, 3),
	(845, 2000, 305, 3),
	(846, 4000, 305, 1),
	(847, 1, 307, 3),
	(848, 2000, 307, 3),
	(849, 4000, 307, 1),
	(850, 1, 308, 3),
	(851, 2000, 308, 3),
	(852, 4000, 308, 1),
	(853, 1, 309, 3),
	(854, 2000, 309, 3),
	(855, 4000, 309, 3),
	(856, 1, 310, 3),
	(857, 2000, 310, 3),
	(858, 4000, 310, 3),
	(859, 1, 311, 3),
	(860, 2000, 311, 3),
	(861, 4000, 311, 3),
	(862, 1, 312, 3),
	(863, 2000, 312, 3),
	(864, 4000, 312, 1),
	(865, 1, 313, 3),
	(866, 2000, 313, 3),
	(867, 4000, 313, 1),
	(868, 1, 314, 3),
	(869, 2000, 314, 3),
	(870, 4000, 314, 1),
	(871, 1, 315, 3),
	(872, 2000, 315, 3),
	(873, 4000, 315, 1),
	(874, 1, 316, 3),
	(875, 2000, 316, 3),
	(876, 4000, 316, 1),
	(877, 1, 317, 3),
	(878, 3000, 317, 3),
	(881, 4000, 317, 1),
	(882, 1, 318, 3),
	(883, 2000, 318, 3),
	(884, 4000, 318, 1),
	(885, 1, 319, 3),
	(886, 2000, 319, 3),
	(887, 4000, 319, 1),
	(888, 1, 320, 3),
	(889, 4000, 320, 1);
/*!40000 ALTER TABLE `auth_rights` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.checkout_billings
DROP TABLE IF EXISTS `checkout_billings`;
CREATE TABLE IF NOT EXISTS `checkout_billings` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `country` varchar(128) NOT NULL,
  `street` varchar(128) NOT NULL,
  `postal` varchar(16) NOT NULL,
  `city` varchar(128) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.checkout_billings: ~0 rows (ungefähr)
DELETE FROM `checkout_billings`;
/*!40000 ALTER TABLE `checkout_billings` DISABLE KEYS */;
/*!40000 ALTER TABLE `checkout_billings` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.checkout_shippings
DROP TABLE IF EXISTS `checkout_shippings`;
CREATE TABLE IF NOT EXISTS `checkout_shippings` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `gender` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `prename` varchar(50) DEFAULT NULL,
  `country` varchar(128) NOT NULL,
  `street` varchar(128) NOT NULL,
  `postal` varchar(16) NOT NULL,
  `city` varchar(128) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.checkout_shippings: ~0 rows (ungefähr)
DELETE FROM `checkout_shippings`;
/*!40000 ALTER TABLE `checkout_shippings` DISABLE KEYS */;
/*!40000 ALTER TABLE `checkout_shippings` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.cookies
DROP TABLE IF EXISTS `cookies`;
CREATE TABLE IF NOT EXISTS `cookies` (
  `cookie_id` varchar(32) NOT NULL,
  `cookie_name` varchar(50) NOT NULL,
  `cookie_data` blob NOT NULL,
  `cookie_expires` int(11) NOT NULL,
  PRIMARY KEY (`cookie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.cookies: ~0 rows (ungefähr)
DELETE FROM `cookies`;
/*!40000 ALTER TABLE `cookies` DISABLE KEYS */;
/*!40000 ALTER TABLE `cookies` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.countries
DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `code` char(2) CHARACTER SET utf8 NOT NULL,
  `en` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `de` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `code` (`code`),
  KEY `de` (`de`),
  KEY `en` (`en`)
) ENGINE=MyISAM AUTO_INCREMENT=244 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Exportiere Daten aus Tabelle core.countries: 243 rows
DELETE FROM `countries`;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` (`ID`, `code`, `en`, `de`) VALUES
	(1, 'AD', 'Andorra', 'Andorra'),
	(2, 'AE', 'United Arab Emirates', 'Vereinigte Arabische Emirate'),
	(3, 'AF', 'Afghanistan', 'Afghanistan'),
	(4, 'AG', 'Antigua and Barbuda', 'Antigua und Barbuda'),
	(5, 'AI', 'Anguilla', 'Anguilla'),
	(6, 'AL', 'Albania', 'Albanien'),
	(7, 'AM', 'Armenia', 'Armenien'),
	(8, 'AN', 'Netherlands Antilles', 'Niederländische Antillen'),
	(9, 'AO', 'Angola', 'Angola'),
	(10, 'AQ', 'Antarctica', 'Antarktis'),
	(11, 'AR', 'Argentina', 'Argentinien'),
	(12, 'AS', 'American Samoa', 'Amerikanisch-Samoa'),
	(13, 'AT', 'Austria', 'Österreich'),
	(14, 'AU', 'Australia', 'Australien'),
	(15, 'AW', 'Aruba', 'Aruba'),
	(16, 'AX', 'Aland Islands', 'Åland'),
	(17, 'AZ', 'Azerbaijan', 'Aserbaidschan'),
	(18, 'BA', 'Bosnia and Herzegovina', 'Bosnien und Herzegowina'),
	(19, 'BB', 'Barbados', 'Barbados'),
	(20, 'BD', 'Bangladesh', 'Bangladesch'),
	(21, 'BE', 'Belgium', 'Belgien'),
	(22, 'BF', 'Burkina Faso', 'Burkina Faso'),
	(23, 'BG', 'Bulgaria', 'Bulgarien'),
	(24, 'BH', 'Bahrain', 'Bahrain'),
	(25, 'BI', 'Burundi', 'Burundi'),
	(26, 'BJ', 'Benin', 'Benin'),
	(27, 'BM', 'Bermuda', 'Bermuda'),
	(28, 'BN', 'Brunei', 'Brunei Darussalam'),
	(29, 'BO', 'Bolivia', 'Bolivien'),
	(30, 'BR', 'Brazil', 'Brasilien'),
	(31, 'BS', 'Bahamas', 'Bahamas'),
	(32, 'BT', 'Bhutan', 'Bhutan'),
	(33, 'BV', 'Bouvet Island', 'Bouvetinsel'),
	(34, 'BW', 'Botswana', 'Botswana'),
	(35, 'BY', 'Belarus', 'Belarus (Weißrussland)'),
	(36, 'BZ', 'Belize', 'Belize'),
	(37, 'CA', 'Canada', 'Kanada'),
	(38, 'CC', 'Cocos (Keeling) Islands', 'Kokosinseln (Keelinginseln)'),
	(39, 'CD', 'Congo (Kinshasa)', 'Kongo'),
	(40, 'CF', 'Central African Republic', 'Zentralafrikanische Republik'),
	(41, 'CG', 'Congo (Brazzaville)', 'Republik Kongo'),
	(42, 'CH', 'Switzerland', 'Schweiz'),
	(43, 'CI', 'Ivory Coast', 'Elfenbeinküste'),
	(44, 'CK', 'Cook Islands', 'Cookinseln'),
	(45, 'CL', 'Chile', 'Chile'),
	(46, 'CM', 'Cameroon', 'Kamerun'),
	(47, 'CN', 'China', 'China, Volksrepublik'),
	(48, 'CO', 'Colombia', 'Kolumbien'),
	(49, 'CR', 'Costa Rica', 'Costa Rica'),
	(50, 'CS', 'Serbia And Montenegro', 'Serbien und Montenegro'),
	(51, 'CU', 'Cuba', 'Kuba'),
	(52, 'CV', 'Cape Verde', 'Kap Verde'),
	(53, 'CX', 'Christmas Island', 'Weihnachtsinsel'),
	(54, 'CY', 'Cyprus', 'Zypern'),
	(55, 'CZ', 'Czech Republic', 'Tschechische Republik'),
	(56, 'DE', 'Germany', 'Deutschland'),
	(57, 'DJ', 'Djibouti', 'Dschibuti'),
	(58, 'DK', 'Denmark', 'Dänemark'),
	(59, 'DM', 'Dominica', 'Dominica'),
	(60, 'DO', 'Dominican Republic', 'Dominikanische Republik'),
	(61, 'DZ', 'Algeria', 'Algerien'),
	(62, 'EC', 'Ecuador', 'Ecuador'),
	(63, 'EE', 'Estonia', 'Estland (Reval)'),
	(64, 'EG', 'Egypt', 'Ägypten'),
	(65, 'EH', 'Western Sahara', 'Westsahara'),
	(66, 'ER', 'Eritrea', 'Eritrea'),
	(67, 'ES', 'Spain', 'Spanien'),
	(68, 'ET', 'Ethiopia', 'Äthiopien'),
	(69, 'FI', 'Finland', 'Finnland'),
	(70, 'FJ', 'Fiji', 'Fidschi'),
	(71, 'FK', 'Falkland Islands', 'Falklandinseln (Malwinen)'),
	(72, 'FM', 'Micronesia', 'Mikronesien'),
	(73, 'FO', 'Faroe Islands', 'Färöer'),
	(74, 'FR', 'France', 'Frankreich'),
	(75, 'GA', 'Gabon', 'Gabun'),
	(76, 'GB', 'United Kingdom', 'Großbritannien und Nordirland'),
	(77, 'GD', 'Grenada', 'Grenada'),
	(78, 'GE', 'Georgia', 'Georgien'),
	(79, 'GF', 'French Guiana', 'Französisch-Guayana'),
	(80, 'GG', 'Guernsey', 'Guernsey (Kanalinsel)'),
	(81, 'GH', 'Ghana', 'Ghana'),
	(82, 'GI', 'Gibraltar', 'Gibraltar'),
	(83, 'GL', 'Greenland', 'Grönland'),
	(84, 'GM', 'Gambia', 'Gambia'),
	(85, 'GN', 'Guinea', 'Guinea'),
	(86, 'GP', 'Guadeloupe', 'Guadeloupe'),
	(87, 'GQ', 'Equatorial Guinea', 'Äquatorialguinea'),
	(88, 'GR', 'Greece', 'Griechenland'),
	(89, 'GS', 'South Georgia and the South Sandwich Islands', 'Südgeorgien und die Südl. Sandwichinseln'),
	(90, 'GT', 'Guatemala', 'Guatemala'),
	(91, 'GU', 'Guam', 'Guam'),
	(92, 'GW', 'Guinea-Bissau', 'Guinea-Bissau'),
	(93, 'GY', 'Guyana', 'Guyana'),
	(94, 'HK', 'Hong Kong S.A.R., China', 'Hongkong'),
	(95, 'HM', 'Heard Island and McDonald Islands', 'Heard- und McDonald-Inseln'),
	(96, 'HN', 'Honduras', 'Honduras'),
	(97, 'HR', 'Croatia', 'Kroatien'),
	(98, 'HT', 'Haiti', 'Haiti'),
	(99, 'HU', 'Hungary', 'Ungarn'),
	(100, 'ID', 'Indonesia', 'Indonesien'),
	(101, 'IE', 'Ireland', 'Irland'),
	(102, 'IL', 'Israel', 'Israel'),
	(103, 'IM', 'Isle of Man', 'Insel Man'),
	(104, 'IN', 'India', 'Indien'),
	(105, 'IO', 'British Indian Ocean Territory', 'Britisches Territorium im Indischen Ozean'),
	(106, 'IQ', 'Iraq', 'Irak'),
	(107, 'IR', 'Iran', 'Iran'),
	(108, 'IS', 'Iceland', 'Island'),
	(109, 'IT', 'Italy', 'Italien'),
	(110, 'JE', 'Jersey', 'Jersey (Kanalinsel)'),
	(111, 'JM', 'Jamaica', 'Jamaika'),
	(112, 'JO', 'Jordan', 'Jordanien'),
	(113, 'JP', 'Japan', 'Japan'),
	(114, 'KE', 'Kenya', 'Kenia'),
	(115, 'KG', 'Kyrgyzstan', 'Kirgisistan'),
	(116, 'KH', 'Cambodia', 'Kambodscha'),
	(117, 'KI', 'Kiribati', 'Kiribati'),
	(118, 'KM', 'Comoros', 'Komoren'),
	(119, 'KN', 'Saint Kitts and Nevis', 'St. Kitts und Nevis'),
	(120, 'KP', 'North Korea', 'Nordkorea'),
	(121, 'KR', 'South Korea', 'Südkorea'),
	(122, 'KW', 'Kuwait', 'Kuwait'),
	(123, 'KY', 'Cayman Islands', 'Kaimaninseln'),
	(124, 'KZ', 'Kazakhstan', 'Kasachstan'),
	(125, 'LA', 'Laos', 'Laos'),
	(126, 'LB', 'Lebanon', 'Libanon'),
	(127, 'LC', 'Saint Lucia', 'St. Lucia'),
	(128, 'LI', 'Liechtenstein', 'Liechtenstein'),
	(129, 'LK', 'Sri Lanka', 'Sri Lanka'),
	(130, 'LR', 'Liberia', 'Liberia'),
	(131, 'LS', 'Lesotho', 'Lesotho'),
	(132, 'LT', 'Lithuania', 'Litauen'),
	(133, 'LU', 'Luxembourg', 'Luxemburg'),
	(134, 'LV', 'Latvia', 'Lettland'),
	(135, 'LY', 'Libya', 'Libyen'),
	(136, 'MA', 'Morocco', 'Marokko'),
	(137, 'MC', 'Monaco', 'Monaco'),
	(138, 'MD', 'Moldova', 'Moldawien'),
	(139, 'MG', 'Madagascar', 'Madagaskar'),
	(140, 'MH', 'Marshall Islands', 'Marshallinseln'),
	(141, 'MK', 'Macedonia', 'Mazedonien'),
	(142, 'ML', 'Mali', 'Mali'),
	(143, 'MM', 'Myanmar', 'Myanmar (Burma)'),
	(144, 'MN', 'Mongolia', 'Mongolei'),
	(145, 'MO', 'Macao S.A.R., China', 'Macao'),
	(146, 'MP', 'Northern Mariana Islands', 'Nördliche Marianen'),
	(147, 'MQ', 'Martinique', 'Martinique'),
	(148, 'MR', 'Mauritania', 'Mauretanien'),
	(149, 'MS', 'Montserrat', 'Montserrat'),
	(150, 'MT', 'Malta', 'Malta'),
	(151, 'MU', 'Mauritius', 'Mauritius'),
	(152, 'MV', 'Maldives', 'Malediven'),
	(153, 'MW', 'Malawi', 'Malawi'),
	(154, 'MX', 'Mexico', 'Mexiko'),
	(155, 'MY', 'Malaysia', 'Malaysia'),
	(156, 'MZ', 'Mozambique', 'Mosambik'),
	(157, 'NA', 'Namibia', 'Namibia'),
	(158, 'NC', 'New Caledonia', 'Neukaledonien'),
	(159, 'NE', 'Niger', 'Niger'),
	(160, 'NF', 'Norfolk Island', 'Norfolkinsel'),
	(161, 'NG', 'Nigeria', 'Nigeria'),
	(162, 'NI', 'Nicaragua', 'Nicaragua'),
	(163, 'NL', 'Netherlands', 'Niederlande'),
	(164, 'NO', 'Norway', 'Norwegen'),
	(165, 'NP', 'Nepal', 'Nepal'),
	(166, 'NR', 'Nauru', 'Nauru'),
	(167, 'NU', 'Niue', 'Niue'),
	(168, 'NZ', 'New Zealand', 'Neuseeland'),
	(169, 'OM', 'Oman', 'Oman'),
	(170, 'PA', 'Panama', 'Panama'),
	(171, 'PE', 'Peru', 'Peru'),
	(172, 'PF', 'French Polynesia', 'Französisch-Polynesien'),
	(173, 'PG', 'Papua New Guinea', 'Papua-Neuguinea'),
	(174, 'PH', 'Philippines', 'Philippinen'),
	(175, 'PK', 'Pakistan', 'Pakistan'),
	(176, 'PL', 'Poland', 'Polen'),
	(177, 'PM', 'Saint Pierre and Miquelon', 'St. Pierre und Miquelon'),
	(178, 'PN', 'Pitcairn', 'Pitcairninseln'),
	(179, 'PR', 'Puerto Rico', 'Puerto Rico'),
	(180, 'PS', 'Palestinian Territory', 'Palästinensische Autonomiegebiete'),
	(181, 'PT', 'Portugal', 'Portugal'),
	(182, 'PW', 'Palau', 'Palau'),
	(183, 'PY', 'Paraguay', 'Paraguay'),
	(184, 'QA', 'Qatar', 'Katar'),
	(185, 'RE', 'Reunion', 'Réunion'),
	(186, 'RO', 'Romania', 'Rumänien'),
	(187, 'RU', 'Russia', 'Russische Föderation'),
	(188, 'RW', 'Rwanda', 'Ruanda'),
	(189, 'SA', 'Saudi Arabia', 'Saudi-Arabien'),
	(190, 'SB', 'Solomon Islands', 'Salomonen'),
	(191, 'SC', 'Seychelles', 'Seychellen'),
	(192, 'SD', 'Sudan', 'Sudan'),
	(193, 'SE', 'Sweden', 'Schweden'),
	(194, 'SG', 'Singapore', 'Singapur'),
	(195, 'SH', 'Saint Helena', 'St. Helena'),
	(196, 'SI', 'Slovenia', 'Slowenien'),
	(197, 'SJ', 'Svalbard and Jan Mayen', 'Svalbard und Jan Mayen'),
	(198, 'SK', 'Slovakia', 'Slowakei'),
	(199, 'SL', 'Sierra Leone', 'Sierra Leone'),
	(200, 'SM', 'San Marino', 'San Marino'),
	(201, 'SN', 'Senegal', 'Senegal'),
	(202, 'SO', 'Somalia', 'Somalia'),
	(203, 'SR', 'Suriname', 'Suriname'),
	(204, 'ST', 'Sao Tome and Principe', 'São Tomé und Príncipe'),
	(205, 'SV', 'El Salvador', 'El Salvador'),
	(206, 'SY', 'Syria', 'Syrien'),
	(207, 'SZ', 'Swaziland', 'Swasiland'),
	(208, 'TC', 'Turks and Caicos Islands', 'Turks- und Caicosinseln'),
	(209, 'TD', 'Chad', 'Tschad'),
	(210, 'TF', 'French Southern Territories', 'Französische Süd- und Antarktisgebiete'),
	(211, 'TG', 'Togo', 'Togo'),
	(212, 'TH', 'Thailand', 'Thailand'),
	(213, 'TJ', 'Tajikistan', 'Tadschikistan'),
	(214, 'TK', 'Tokelau', 'Tokelau'),
	(215, 'TL', 'East Timor', 'Timor-Leste'),
	(216, 'TM', 'Turkmenistan', 'Turkmenistan'),
	(217, 'TN', 'Tunisia', 'Tunesien'),
	(218, 'TO', 'Tonga', 'Tonga'),
	(219, 'TR', 'Turkey', 'Türkei'),
	(220, 'TT', 'Trinidad and Tobago', 'Trinidad und Tobago'),
	(221, 'TV', 'Tuvalu', 'Tuvalu'),
	(222, 'TW', 'Taiwan', 'Taiwan'),
	(223, 'TZ', 'Tanzania', 'Tansania'),
	(224, 'UA', 'Ukraine', 'Ukraine'),
	(225, 'UG', 'Uganda', 'Uganda'),
	(226, 'UM', 'United States Minor Outlying Islands', 'Amerikanisch-Ozeanien'),
	(227, 'US', 'United States', 'Vereinigte Staaten von Amerika'),
	(228, 'UY', 'Uruguay', 'Uruguay'),
	(229, 'UZ', 'Uzbekistan', 'Usbekistan'),
	(230, 'VA', 'Vatican', 'Vatikanstadt'),
	(231, 'VC', 'Saint Vincent and the Grenadines', 'St. Vincent und die Grenadinen'),
	(232, 'VE', 'Venezuela', 'Venezuela'),
	(233, 'VG', 'British Virgin Islands', 'Britische Jungferninseln'),
	(234, 'VI', 'U.S. Virgin Islands', 'Amerikanische Jungferninseln'),
	(235, 'VN', 'Vietnam', 'Vietnam'),
	(236, 'VU', 'Vanuatu', 'Vanuatu'),
	(237, 'WF', 'Wallis and Futuna', 'Wallis und Futuna'),
	(238, 'WS', 'Samoa', 'Samoa'),
	(239, 'YE', 'Yemen', 'Jemen'),
	(240, 'YT', 'Mayotte', 'Mayotte'),
	(241, 'ZA', 'South Africa', 'Südafrika'),
	(242, 'ZM', 'Zambia', 'Sambia'),
	(243, 'ZW', 'Zimbabwe', 'Simbabwe');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.log
DROP TABLE IF EXISTS `log`;
CREATE TABLE IF NOT EXISTS `log` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `log` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.log: ~0 rows (ungefähr)
DELETE FROM `log`;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.mail_templates
DROP TABLE IF EXISTS `mail_templates`;
CREATE TABLE IF NOT EXISTS `mail_templates` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `template` varchar(50) NOT NULL,
  `subject` varchar(250) NOT NULL,
  `html` mediumtext NOT NULL,
  `text` mediumtext NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.mail_templates: ~2 rows (ungefähr)
DELETE FROM `mail_templates`;
/*!40000 ALTER TABLE `mail_templates` DISABLE KEYS */;
INSERT INTO `mail_templates` (`ID`, `template`, `subject`, `html`, `text`) VALUES
	(1, 'contact', 'Kontaktanfrage', 'Der folgende Interessent hat folgende Kontaktanfrage formuliert:<br><br>\r\n\r\nKontakt: [GENDER] [PRENAME] [NAME]<br>\r\nE-Mail: [MAIL]<br>\r\nDer/Die Interessent(in schrieb:<br><br>\r\n[MESSAGE] \r\n\r\n', 'Der folgende Interessent hat folgende Kontaktanfrage formuliert:"\\n\\n"\r\n\r\nKontakt: [GENDER] [PRENAME] [NAME]"\\n"\r\nE-Mail: [MAIL]"\\n"\r\nDer/Die Interessent(in schrieb:"\\n"\r\n[MESSAGE] \r\n\r\n'),
	(2, 'callus', 'Rückrufanfrage', 'Der folgende Interessent hat folgenden Rückrufwunsch geäußert:<br><br>\r\n\r\nKontakt: [GENDER] [PRENAME] [NAME]<br>\r\nRückruftermin: [CALLUSDATE]<br>\r\nTelefonnummer: [PHONE]<br><br>\r\nDer/Die Interessent/in schrieb:<br><br>\r\n[MESSAGE] \r\n\r\n', 'Der folgende Interessent hat folgenden Rückrufwunsch geäußert:\r\n\r\nKontakt: [GENDER] [PRENAME] [NAME]\r\nRückruftermin: [CALLUSDATE]\r\nTelefonnummer: [PHONE]\r\nDer/Die Interessent/in schrieb:\r\n[MESSAGE] \r\n\r\n');
/*!40000 ALTER TABLE `mail_templates` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.mediathek
DROP TABLE IF EXISTS `mediathek`;
CREATE TABLE IF NOT EXISTS `mediathek` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `src` varchar(256) NOT NULL,
  `type` varchar(20) NOT NULL,
  `category` int(10) NOT NULL DEFAULT '0',
  `thumb_xs` varchar(256) NOT NULL,
  `thumb_sm` varchar(256) NOT NULL,
  `thumb_md` varchar(256) NOT NULL,
  `thumb_lg` varchar(256) NOT NULL,
  `folder_id` bigint(20) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.mediathek: ~0 rows (ungefähr)
DELETE FROM `mediathek`;
/*!40000 ALTER TABLE `mediathek` DISABLE KEYS */;
/*!40000 ALTER TABLE `mediathek` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.mediathek_folders
DROP TABLE IF EXISTS `mediathek_folders`;
CREATE TABLE IF NOT EXISTS `mediathek_folders` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `folder_id` bigint(20) NOT NULL,
  `folder` varchar(76) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.mediathek_folders: ~1 rows (ungefähr)
DELETE FROM `mediathek_folders`;
/*!40000 ALTER TABLE `mediathek_folders` DISABLE KEYS */;
INSERT INTO `mediathek_folders` (`ID`, `folder_id`, `folder`) VALUES
	(3, 1, 'Artikelbilder');
/*!40000 ALTER TABLE `mediathek_folders` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.menus
DROP TABLE IF EXISTS `menus`;
CREATE TABLE IF NOT EXISTS `menus` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu` varchar(50) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT '0',
  `route_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `icon` varchar(26) NOT NULL DEFAULT 'fa-caret-right',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.menus: ~0 rows (ungefähr)
DELETE FROM `menus`;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.models
DROP TABLE IF EXISTS `models`;
CREATE TABLE IF NOT EXISTS `models` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.models: ~48 rows (ungefähr)
DELETE FROM `models`;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` (`ID`, `name`) VALUES
	(1, 'Users'),
	(2, 'Routes'),
	(3, 'Route_scopes'),
	(4, 'Auth_groups'),
	(5, 'Register'),
	(6, 'Response_errors'),
	(7, 'Qunit_test'),
	(8, 'Admin_menus'),
	(9, 'Mediathek'),
	(10, 'Countries'),
	(11, 'Model_definitions'),
	(12, 'Model_types'),
	(13, 'Models'),
	(14, 'Menus'),
	(15, 'Page_content'),
	(16, 'Route_page_content'),
	(17, 'Plugins'),
	(18, 'Route_plugins'),
	(19, 'Mail_templates'),
	(101, 'Article_attributes'),
	(102, 'Article_categories'),
	(103, 'Article_category_rel'),
	(104, 'Article_variations'),
	(105, 'Article_variation_value'),
	(106, 'Products'),
	(107, 'Producers'),
	(108, 'Orders'),
	(109, 'Order_errors'),
	(110, 'User_billings'),
	(111, 'User_companies'),
	(112, 'User_orders'),
	(113, 'User_shippings'),
	(114, 'Checkout_billings'),
	(115, 'Checkout_shippings'),
	(116, 'Product_producers'),
	(117, 'Article_units'),
	(118, 'Article_manufacturers'),
	(119, 'Article_suppliers'),
	(120, 'Article_warehouses'),
	(121, 'Taxes'),
	(122, 'Mediathek_folders'),
	(123, 'Breadcrumbs'),
	(124, 'Search_results'),
	(125, 'Search_result_models'),
	(126, 'article_payments'),
	(127, 'article_payment_gateways'),
	(128, 'Article_prices'),
	(129, 'Article_pricetypes');
/*!40000 ALTER TABLE `models` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.model_definitions
DROP TABLE IF EXISTS `model_definitions`;
CREATE TABLE IF NOT EXISTS `model_definitions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `model_id` bigint(20) NOT NULL,
  `col` varchar(50) NOT NULL,
  `model_type` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `model_col` (`col`,`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.model_definitions: ~300 rows (ungefähr)
DELETE FROM `model_definitions`;
/*!40000 ALTER TABLE `model_definitions` DISABLE KEYS */;
INSERT INTO `model_definitions` (`ID`, `model_id`, `col`, `model_type`) VALUES
	(1, 1, 'email', 5),
	(2, 1, 'pw_reset', 3),
	(3, 1, 'pw_temp', 3),
	(4, 1, 'password', 4),
	(5, 1, 'name', 3),
	(6, 1, 'gender', 3),
	(7, 1, 'prename', 3),
	(8, 1, 'group', 2),
	(9, 1, 'group_name', 103),
	(10, 2, 'customizable', 2),
	(11, 2, 'deleted', 2),
	(12, 2, 'enabled', 2),
	(13, 2, 'force', 2),
	(14, 2, 'layout', 3),
	(15, 2, 'route', 3),
	(16, 2, 'seo_description', 3),
	(17, 2, 'seo_keywords', 3),
	(18, 2, 'title', 3),
	(19, 2, 'crawlable', 2),
	(20, 2, 'seo_frequency', 2),
	(21, 2, 'seo_priority', 2),
	(22, 2, 'scope', 103),
	(23, 2, 'scope_id', 2),
	(24, 2, 'user', 103),
	(25, 2, 'content', 106),
	(26, 2, 'version', 102),
	(27, 2, 'content_date', 103),
	(28, 2, 'plugin_name', 103),
	(29, 2, 'plugin_enabled', 102),
	(30, 2, 'type', 103),
	(31, 2, 'content_enabled', 102),
	(32, 3, 'name', 3),
	(33, 4, 'group', 3),
	(34, 5, 'email', 5),
	(35, 5, 'password', 4),
	(36, 5, 'confirmation_code', 3),
	(37, 6, 'user_id', 2),
	(38, 6, 'rsp_code', 2),
	(39, 6, 'rsp_text', 3),
	(40, 6, 'intenal_code', 2),
	(42, 6, 'internal_text', 3),
	(43, 6, 'request', 3),
	(44, 6, 'error_stack', 3),
	(45, 7, 'name', 3),
	(46, 8, 'menu', 3),
	(47, 8, 'parent', 2),
	(48, 8, 'route_id', 2),
	(49, 8, 'order', 2),
	(50, 8, 'icon', 3),
	(51, 8, 'route', 103),
	(52, 9, 'name', 3),
	(53, 9, 'src', 3),
	(54, 9, 'type', 3),
	(55, 9, 'category', 2),
	(56, 10, 'en', 3),
	(57, 10, 'de', 3),
	(58, 10, 'code', 3),
	(59, 11, 'model_id', 2),
	(60, 11, 'col', 3),
	(61, 11, 'model_type', 2),
	(62, 11, 'name', 103),
	(63, 11, 'type', 103),
	(64, 12, 'name', 3),
	(65, 13, 'name', 3),
	(66, 14, 'menu', 3),
	(67, 14, 'parent', 2),
	(68, 14, 'route_id', 2),
	(69, 14, 'order', 2),
	(70, 14, 'icon', 3),
	(72, 14, 'route', 103),
	(73, 14, 'scope', 103),
	(74, 15, 'content_id', 2),
	(75, 15, 'content', 6),
	(76, 15, 'version', 2),
	(77, 15, 'user_id', 2),
	(78, 15, 'type', 3),
	(79, 15, 'plugin_enabled', 102),
	(81, 16, 'version', 2),
	(82, 16, 'route_id', 2),
	(83, 16, 'page_content_id', 2),
	(84, 16, 'enabled', 2),
	(85, 17, 'plugin_name', 3),
	(86, 17, 'plugin_enabled', 102),
	(87, 17, 'plugin_admin_html', 106),
	(88, 17, 'plugin_content', 108),
	(89, 17, 'route_id', 102),
	(90, 18, 'route_id', 2),
	(91, 18, 'plugin_id', 2),
	(92, 18, 'name', 103),
	(93, 18, 'enabled', 2),
	(94, 19, 'template', 3),
	(95, 19, 'subject', 3),
	(96, 19, 'html', 3),
	(97, 19, 'text', 3),
	(106, 101, 'name', 3),
	(107, 101, 'value', 3),
	(108, 101, 'article_id', 3),
	(109, 102, 'KeyName', 3),
	(110, 102, 'Sort', 2),
	(111, 102, 'KeyKategorie', 2),
	(112, 102, 'KeyOberkategorie', 2),
	(113, 102, 'bookmark', 3),
	(114, 102, 'image', 3),
	(115, 103, 'KeyKategorie', 2),
	(116, 103, 'KeyArtikel', 2),
	(117, 104, 'KeyEigenschaft', 2),
	(118, 104, 'KeyArtikel', 2),
	(119, 104, 'Name', 3),
	(120, 104, 'Sort', 2),
	(121, 104, 'Waehlbar', 3),
	(122, 105, 'KeyEigenschaft', 2),
	(123, 105, 'Name', 3),
	(124, 105, 'Aufpreis', 2),
	(125, 105, 'Sort', 2),
	(126, 105, 'Lager', 2),
	(127, 105, 'ArtikelNr', 2),
	(128, 105, 'Packeinheit', 2),
	(129, 105, 'KeyEigenschaftWert', 2),
	(130, 106, 'name', 3),
	(131, 106, 'bookmark', 3),
	(132, 106, 'stock', 2),
	(133, 106, 'image', 3),
	(134, 106, 'price', 2),
	(135, 106, 'gross', 102),
	(136, 106, 'tax', 2),
	(137, 106, 'article_id', 3),
	(138, 106, 'category_id', 2),
	(139, 106, 'title', 6),
	(140, 106, 'description', 6),
	(141, 106, 'variations', 108),
	(142, 106, 'rel_article_id', 3),
	(143, 106, 'viewed', 2),
	(144, 106, 'searched', 2),
	(145, 106, 'rank', 102),
	(146, 106, 'page', 102),
	(147, 106, 'manufacturer', 103),
	(148, 106, 'dependencies', 108),
	(149, 106, 'publish_date', 7),
	(150, 106, 'kind_of_new', 108),
	(151, 107, 'Hersteller', 103),
	(152, 107, 'amountArticles', 102),
	(153, 108, 'order_id', 2),
	(154, 108, 'article_id', 3),
	(155, 108, 'amount', 2),
	(156, 108, 'deleted', 2),
	(157, 108, 'ref_article_id', 3),
	(158, 108, 'price_brutto', 2),
	(159, 108, 'tax', 2),
	(160, 109, 'order_id', 2),
	(161, 109, 'error', 3),
	(162, 110, 'user_id', 2),
	(163, 110, 'checkout_billing_id', 2),
	(164, 111, 'user_id', 2),
	(166, 111, 'company', 3),
	(167, 111, 'ustid', 3),
	(168, 112, 'user_id', 2),
	(169, 112, 'gender', 3),
	(170, 112, 'name', 3),
	(171, 112, 'prename', 3),
	(172, 112, 'email', 3),
	(173, 112, 'company', 3),
	(174, 112, 'ustid', 3),
	(175, 112, 'billing_country', 3),
	(176, 112, 'billing_street', 3),
	(177, 112, 'billing_postal', 3),
	(178, 112, 'billing_city', 3),
	(179, 112, 'shipping_country', 3),
	(180, 112, 'shipping_street', 3),
	(181, 112, 'shipping_postal', 3),
	(182, 112, 'shipping_city', 3),
	(183, 112, 'confirmed', 2),
	(184, 112, 'created_at', 7),
	(185, 112, 'confirmed_at', 7),
	(186, 112, 'token', 3),
	(187, 112, 'gateway', 3),
	(188, 112, 'gateway_token', 3),
	(189, 112, 'client_id', 3),
	(190, 112, 'payer_id', 3),
	(191, 112, 'error', 2),
	(192, 112, 'deleted', 2),
	(193, 112, 'order_mail', 2),
	(194, 112, 'delivery', 3),
	(195, 112, 'iban', 3),
	(196, 112, 'bic', 3),
	(197, 112, 'owner', 3),
	(198, 112, 'mandat_ref_date', 3),
	(199, 113, 'user_id', 2),
	(200, 113, 'checkout_shipping_id', 2),
	(201, 114, 'country', 3),
	(202, 114, 'street', 3),
	(203, 114, 'postal', 3),
	(204, 114, 'city', 3),
	(205, 115, 'country', 3),
	(206, 115, 'street', 3),
	(207, 115, 'postal', 3),
	(208, 115, 'city', 3),
	(209, 106, 'category', 103),
	(210, 106, 'manufacturer_id', 2),
	(211, 116, 'name', 3),
	(212, 116, 'slug', 3),
	(213, 106, 'agio', 2),
	(214, 102, 'KeyBeschreibung', 3),
	(215, 102, 'deleted', 2),
	(216, 102, 'parent', 103),
	(217, 106, 'enabled', 2),
	(218, 117, 'unit_id', 2),
	(219, 117, 'name', 3),
	(220, 117, 'deleted', 2),
	(221, 118, 'manufacturer_id', 2),
	(222, 118, 'name', 3),
	(223, 118, 'country', 3),
	(224, 118, 'postal', 3),
	(225, 118, 'city', 3),
	(226, 118, 'street', 3),
	(227, 118, 'street_number', 3),
	(228, 118, 'deleted', 2),
	(229, 118, 'user', 2),
	(230, 119, 'supplier_id', 2),
	(231, 119, 'name', 3),
	(232, 119, 'country', 3),
	(233, 119, 'postal', 3),
	(234, 119, 'city', 3),
	(235, 119, 'street', 3),
	(236, 119, 'street_number', 3),
	(237, 119, 'deleted', 2),
	(238, 119, 'user', 2),
	(239, 120, 'warehouse_id', 2),
	(240, 120, 'name', 3),
	(241, 120, 'deleted', 2),
	(242, 120, 'user', 2),
	(243, 106, 'deliverable', 2),
	(244, 106, 'top_offer', 2),
	(245, 106, 'oversaleable', 2),
	(246, 106, 'is_new', 2),
	(247, 106, 'unit_id', 2),
	(248, 106, 'weight', 2),
	(250, 106, 'pack_unit', 3),
	(251, 106, 'han', 3),
	(252, 106, 'supplier_id', 2),
	(253, 106, 'supplier_ek', 2),
	(254, 106, 'supplier_tax', 2),
	(255, 106, 'warehouse_id', 2),
	(256, 106, 'weight_unit', 3),
	(257, 121, 'tax_id', 2),
	(258, 121, 'tax', 2),
	(259, 121, 'deleted', 2),
	(260, 121, 'user', 2),
	(261, 118, 'slug', 3),
	(262, 112, 'shipping_gender', 3),
	(263, 112, 'shipping_name', 3),
	(264, 112, 'shipping_prename', 3),
	(265, 115, 'gender', 3),
	(266, 115, 'name', 3),
	(267, 115, 'prename', 3),
	(268, 112, 'delivered', 2),
	(269, 112, 'articles', 108),
	(270, 112, 'total', 102),
	(271, 112, 'delivery_costs', 102),
	(272, 112, 'price_total', 102),
	(278, 122, 'folder_id', 2),
	(279, 122, 'folder', 3),
	(280, 123, 'slug', 3),
	(281, 123, 'breadcrumb', 3),
	(282, 106, 'manufacturer_slug', 103),
	(283, 106, 'search_result', 102),
	(285, 124, 'search_type', 3),
	(286, 124, 'hashed_term', 3),
	(287, 125, 'search_result_id', 2),
	(288, 125, 'model', 3),
	(289, 125, 'model_id', 2),
	(290, 125, 'clicked', 2),
	(291, 106, 'search_rank', 102),
	(292, 106, 'deleted', 2),
	(293, 106, 'user', 2),
	(294, 102, 'user', 2),
	(295, 117, 'user', 2),
	(296, 106, 'category_slug', 103),
	(297, 112, 'processing', 2),
	(298, 112, 'paid', 2),
	(299, 112, 'done', 2),
	(300, 126, 'article_id', 2),
	(301, 126, 'gateway_id', 2),
	(302, 127, 'gateway_id', 2),
	(303, 127, 'gateway_name', 3),
	(304, 106, 'payment_gateways', 108),
	(305, 126, 'enabled', 2),
	(307, 127, 'checkout_name', 3),
	(308, 127, 'prefix', 3),
	(309, 108, 'deliverable', 2),
	(310, 108, 'available', 2),
	(311, 108, 'enabled', 2),
	(312, 106, 'special_prices', 108),
	(313, 128, 'price_netto', 2),
	(314, 128, 'price_type', 2),
	(315, 128, 'price_enabled', 2),
	(316, 129, 'name', 3),
	(317, 129, 'description', 3),
	(318, 128, 'article_id', 2),
	(319, 129, 'deleted', 2),
	(320, 129, 'user', 3);
/*!40000 ALTER TABLE `model_definitions` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.model_types
DROP TABLE IF EXISTS `model_types`;
CREATE TABLE IF NOT EXISTS `model_types` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.model_types: ~14 rows (ungefähr)
DELETE FROM `model_types`;
/*!40000 ALTER TABLE `model_types` DISABLE KEYS */;
INSERT INTO `model_types` (`ID`, `name`) VALUES
	(1, 'boolean'),
	(2, 'number'),
	(3, 'string'),
	(4, 'password'),
	(5, 'mail'),
	(6, 'html'),
	(7, 'date'),
	(8, 'object'),
	(101, 'virtual_boolean'),
	(102, 'virtual_number'),
	(103, 'virtual_string'),
	(106, 'virtual_html'),
	(107, 'virtual_date'),
	(108, 'virtual_object');
/*!40000 ALTER TABLE `model_types` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.page_content
DROP TABLE IF EXISTS `page_content`;
CREATE TABLE IF NOT EXISTS `page_content` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `content_id` bigint(20) NOT NULL,
  `content` mediumtext NOT NULL,
  `type` varchar(50) NOT NULL,
  `version` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.page_content: ~18 rows (ungefähr)
DELETE FROM `page_content`;
/*!40000 ALTER TABLE `page_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `page_content` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.plugins
DROP TABLE IF EXISTS `plugins`;
CREATE TABLE IF NOT EXISTS `plugins` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `plugin_name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `name` (`plugin_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.plugins: ~6 rows (ungefähr)
DELETE FROM `plugins`;
/*!40000 ALTER TABLE `plugins` DISABLE KEYS */;
INSERT INTO `plugins` (`ID`, `plugin_name`) VALUES
	(6, 'Gallery'),
	(8, 'Mail Form'),
	(4, 'News'),
	(5, 'Simple Offers'),
	(2, 'Slider'),
	(7, 'Vita');
/*!40000 ALTER TABLE `plugins` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` varchar(50) NOT NULL,
  `rel_article_id` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `bookmark` varchar(50) NOT NULL,
  `image` varchar(120) NOT NULL,
  `price` decimal(10,5) NOT NULL,
  `tax` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `agio` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `unit_id` bigint(20) NOT NULL,
  `weight` varchar(50) NOT NULL,
  `weight_unit` varchar(10) NOT NULL DEFAULT 'kg',
  `pack_unit` varchar(50) NOT NULL DEFAULT '0',
  `title` text NOT NULL,
  `description` mediumtext NOT NULL,
  `manufacturer_id` bigint(20) NOT NULL,
  `han` varchar(70) NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `supplier_ek` decimal(10,5) NOT NULL,
  `supplier_tax` int(11) NOT NULL,
  `deliverable` tinyint(4) NOT NULL DEFAULT '1',
  `warehouse_id` bigint(20) NOT NULL DEFAULT '1',
  `top_offer` tinyint(4) NOT NULL DEFAULT '0',
  `oversaleable` tinyint(4) NOT NULL DEFAULT '1',
  `is_new` tinyint(4) NOT NULL DEFAULT '1',
  `viewed` bigint(20) NOT NULL DEFAULT '0',
  `searched` bigint(20) NOT NULL DEFAULT '0',
  `publish_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `enabled` tinyint(4) NOT NULL DEFAULT '0',
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.products: ~2 rows (ungefähr)
DELETE FROM `products`;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.product_producers
DROP TABLE IF EXISTS `product_producers`;
CREATE TABLE IF NOT EXISTS `product_producers` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.product_producers: ~0 rows (ungefähr)
DELETE FROM `product_producers`;
/*!40000 ALTER TABLE `product_producers` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_producers` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.qunit_test
DROP TABLE IF EXISTS `qunit_test`;
CREATE TABLE IF NOT EXISTS `qunit_test` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.qunit_test: ~2 rows (ungefähr)
DELETE FROM `qunit_test`;
/*!40000 ALTER TABLE `qunit_test` DISABLE KEYS */;
INSERT INTO `qunit_test` (`ID`, `name`) VALUES
	(1, 'qunit_name_1'),
	(2, 'qunit_name_2');
/*!40000 ALTER TABLE `qunit_test` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.register
DROP TABLE IF EXISTS `register`;
CREATE TABLE IF NOT EXISTS `register` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `confirmation_code` varchar(256) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `code` (`confirmation_code`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.register: 1 rows
DELETE FROM `register`;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` (`id`, `email`, `password`, `confirmation_code`, `deleted`) VALUES
	(1, 'admin@np.dev', 'MEEfqPGs1RiSxsK12q3umpG0FFjBp6VsUp4f0lG6ZWGLZlGvrL8Qbm8jcCGNZoCDmo1ysSDBUTcuKsoBzdnYC855Jv9Oz8iRDFCCrgenHZJDuVOXgkfLaEvcVfGXerA_8083f85c977279c3f4ce402a64c24d1b8471a230f662faba61f4bf57a7dc45a0d089ab41da483d820180cf5378cdc8d62c43eb370eda28dcc1d938ce650a1f00', 'HcatdQg4PjnNiOKSobCpTrVO9YhQy0SziPtiiwzHrNeHwEzOBzD0JJ8k6o0sqCfp4HfVD9hADaFRH8iXlhHp7JldWNPJyDBY4KkEPkqcEbJ2CCyOan4js9EFKsvxSbg_c06c1db6bd393bf69104b2b13dd9cfbb94c6b6cd92af4c9aa7b1c42185d718fd4396299ff18f01a3674016f43f220a0c0d8fc1631299f6e93f23093982aa444e', 1);
/*!40000 ALTER TABLE `register` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.response_errors
DROP TABLE IF EXISTS `response_errors`;
CREATE TABLE IF NOT EXISTS `response_errors` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `rsp_code` int(11) NOT NULL,
  `rsp_text` varchar(256) NOT NULL,
  `internal_code` int(11) NOT NULL,
  `internal_text` varchar(256) NOT NULL,
  `request` longtext NOT NULL,
  `error_stack` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.response_errors: ~0 rows (ungefähr)
DELETE FROM `response_errors`;
/*!40000 ALTER TABLE `response_errors` DISABLE KEYS */;
/*!40000 ALTER TABLE `response_errors` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.routes
DROP TABLE IF EXISTS `routes`;
CREATE TABLE IF NOT EXISTS `routes` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `route` varchar(100) DEFAULT NULL,
  `scope_id` int(11) NOT NULL,
  `layout` varchar(100) DEFAULT NULL,
  `title` varchar(55) NOT NULL,
  `force` int(1) NOT NULL DEFAULT '0' COMMENT 'wenn force=true, dann wird vom np-client die route immer vom server geladen',
  `enabled` int(1) DEFAULT '1',
  `deleted` int(1) DEFAULT '0',
  `customizable` int(1) NOT NULL DEFAULT '1',
  `crawlable` int(1) NOT NULL DEFAULT '1',
  `seo_description` varchar(156) NOT NULL,
  `seo_keywords` varchar(255) NOT NULL,
  `seo_frequency` int(1) NOT NULL DEFAULT '4' COMMENT '0=always, 1=hourly, 2=daily, 3=weekly, 4=monthly, 5=yearly, 6=never',
  `seo_priority` int(2) NOT NULL DEFAULT '5',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `route` (`route`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.routes: ~78 rows (ungefähr)
DELETE FROM `routes`;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` (`ID`, `route`, `scope_id`, `layout`, `title`, `force`, `enabled`, `deleted`, `customizable`, `crawlable`, `seo_description`, `seo_keywords`, `seo_frequency`, `seo_priority`, `updated_at`) VALUES
	(1, '/admin', 1, 'admin', 'np | Administration', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:21'),
	(2, '/admin/usermanagement', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:23'),
	(3, '/admin/modelmanagement', 1, 'admin-page', 'np | Modelverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:24'),
	(4, '/admin/articlemanagement', 1, 'admin-page', 'np | Artikelverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:26'),
	(5, '/admin/usermanagement/users', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:27'),
	(6, '/admin/usermanagement/roles', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:29'),
	(7, '/admin/usermanagement/user/*', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:30'),
	(8, '/admin/usermanagement/user', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:31'),
	(9, '/admin/routesmanagement', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:32'),
	(10, '/admin/routesmanagement/routes', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:34'),
	(11, '/admin/routesmanagement/scopes', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(12, '/admin/modelmanagement/*', 1, 'admin-page', 'np | Modelverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(13, '/admin/routesmanagement/routes/*', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(14, '/admin/usermanagement/users/*', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(15, '/admin/usermanagement/roles/*', 1, 'admin-page', 'np | Benutzerverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(16, '/admin/routesmanagement/scopes/*', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(17, '/admin/routesmanagement/route', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(18, '/admin/routesmanagement/route/*', 1, 'admin-page', 'np | Routenverwaltung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(19, '/auth/login', 2, 'main', 'Ihre Seite | Anmelden', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(20, '/auth/loggedout', 2, 'main', 'Ihre Seite | Abgemeldet', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(21, '/auth/register/user', 2, 'main', 'Ihre Seite | Registrierung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(22, '/auth/register/confirmation/*', 2, 'main', 'Ihre Seite | Registrierungsbestätigung', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(23, '/auth/forgot/password', 2, 'main', 'Ihre Seite | Passwort vergessen', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(24, '/auth/reset/password/*', 2, 'main', 'Ihre Seite | Passswort vergeben', 0, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(25, '/', 2, 'main', 'Ihre Seite | Startseite', 1, 1, 0, 1, 1, '', '', 5, 10, '2017-02-22 13:16:59'),
	(26, '/kontakt', 2, 'main', 'Ihre Seite | Kontakt', 1, 1, 0, 1, 1, '', '', 6, 0, '2017-02-22 13:16:59'),
	(27, '/impressum', 2, 'main', 'Ihre Seite | Impressum', 1, 1, 0, 1, 0, '', '', 4, 5, '2016-07-09 20:37:56'),
	(28, '/agb', 2, 'main', 'Ihre Seite | AGB', 1, 1, 0, 1, 0, '', '', 4, 5, '2016-07-09 20:36:50'),
	(29, '/datenschutz', 2, 'main', 'Ihre Seite | Datenschutz', 1, 1, 0, 1, 0, '', '', 4, 5, '2016-07-09 20:37:45'),
	(52, '/checkout/address', 2, 'checkout', 'Ihre Seite | Bestellung > Adressdaten', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(53, '/checkout/confirmation', 2, 'checkout', 'Ihre Seite | Bestellung > Bestätigung', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(54, '/checkout/payment/*', 2, 'checkout', 'Ihre Seite | Bestellung > Bezahlart', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(55, '/checkout/user', 2, 'checkout', 'Ihre Seite | Bestellung > Kundendaten', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(56, '/checkout/verification', 2, 'checkout', 'Ihre Seite | Bestellung > Bestätigung', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(57, '/checkout/verification/*', 2, 'checkout', 'Ihre Seite | Bestellung > Bestätigung', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(58, '/admin/shopmanagement/categories', 1, 'admin-page', 'np | Artikelverwaltung > Kategorien', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(59, '/admin/shopmanagement/category', 1, 'admin-page', 'np | Artikelverwaltung > Kategorien', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(60, '/admin/shopmanagement/category/*', 1, 'admin-page', 'np | Artikelverwaltung > Kategorie', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(61, '/admin/shopmanagement/articles', 1, 'admin-page', 'np | Artikelverwaltung > Artikel', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(62, '/admin/shopmanagement/articles/*', 1, 'admin-page', 'np | Artikelverwaltung > Artikel', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(63, '/admin/shopmanagement/categories/*', 1, 'admin-page', 'np | Artikelverwaltung > Kategorien', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(64, '/admin/shopmanagement/article', 1, 'admin-page', 'np | Artikelverwaltung > Artikeldetails', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(65, '/admin/shopmanagement/article/*', 1, 'admin-page', 'np | Artikelverwaltung > Artikeldetails', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(66, '/admin/shopmanagement/articleunits', 1, 'admin-page', 'np | Artikelverwaltung > Artikeleinheiten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(68, '/admin/shopmanagement/articleunits/*', 1, 'admin-page', 'np | Artikelverwaltung > Artikeleinheiten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(69, '/admin/shopmanagement/manufacturers', 1, 'admin-page', 'np | Artikelverwaltung > Hersteller', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(70, '/admin/shopmanagement/manufacturers/*', 1, 'admin-page', 'np | Artikelverwaltung > Hersteller', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(71, '/admin/shopmanagement/suppliers', 1, 'admin-page', 'np | Artikelverwaltung > Lieferanten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(72, '/admin/shopmanagement/suppliers/*', 1, 'admin-page', 'np | Artikelverwaltung > Lieferanten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(73, '/admin/shopmanagement/warehouses', 1, 'admin-page', 'np | Artikelverwaltung > Lagerverwaltung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(74, '/admin/shopmanagement/warehouses/*', 1, 'admin-page', 'np | Artikelverwaltung > Lagerverwaltung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(75, '/admin/shopmanagement/taxes', 1, 'admin-page', 'np | Artikelverwaltung > Steuersätze', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(76, '/admin/shopmanagement/taxes/*', 1, 'admin-page', 'np | Artikelverwaltung > Steuersätze', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(77, '/user/profile', 2, 'main', 'Ihre Seite | Benutzer > Profil', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:17:15'),
	(78, '/user/orders', 2, 'main', 'Ihre Seite | Benutzer > Bestellhistorie', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:17:18'),
	(79, '/user/orders/*', 2, 'main', 'Ihre Seite | Benutzer > Bestellhistorie', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:17:22'),
	(80, '/admin/richcards', 1, 'admin-page', 'np | Rich Cards / Snippets', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(81, '/admin/richcards/contact', 1, 'admin-page', 'np | Rich Cards / Snippets > Contact', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(82, '/admin/shopmanagement/manufacturer', 1, 'admin-page', 'np | Artikelverwaltung > Hersteller', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(83, '/admin/shopmanagement/manufacturer/*', 1, 'admin-page', 'np | Artikelverwaltung > Hersteller', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(84, '/search', 2, 'shop-search', 'Ihre Seite | Artikelsuche', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:17:27'),
	(85, '/search/*', 2, 'shop-search', 'Ihre Seite | Artikelsuche', 1, 1, 0, 1, 0, '', '', 4, 5, '2017-02-22 13:17:31'),
	(86, '/admin/shopmanagement/supplier', 1, 'admin-page', 'np | Artikelverwaltung > Lieferant', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(87, '/admin/shopmanagement/supplier/*', 1, 'admin-page', 'np | Artikelverwaltung > Lieferant', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(88, '/admin/shopmanagement/articleunit', 1, 'admin-page', 'np | Artikelverwaltung > Artikeleinheit', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(89, '/admin/shopmanagement/articleunit/*', 1, 'admin-page', 'np | Artikelverwaltung > Artikeleinheit', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(90, '/admin/shopmanagement/warehouse', 1, 'admin-page', 'np | Artikelverwaltung > Lagerverwaltung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(91, '/admin/shopmanagement/warehouse/*', 1, 'admin-page', 'np | Artikelverwaltung > Lagerverwaltung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(92, '/admin/shopmanagement/tax', 1, 'admin-page', 'np | Artikelverwaltung > Steuersatz', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(93, '/admin/shopmanagement/tax/*', 1, 'admin-page', 'np | Artikelverwaltung > Steuersatz', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(94, '/admin/shopmanagement/orders', 1, 'admin-page', 'np | Artikelverwaltung > Bestellungen', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(95, '/admin/shopmanagement/orders/*', 1, 'admin-page', 'np | Artikelverwaltung > Bestellungen', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(96, '/admin/shopmanagement/order', 1, 'admin-page', 'np | Artikelverwaltung > Bestellung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(97, '/admin/shopmanagement/order/*', 1, 'admin-page', 'np | Artikelverwaltung > Bestellung', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(98, '/admin/shopmanagement/pricetypes/*', 1, 'admin-page', 'np | Artikelverwaltung > Sonderpreisarten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(99, '/admin/shopmanagement/pricetypes', 1, 'admin-page', 'np | Artikelverwaltung > Sonderpreisarten', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(100, '/admin/shopmanagement/pricetype', 1, 'admin-page', 'np | Artikelverwaltung > Sonderpreisart', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59'),
	(101, '/admin/shopmanagement/pricetype/*', 1, 'admin-page', 'np | Artikelverwaltung > Sonderpreisart', 1, 1, 0, 0, 0, '', '', 4, 5, '2017-02-22 13:16:59');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.route_page_content
DROP TABLE IF EXISTS `route_page_content`;
CREATE TABLE IF NOT EXISTS `route_page_content` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `route_id` bigint(20) NOT NULL,
  `page_content_id` bigint(20) NOT NULL,
  `enabled` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `content` (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.route_page_content: ~8 rows (ungefähr)
DELETE FROM `route_page_content`;
/*!40000 ALTER TABLE `route_page_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_page_content` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.route_plugins
DROP TABLE IF EXISTS `route_plugins`;
CREATE TABLE IF NOT EXISTS `route_plugins` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `route_id` bigint(20) NOT NULL,
  `plugin_id` bigint(20) NOT NULL,
  `enabled` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `plugin` (`route_id`,`plugin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.route_plugins: ~0 rows (ungefähr)
DELETE FROM `route_plugins`;
/*!40000 ALTER TABLE `route_plugins` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_plugins` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.route_scopes
DROP TABLE IF EXISTS `route_scopes`;
CREATE TABLE IF NOT EXISTS `route_scopes` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.route_scopes: ~2 rows (ungefähr)
DELETE FROM `route_scopes`;
/*!40000 ALTER TABLE `route_scopes` DISABLE KEYS */;
INSERT INTO `route_scopes` (`ID`, `name`) VALUES
	(1, 'admin'),
	(2, 'custom');
/*!40000 ALTER TABLE `route_scopes` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.search_results
DROP TABLE IF EXISTS `search_results`;
CREATE TABLE IF NOT EXISTS `search_results` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `search_type` varchar(255) NOT NULL,
  `hashed_term` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `search_type` (`search_type`,`hashed_term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.search_results: ~0 rows (ungefähr)
DELETE FROM `search_results`;
/*!40000 ALTER TABLE `search_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_results` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.search_result_models
DROP TABLE IF EXISTS `search_result_models`;
CREATE TABLE IF NOT EXISTS `search_result_models` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `search_result_id` bigint(20) NOT NULL,
  `model` varchar(255) NOT NULL,
  `model_id` bigint(20) NOT NULL,
  `clicked` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `search_result_id` (`search_result_id`,`model`,`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.search_result_models: ~0 rows (ungefähr)
DELETE FROM `search_result_models`;
/*!40000 ALTER TABLE `search_result_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_result_models` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.seo_models
DROP TABLE IF EXISTS `seo_models`;
CREATE TABLE IF NOT EXISTS `seo_models` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) NOT NULL,
  `model` varchar(50) NOT NULL,
  `bookmark_column` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `route_id` (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.seo_models: ~0 rows (ungefähr)
DELETE FROM `seo_models`;
/*!40000 ALTER TABLE `seo_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `seo_models` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.session_data
DROP TABLE IF EXISTS `session_data`;
CREATE TABLE IF NOT EXISTS `session_data` (
  `session_id` varchar(32) NOT NULL DEFAULT '',
  `hash` varchar(32) NOT NULL DEFAULT '',
  `session_data` blob NOT NULL,
  `session_expire` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.session_data: ~0 rows (ungefähr)
DELETE FROM `session_data`;
/*!40000 ALTER TABLE `session_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `session_data` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.static_content
DROP TABLE IF EXISTS `static_content`;
CREATE TABLE IF NOT EXISTS `static_content` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `html` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.static_content: ~2 rows (ungefähr)
DELETE FROM `static_content`;
/*!40000 ALTER TABLE `static_content` DISABLE KEYS */;
INSERT INTO `static_content` (`ID`, `name`, `html`) VALUES
	(1, 'header', '<!DOCTYPE html>\r\n<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->\r\n<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->\r\n<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->\r\n<!--[if gt IE 8]><!--> <html class="no-js" lang="de"> <!--<![endif]-->\r\n<head>\r\n    <meta charset="utf-8">\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n\r\n    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"> \r\n\r\n    <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.14.2/TweenMax.min.js"></script>\r\n    <script src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/ScrollMagic.min.js"></script>\r\n    <script src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/animation.gsap.js"></script>\r\n    <script src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/debug.addIndicators.min.js"></script> \r\n\r\n    {{#meta-description}}\r\n    {{#meta-keywords}}\r\n\r\n    {{#title}}\r\n</head>\r\n    <body id="np-body">\r\n	<!--[if lt IE 7]>\r\n	    <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>\r\n        <![endif]-->\r\n	\r\n	<!--[if gte IE 9]>\r\n	  <style type="text/css">\r\n	    .gradient {\r\n	       filter: none;\r\n	    }\r\n	  </style>\r\n	<![endif]-->	\r\n        <div id="qunit"></div>\r\n        <div id="qunit-fixture"></div>'),
	(2, 'footer', '    </body>\r\n</html>\r\n');
/*!40000 ALTER TABLE `static_content` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.taxes
DROP TABLE IF EXISTS `taxes`;
CREATE TABLE IF NOT EXISTS `taxes` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `tax_id` bigint(20) NOT NULL,
  `tax` int(10) NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  `user` bigint(20) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.taxes: ~46 rows (ungefähr)
DELETE FROM `taxes`;
/*!40000 ALTER TABLE `taxes` DISABLE KEYS */;
/*!40000 ALTER TABLE `taxes` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `prename` varchar(50) NOT NULL,
  `street` varchar(100) NOT NULL,
  `zip` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `birthdate` datetime NOT NULL,
  `password` varchar(256) NOT NULL,
  `status` varchar(100) NOT NULL,
  `enabled` int(1) NOT NULL DEFAULT '1',
  `deleted` int(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `pw_reset` varchar(256) NOT NULL,
  `pw_temp` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.users: ~1 rows (ungefähr)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `group`, `name`, `prename`, `street`, `zip`, `email`, `gender`, `birthdate`, `password`, `status`, `enabled`, `deleted`, `created_at`, `updated_at`, `pw_reset`, `pw_temp`) VALUES
	(1, 1, 'Admin', 'Admin', '', '', 'admin@np.dev', 'male', '0000-00-00 00:00:00', 'Zdrwim3hr0wssI0PGDs8PKgIUoF6i3QDDMq0hxEVeUBakhOqHQeo4oTGpYFvYsunaGAnc0ffmC1j2uT1u7pxo7gA5iqE4q4J1MtLMBAeGdsGxZN9zTYnaN2zP1kkQjf_0a8f8397b28fa746c6622fcdf5b6d0e963d810afcbc53b7db92459820119c73d4e3d55d3377e9aa511898d10a0c9788f3cfc744bb8b0ef3e9640a4deea5bb6a0', '', 1, 0, '2016-07-10 12:47:50', '0000-00-00 00:00:00', '', '');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.user_billings
DROP TABLE IF EXISTS `user_billings`;
CREATE TABLE IF NOT EXISTS `user_billings` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `checkout_billing_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `billing_relation` (`user_id`,`checkout_billing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.user_billings: ~1 rows (ungefähr)
DELETE FROM `user_billings`;
/*!40000 ALTER TABLE `user_billings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_billings` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.user_companies
DROP TABLE IF EXISTS `user_companies`;
CREATE TABLE IF NOT EXISTS `user_companies` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company` varchar(255) NOT NULL,
  `ustid` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `user_company` (`ustid`,`user_id`,`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.user_companies: ~3 rows (ungefähr)
DELETE FROM `user_companies`;
/*!40000 ALTER TABLE `user_companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_companies` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.user_orders
DROP TABLE IF EXISTS `user_orders`;
CREATE TABLE IF NOT EXISTS `user_orders` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `payer_id` varchar(256) NOT NULL,
  `client_id` varchar(256) NOT NULL,
  `token` varchar(256) NOT NULL,
  `gateway` varchar(20) NOT NULL,
  `gateway_token` varchar(256) NOT NULL,
  `delivery` varchar(40) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `name` varchar(50) NOT NULL,
  `prename` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `ustid` varchar(100) NOT NULL,
  `billing_country` varchar(50) NOT NULL,
  `billing_street` varchar(100) NOT NULL,
  `billing_postal` varchar(16) NOT NULL,
  `billing_city` varchar(50) NOT NULL,
  `shipping_gender` varchar(50) NOT NULL,
  `shipping_name` varchar(50) NOT NULL,
  `shipping_prename` varchar(50) NOT NULL,
  `shipping_country` varchar(50) NOT NULL,
  `shipping_street` varchar(50) NOT NULL,
  `shipping_postal` varchar(16) NOT NULL,
  `shipping_city` varchar(50) NOT NULL,
  `iban` text,
  `bic` text,
  `owner` text,
  `mandat_ref_date` varchar(18) DEFAULT NULL,
  `confirmed` int(1) NOT NULL DEFAULT '0',
  `delivered` int(1) NOT NULL DEFAULT '0',
  `processing` int(1) NOT NULL DEFAULT '0',
  `paid` int(1) NOT NULL DEFAULT '0',
  `done` int(1) NOT NULL DEFAULT '0',
  `wawi_sync` varchar(30) DEFAULT NULL,
  `order_mail` int(1) NOT NULL DEFAULT '0',
  `error` int(1) NOT NULL DEFAULT '0',
  `deleted` int(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.user_orders: ~1 rows (ungefähr)
DELETE FROM `user_orders`;
/*!40000 ALTER TABLE `user_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_orders` ENABLE KEYS */;


-- Exportiere Struktur von Tabelle core.user_shippings
DROP TABLE IF EXISTS `user_shippings`;
CREATE TABLE IF NOT EXISTS `user_shippings` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `checkout_shipping_id` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `checkout_shipping_id` (`checkout_shipping_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle core.user_shippings: ~1 rows (ungefähr)
DELETE FROM `user_shippings`;
/*!40000 ALTER TABLE `user_shippings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_shippings` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
