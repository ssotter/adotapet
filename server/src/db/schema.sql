-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- TABELA: neighborhoods
-- =========================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- =========================
-- TABELA: users
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- TABELA: pet_posts
-- =========================
CREATE TABLE IF NOT EXISTS pet_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN ('ADOPTION', 'FOUND_LOST')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED')),

  species TEXT NOT NULL CHECK (species IN ('DOG', 'CAT')),
  name TEXT NULL,

  color TEXT NOT NULL,
  age_months INT NOT NULL CHECK (age_months >= 0 AND age_months <= 360),
  weight_kg NUMERIC(6,2) NOT NULL CHECK (weight_kg >= 0 AND weight_kg <= 200),

  sex TEXT NOT NULL DEFAULT 'UNKNOWN' CHECK (sex IN ('M', 'F', 'UNKNOWN')),
  size TEXT NULL CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE')),

  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),

  description TEXT NOT NULL,
  event_date DATE NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- TABELA: pet_photos
-- =========================
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES pet_posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- TABELA: visit_requests
-- =========================
CREATE TABLE IF NOT EXISTS visit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES pet_posts(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  message TEXT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (post_id, requester_id)
);
