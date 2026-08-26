-- Create storage policies for the 'media' bucket
-- Public read: anyone can view uploaded images
CREATE POLICY "media_bucket_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

-- Only authenticated (admin) can upload
CREATE POLICY "media_bucket_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Only authenticated (admin) can update/replace
CREATE POLICY "media_bucket_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- Only authenticated (admin) can delete
CREATE POLICY "media_bucket_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
