CREATE TABLE IF NOT EXISTS `polls` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `description` text NOT NULL,
  `status_id` int UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);