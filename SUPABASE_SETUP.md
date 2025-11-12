# Supabase Storage Setup Guide

## Quick Setup (5 minutes)

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Name it: `transcripts`
5. Set to **Public** (so uploaded transcript images can be accessed)
6. Click **Create Bucket**

### 2. Set Up Storage Policies

By default, the bucket needs policies to allow uploads. Go to **Storage > Policies**:

#### Policy 1: Allow Public Upload
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'transcripts');
```

#### Policy 2: Allow Public Read
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'transcripts');
```

### 3. Add Environment Variables

1. In your Supabase Dashboard, go to **Project Settings > API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create `.env` file in your project root (if it doesn't exist):

```bash
cp .env.example .env
```

4. Update these values in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://[your-project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 4. Test the Upload

You can test the endpoint with curl:

```bash
curl -X POST http://localhost:3002/api/upload-transcript \
  -F "image=@/path/to/your/transcript.jpg" \
  -F "userId=demo-user-id"
```

Or use the frontend TranscriptUploader component!

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env` file exists and has the correct variables
- Restart your Next.js dev server after adding env vars

### Error: "Upload failed: new row violates row-level security policy"
- Check that storage policies are set up correctly
- Make sure bucket is set to Public

### Error: "Bucket not found"
- Verify the bucket is named exactly `transcripts`
- Check that the bucket exists in Supabase Dashboard

---

## Alternative: Skip Storage (Quick Test)

If you want to test OCR without setting up Supabase Storage, you can temporarily comment out the upload step in `pages/api/upload-transcript.js` lines 49-61 and set `imageUrl = 'local-test'`.
