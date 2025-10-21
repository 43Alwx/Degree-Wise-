const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import course data from msuDenverCS.js
const {
  coreCourses,
  mathCourses,
  ancillaryCourses,
  scienceCourseGroups,
  commonElectives,
} = require('../data/msuDenverCS.js');

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.requirementCourse.deleteMany({});
  await prisma.prerequisite.deleteMany({});
  await prisma.completedCourse.deleteMany({});
  await prisma.timeline.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleanup complete\n');

  // ==================== SEED COURSES ====================
  console.log('📚 Seeding courses...');

  const allCoursesData = [
    ...coreCourses,
    ...mathCourses,
    ...ancillaryCourses,
    ...commonElectives,
  ];

  // Flatten science courses from groups
  const scienceCourses = scienceCourseGroups.flatMap(group =>
    group.courses.map(course => ({
      ...course,
      scienceGroup: group.groupName
    }))
  );
  allCoursesData.push(...scienceCourses);

  // Create a map to store course IDs for later use
  const courseMap = new Map();

  // Create all courses
  for (const courseData of allCoursesData) {
    const course = await prisma.course.create({
      data: {
        code: courseData.code,
        name: courseData.name,
        credits: courseData.credits,
        description: courseData.description || `${courseData.name} - ${courseData.code}`,
        offeredFall: true,
        offeredSpring: true,
        offeredSummer: false,
      },
    });
    courseMap.set(courseData.code, course);
    console.log(`  ✓ Created: ${course.code} - ${course.name}`);
  }

  console.log(`\n✅ Created ${allCoursesData.length} courses\n`);

  // ==================== CREATE PREREQUISITES ====================
  console.log('🔗 Creating prerequisite relationships...');

  let prereqCount = 0;
  for (const courseData of allCoursesData) {
    if (courseData.prerequisites && courseData.prerequisites.length > 0) {
      const course = courseMap.get(courseData.code);

      for (const prereqCode of courseData.prerequisites) {
        const prerequisite = courseMap.get(prereqCode);

        if (prerequisite) {
          await prisma.prerequisite.create({
            data: {
              courseId: course.id,
              prerequisiteId: prerequisite.id,
            },
          });
          prereqCount++;
          console.log(`  ✓ ${course.code} requires ${prerequisite.code}`);
        }
      }
    }
  }

  console.log(`\n✅ Created ${prereqCount} prerequisite relationships\n`);

  // ==================== CREATE REQUIREMENT CATEGORIES ====================
  console.log('📋 Creating requirement categories...');

  // 1. Core CS Courses Requirement
  const coreRequirement = await prisma.requirement.create({
    data: {
      name: 'Required Computer Science Courses',
      description: 'Core CS courses required for the major',
      type: 'CORE',
      minCredits: 62,
    },
  });
  console.log(`  ✓ Created: ${coreRequirement.name}`);

  // Link core courses
  for (const courseData of coreCourses) {
    const course = courseMap.get(courseData.code);
    await prisma.requirementCourse.create({
      data: {
        requirementId: coreRequirement.id,
        courseId: course.id,
      },
    });
  }
  console.log(`    - Linked ${coreCourses.length} core courses`);

  // 2. CS Electives Requirement
  const electivesRequirement = await prisma.requirement.create({
    data: {
      name: 'CS Upper Division Electives',
      description: 'Choose 12 credits of upper division CS electives',
      type: 'ELECTIVE',
      minCredits: 12,
    },
  });
  console.log(`  ✓ Created: ${electivesRequirement.name}`);

  // Link elective courses
  for (const courseData of commonElectives) {
    const course = courseMap.get(courseData.code);
    await prisma.requirementCourse.create({
      data: {
        requirementId: electivesRequirement.id,
        courseId: course.id,
      },
    });
  }
  console.log(`    - Linked ${commonElectives.length} elective courses`);

  // 3. Mathematics Requirement
  const mathRequirement = await prisma.requirement.create({
    data: {
      name: 'Required Mathematics',
      description: 'Math courses required for the major',
      type: 'MATH',
      minCredits: 12,
    },
  });
  console.log(`  ✓ Created: ${mathRequirement.name}`);

  // Link math courses
  for (const courseData of mathCourses) {
    const course = courseMap.get(courseData.code);
    await prisma.requirementCourse.create({
      data: {
        requirementId: mathRequirement.id,
        courseId: course.id,
      },
    });
  }
  console.log(`    - Linked ${mathCourses.length} math courses`);

  // 4. Ancillary Courses Requirement
  const ancillaryRequirement = await prisma.requirement.create({
    data: {
      name: 'Required Ancillary Courses',
      description: 'Communication and ethics courses',
      type: 'ANCILLARY',
      minCredits: 9,
    },
  });
  console.log(`  ✓ Created: ${ancillaryRequirement.name}`);

  // Link ancillary courses
  for (const courseData of ancillaryCourses) {
    const course = courseMap.get(courseData.code);
    await prisma.requirementCourse.create({
      data: {
        requirementId: ancillaryRequirement.id,
        courseId: course.id,
      },
    });
  }
  console.log(`    - Linked ${ancillaryCourses.length} ancillary courses`);

  // 5. Science Requirements (one requirement per group)
  console.log(`  ✓ Creating science requirement groups...`);
  for (const group of scienceCourseGroups) {
    const scienceRequirement = await prisma.requirement.create({
      data: {
        name: `Science Option: ${group.groupName}`,
        description: `Complete all courses in ${group.groupName} group`,
        type: 'SCIENCE',
        minCredits: group.courses.reduce((sum, c) => sum + c.credits, 0),
      },
    });

    // Link science courses in this group
    for (const courseData of group.courses) {
      const course = courseMap.get(courseData.code);
      await prisma.requirementCourse.create({
        data: {
          requirementId: scienceRequirement.id,
          courseId: course.id,
        },
      });
    }
    console.log(`    - Created: ${group.groupName} (${group.courses.length} courses)`);
  }

  console.log(`\n✅ Created requirement categories\n`);

  // ==================== CREATE SAMPLE USER (Optional) ====================
  console.log('👤 Creating sample user...');

  const sampleUser = await prisma.user.create({
    data: {
      email: 'student@msudenver.edu',
      name: 'Sample Student',
    },
  });
  console.log(`  ✓ Created sample user: ${sampleUser.email}\n`);

  // ==================== SUMMARY ====================
  const coursesCount = await prisma.course.count();
  const prerequisitesCount = await prisma.prerequisite.count();
  const requirementsCount = await prisma.requirement.count();
  const requirementCoursesCount = await prisma.requirementCourse.count();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Database seeding completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   • Courses: ${coursesCount}`);
  console.log(`   • Prerequisites: ${prerequisitesCount}`);
  console.log(`   • Requirements: ${requirementsCount}`);
  console.log(`   • Requirement-Course Links: ${requirementCoursesCount}`);
  console.log(`   • Users: 1 (sample)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
