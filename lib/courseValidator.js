/**
 * Course Validator
 * Validates course data, enrollment eligibility, and input validation
 */

/**
 * Validate course code format
 * Expected format: PREFIX#### (e.g., CS1050, MTH3210)
 * @param {String} courseCode - Course code to validate
 * @returns {Object} { valid, error }
 */
export function validateCourseCode(courseCode) {
  if (!courseCode || typeof courseCode !== 'string') {
    return { valid: false, error: 'Course code is required' }
  }

  const trimmed = courseCode.trim().toUpperCase()

  // Check format: 2-4 letters followed by 4 digits
  const courseCodeRegex = /^[A-Z]{2,4}\d{4}$/

  if (!courseCodeRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid format. Expected format: PREFIX#### (e.g., CS1050)'
    }
  }

  return { valid: true, error: null, normalized: trimmed }
}

/**
 * Validate grade
 * @param {String} grade - Letter grade
 * @returns {Object} { valid, error }
 */
export function validateGrade(grade) {
  if (!grade || typeof grade !== 'string') {
    return { valid: false, error: 'Grade is required' }
  }

  const validGrades = [
    'A', 'A-',
    'B+', 'B', 'B-',
    'C+', 'C', 'C-',
    'D+', 'D', 'D-',
    'F', 'W', 'I', 'P'
  ]

  const normalizedGrade = grade.toUpperCase().trim()

  if (!validGrades.includes(normalizedGrade)) {
    return {
      valid: false,
      error: `Invalid grade. Must be one of: ${validGrades.join(', ')}`
    }
  }

  return { valid: true, error: null, normalized: normalizedGrade }
}

/**
 * Validate credits
 * @param {Number} credits - Course credits
 * @returns {Object} { valid, error }
 */
export function validateCredits(credits) {
  const creditNum = Number(credits)

  if (isNaN(creditNum)) {
    return { valid: false, error: 'Credits must be a number' }
  }

  if (creditNum < 0 || creditNum > 6) {
    return { valid: false, error: 'Credits must be between 0 and 6' }
  }

  if (![1, 2, 3, 4, 5, 6].includes(creditNum)) {
    return { valid: false, error: 'Credits must be a whole number (1-6)' }
  }

  return { valid: true, error: null, credits: creditNum }
}

/**
 * Validate semester
 * @param {String} semester - Semester (fall, spring, summer)
 * @returns {Object} { valid, error }
 */
export function validateSemester(semester) {
  if (!semester || typeof semester !== 'string') {
    return { valid: false, error: 'Semester is required' }
  }

  const validSemesters = ['fall', 'spring', 'summer']
  const normalizedSemester = semester.toLowerCase().trim()

  if (!validSemesters.includes(normalizedSemester)) {
    return {
      valid: false,
      error: 'Invalid semester. Must be one of: fall, spring, summer'
    }
  }

  return { valid: true, error: null, normalized: normalizedSemester }
}

/**
 * Validate year
 * @param {Number} year - Academic year
 * @returns {Object} { valid, error }
 */
export function validateYear(year) {
  const yearNum = Number(year)

  if (isNaN(yearNum)) {
    return { valid: false, error: 'Year must be a number' }
  }

  const currentYear = new Date().getFullYear()

  if (yearNum < 2000 || yearNum > currentYear + 10) {
    return {
      valid: false,
      error: `Year must be between 2000 and ${currentYear + 10}`
    }
  }

  return { valid: true, error: null, year: yearNum }
}

/**
 * Validate completed course object
 * @param {Object} courseData - Completed course data
 * @returns {Object} { valid, errors, validatedData }
 */
export function validateCompletedCourse(courseData) {
  const errors = []
  const validatedData = {}

  // Validate course code
  const codeValidation = validateCourseCode(courseData.courseCode)
  if (!codeValidation.valid) {
    errors.push({ field: 'courseCode', message: codeValidation.error })
  } else {
    validatedData.courseCode = codeValidation.normalized
  }

  // Validate grade
  const gradeValidation = validateGrade(courseData.grade)
  if (!gradeValidation.valid) {
    errors.push({ field: 'grade', message: gradeValidation.error })
  } else {
    validatedData.grade = gradeValidation.normalized
  }

  // Validate semester
  const semesterValidation = validateSemester(courseData.semester)
  if (!semesterValidation.valid) {
    errors.push({ field: 'semester', message: semesterValidation.error })
  } else {
    validatedData.semester = semesterValidation.normalized
  }

  // Validate year
  const yearValidation = validateYear(courseData.year)
  if (!yearValidation.valid) {
    errors.push({ field: 'year', message: yearValidation.error })
  } else {
    validatedData.year = yearValidation.year
  }

  return {
    valid: errors.length === 0,
    errors,
    validatedData: errors.length === 0 ? validatedData : null
  }
}

/**
 * Validate course exists in database
 * @param {String} courseCode - Course code to check
 * @param {Array} allCourses - All available courses
 * @returns {Object} { exists, course }
 */
export function validateCourseExists(courseCode, allCourses) {
  const normalizedCode = courseCode.trim().toUpperCase()

  const course = allCourses.find(c => c.code === normalizedCode)

  return {
    exists: !!course,
    course: course || null,
    error: course ? null : `Course ${normalizedCode} not found in catalog`
  }
}

/**
 * Validate enrollment capacity
 * @param {Number} enrolledCount - Current enrollment
 * @param {Number} capacity - Maximum capacity
 * @returns {Object} { canEnroll, spotsRemaining }
 */
export function validateEnrollmentCapacity(enrolledCount, capacity) {
  const spotsRemaining = capacity - enrolledCount

  return {
    canEnroll: spotsRemaining > 0,
    spotsRemaining,
    isFull: spotsRemaining <= 0,
    capacity,
    enrolled: enrolledCount
  }
}

/**
 * Validate course load
 * Checks if student is taking too many or too few credits
 * @param {Array} courses - Courses for a semester
 * @param {Number} minCredits - Minimum credits (default 12 for full-time)
 * @param {Number} maxCredits - Maximum credits (default 18)
 * @returns {Object} { valid, totalCredits, warning }
 */
export function validateCourseLoad(courses, minCredits = 12, maxCredits = 18) {
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 3), 0)

  let warning = null

  if (totalCredits < minCredits) {
    warning = `Course load below full-time (${totalCredits}/${minCredits} credits)`
  } else if (totalCredits > maxCredits) {
    warning = `Course load exceeds maximum (${totalCredits}/${maxCredits} credits)`
  }

  return {
    valid: totalCredits >= minCredits && totalCredits <= maxCredits,
    totalCredits,
    minCredits,
    maxCredits,
    isFullTime: totalCredits >= minCredits,
    warning
  }
}

/**
 * Validate minimum grade requirement
 * Some programs require minimum grades (e.g., C- minimum for CS major)
 * @param {String} grade - Letter grade
 * @param {String} minGrade - Minimum required grade (default C-)
 * @returns {Object} { meetsRequirement, grade, minGrade }
 */
export function validateMinimumGrade(grade, minGrade = 'C-') {
  const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  }

  const actualPoints = gradePoints[grade.toUpperCase()] || 0
  const requiredPoints = gradePoints[minGrade.toUpperCase()] || 0

  return {
    meetsRequirement: actualPoints >= requiredPoints,
    grade: grade.toUpperCase(),
    minGrade: minGrade.toUpperCase(),
    needsRetake: actualPoints < requiredPoints
  }
}

/**
 * Validate duplicate course enrollment
 * Checks if student is trying to take a course they already completed
 * @param {String} courseCode - Course to check
 * @param {Array} completedCourses - Already completed courses
 * @returns {Object} { isDuplicate, previousGrade }
 */
export function validateDuplicateEnrollment(courseCode, completedCourses) {
  const normalizedCode = courseCode.trim().toUpperCase()

  const previouslyTaken = completedCourses.find(
    cc => (cc.course?.code || cc.code) === normalizedCode
  )

  return {
    isDuplicate: !!previouslyTaken,
    previousGrade: previouslyTaken?.grade || null,
    allowRetake: previouslyTaken && ['D', 'D-', 'F'].includes(previouslyTaken.grade),
    message: previouslyTaken
      ? `Already completed ${normalizedCode} with grade ${previouslyTaken.grade}`
      : null
  }
}

/**
 * Validate course offering availability
 * @param {Object} course - Course object
 * @param {String} semester - Desired semester
 * @returns {Object} { isOffered, semester, availableIn }
 */
export function validateCourseOffering(course, semester) {
  const normalizedSemester = semester.toLowerCase()

  const offeringMap = {
    fall: course.offeredFall,
    spring: course.offeredSpring,
    summer: course.offeredSummer
  }

  const isOffered = offeringMap[normalizedSemester]

  // Find which semesters it's offered in
  const availableIn = []
  if (course.offeredFall) availableIn.push('Fall')
  if (course.offeredSpring) availableIn.push('Spring')
  if (course.offeredSummer) availableIn.push('Summer')

  return {
    isOffered,
    semester: normalizedSemester.charAt(0).toUpperCase() + normalizedSemester.slice(1),
    availableIn,
    error: isOffered ? null : `${course.code} is not offered in ${normalizedSemester}`
  }
}

/**
 * Comprehensive course enrollment validation
 * Combines all validation checks
 * @param {Object} enrollmentData - Enrollment request data
 * @param {Object} context - Context (allCourses, completedCourses, etc.)
 * @returns {Object} { valid, errors, warnings }
 */
export function validateEnrollment(enrollmentData, context) {
  const { courseCode, semester } = enrollmentData
  const { allCourses, completedCourses } = context

  const errors = []
  const warnings = []

  // 1. Validate course code format
  const codeValidation = validateCourseCode(courseCode)
  if (!codeValidation.valid) {
    errors.push(codeValidation.error)
    return { valid: false, errors, warnings } // Can't continue without valid code
  }

  // 2. Validate course exists
  const existsValidation = validateCourseExists(codeValidation.normalized, allCourses)
  if (!existsValidation.exists) {
    errors.push(existsValidation.error)
    return { valid: false, errors, warnings }
  }

  const course = existsValidation.course

  // 3. Check for duplicates
  const duplicateCheck = validateDuplicateEnrollment(courseCode, completedCourses)
  if (duplicateCheck.isDuplicate && !duplicateCheck.allowRetake) {
    errors.push(duplicateCheck.message)
  } else if (duplicateCheck.isDuplicate && duplicateCheck.allowRetake) {
    warnings.push(`Retaking ${courseCode} (previous grade: ${duplicateCheck.previousGrade})`)
  }

  // 4. Validate offering
  if (semester) {
    const offeringValidation = validateCourseOffering(course, semester)
    if (!offeringValidation.isOffered) {
      errors.push(offeringValidation.error)
      warnings.push(`Available in: ${offeringValidation.availableIn.join(', ')}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    course
  }
}
