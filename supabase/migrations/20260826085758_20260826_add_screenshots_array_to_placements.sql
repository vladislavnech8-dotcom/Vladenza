-- Add screenshots array column to placements table
-- Keeps existing screenshot_url column for backward compatibility (single screenshot)
-- New screenshots column supports multiple images
ALTER TABLE placements ADD COLUMN IF NOT EXISTS screenshots text[] NOT NULL DEFAULT '{}';
