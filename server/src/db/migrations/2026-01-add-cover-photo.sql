-- =========================
-- ADD cover photo to pet_posts
-- =========================

ALTER TABLE pet_posts
ADD COLUMN IF NOT EXISTS cover_photo_id UUID NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_pet_posts_cover_photo'
  ) THEN
    ALTER TABLE pet_posts
    ADD CONSTRAINT fk_pet_posts_cover_photo
    FOREIGN KEY (cover_photo_id)
    REFERENCES pet_photos(id)
    ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pet_posts_cover_photo_id
ON pet_posts(cover_photo_id);
