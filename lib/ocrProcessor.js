import { createWorker } from 'tesseract.js'

/**
 * Extract text from an image using Tesseract OCR
 * @param {string|Buffer} imagePath - Path to image or buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromImage(imagePath) {
  const worker = await createWorker('eng')

  try {
    const { data: { text } } = await worker.recognize(imagePath)
    return text
  } finally {
    await worker.terminate()
  }
}

/**
 * Parse transcript text to extract course information
 * Looks for patterns like:
 * - CS1050 Computer Science I A 4.00
 * - MTH 1410 Calculus I B+ 4
 * - CS 2050 Fall 2023 A- 3.00
 *
 * @param {string} text - OCR extracted text
 * @returns {Array<{code: string, name: string, grade: string, credits: number, semester: string}>}
 */
export function parseTranscriptText(text) {
  const courses = []

  console.log('[Parser] Text length:', text.length)

  // Pattern to match course entries like: CS   1050   Computer Science 1   T   4.000
  // Department (2-4 letters) + spaces + 4 digits + spaces + title + spaces + grade + spaces + credits
  const coursePattern = /\b([A-Z]{2,4})\s+(\d{4})\s+([^T]+?)\s+([A-F][+-]?|T|P|W|I|[ABCDF])\s+(\d+(?:\.\d+)?)/gi

  const matches = [...text.matchAll(coursePattern)]
  console.log('[Parser] Found', matches.length, 'course matches')

  // Also look for semester markers
  const semesterPattern = /(Fall|Spring|Summer)\s+(\d{4})/gi
  const semesterMatches = [...text.matchAll(semesterPattern)]
  console.log('[Parser] Found', semesterMatches.length, 'semester markers')

  for (const match of matches) {
    const [, dept, number, title, grade, credits] = match
    const courseCode = `${dept.toUpperCase()}${number}`

    // Try to determine semester based on position in text
    let semester = 'Unknown'
    const matchPosition = match.index

    // Find the closest semester marker before this course
    for (let i = semesterMatches.length - 1; i >= 0; i--) {
      if (semesterMatches[i].index < matchPosition) {
        semester = `${semesterMatches[i][1]} ${semesterMatches[i][2]}`
        break
      }
    }

    courses.push({
      code: courseCode,
      name: title.trim(),
      grade: grade.toUpperCase(),
      credits: parseFloat(credits),
      semester: semester
    })
  }

  console.log('[Parser] Extracted', courses.length, 'courses')
  if (courses.length > 0) {
    console.log('[Parser] Sample:', courses[0])
  }

  return courses
}

/**
 * Match extracted courses to degree requirement courses
 * @param {Array} extractedCourses - Courses from transcript
 * @param {Array} allCourses - All courses from database
 * @returns {Object} - { matched, unmatched }
 */
export function matchCourses(extractedCourses, allCourses) {
  const matched = []
  const unmatched = []

  // Create a map of course codes for quick lookup
  const courseMap = new Map(
    allCourses.map(course => [course.code.toUpperCase(), course])
  )

  for (const extracted of extractedCourses) {
    const normalizedCode = extracted.code.toUpperCase()
    const dbCourse = courseMap.get(normalizedCode)

    if (dbCourse) {
      matched.push({
        ...extracted,
        courseId: dbCourse.id,
        courseName: dbCourse.name, // Use official name from DB
        category: dbCourse.category
      })
    } else {
      unmatched.push(extracted)
    }
  }

  return { matched, unmatched }
}
