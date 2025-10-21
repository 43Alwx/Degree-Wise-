/**
 * GPA Calculator
 * Calculates GPA, predicts future GPA, and tracks academic performance
 */

// Grade point mapping
const GRADE_POINTS = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0
}

/**
 * Convert letter grade to grade points
 * @param {String} grade - Letter grade (A, B+, etc.)
 * @returns {Number} Grade points (0.0 - 4.0)
 */
export function getGradePoints(grade) {
  const normalizedGrade = grade?.toUpperCase().trim()
  return GRADE_POINTS[normalizedGrade] ?? 0.0
}

/**
 * Calculate GPA from completed courses
 * @param {Array} completedCourses - Array of completed course objects with grades
 * @returns {Object} { gpa, totalCredits, totalGradePoints, courseCount }
 */
export function calculateGPA(completedCourses) {
  let totalGradePoints = 0
  let totalCredits = 0
  let courseCount = 0

  for (const completedCourse of completedCourses) {
    const credits = completedCourse.course?.credits || completedCourse.credits || 3
    const grade = completedCourse.grade

    if (!grade || grade === 'W' || grade === 'I' || grade === 'P') {
      // Skip withdrawn, incomplete, or pass/fail courses
      continue
    }

    const gradePoints = getGradePoints(grade)
    totalGradePoints += gradePoints * credits
    totalCredits += credits
    courseCount++
  }

  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0

  return {
    gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
    totalCredits,
    totalGradePoints: Math.round(totalGradePoints * 100) / 100,
    courseCount
  }
}

/**
 * Calculate semester GPA
 * @param {Array} courses - Courses from a specific semester
 * @returns {Object} { semesterGpa, credits, gradePoints }
 */
export function calculateSemesterGPA(courses) {
  let totalGradePoints = 0
  let totalCredits = 0

  for (const course of courses) {
    const credits = course.course?.credits || course.credits || 3
    const grade = course.grade

    if (!grade || grade === 'W' || grade === 'I' || grade === 'P') {
      continue
    }

    const gradePoints = getGradePoints(grade)
    totalGradePoints += gradePoints * credits
    totalCredits += credits
  }

  const semesterGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0

  return {
    semesterGpa: Math.round(semesterGpa * 100) / 100,
    credits: totalCredits,
    gradePoints: Math.round(totalGradePoints * 100) / 100
  }
}

/**
 * Predict future GPA based on target grades
 * @param {Number} currentGPA - Current cumulative GPA
 * @param {Number} currentCredits - Current total credits
 * @param {Array} futureCourses - Future courses with projected grades
 * @returns {Object} { predictedGPA, totalCredits, additionalCredits }
 */
export function predictGPA(currentGPA, currentCredits, futureCourses) {
  const currentGradePoints = currentGPA * currentCredits

  let additionalGradePoints = 0
  let additionalCredits = 0

  for (const course of futureCourses) {
    const credits = course.credits || 3
    const projectedGrade = course.projectedGrade || 'B'
    const gradePoints = getGradePoints(projectedGrade)

    additionalGradePoints += gradePoints * credits
    additionalCredits += credits
  }

  const totalGradePoints = currentGradePoints + additionalGradePoints
  const totalCredits = currentCredits + additionalCredits

  const predictedGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0

  return {
    predictedGPA: Math.round(predictedGPA * 100) / 100,
    totalCredits,
    additionalCredits,
    currentGPA: Math.round(currentGPA * 100) / 100
  }
}

/**
 * Calculate required GPA to reach target
 * @param {Number} currentGPA - Current cumulative GPA
 * @param {Number} currentCredits - Current total credits
 * @param {Number} targetGPA - Desired GPA
 * @param {Number} additionalCredits - Credits to be taken
 * @returns {Object} { requiredSemesterGPA, achievable }
 */
export function calculateRequiredGPA(currentGPA, currentCredits, targetGPA, additionalCredits) {
  const currentGradePoints = currentGPA * currentCredits
  const targetGradePoints = targetGPA * (currentCredits + additionalCredits)

  const requiredGradePoints = targetGradePoints - currentGradePoints
  const requiredSemesterGPA = additionalCredits > 0 ? requiredGradePoints / additionalCredits : 0.0

  return {
    requiredSemesterGPA: Math.round(requiredSemesterGPA * 100) / 100,
    achievable: requiredSemesterGPA >= 0 && requiredSemesterGPA <= 4.0,
    targetGPA,
    currentGPA: Math.round(currentGPA * 100) / 100
  }
}

/**
 * Check if GPA meets minimum requirement
 * @param {Number} gpa - Student's GPA
 * @param {Number} minGPA - Minimum required GPA (default 2.0 for CS)
 * @returns {Object} { meets Requirement, difference }
 */
export function meetsGPARequirement(gpa, minGPA = 2.0) {
  const difference = Math.round((gpa - minGPA) * 100) / 100

  return {
    meetsRequirement: gpa >= minGPA,
    difference,
    gpa: Math.round(gpa * 100) / 100,
    minGPA
  }
}

/**
 * Get GPA statistics by category (core courses, electives, etc.)
 * @param {Array} completedCourses - All completed courses
 * @param {String} category - Category to filter by (e.g., 'CS', 'MATH')
 * @returns {Object} GPA statistics for the category
 */
export function getGPAByCategory(completedCourses, category) {
  const categoryCourses = completedCourses.filter(cc => {
    const courseCode = cc.course?.code || cc.code
    return courseCode?.startsWith(category)
  })

  return calculateGPA(categoryCourses)
}

/**
 * Get academic standing based on GPA
 * @param {Number} gpa - Student's GPA
 * @returns {Object} { standing, description, probation }
 */
export function getAcademicStanding(gpa) {
  if (gpa >= 3.75) {
    return {
      standing: 'President\'s List',
      description: 'Exceptional academic performance',
      probation: false
    }
  } else if (gpa >= 3.5) {
    return {
      standing: 'Dean\'s List',
      description: 'High academic achievement',
      probation: false
    }
  } else if (gpa >= 3.0) {
    return {
      standing: 'Good Standing',
      description: 'Satisfactory academic progress',
      probation: false
    }
  } else if (gpa >= 2.0) {
    return {
      standing: 'Satisfactory',
      description: 'Meeting minimum requirements',
      probation: false
    }
  } else if (gpa >= 1.5) {
    return {
      standing: 'Academic Warning',
      description: 'GPA below required standard',
      probation: true
    }
  } else {
    return {
      standing: 'Academic Probation',
      description: 'Immediate improvement required',
      probation: true
    }
  }
}

/**
 * Calculate credits needed for graduation with GPA requirement
 * @param {Number} currentGPA - Current GPA
 * @param {Number} currentCredits - Current credits
 * @param {Number} totalCreditsNeeded - Total credits for degree (default 120)
 * @param {Number} minGradGPA - Minimum GPA to graduate (default 2.0)
 * @returns {Object} Analysis of GPA requirements for graduation
 */
export function analyzeGraduationGPA(
  currentGPA,
  currentCredits,
  totalCreditsNeeded = 120,
  minGradGPA = 2.0
) {
  const creditsRemaining = totalCreditsNeeded - currentCredits

  if (creditsRemaining <= 0) {
    return {
      canGraduate: currentGPA >= minGradGPA,
      creditsRemaining: 0,
      minRequiredGPA: 0,
      message: currentGPA >= minGradGPA
        ? 'Credits complete and GPA requirement met'
        : 'Credits complete but GPA below minimum'
    }
  }

  const { requiredSemesterGPA, achievable } = calculateRequiredGPA(
    currentGPA,
    currentCredits,
    minGradGPA,
    creditsRemaining
  )

  return {
    canGraduate: currentGPA >= minGradGPA,
    creditsRemaining,
    minRequiredGPA: achievable ? requiredSemesterGPA : null,
    achievable,
    message: achievable
      ? `Need ${requiredSemesterGPA.toFixed(2)} GPA in remaining ${creditsRemaining} credits`
      : currentGPA >= minGradGPA
        ? 'On track for graduation'
        : 'Cannot reach minimum GPA with remaining credits'
  }
}
