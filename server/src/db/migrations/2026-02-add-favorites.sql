-- =========================
-- TABELA: favorites
-- user <-> pet_posts (N:N)
-- =========================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES pet_posts(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id
ON favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_post_id
ON favorites(post_id);
