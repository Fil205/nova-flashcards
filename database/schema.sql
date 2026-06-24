-- Falschcard — MariaDB schema
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS falschcard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE falschcard;

-- ─── profiles ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(80)     NOT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_profiles_name (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── profile_settings ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profile_settings (
  profile_id         BIGINT UNSIGNED NOT NULL,
  -- Gemini API key encrypted with AES-256-GCM (IV + tag + ciphertext, base64)
  gemini_api_key     VARBINARY(640)  NULL        DEFAULT NULL,
  gemini_model       VARCHAR(80)     NOT NULL     DEFAULT 'gemini-3.5-flash',
  auto_read_question TINYINT(1)      NOT NULL     DEFAULT 0,
  tts_voice_uri      VARCHAR(255)    NULL         DEFAULT NULL,
  tts_rate           DECIMAL(3,2)    NOT NULL     DEFAULT 1.00,
  tts_pitch          DECIMAL(3,2)    NOT NULL     DEFAULT 1.00,
  theme              VARCHAR(20)     NOT NULL     DEFAULT 'dark',
  -- JSON blob for future preference keys (no schema migration needed)
  extra              JSON            NULL         DEFAULT NULL,
  updated_at         DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP
                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_id),
  CONSTRAINT fk_settings_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── decks ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS decks (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  profile_id      BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(120)    NOT NULL,
  description     TEXT            NULL         DEFAULT NULL,
  lang            VARCHAR(12)     NULL         DEFAULT NULL,  -- BCP-47 (e.g. 'it-IT')
  source          ENUM('manual','import-txt','import-json','ai','example')
                  NOT NULL DEFAULT 'manual',
  position        INT UNSIGNED    NOT NULL     DEFAULT 0,
  times_studied   INT UNSIGNED    NOT NULL     DEFAULT 0,
  last_score      DECIMAL(5,4)    NULL         DEFAULT NULL,  -- 0.0000–1.0000
  last_studied_at DATETIME        NULL         DEFAULT NULL,
  mastery         DECIMAL(5,4)    NULL         DEFAULT NULL,  -- 0.0000–1.0000
  created_at      DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_decks_profile (profile_id, position),
  CONSTRAINT fk_decks_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── flashcards ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS flashcards (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  deck_id     BIGINT UNSIGNED NOT NULL,
  question    TEXT            NOT NULL,
  answer      TEXT            NOT NULL,
  explanation TEXT            NULL         DEFAULT NULL,
  position    INT UNSIGNED    NOT NULL     DEFAULT 0,
  created_at  DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cards_deck (deck_id, position),
  CONSTRAINT fk_cards_deck
    FOREIGN KEY (deck_id)
    REFERENCES decks (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── card_images ─────────────────────────────────────────────────────────────────
-- Per-section images (question/answer/explanation) for a flashcard.
-- Files live on disk under public/uploads/; this table stores only metadata.

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

-- ─── study_sessions ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS study_sessions (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  profile_id  BIGINT UNSIGNED NOT NULL,
  deck_id     BIGINT UNSIGNED NOT NULL,
  mode        ENUM('sequential','shuffle') NOT NULL DEFAULT 'sequential',
  total       INT UNSIGNED    NOT NULL,
  correct     INT UNSIGNED    NOT NULL,
  partial     INT UNSIGNED    NOT NULL,
  wrong       INT UNSIGNED    NOT NULL,
  score       DECIMAL(5,4)    NOT NULL,
  duration_ms BIGINT UNSIGNED NULL         DEFAULT NULL,
  created_at  DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sessions_deck    (deck_id, created_at),
  KEY idx_sessions_profile (profile_id, created_at),
  CONSTRAINT fk_sessions_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_sessions_deck
    FOREIGN KEY (deck_id)
    REFERENCES decks (id)
    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── card_reviews ──────────────────────────────────────────────────────────────
-- Tracks per-profile cards the user has marked as "didn't know".
-- Upserted at session end; cleared when the card is answered correctly.

CREATE TABLE IF NOT EXISTS card_reviews (
  profile_id     BIGINT UNSIGNED NOT NULL,
  card_id        BIGINT UNSIGNED NOT NULL,
  missed_count   INT UNSIGNED    NOT NULL DEFAULT 1,
  last_missed_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_id, card_id),
  CONSTRAINT fk_cr_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cr_card
    FOREIGN KEY (card_id)
    REFERENCES flashcards (id)
    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ─── generation_logs ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS generation_logs (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  profile_id BIGINT UNSIGNED NOT NULL,
  kind       ENUM('evaluate','review','tutor') NOT NULL,
  model      VARCHAR(80)     NOT NULL,
  ok         TINYINT(1)      NOT NULL DEFAULT 1,
  error      VARCHAR(255)    NULL     DEFAULT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_logs_profile (profile_id, created_at),
  CONSTRAINT fk_logs_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles (id)
    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
