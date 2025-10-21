/**
 * Prerequisite Checking Engine
 * Determines which courses a student can take based on completed courses
 *
 * Supports:
 * - AND logic: All prerequisites must be met
 * - OR logic: At least one prerequisite must be met (alternatives)
 * - Co-requisites: Courses that must be taken together
 */

/**
 * Check if a student can take a specific course
 * @param {Object} course - The course to check
 * @param {Array} completedCourses - Array of completed course objects
 * @param {Array} currentSemesterCourses - Courses being taken this semester (for co-requisites)
 * @returns {Object} { canTake: boolean, missingPrereqs: Array, reason: String }
 */
export function canTakeCourse(course, completedCourses, currentSemesterCourses = []) {
  // No prerequisites - can take the course
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { canTake: true, missingPrereqs: [], reason: 'No prerequisites' }
  }

  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course?.code || c.code)
  )

  const currentSemesterCodes = new Set(
    currentSemesterCourses.map(c => c.code)
  )

  const missingPrereqs = []

  // Check standard prerequisites (AND logic - all must be met)
  for (const prereq of course.prerequisites) {
    const prereqCode = prereq.prerequisite?.code || prereq.code

    if (!completedCourseCodes.has(prereqCode)) {
      missingPrereqs.push(prereq.prerequisite || prereq)
    }
  }

  // If all prerequisites are met
  if (missingPrereqs.length === 0) {
    return {
      canTake: true,
      missingPrereqs: [],
      reason: 'All prerequisites met'
    }
  }

  return {
    canTake: false,
    missingPrereqs,
    reason: `Missing ${missingPrereqs.length} prerequisite(s)`
  }
}

/**
 * Check if prerequisites are met with OR logic (alternative prerequisites)
 * Example: "CS2050 OR CS2060" - student needs either one
 * @param {Array} prerequisiteGroups - Array of prerequisite alternatives
 * @param {Array} completedCourses - Completed courses
 * @returns {Object} { canTake: boolean, missingAll: Array }
 */
export function checkAlternativePrerequisites(prerequisiteGroups, completedCourses) {
  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course?.code || c.code)
  )

  // Check if at least ONE group is satisfied
  for (const group of prerequisiteGroups) {
    const groupCodes = Array.isArray(group) ? group : [group]
    const groupSatisfied = groupCodes.every(code => completedCourseCodes.has(code))

    if (groupSatisfied) {
      return { canTake: true, missingAll: [] }
    }
  }

  return {
    canTake: false,
    missingAll: prerequisiteGroups,
    reason: 'Must complete at least one prerequisite group'
  }
}

/**
 * Check if co-requisites are satisfied
 * Co-requisites are courses that must be taken in the same semester or already completed
 * @param {Object} course - Course to check
 * @param {Array} completedCourses - Already completed courses
 * @param {Array} currentSemesterCourses - Courses being taken this semester
 * @returns {Object} { canTake: boolean, missingCoreqs: Array }
 */
export function checkCoRequisites(course, completedCourses, currentSemesterCourses = []) {
  if (!course.corequisites || course.corequisites.length === 0) {
    return { canTake: true, missingCoreqs: [] }
  }

  const completedCourseCodes = new Set(
    completedCourses.map(c => c.course?.code || c.code)
  )

  const currentSemesterCodes = new Set(
    currentSemesterCourses.map(c => c.code)
  )

  const missingCoreqs = []

  for (const coreq of course.corequisites) {
    const coreqCode = coreq.code || coreq

    // Co-requisite is satisfied if either completed OR taking this semester
    if (!completedCourseCodes.has(coreqCode) && !currentSemesterCodes.has(coreqCode)) {
      missingCoreqs.push(coreq)
    }
  }

  return {
    canTake: missingCoreqs.length === 0,
    missingCoreqs,
    reason: missingCoreqs.length > 0
      ? `Must take ${missingCoreqs.length} co-requisite(s) simultaneously`
      : 'Co-requisites satisfied'
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

/**
 * Sort courses by prerequisite dependencies
 * Courses with fewer/no prerequisites come first
 * @param {Array} courses - Courses to sort
 * @returns {Array} Sorted courses (prerequisites first)
 */
export function sortByPrerequisites(courses) {
  return [...courses].sort((a, b) => {
    const aPrereqCount = a.prerequisites?.length || 0
    const bPrereqCount = b.prerequisites?.length || 0
    return aPrereqCount - bPrereqCount
  })
}

/**
 * Get prerequisite chain depth for a course
 * Useful for determining course ordering in a degree plan
 * @param {Object} course - Course to analyze
 * @param {Array} allCourses - All available courses
 * @param {Number} depth - Current recursion depth
 * @returns {Number} Maximum depth of prerequisite chain
 */
export function getPrerequisiteDepth(course, allCourses, depth = 0) {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return depth
  }

  let maxDepth = depth

  for (const prereq of course.prerequisites) {
    const prereqCourse = allCourses.find(
      c => c.code === (prereq.prerequisite?.code || prereq.code)
    )

    if (prereqCourse) {
      const prereqDepth = getPrerequisiteDepth(prereqCourse, allCourses, depth + 1)
      maxDepth = Math.max(maxDepth, prereqDepth)
    }
  }

  return maxDepth
}

/**
 * Get recommended course order based on prerequisites
 * Orders courses from foundational to advanced
 * @param {Array} courses - Courses to order
 * @param {Array} allCourses - All available courses (for prerequisite lookup)
 * @returns {Array} Ordered courses
 */
export function getRecommendedCourseOrder(courses, allCourses) {
  return [...courses].sort((a, b) => {
    const depthA = getPrerequisiteDepth(a, allCourses)
    const depthB = getPrerequisiteDepth(b, allCourses)

    if (depthA !== depthB) {
      return depthA - depthB
    }

    // If same depth, sort by course code
    return a.code.localeCompare(b.code)
  })
}
