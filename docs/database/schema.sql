-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: cola
-- ------------------------------------------------------
-- Server version	5.1.73-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `collmex_address_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `street` varchar(120) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `web` varchar(120) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `collmex_address_groups` varchar(120) NOT NULL,
  `location_checked` tinyint(1) unsigned DEFAULT '0',
  `geolocate_count` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `collmex_address_id` (`collmex_address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1360 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_has_offertype`
--

DROP TABLE IF EXISTS `item_has_offertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_has_offertype` (
  `item_id` int(10) unsigned NOT NULL,
  `offertype_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`item_id`,`offertype_id`),
  KEY `offertype_id` (`offertype_id`),
  CONSTRAINT `item_has_offertype_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `item_has_offertype_ibfk_2` FOREIGN KEY (`offertype_id`) REFERENCES `offertype` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_has_product`
--

DROP TABLE IF EXISTS `item_has_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_has_product` (
  `item_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`item_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `item_has_product_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `item_has_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `offertype`
--

DROP TABLE IF EXISTS `offertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offertype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `offertype` WRITE;
/*!40000 ALTER TABLE `offertype` DISABLE KEYS */;
INSERT INTO `offertype` VALUES (1,'Laden',NULL),(2,'Händler',NULL),(3,'Sprecher',NULL),(4,'Onlinehandel',NULL);
/*!40000 ALTER TABLE `offertype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) DEFAULT NULL,
  `description` text,
  `collmex_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Cola',NULL,20),(2,'Bier',NULL,21),(3,'Frohlunder',NULL,29),(4,'Muntermate',NULL,33);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-18 12:36:23
