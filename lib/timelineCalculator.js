/**
 * Graduation Timeline Calculator
 * Calculates when a student will graduate based on course load
 */

/**
 * Calculate graduation timeline
 * @param {Array} remainingCourses - Courses still needed to graduate
 * @param {Number} coursesPerSemester - How many courses per semester (1-4)
 * @param {String} currentSemester - 'fall' or 'spring'
 * @param {Number} currentYear - Current year (e.g., 2024)
 * @returns {Object} Timeline with graduation date and semester plan
 */
export function calculateGraduationTimeline(
  remainingCourses,
  coursesPerSemester,
  currentSemester = 'fall',
  currentYear = new Date().getFullYear()
) {
  if (remainingCourses.length === 0) {
    return {
      graduationSemester: currentSemester,
      graduationYear: currentYear,
      semestersRemaining: 0,
      plan: []
    }
  }

  const totalCredits = remainingCourses.reduce((sum, course) => sum + (course.credits || 3), 0)
  const creditsPerSemester = coursesPerSemester * 3 // Assuming 3 credits per course
  const semestersNeeded = Math.ceil(totalCredits / creditsPerSemester)

  // Calculate graduation semester and year
  let gradSemester = currentSemester
  let gradYear = currentYear
  let semesterCount = semestersNeeded

  while (semesterCount > 0) {
    if (gradSemester === 'fall') {
      gradSemester = 'spring'
    } else {
      gradSemester = 'fall'
      gradYear++
    }
    semesterCount--
  }

  return {
    graduationSemester: gradSemester.charAt(0).toUpperCase() + gradSemester.slice(1),
    graduationYear: gradYear,
    semestersRemaining: semestersNeeded,
    totalCreditsRemaining: totalCredits,
    coursesRemaining: remainingCourses.length
  }
}

/**
 * Generate multiple timeline scenarios
 * @param {Array} remainingCourses - Courses still needed
 * @param {String} currentSemester - 'fall' or 'spring'
 * @param {Number} currentYear - Current year
 * @returns {Array} Array of timeline scenarios for 1-4 courses per semester
 */
export function generateTimelineScenarios(remainingCourses, currentSemester, currentYear) {
  const scenarios = []

  for (let coursesPerSem = 1; coursesPerSem <= 4; coursesPerSem++) {
    const timeline = calculateGraduationTimeline(
      remainingCourses,
      coursesPerSem,
      currentSemester,
      currentYear
    )

    scenarios.push({
      coursesPerSemester: coursesPerSem,
      ...timeline,
      graduationDate: `${timeline.graduationSemester} ${timeline.graduationYear}`
    })
  }

  return scenarios
}

/**
 * Create a detailed semester-by-semester plan
 * @param {Array} remainingCourses - Courses still needed
 * @param {Array} completedCourses - Already completed courses
 * @param {Number} coursesPerSemester - Target courses per semester
 * @param {String} startSemester - 'fall' or 'spring'
 * @param {Number} startYear - Starting year
 * @returns {Array} Semester-by-semester course plan
 */
export function createSemesterPlan(
  remainingCourses,
  completedCourses,
  coursesPerSemester,
  startSemester = 'fall',
  startYear = new Date().getFullYear()
) {
  const plan = []
  let currentSemester = startSemester
  let currentYear = startYear
  let coursesToTake = [...remainingCourses]
  let completed = [...completedCourses]

  while (coursesToTake.length > 0) {
    const semesterCourses = []
    const availableThisSemester = coursesToTake.filter(course => {
      // Check if offered this semester
      if (currentSemester === 'fall' && !course.offeredFall) return false
      if (currentSemester === 'spring' && !course.offeredSpring) return false

      // Check prerequisites (would need the full prerequisite checker here)
      return true
    })

    // Take up to coursesPerSemester courses
    const coursesThisSemester = availableThisSemester.slice(0, coursesPerSemester)

    semesterCourses.push(...coursesThisSemester)

    // Remove taken courses from remaining
    coursesToTake = coursesToTake.filter(c => !coursesThisSemester.includes(c))

    // Add to completed
    completed.push(...coursesThisSemester)

    plan.push({
      semester: currentSemester.charAt(0).toUpperCase() + currentSemester.slice(1),
      year: currentYear,
      courses: semesterCourses,
      credits: semesterCourses.reduce((sum, c) => sum + (c.credits || 3), 0)
    })

    // Move to next semester
    if (currentSemester === 'fall') {
      currentSemester = 'spring'
    } else {
      currentSemester = 'fall'
      currentYear++
    }
  }

  return plan
}

/**
 * Calculate progress percentage
 * @param {Number} completedCredits - Credits completed
 * @param {Number} totalCredits - Total credits needed (default 120 for CS degree)
 * @returns {Number} Percentage complete (0-100)
 */
export function calculateProgress(completedCredits, totalCredits = 120) {
  return Math.min(Math.round((completedCredits / totalCredits) * 100), 100)
}
