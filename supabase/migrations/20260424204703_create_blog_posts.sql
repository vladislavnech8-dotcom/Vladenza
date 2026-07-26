/*
  # Create blog_posts table

  ## New Tables
  - `blog_posts`
    - `id` (uuid, primary key)
    - `slug` (text, unique) — URL-friendly identifier, e.g. "my-post-title"
    - `title` (text) — article title
    - `excerpt` (text) — short summary shown on listing pages
    - `category` (text) — e.g. "Link Building", "AI & LLM SEO"
    - `category_color` (text) — tailwind classes string for badge styling
    - `read_time` (text) — e.g. "8 min read"
    - `image_url` (text) — hero image URL (Pexels)
    - `tags` (text[]) — array of tag strings
    - `content_json` (jsonb) — article body as structured JSON sections
    - `published` (boolean) — draft vs published
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    - `created_by` (uuid, references auth.users)

  ## Security
  - RLS enabled
  - Authenticated users (admins) can INSERT, UPDATE, DELETE
  - Anyone can SELECT published posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  category_color text NOT NULL DEFAULT 'text-gray-600 bg-gray-50 border-gray-200',
  read_time text NOT NULL DEFAULT '5 min read',
  image_url text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  content_json jsonb NOT NULL DEFAULT '[]',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Authenticated users can read all posts (including drafts) for admin
CREATE POLICY "Authenticated users can read all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published, created_at DESC);
