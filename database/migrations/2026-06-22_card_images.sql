-- Migration: card_images
-- Adds per-section images (question/answer/explanation) to flashcards.
-- Files live on disk under public/uploads/; this table stores only metadata.
-- Apply: sudo mysql falschcard < database/migrations/2026-06-22_card_images.sql

USE falschcard;

CREATE TABLE IF NOT EXISTS card_images (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  card_id    BIGINT UNSIGNED NOT NULL,
  section    ENUM('question','answer','explanation') NOT NULL,
  position   TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- 0..2, order within the section
  path       VARCHAR(255)    NOT NULL,              -- relative to public/, e.g. uploads/ab/cd123.webp
  width      SMALLINT UNSIGNED NULL DEFAULT NULL,
  height     SMALLINT UNSIGNED NULL DEFAULT NULL,
  bytes      INT UNSIGNED    NULL DEFAULT NULL,
  alt        VARCHAR(255)    NULL DEFAULT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ci_card (card_id, section, position),
  CONSTRAINT fk_ci_card
    FOREIGN KEY (card_id)
    REFERENCES flashcards (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
