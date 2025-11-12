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
  const lines = text.split('\n')

  // Common semester patterns
  const semesterRegex = /(Fall|Spring|Summer)\s+(\d{4})/i
  let currentSemester = null

  // Course code patterns: CS1050, CS 1050, MTH1410, etc.
  const courseRegex = /([A-Z]{2,4})\s*(\d{4})/i

  // Grade patterns: A, A-, B+, C, etc.
  const gradeRegex = /\b([A-F][+-]?|[ABCDF])\b/

  // Credits pattern: 3, 3.0, 3.00, 4 credits, etc.
  const creditsRegex = /(\d+(?:\.\d+)?)\s*(?:credits?)?/i

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    // Check for semester line
    const semesterMatch = trimmedLine.match(semesterRegex)
    if (semesterMatch) {
      currentSemester = `${semesterMatch[1]} ${semesterMatch[2]}`
      continue
    }

    // Check for course line
    const courseMatch = trimmedLine.match(courseRegex)
    if (courseMatch) {
      const courseCode = `${courseMatch[1].toUpperCase()}${courseMatch[2]}`

      // Try to extract course name (text between code and grade)
      const afterCode = trimmedLine.substring(courseMatch.index + courseMatch[0].length)
      const gradeMatch = afterCode.match(gradeRegex)

      let courseName = ''
      let grade = null
      let credits = 3 // Default

      if (gradeMatch) {
        grade = gradeMatch[1]
        // Course name is between code and grade
        courseName = afterCode.substring(0, gradeMatch.index).trim()

        // Look for credits after grade
        const afterGrade = afterCode.substring(gradeMatch.index + gradeMatch[0].length)
        const creditsMatch = afterGrade.match(creditsRegex)
        if (creditsMatch) {
          credits = parseFloat(creditsMatch[1])
        }
      } else {
        // No grade found, just take rest as name
        courseName = afterCode.trim()
      }

      courses.push({
        code: courseCode,
        name: courseName || `Course ${courseCode}`,
        grade: grade || 'P', // Default to Pass if no grade
        credits: credits,
        semester: currentSemester || 'Unknown'
      })
    }
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
