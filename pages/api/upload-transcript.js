// API endpoint for transcript upload
// This is a placeholder - will be implemented with actual OCR and storage logic

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle multipart/form-data
  },
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    // TODO: Parse multipart form data (use formidable or busboy)
    // TODO: Validate file type and size
    // TODO: Upload to storage (Supabase Storage/Vercel Blob)
    // TODO: Run OCR on the image
    // TODO: Extract course data
    // TODO: Store in database

    // PLACEHOLDER: Return mock data for now
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing

    // Mock extracted course data
    const mockCourses = [
      {
        code: 'CS1050',
        name: 'Computer Science I',
        semester: 'Fall 2023',
        grade: 'A',
        credits: 4
      },
      {
        code: 'MTH1410',
        name: 'Calculus I',
        semester: 'Fall 2023',
        grade: 'B+',
        credits: 4
      },
      {
        code: 'ENG1020',
        name: 'English Composition',
        semester: 'Fall 2023',
        grade: 'A-',
        credits: 3
      },
      {
        code: 'CS2050',
        name: 'Computer Science II',
        semester: 'Spring 2024',
        grade: 'A',
        credits: 4
      },
      {
        code: 'MTH2420',
        name: 'Discrete Mathematics',
        semester: 'Spring 2024',
        grade: 'B',
        credits: 3
      }
    ]

    return res.status(200).json({
      success: true,
      courses: mockCourses,
      imageUrl: 'https://placeholder.example.com/transcript.jpg',
      message: 'Transcript processed successfully (using mock data)'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to process transcript. Please try again.'
    })
  }
}

/*
TODO: Implementation checklist for Alex

1. Install dependencies:
   npm install formidable
   OR
   npm install busboy

2. File upload handling:
   - Parse multipart/form-data
   - Save file temporarily or to storage

3. Storage setup (choose one):
   Option A - Supabase Storage:
   - Create bucket in Supabase
   - Upload file using @supabase/supabase-js

   Option B - Vercel Blob:
   - npm install @vercel/blob
   - Use put() method to upload

4. OCR Integration (Phase 2):
   Option A - Tesseract.js (free, runs on server):
   - npm install tesseract.js

   Option B - Google Cloud Vision API (paid, more accurate):
   - Set up GCP credentials
   - npm install @google-cloud/vision

   Option C - AWS Textract (paid):
   - Set up AWS credentials
   - npm install @aws-sdk/client-textract

5. Data extraction:
   - Parse OCR text to extract:
     * Course codes (e.g., "CS1050")
     * Course names
     * Semesters
     * Grades
     * Credits
   - Use regex patterns or NLP

6. Database storage:
   - Save to Prisma database
   - Link to user account

Example implementation with formidable:

import formidable from 'formidable'

export default async function handler(req, res) {
  const form = formidable({ multiples: false })

  const [fields, files] = await form.parse(req)
  const imageFile = files.image[0]

  // Upload to storage
  // Run OCR
  // Extract data
  // Save to DB

  return res.json({ success: true, courses: [...] })
}
*/
