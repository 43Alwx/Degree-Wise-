/**
 * Prerequisite Checking Engine
 * Determines which courses a student can take based on completed courses
 */

/**
 * Check if a student can take a specific course
 * @param {Object} course - The course to check
 * @param {Array} completedCourses - Array of completed course objects
 * @returns {Object} { canTake: boolean, missingPrereqs: Array }
 */
export function canTakeCourse(course, completedCourses) {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { canTake: true, missingPrereqs: [] }
  }

  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course.code)
  )

  const missingPrereqs = []

  for (const prereq of course.prerequisites) {
    if (!completedCourseCodes.has(prereq.prerequisite.code)) {
      missingPrereqs.push(prereq.prerequisite)
    }
  }

  return {
    canTake: missingPrereqs.length === 0,
    missingPrereqs
  }
}

/**
 * Get all courses a student can take next
 * @param {Array} allCourses - All available courses
 * @param {Array} completedCourses - Student's completed courses
 * @param {String} semester - 'fall', 'spring', or 'summer'
 * @returns {Array} Courses the student can take
 */
export function getAvailableCourses(allCourses, completedCourses, semester = 'fall') {
  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course.code)
  )

  return allCourses
    .filter(course => {
      // Don't show already completed courses
      if (completedCourseCodes.has(course.code)) {
        return false
      }

      // Check if course is offered this semester
      if (semester === 'fall' && !course.offeredFall) return false
      if (semester === 'spring' && !course.offeredSpring) return false
      if (semester === 'summer' && !course.offeredSummer) return false

      // Check prerequisites
      const { canTake } = canTakeCourse(course, completedCourses)
      return canTake
    })
}

/**
 * Get courses that are blocked by missing prerequisites
 * @param {Array} allCourses - All available courses
 * @param {Array} completedCourses - Student's completed courses
 * @returns {Array} Courses with missing prerequisites
 */
export function getBlockedCourses(allCourses, completedCourses) {
  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course.code)
  )

  return allCourses
    .filter(course => !completedCourseCodes.has(course.code))
    .map(course => {
      const { canTake, missingPrereqs } = canTakeCourse(course, completedCourses)
      return {
        course,
        canTake,
        missingPrereqs
      }
    })
    .filter(item => !item.canTake)
}

/**
 * Check if all prerequisites for a set of courses are met
 * @param {Array} courses - Courses to check
 * @param {Array} completedCourses - Student's completed courses
 * @returns {Boolean}
 */
export function allPrerequisitesMet(courses, completedCourses) {
  return courses.every(course => {
    const { canTake } = canTakeCourse(course, completedCourses)
    return canTake
  })
}
