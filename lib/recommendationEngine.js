/**
 * Generate course recommendations based on completed courses
 * @param {Array} completedCourseIds - IDs of completed courses
 * @param {Array} allCourses - All degree requirement courses with prerequisites
 * @returns {Object} - { available, blocked, completed }
 */
export function generateRecommendations(completedCourseIds, allCourses) {
  const completedSet = new Set(completedCourseIds)
  const available = []
  const blocked = []
  const completed = []

  for (const course of allCourses) {
    // Already completed
    if (completedSet.has(course.id)) {
      completed.push({
        ...course,
        status: 'completed'
      })
      continue
    }

    // Check prerequisites
    const prerequisites = course.prerequisites || []
    const prerequisitesMet = prerequisites.every(prereq =>
      completedSet.has(prereq.prerequisiteId)
    )

    if (prerequisitesMet) {
      available.push({
        ...course,
        status: 'available',
        canTake: true
      })
    } else {
      // Find which prerequisites are missing
      const missingPrereqs = prerequisites
        .filter(prereq => !completedSet.has(prereq.prerequisiteId))
        .map(prereq => {
          const prereqCourse = allCourses.find(c => c.id === prereq.prerequisiteId)
          return prereqCourse ? prereqCourse.code : 'Unknown'
        })

      blocked.push({
        ...course,
        status: 'blocked',
        canTake: false,
        missingPrerequisites: missingPrereqs
      })
    }
  }

  return {
    available,
    blocked,
    completed,
    summary: {
      totalCourses: allCourses.length,
      completedCount: completed.length,
      availableCount: available.length,
      blockedCount: blocked.length,
      percentComplete: ((completed.length / allCourses.length) * 100).toFixed(1)
    }
  }
}

/**
 * Recommend courses for next semester based on offerings and prerequisites
 * @param {Array} availableCourses - Courses student can take
 * @param {Array} courseOfferings - Current term offerings with availability
 * @param {number} maxCourses - Maximum courses to recommend (default: 4)
 * @returns {Array} - Recommended courses sorted by priority
 */
export function recommendNextSemester(availableCourses, courseOfferings = [], maxCourses = 4) {
  const recommendations = []

  // Create offering map for quick lookup
  const offeringMap = new Map(
    courseOfferings.map(offering => [offering.courseId, offering])
  )

  // Score and prioritize courses
  for (const course of availableCourses) {
    const offering = offeringMap.get(course.id)

    let priority = 0
    let reason = []

    // Higher priority for courses that are prerequisites for many others
    if (course.prerequisiteFor && course.prerequisiteFor.length > 0) {
      priority += course.prerequisiteFor.length * 10
      reason.push(`Required for ${course.prerequisiteFor.length} other courses`)
    }

    // Check if offered this term
    if (offering) {
      if (offering.availabilityStatus === 'available') {
        priority += 50
        reason.push('Available with open seats')
      } else if (offering.availabilityStatus === 'limited') {
        priority += 30
        reason.push('Limited seats available')
      } else if (offering.availabilityStatus === 'full') {
        priority += 5
        reason.push('Course is full (waitlist may be available)')
      }
    } else {
      // Not offered this term
      priority -= 100
      reason.push('Not offered this term')
    }

    // Core courses get higher priority
    if (course.category === 'Core CS') {
      priority += 20
      reason.push('Core CS requirement')
    }

    // Senior experience should be taken later
    if (course.isSeniorExperience) {
      priority -= 50
      reason.push('Senior-level course')
    }

    recommendations.push({
      ...course,
      priority,
      reason: reason.join(', '),
      offering
    })
  }

  // Sort by priority (highest first) and return top N
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxCourses)
}

/**
 * Calculate degree progress statistics
 * @param {Array} completedCourses - Completed courses with credits
 * @param {number} totalRequiredCredits - Total credits needed (default: 120)
 * @returns {Object} - Progress statistics
 */
export function calculateDegreeProgress(completedCourses, totalRequiredCredits = 120) {
  const totalCreditsEarned = completedCourses.reduce(
    (sum, course) => sum + (course.credits || 3),
    0
  )

  const creditsRemaining = Math.max(0, totalRequiredCredits - totalCreditsEarned)
  const percentComplete = ((totalCreditsEarned / totalRequiredCredits) * 100).toFixed(1)

  // Calculate GPA if grades are available
  const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  }

  let totalGradePoints = 0
  let totalGradedCredits = 0

  for (const course of completedCourses) {
    if (course.grade && gradePoints[course.grade] !== undefined) {
      const credits = course.credits || 3
      totalGradePoints += gradePoints[course.grade] * credits
      totalGradedCredits += credits
    }
  }

  const gpa = totalGradedCredits > 0
    ? (totalGradePoints / totalGradedCredits).toFixed(2)
    : null

  return {
    totalCreditsEarned,
    totalRequiredCredits,
    creditsRemaining,
    percentComplete: parseFloat(percentComplete),
    gpa: gpa ? parseFloat(gpa) : null,
    coursesCompleted: completedCourses.length
  }
}
