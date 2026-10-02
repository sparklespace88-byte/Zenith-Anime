export const MYSQL_DATABASE_SQL = `-- ========================================================
-- ZenithAnime / Anime Stream Streaming Platform
-- Production MySQL Database Schema & Sample Dataset
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, XAMPP & phpMyAdmin
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`zenith_anime_db\`;
CREATE DATABASE \`zenith_anime_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`zenith_anime_db\`;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('user', 'admin', 'moderator') NOT NULL DEFAULT 'user',
  \`avatar\` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  \`bio\` TEXT NULL,
  \`is_blocked\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_user_email\` (\`email\`),
  INDEX \`idx_user_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: genres
-- --------------------------------------------------------
CREATE TABLE \`genres\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(50) NOT NULL UNIQUE,
  \`slug\` VARCHAR(60) NOT NULL UNIQUE,
  \`description\` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: anime
-- --------------------------------------------------------
CREATE TABLE \`anime\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`alt_title\` VARCHAR(255) NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`synopsis\` TEXT NOT NULL,
  \`type\` ENUM('TV', 'Movie', 'OVA', 'ONA') NOT NULL DEFAULT 'TV',
  \`status\` ENUM('Ongoing', 'Completed') NOT NULL DEFAULT 'Ongoing',
  \`release_year\` SMALLINT UNSIGNED NOT NULL DEFAULT 2024,
  \`rating\` DECIMAL(3, 1) NOT NULL DEFAULT 0.0,
  \`rating_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`total_episodes\` SMALLINT UNSIGNED NOT NULL DEFAULT 12,
  \`studio\` VARCHAR(100) NOT NULL DEFAULT 'Studio MAPPA',
  \`language\` VARCHAR(50) NOT NULL DEFAULT 'Sub & Dub',
  \`banner_image\` TEXT NOT NULL,
  \`poster_image\` TEXT NOT NULL,
  \`trailer_url\` TEXT NULL,
  \`views_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_trending\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_popular\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_published\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_anime_status\` (\`status\`),
  INDEX \`idx_anime_type\` (\`type\`),
  INDEX \`idx_anime_rating\` (\`rating\`),
  INDEX \`idx_anime_year\` (\`release_year\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: anime_genres (Pivot Table)
-- --------------------------------------------------------
CREATE TABLE \`anime_genres\` (
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`genre_id\` INT UNSIGNED NOT NULL,
  PRIMARY KEY (\`anime_id\`, \`genre_id\`),
  CONSTRAINT \`fk_ag_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_ag_genre\` FOREIGN KEY (\`genre_id\`) REFERENCES \`genres\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: episodes
-- --------------------------------------------------------
CREATE TABLE \`episodes\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`episode_number\` SMALLINT UNSIGNED NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`duration\` VARCHAR(20) NOT NULL DEFAULT '24m',
  \`thumbnail\` TEXT NOT NULL,
  \`video_url\` TEXT NOT NULL,
  \`views\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`release_date\` DATE NOT NULL,
  \`synopsis\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_episodes_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uq_anime_episode\` (\`anime_id\`, \`episode_number\`),
  INDEX \`idx_ep_number\` (\`episode_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: reviews (Ratings & Detailed Critiques)
-- --------------------------------------------------------
CREATE TABLE \`reviews\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`rating\` TINYINT UNSIGNED NOT NULL CHECK (\`rating\` BETWEEN 1 AND 10),
  \`review_text\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_reviews_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_reviews_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uq_user_anime_review\` (\`anime_id\`, \`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: comments (Episode & Anime Discussion)
-- --------------------------------------------------------
CREATE TABLE \`comments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`episode_id\` INT UNSIGNED NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`content\` TEXT NOT NULL,
  \`likes_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`dislikes_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`is_approved\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_comments_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_comments_episode\` FOREIGN KEY (\`episode_id\`) REFERENCES \`episodes\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_comments_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: replies (Nested Comment Replies)
-- --------------------------------------------------------
CREATE TABLE \`replies\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`comment_id\` INT UNSIGNED NOT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`content\` TEXT NOT NULL,
  \`likes_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_replies_comment\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comments\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_replies_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: watchlists
-- --------------------------------------------------------
CREATE TABLE \`watchlists\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`status\` ENUM('watching', 'plan_to_watch', 'completed', 'on_hold', 'dropped') NOT NULL DEFAULT 'watching',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_wl_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_wl_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uq_user_watchlist\` (\`user_id\`, \`anime_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: favorites
-- --------------------------------------------------------
CREATE TABLE \`favorites\` (
  \`user_id\` INT UNSIGNED NOT NULL,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`user_id\`, \`anime_id\`),
  CONSTRAINT \`fk_fav_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_fav_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: watch_history
-- --------------------------------------------------------
CREATE TABLE \`watch_history\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`anime_id\` INT UNSIGNED NOT NULL,
  \`episode_id\` INT UNSIGNED NOT NULL,
  \`progress_seconds\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`duration_seconds\` INT UNSIGNED NOT NULL DEFAULT 1440,
  \`last_watched_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_wh_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_wh_anime\` FOREIGN KEY (\`anime_id\`) REFERENCES \`anime\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_wh_episode\` FOREIGN KEY (\`episode_id\`) REFERENCES \`episodes\` (\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uq_user_anime_history\` (\`user_id\`, \`anime_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- Initial Data Seeding
-- ========================================================

-- Users (Passwords hashed using password_hash('password123', PASSWORD_BCRYPT))
INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`email\`, \`password_hash\`,\`role\`, \`avatar\`, \`bio\`) VALUES
(1, 'Admin Otaku', 'admin', 'admin@zenithanime.com', '$2y$10$e7pQ5zZ6yY4e7C1.jQ1y.u9wX.eOqHj8vW2A.o7Tz/x0N5k6t4X9G', 'admin', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150', 'Senior Content Curator & Site Administrator.'),
(2, 'Muhammad Faizan', 'faizan_otaku', 'muhammadfaiza903@gmail.com', '$2y$10$e7pQ5zZ6yY4e7C1.jQ1y.u9wX.eOqHj8vW2A.o7Tz/x0N5k6t4X9G', 'user', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Avid shounen and dark fantasy enthusiast.'),
(3, 'Sakura Haruno', 'sakura_h', 'sakura@animefan.net', '$2y$10$e7pQ5zZ6yY4e7C1.jQ1y.u9wX.eOqHj8vW2A.o7Tz/x0N5k6t4X9G', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Anime reviewer and manga collector.');

-- Genres
INSERT INTO \`genres\` (\`id\`, \`name\`, \`slug\`, \`description\`) VALUES
(1, 'Action', 'action', 'High octane combat and thrilling confrontations'),
(2, 'Fantasy', 'fantasy', 'Magic, mythical beings, and mystical realms'),
(3, 'Shounen', 'shounen', 'Inspiring journeys of courage, power and friendship'),
(4, 'Supernatural', 'supernatural', 'Paranormal spirits, curses, and deities'),
(5, 'Adventure', 'adventure', 'Epic expeditions across uncharted territories'),
(6, 'Sci-Fi', 'sci-fi', 'Futuristic dystopias, cybernetics, and technology'),
(7, 'Drama', 'drama', 'Deep character struggles and emotional narratives'),
(8, 'Romance', 'romance', 'Heartfelt connections and romantic stories');
`;
