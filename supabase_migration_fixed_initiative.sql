-- Add fixed_initiative column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS fixed_initiative TEXT;
