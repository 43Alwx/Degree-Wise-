/**
 * MSU Denver Computer Science B.S. Degree Requirements
 * Parsed from CS-Advising-Sheet-2023-2024-2.pdf
 * Effective Fall 2023
 */

// Core CS Courses (62 credits required)
export const coreCourses = [
  {
    code: 'CS1030',
    name: 'Computer Science Principles',
    credits: 4,
    prerequisites: [],
    description: 'Introduction to computer science principles'
  },
  {
    code: 'CS1050',
    name: 'Computer Science 1',
    credits: 4,
    prerequisites: ['CS1030'], // or Readiness for College Algebra
    description: 'First course in computer science'
  },
  {
    code: 'CS1400',
    name: 'Computer Organization 1',
    credits: 4,
    prerequisites: [], // Readiness for College Algebra
    description: 'Introduction to computer organization'
  },
  {
    code: 'CS2050',
    name: 'Computer Science 2',
    credits: 4,
    prerequisites: ['CS1050'], // and College Algebra
    description: 'Second course in computer science'
  },
  {
    code: 'CS2240',
    name: 'Discrete Structures for Computer Science',
    credits: 4,
    prerequisites: ['CS2050', 'MTH1400'], // or MTH1120 and MTH1110
    description: 'Mathematical foundations for computer science'
  },
  {
    code: 'CS2400',
    name: 'Computer Organization 2',
    credits: 4,
    prerequisites: ['CS1050', 'CS1400'], // and College Algebra
    description: 'Advanced computer organization'
  },
  {
    code: 'CS3210',
    name: 'Principles of Programming Languages',
    credits: 4,
    prerequisites: ['CS2050', 'CS2400', 'CS3240', 'CS3250', 'CS2240'],
    description: 'Study of programming language paradigms'
  },
  {
    code: 'CS3240',
    name: 'Introduction to Theory of Computation',
    credits: 2,
    prerequisites: ['CS2050', 'CS2240'],
    description: 'Theoretical foundations of computation'
  },
  {
    code: 'CS3250',
    name: 'Software Development Methods & Tools',
    credits: 4,
    prerequisites: ['CS2050', 'ENG1020', 'CAS1010'],
    description: 'Modern software development practices'
  },
  {
    code: 'CS3600',
    name: 'Operating Systems',
    credits: 4,
    prerequisites: ['CS2050', 'CS2400', 'CS3250'],
    description: 'Operating system concepts and implementation'
  },
  {
    code: 'CS3700',
    name: 'Networking and Distributed Computing',
    credits: 4,
    prerequisites: ['CS1400', 'CS2050'],
    description: 'Computer networks and distributed systems'
  },
  {
    code: 'CS4050',
    name: 'Algorithms and Algorithm Analysis',
    credits: 4,
    prerequisites: ['CS3240', 'CS3250'], // and 4 additional upper division CS credits
    description: 'Algorithm design and complexity analysis'
  },
  {
    code: 'CS4360',
    name: 'Senior Experience in Computer Science',
    credits: 4,
    prerequisites: ['CS3250', 'COMM1010', 'JMP2610', 'PHI3370'], // Senior Standing, 12 additional upper division CS credits
    description: 'Capstone project course',
    isSeniorExperience: true
  }
];

// Math Requirements (12 credits)
export const mathCourses = [
  {
    code: 'MTH1410',
    name: 'Calculus I',
    credits: 4,
    prerequisites: [],
    description: 'First semester calculus'
  },
  {
    code: 'MTH3130',
    name: 'Applied Methods in Linear Algebra',
    credits: 4,
    prerequisites: ['MTH1410'],
    description: 'Linear algebra for applications'
  },
  {
    code: 'MTH3210',
    name: 'Probability and Statistics',
    credits: 4,
    prerequisites: ['MTH1410'],
    description: 'Statistical methods and probability theory'
  }
];

// Ancillary Courses (9 credits)
export const ancillaryCourses = [
  {
    code: 'COMM1010',
    name: 'Presentational Speaking',
    credits: 3,
    prerequisites: [],
    description: 'Public speaking skills',
    alternativeTo: 'COMM1100'
  },
  {
    code: 'COMM1100',
    name: 'Fundamentals of Oral Communication',
    credits: 3,
    prerequisites: [],
    description: 'Oral communication fundamentals',
    alternativeTo: 'COMM1010'
  },
  {
    code: 'JMP2610',
    name: 'Introduction to Technical Writing',
    credits: 3,
    prerequisites: [],
    description: 'Technical writing for CS professionals'
  },
  {
    code: 'PHI3370',
    name: 'Computers, Ethics, and Society',
    credits: 3,
    prerequisites: [],
    description: 'Ethical issues in computing'
  }
];

// Science Requirements (6+ credits) - Must choose ONE group
export const scienceCourseGroups = [
  {
    groupName: 'Biology I',
    courses: [
      {
        code: 'BIO1080',
        name: 'General Biology I',
        credits: 3,
        prerequisites: []
      },
      {
        code: 'BIO1090',
        name: 'General Biology Laboratory I',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Biology II',
    courses: [
      {
        code: 'BIO1081',
        name: 'General Biology 2',
        credits: 3,
        prerequisites: []
      },
      {
        code: 'BIO1091',
        name: 'General Biology Laboratory 2',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Chemistry I',
    courses: [
      {
        code: 'CHE1800',
        name: 'General Chemistry I',
        credits: 4,
        prerequisites: []
      },
      {
        code: 'CHE1801',
        name: 'General Chemistry I Laboratory',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Chemistry II',
    courses: [
      {
        code: 'CHE1810',
        name: 'General Chemistry 2',
        credits: 4,
        prerequisites: []
      },
      {
        code: 'CHE1811',
        name: 'General Chemistry 2 Laboratory',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Geology',
    courses: [
      {
        code: 'GEL1010',
        name: 'Physical Geology',
        credits: 4,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Meteorology',
    courses: [
      {
        code: 'MTR1400',
        name: 'Weather and Climate',
        credits: 3,
        prerequisites: []
      },
      {
        code: 'MTR2020',
        name: 'Weather and Climate Lab for Sciences',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Physics I',
    courses: [
      {
        code: 'PHY2311',
        name: 'General Physics I',
        credits: 4,
        prerequisites: []
      },
      {
        code: 'PHY2321',
        name: 'General Physics I Laboratory',
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Physics II',
    courses: [
      {
        code: 'PHY2331',
        name: 'General Physics 2',
        credits: 4,
        prerequisites: []
      },
      {
        code: 'PHY2341',
        name: 'General Physics 2 Laboratory',
        
        credits: 1,
        prerequisites: []
      }
    ]
  },
  {
    groupName: 'Environmental Science',
    courses: [
      {
        code: 'ENV1200',
        name: 'Environmental Science',
        credits: 3,
        prerequisites: []
      }
    ]
  }
];

// Requirement Categories
export const requirements = {
  coreCourses: {
    name: 'Required Computer Science Courses',
    credits: 62,
    courses: coreCourses.map(c => c.code),
    description: 'Core CS courses required for the major'
  },
  csElectives: {
    name: 'CS Upper Division Electives',
    credits: 12,
    courses: [], // Any upper division CS courses
    description: 'Choose 12 credits of upper division CS electives'
  },
  mathematics: {
    name: 'Required Mathematics',
    credits: 12,
    courses: mathCourses.map(c => c.code),
    description: 'Math courses required for the major'
  },
  ancillary: {
    name: 'Required Ancillary Courses',
    credits: 9,
    courses: ['COMM1010_OR_COMM1100', 'JMP2610', 'PHI3370'],
    description: 'Communication and ethics courses'
  },
  science: {
    name: 'Required Science Courses',
    credits: 6,
    minCredits: 6,
    description: 'Must choose ONE group from the science options',
    isChoiceRequired: true,
    groups: scienceCourseGroups
  }
};

// Degree Summary
export const degreeSummary = {
  programName: 'Bachelor of Science in Computer Science',
  institution: 'Metropolitan State University of Denver',
  department: 'Department of Computer Sciences',
  effectiveDate: 'Fall 2023',
  totalCredits: 120,
  minimumGrade: 'C-',
  accreditation: 'ABET - Computing Accreditation Commission',
  additionalRequirements: {
    generalStudies: 33, // minimum credits
    ethnicStudies: 3, // ESSJ requirement
  }
};

// Sample Upper Division CS Electives (common options - not exhaustive)
export const commonElectives = [
  {
    code: 'CS3110',
    name: 'Database Systems',
    credits: 4,
    prerequisites: ['CS2050'],
    isElective: true
  },
  {
    code: 'CS3920',
    name: 'Software Engineering',
    credits: 4,
    prerequisites: ['CS3250'],
    isElective: true
  },
  {
    code: 'CS4100',
    name: 'Artificial Intelligence',
    credits: 4,
    prerequisites: ['CS2240', 'CS2050'],
    isElective: true
  },
  {
    code: 'CS4250',
    name: 'Web Development',
    credits: 4,
    prerequisites: ['CS2050'],
    isElective: true
  },
  {
    code: 'CS4400',
    name: 'Computer Graphics',
    credits: 4,
    prerequisites: ['CS2050', 'MTH3130'],
    isElective: true
  },
  {
    code: 'CS4760',
    name: 'Computer Security',
    credits: 4,
    prerequisites: ['CS3600'],
    isElective: true
  }
];

// Export all data
export const msuDenverCS = {
  degreeSummary,
  coreCourses,
  mathCourses,
  ancillaryCourses,
  scienceCourseGroups,
  commonElectives,
  requirements
};

export default msuDenverCS;