CREATE TABLE IF NOT EXISTS `poll_votes` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `poll_id` int UNSIGNED NOT NULL,
  `song_id` int UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_vote` (`poll_id`, `ip_address`, `user_agent`(100)),
  FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE CASCADE
);