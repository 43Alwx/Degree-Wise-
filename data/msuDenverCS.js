/**
 * MSU Denver Computer Science Degree Requirements
 * Sample data - should be updated with actual MSU Denver CS curriculum
 */

export const csCourses = [
  // First Year Courses
  {
    code: 'CS 1050',
    name: 'Computer Science I',
    credits: 4,
    description: 'Introduction to programming and problem solving',
    prerequisites: [],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: true
  },
  {
    code: 'CS 1150',
    name: 'Computer Science II',
    credits: 4,
    description: 'Advanced programming concepts and data structures',
    prerequisites: ['CS 1050'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'MTH 1410',
    name: 'Calculus I',
    credits: 4,
    description: 'Differential calculus',
    prerequisites: [],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: true
  },
  {
    code: 'MTH 1420',
    name: 'Calculus II',
    credits: 4,
    description: 'Integral calculus',
    prerequisites: ['MTH 1410'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },

  // Second Year Courses
  {
    code: 'CS 2050',
    name: 'Computer Organization',
    credits: 3,
    description: 'Computer architecture and assembly language',
    prerequisites: ['CS 1150'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 2060',
    name: 'Data Structures',
    credits: 3,
    description: 'Advanced data structures and algorithms',
    prerequisites: ['CS 1150'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 2400',
    name: 'Discrete Mathematics',
    credits: 3,
    description: 'Logic, sets, functions, and relations',
    prerequisites: ['MTH 1410'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'MTH 2420',
    name: 'Discrete Mathematics II',
    credits: 3,
    description: 'Graph theory and combinatorics',
    prerequisites: ['CS 2400'],
    offeredFall: true,
    offeredSpring: false,
    offeredSummer: false
  },

  // Third Year Courses
  {
    code: 'CS 3000',
    name: 'Algorithms',
    credits: 3,
    description: 'Algorithm design and analysis',
    prerequisites: ['CS 2060', 'CS 2400'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 3120',
    name: 'Software Engineering',
    credits: 3,
    description: 'Software development lifecycle and methodologies',
    prerequisites: ['CS 2060'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 3210',
    name: 'Database Systems',
    credits: 3,
    description: 'Database design and SQL',
    prerequisites: ['CS 2060'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 3240',
    name: 'Operating Systems',
    credits: 3,
    description: 'OS concepts and system programming',
    prerequisites: ['CS 2050', 'CS 2060'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 3700',
    name: 'Computer Networks',
    credits: 3,
    description: 'Network protocols and architecture',
    prerequisites: ['CS 2060'],
    offeredFall: true,
    offeredSpring: false,
    offeredSummer: false
  },

  // Fourth Year Courses
  {
    code: 'CS 4100',
    name: 'Programming Languages',
    credits: 3,
    description: 'Language paradigms and implementation',
    prerequisites: ['CS 3000'],
    offeredFall: false,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 4200',
    name: 'Artificial Intelligence',
    credits: 3,
    description: 'AI concepts and techniques',
    prerequisites: ['CS 3000'],
    offeredFall: true,
    offeredSpring: false,
    offeredSummer: false
  },
  {
    code: 'CS 4300',
    name: 'Computer Graphics',
    credits: 3,
    description: '2D and 3D graphics programming',
    prerequisites: ['CS 2060', 'MTH 1420'],
    offeredFall: false,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 4500',
    name: 'Cybersecurity',
    credits: 3,
    description: 'Security principles and practices',
    prerequisites: ['CS 3240'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 4910',
    name: 'Senior Project I',
    credits: 3,
    description: 'Capstone project development',
    prerequisites: ['CS 3120'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  },
  {
    code: 'CS 4920',
    name: 'Senior Project II',
    credits: 3,
    description: 'Capstone project completion',
    prerequisites: ['CS 4910'],
    offeredFall: true,
    offeredSpring: true,
    offeredSummer: false
  }
]

export const degreeRequirements = [
  {
    name: 'Core CS Courses',
    type: 'CORE',
    description: 'Required courses for CS major',
    minCredits: 36,
    courses: [
      'CS 1050', 'CS 1150', 'CS 2050', 'CS 2060', 'CS 2400',
      'CS 3000', 'CS 3120', 'CS 3210', 'CS 3240', 'CS 4910', 'CS 4920'
    ]
  },
  {
    name: 'CS Electives',
    type: 'ELECTIVE',
    description: 'Choose 4 CS elective courses',
    minCredits: 12,
    courses: [
      'CS 3700', 'CS 4100', 'CS 4200', 'CS 4300', 'CS 4500'
    ]
  },
  {
    name: 'Math Requirements',
    type: 'MATH',
    description: 'Required mathematics courses',
    minCredits: 14,
    courses: [
      'MTH 1410', 'MTH 1420', 'MTH 2420'
    ]
  },
  {
    name: 'General Education',
    type: 'GENERAL_ED',
    description: 'General education requirements',
    minCredits: 42,
    courses: []
  }
]

export const totalCreditsRequired = 120

/**
 * Get a course by its code
 */
export function getCourseByCode(code) {
  return csCourses.find(c => c.code === code)
}

/**
 * Get all prerequisites for a course
 */
export function getPrerequisites(courseCode) {
  const course = getCourseByCode(courseCode)
  if (!course || !course.prerequisites) return []

  return course.prerequisites.map(prereqCode => getCourseByCode(prereqCode))
}

/**
 * Calculate remaining requirements
 */
export function calculateRemainingRequirements(completedCourses) {
  const completedCodes = new Set(completedCourses.map(c => c.code || c.course?.code))

  return degreeRequirements.map(req => {
    const completed = req.courses.filter(code => completedCodes.has(code))
    const remaining = req.courses.filter(code => !completedCodes.has(code))

    return {
      ...req,
      completedCourses: completed,
      remainingCourses: remaining,
      completedCredits: completed.length * 3,
      remainingCredits: req.minCredits - (completed.length * 3)
    }
  })
}
