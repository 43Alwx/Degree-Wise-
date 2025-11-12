import formidable from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import { uploadToStorage } from '../../lib/supabase'
import { extractTextFromImage, parseTranscriptText, matchCourses } from '../../lib/ocrProcessor'
import { generateRecommendations, calculateDegreeProgress, recommendNextSemester } from '../../lib/recommendationEngine'
import prisma from '../../lib/prisma'

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

  let tempFilePath = null

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: false,
      filter: function ({ mimetype }) {
        // Accept only images and PDFs
        return mimetype && (mimetype.includes('image') || mimetype.includes('pdf'))
      }
    })

    const [fields, files] = await form.parse(req)
    const imageFile = files.image?.[0]

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      })
    }

    tempFilePath = imageFile.filepath

    // Step 1: Upload to Supabase Storage
    console.log('Uploading to Supabase Storage...')
    const timestamp = Date.now()
    const fileName = `transcripts/${timestamp}-${imageFile.originalFilename || 'transcript.jpg'}`

    const fileBuffer = await fs.readFile(tempFilePath)
    const { url: imageUrl } = await uploadToStorage(
      fileBuffer,
      'transcripts',
      fileName
    )

    console.log('File uploaded:', imageUrl)

    // Step 2: Run OCR
    console.log('Running OCR...')
    const extractedText = await extractTextFromImage(tempFilePath)
    console.log('OCR completed, extracted text length:', extractedText.length)

    // Step 3: Parse transcript
    console.log('Parsing transcript...')
    const extractedCourses = parseTranscriptText(extractedText)
    console.log('Extracted courses:', extractedCourses.length)

    // Step 4: Match with database courses
    console.log('Matching courses with database...')
    const allCourses = await prisma.course.findMany({
      include: {
        prerequisites: true,
        prerequisiteFor: true
      }
    })

    const { matched, unmatched } = matchCourses(extractedCourses, allCourses)
    console.log('Matched courses:', matched.length, 'Unmatched:', unmatched.length)

    // Step 5: Get userId from session/query (for now, use from request body or create demo user)
    // TODO: Replace with actual auth session
    const userId = fields.userId?.[0] || 'demo-user-id'

    // Ensure user exists (create demo user if needed)
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user && userId === 'demo-user-id') {
      user = await prisma.user.create({
        data: {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User'
        }
      })
    }

    // Step 6: Save matched courses to database
    console.log('Saving completed courses to database...')
    const savedCourses = []

    for (const course of matched) {
      // Check if already exists
      const existing = await prisma.completedCourse.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: course.courseId
          }
        }
      })

      if (!existing) {
        const saved = await prisma.completedCourse.create({
          data: {
            userId: userId,
            courseId: course.courseId,
            semester: course.semester,
            grade: course.grade
          },
          include: {
            course: true
          }
        })
        savedCourses.push(saved)
      } else {
        savedCourses.push(existing)
      }
    }

    // Step 7: Generate recommendations
    console.log('Generating recommendations...')
    const completedCourseIds = savedCourses.map(c => c.courseId)
    const recommendations = generateRecommendations(completedCourseIds, allCourses)

    // Get current term offerings
    const currentTermOfferings = await prisma.courseOffering.findMany({
      where: {
        termDescription: 'Spring 2026' // TODO: Make dynamic
      },
      include: {
        course: true
      }
    })

    const nextSemesterRecommendations = recommendNextSemester(
      recommendations.available,
      currentTermOfferings,
      4
    )

    // Calculate degree progress
    const progress = calculateDegreeProgress(
      savedCourses.map(sc => ({
        credits: sc.course.credits,
        grade: sc.grade
      }))
    )

    // Cleanup temp file
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {})
    }

    return res.status(200).json({
      success: true,
      imageUrl,
      extractedText: extractedText.substring(0, 500), // First 500 chars for debugging
      courses: {
        matched: matched.length,
        unmatched: unmatched.length,
        saved: savedCourses.length
      },
      recommendations: {
        completed: recommendations.completed.length,
        available: recommendations.available.length,
        blocked: recommendations.blocked.length,
        nextSemester: nextSemesterRecommendations
      },
      progress,
      unmatchedCourses: unmatched, // So user can manually review
      message: `Successfully processed ${matched.length} courses. ${unmatched.length} courses could not be matched.`
    })

  } catch (error) {
    console.error('Upload error:', error)

    // Cleanup temp file on error
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {})
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process transcript. Please try again.'
    })
  }
}

/*
IMPLEMENTATION NOTES:

✅ Phase 1: File Upload & Storage - COMPLETE
- Uses formidable to parse multipart form data
- Validates file type (images and PDFs only) and size (10MB max)
- Uploads to Supabase Storage bucket 'transcripts'

✅ Phase 2: OCR Processing - COMPLETE
- Uses Tesseract.js for text extraction
- Processes images and extracts text content

✅ Phase 3: Course Matching - COMPLETE
- Parses transcript text for course codes, grades, semesters
- Matches extracted courses against database courses
- Saves matched courses to CompletedCourse model

✅ Phase 4: Recommendations - COMPLETE
- Generates available/blocked course lists based on prerequisites
- Recommends courses for next semester based on offerings
- Calculates degree progress and GPA

TODO for production:
1. Set up Supabase Storage bucket named 'transcripts'
2. Add environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Integrate with authentication (replace demo-user-id with actual session)
4. Improve OCR accuracy for different transcript formats
5. Add manual correction interface for unmatched courses
*/
