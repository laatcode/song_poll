CREATE TABLE IF NOT EXISTS `polls_songs` (
  `poll_id` int UNSIGNED NOT NULL,
  `song_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`poll_id`,`song_id`),
  FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);