/**
 * Degree Audit System
 * Checks graduation requirements and generates degree audit reports
 */

/**
 * Audit a specific requirement category
 * @param {Object} requirement - Requirement from database
 * @param {Array} completedCourses - Student's completed courses
 * @param {Array} requirementCourses - Courses that fulfill this requirement
 * @returns {Object} Audit result for this requirement
 */
export function auditRequirement(requirement, completedCourses, requirementCourses) {
  const completedCourseCodes = new Set(
    completedCourses.map(cc => cc.course?.code || cc.code)
  )

  const requirementCourseCodes = requirementCourses.map(rc => rc.course?.code || rc.code)

  // Find which requirement courses have been completed
  const fulfilledCourses = requirementCourses.filter(rc =>
    completedCourseCodes.has(rc.course?.code || rc.code)
  )

  // Calculate completed credits
  const completedCredits = fulfilledCourses.reduce((sum, rc) => {
    const matchingCompleted = completedCourses.find(
      cc => (cc.course?.code || cc.code) === (rc.course?.code || rc.code)
    )
    return sum + (matchingCompleted?.course?.credits || matchingCompleted?.credits || 0)
  }, 0)

  const minCredits = requirement.minCredits || 0
  const creditsRemaining = Math.max(0, minCredits - completedCredits)

  // Find remaining courses needed
  const remainingCourses = requirementCourses.filter(
    rc => !completedCourseCodes.has(rc.course?.code || rc.code)
  )

  return {
    requirementId: requirement.id,
    requirementName: requirement.name,
    requirementType: requirement.type,
    description: requirement.description,
    minCredits,
    completedCredits,
    creditsRemaining,
    percentComplete: minCredits > 0 ? Math.round((completedCredits / minCredits) * 100) : 100,
    isFulfilled: completedCredits >= minCredits,
    fulfilledCourses: fulfilledCourses.map(fc => fc.course?.code || fc.code),
    remainingCourses: remainingCourses.map(rc => rc.course?.code || rc.code),
    courseCount: {
      total: requirementCourses.length,
      completed: fulfilledCourses.length,
      remaining: remainingCourses.length
    }
  }
}

/**
 * Perform full degree audit
 * @param {Array} requirements - All degree requirements
 * @param {Array} completedCourses - Student's completed courses
 * @param {Array} allRequirementCourses - All requirement-course relationships
 * @returns {Object} Complete degree audit report
 */
export function performDegreeAudit(requirements, completedCourses, allRequirementCourses) {
  const auditResults = []

  for (const requirement of requirements) {
    // Get courses that fulfill this requirement
    const requirementCourses = allRequirementCourses.filter(
      rc => rc.requirementId === requirement.id
    )

    const auditResult = auditRequirement(requirement, completedCourses, requirementCourses)
    auditResults.push(auditResult)
  }

  // Calculate overall progress
  const totalMinCredits = requirements.reduce((sum, req) => sum + (req.minCredits || 0), 0)
  const totalCompletedCredits = auditResults.reduce((sum, ar) => sum + ar.completedCredits, 0)
  const totalCreditsRemaining = Math.max(0, totalMinCredits - totalCompletedCredits)

  // Check if all requirements are met
  const allRequirementsMet = auditResults.every(ar => ar.isFulfilled)

  return {
    auditDate: new Date().toISOString(),
    overallProgress: {
      totalMinCredits,
      totalCompletedCredits,
      totalCreditsRemaining,
      percentComplete: totalMinCredits > 0
        ? Math.round((totalCompletedCredits / totalMinCredits) * 100)
        : 100,
      canGraduate: allRequirementsMet && totalCompletedCredits >= totalMinCredits
    },
    requirementAudits: auditResults,
    unmetRequirements: auditResults.filter(ar => !ar.isFulfilled),
    summary: {
      totalRequirements: requirements.length,
      fulfilledRequirements: auditResults.filter(ar => ar.isFulfilled).length,
      unfulfilledRequirements: auditResults.filter(ar => !ar.isFulfilled).length
    }
  }
}

/**
 * Check graduation eligibility
 * @param {Object} degreeAudit - Result from performDegreeAudit
 * @param {Number} currentGPA - Student's current GPA
 * @param {Number} minGPA - Minimum GPA required (default 2.0)
 * @returns {Object} Graduation eligibility status
 */
export function checkGraduationEligibility(degreeAudit, currentGPA, minGPA = 2.0) {
  const { overallProgress, unmetRequirements } = degreeAudit

  const blockers = []

  // Check credit requirements
  if (!overallProgress.canGraduate) {
    blockers.push({
      type: 'credits',
      message: `Need ${overallProgress.totalCreditsRemaining} more credits`,
      creditsNeeded: overallProgress.totalCreditsRemaining
    })
  }

  // Check specific requirements
  for (const unmetReq of unmetRequirements) {
    blockers.push({
      type: 'requirement',
      message: `${unmetReq.requirementName}: Need ${unmetReq.creditsRemaining} more credits`,
      requirementName: unmetReq.requirementName,
      creditsNeeded: unmetReq.creditsRemaining,
      coursesNeeded: unmetReq.remainingCourses
    })
  }

  // Check GPA requirement
  if (currentGPA < minGPA) {
    blockers.push({
      type: 'gpa',
      message: `GPA below minimum (${currentGPA.toFixed(2)} < ${minGPA.toFixed(2)})`,
      currentGPA,
      minGPA,
      gpaDeficit: minGPA - currentGPA
    })
  }

  return {
    eligible: blockers.length === 0,
    blockers,
    estimatedCompletion: overallProgress.canGraduate && currentGPA >= minGPA
      ? 'Eligible to graduate'
      : `${blockers.length} requirement(s) not met`,
    details: {
      creditsComplete: overallProgress.totalCreditsRemaining === 0,
      requirementsMet: unmetRequirements.length === 0,
      gpaRequirementMet: currentGPA >= minGPA
    }
  }
}

/**
 * Generate recommendations for degree completion
 * @param {Object} degreeAudit - Result from performDegreeAudit
 * @returns {Object} Recommendations for completing degree
 */
export function generateDegreeRecommendations(degreeAudit) {
  const { unmetRequirements, overallProgress } = degreeAudit

  const recommendations = []

  // Sort unmet requirements by priority
  const sortedUnmet = [...unmetRequirements].sort((a, b) => {
    // Core requirements first
    if (a.requirementType === 'CORE' && b.requirementType !== 'CORE') return -1
    if (a.requirementType !== 'CORE' && b.requirementType === 'CORE') return 1

    // Then by credits remaining
    return b.creditsRemaining - a.creditsRemaining
  })

  for (const unmetReq of sortedUnmet) {
    const priority = unmetReq.requirementType === 'CORE' ? 'High' : 'Medium'

    recommendations.push({
      priority,
      requirementName: unmetReq.requirementName,
      action: `Complete ${unmetReq.creditsRemaining} credits from ${unmetReq.requirementName}`,
      coursesNeeded: unmetReq.courseCount.remaining,
      suggestedCourses: unmetReq.remainingCourses.slice(0, 5), // Top 5 suggestions
      percentComplete: unmetReq.percentComplete
    })
  }

  // Overall recommendation
  let overallRecommendation = ''
  if (overallProgress.percentComplete >= 90) {
    overallRecommendation = 'You are close to graduation! Focus on completing remaining requirements.'
  } else if (overallProgress.percentComplete >= 75) {
    overallRecommendation = 'You are on track. Continue completing core requirements.'
  } else if (overallProgress.percentComplete >= 50) {
    overallRecommendation = 'Good progress. Focus on foundational courses and prerequisites.'
  } else {
    overallRecommendation = 'Early in your degree. Build a strong foundation with core courses.'
  }

  return {
    overallRecommendation,
    recommendations,
    nextSteps: recommendations.slice(0, 3), // Top 3 priorities
    estimatedSemesters: Math.ceil(overallProgress.totalCreditsRemaining / 12)
  }
}

/**
 * Audit specific requirement type (CORE, ELECTIVE, etc.)
 * @param {Array} requirements - All requirements
 * @param {Array} completedCourses - Completed courses
 * @param {Array} allRequirementCourses - Requirement-course relationships
 * @param {String} requirementType - Type to audit (CORE, ELECTIVE, MATH, etc.)
 * @returns {Object} Audit for specific type
 */
export function auditByType(requirements, completedCourses, allRequirementCourses, requirementType) {
  const typeRequirements = requirements.filter(req => req.type === requirementType)

  return performDegreeAudit(typeRequirements, completedCourses, allRequirementCourses)
}

/**
 * Check if student meets prerequisite for senior-level courses
 * Typically requires certain credit count and GPA
 * @param {Number} completedCredits - Total credits completed
 * @param {Number} currentGPA - Current GPA
 * @param {Number} minCredits - Minimum credits for senior standing (default 90)
 * @param {Number} minGPA - Minimum GPA (default 2.0)
 * @returns {Object} Senior standing status
 */
export function checkSeniorStanding(
  completedCredits,
  currentGPA,
  minCredits = 90,
  minGPA = 2.0
) {
  const hasCredits = completedCredits >= minCredits
  const hasGPA = currentGPA >= minGPA

  return {
    isSenior: hasCredits && hasGPA,
    completedCredits,
    minCredits,
    creditsToSenior: Math.max(0, minCredits - completedCredits),
    currentGPA,
    minGPA,
    meetsGPA: hasGPA,
    message: hasCredits && hasGPA
      ? 'Senior standing achieved'
      : `Need ${Math.max(0, minCredits - completedCredits)} more credits and/or ${Math.max(0, minGPA - currentGPA).toFixed(2)} GPA points`
  }
}

/**
 * Generate degree audit PDF report data
 * @param {Object} degreeAudit - Complete degree audit
 * @param {Object} studentInfo - Student information
 * @param {Number} currentGPA - Current GPA
 * @returns {Object} Data formatted for PDF generation
 */
export function generateAuditReport(degreeAudit, studentInfo, currentGPA) {
  const eligibility = checkGraduationEligibility(degreeAudit, currentGPA)
  const recommendations = generateDegreeRecommendations(degreeAudit)

  return {
    reportDate: new Date().toISOString(),
    student: {
      name: studentInfo.name || 'Student',
      email: studentInfo.email,
      studentId: studentInfo.id
    },
    degreeProgram: {
      name: 'Bachelor of Science in Computer Science',
      department: 'Computer Sciences',
      institution: 'Metropolitan State University of Denver'
    },
    academicProgress: {
      gpa: currentGPA.toFixed(2),
      totalCredits: degreeAudit.overallProgress.totalCompletedCredits,
      creditsNeeded: degreeAudit.overallProgress.totalCreditsRemaining,
      percentComplete: degreeAudit.overallProgress.percentComplete
    },
    requirementStatus: degreeAudit.requirementAudits.map(ra => ({
      name: ra.requirementName,
      completed: ra.completedCredits,
      required: ra.minCredits,
      status: ra.isFulfilled ? 'Complete' : 'In Progress',
      percentComplete: ra.percentComplete
    })),
    graduationEligibility: {
      eligible: eligibility.eligible,
      status: eligibility.estimatedCompletion,
      blockers: eligibility.blockers.map(b => b.message)
    },
    recommendations: recommendations.nextSteps,
    summary: {
      canGraduate: eligibility.eligible,
      estimatedGraduation: eligibility.eligible
        ? 'Current semester'
        : `${recommendations.estimatedSemesters} semester(s)`,
      outstandingRequirements: degreeAudit.unmetRequirements.length
    }
  }
}
