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
 * Improved with prerequisite-aware scheduling
 * @param {Array} remainingCourses - Courses still needed
 * @param {Array} completedCourses - Already completed courses
 * @param {Array} allCourses - All courses for prerequisite lookup
 * @param {Number} coursesPerSemester - Target courses per semester
 * @param {String} startSemester - 'fall' or 'spring'
 * @param {Number} startYear - Starting year
 * @returns {Array} Semester-by-semester course plan
 */
export function createSemesterPlan(
  remainingCourses,
  completedCourses,
  allCourses,
  coursesPerSemester,
  startSemester = 'fall',
  startYear = new Date().getFullYear()
) {
  const plan = []
  let currentSemester = startSemester
  let currentYear = startYear
  let coursesToTake = [...remainingCourses]
  let completed = [...completedCourses]

  // Import prerequisite checker functions (dynamic import for modularity)
  const canTakeCourse = (course, completedList) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true
    }

    const completedCodes = new Set(
      completedList.map(c => c.course?.code || c.code)
    )

    // Check if all prerequisites are met
    return course.prerequisites.every(prereq => {
      const prereqCode = prereq.prerequisite?.code || prereq.code
      return completedCodes.has(prereqCode)
    })
  }

  // Sort courses by prerequisite depth (foundational courses first)
  const getPrerequisiteDepth = (course, depth = 0) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return depth
    }

    let maxDepth = depth
    for (const prereq of course.prerequisites) {
      const prereqCourse = allCourses.find(
        c => c.code === (prereq.prerequisite?.code || prereq.code)
      )
      if (prereqCourse) {
        const prereqDepth = getPrerequisiteDepth(prereqCourse, depth + 1)
        maxDepth = Math.max(maxDepth, prereqDepth)
      }
    }
    return maxDepth
  }

  let iterationLimit = 20 // Prevent infinite loops
  let iteration = 0

  while (coursesToTake.length > 0 && iteration < iterationLimit) {
    iteration++

    // Filter courses available this semester
    const availableThisSemester = coursesToTake.filter(course => {
      // Check if offered this semester
      if (currentSemester === 'fall' && !course.offeredFall) return false
      if (currentSemester === 'spring' && !course.offeredSpring) return false
      if (currentSemester === 'summer' && !course.offeredSummer) return false

      // Check if prerequisites are met
      return canTakeCourse(course, completed)
    })

    // Sort by prerequisite depth (take foundational courses first)
    const sortedAvailable = [...availableThisSemester].sort((a, b) => {
      const depthA = getPrerequisiteDepth(a)
      const depthB = getPrerequisiteDepth(b)

      if (depthA !== depthB) {
        return depthA - depthB
      }

      // If same depth, prioritize core courses over electives
      const aIsCore = a.code.startsWith('CS') && !a.isElective
      const bIsCore = b.code.startsWith('CS') && !b.isElective

      if (aIsCore && !bIsCore) return -1
      if (!aIsCore && bIsCore) return 1

      return a.code.localeCompare(b.code)
    })

    // Take up to coursesPerSemester courses
    const coursesThisSemester = sortedAvailable.slice(0, coursesPerSemester)

    // If no courses can be taken, but courses remain, there might be a prerequisite issue
    if (coursesThisSemester.length === 0 && coursesToTake.length > 0) {
      // Try to take at least one course from a different semester offering
      const anyCourse = coursesToTake.find(c => canTakeCourse(c, completed))
      if (anyCourse) {
        coursesThisSemester.push(anyCourse)
      }
    }

    if (coursesThisSemester.length > 0) {
      // Remove taken courses from remaining
      coursesToTake = coursesToTake.filter(c => !coursesThisSemester.includes(c))

      // Add to completed
      completed = [...completed, ...coursesThisSemester]

      plan.push({
        semester: currentSemester.charAt(0).toUpperCase() + currentSemester.slice(1),
        year: currentYear,
        courses: coursesThisSemester,
        credits: coursesThisSemester.reduce((sum, c) => sum + (c.credits || 3), 0),
        courseCodes: coursesThisSemester.map(c => c.code)
      })
    }

    // Move to next semester
    if (currentSemester === 'fall') {
      currentSemester = 'spring'
    } else if (currentSemester === 'spring') {
      currentSemester = 'summer'
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
