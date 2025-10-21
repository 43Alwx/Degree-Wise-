const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestUser() {
  console.log('Creating test user with completed courses...\n');

  // Delete existing test user if exists
  await prisma.completedCourse.deleteMany({
    where: { userId: 'test-user-123' }
  });

  await prisma.user.deleteMany({
    where: { id: 'test-user-123' }
  });

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      id: 'test-user-123',
      email: 'test@student.com',
      name: 'Test Student'
    }
  });

  console.log(`✓ Created user: ${testUser.name} (${testUser.email})`);

  // Get some courses to mark as completed
  const cs1030 = await prisma.course.findFirst({ where: { code: 'CS1030' } });
  const cs1050 = await prisma.course.findFirst({ where: { code: 'CS1050' } });
  const cs1400 = await prisma.course.findFirst({ where: { code: 'CS1400' } });
  const cs2050 = await prisma.course.findFirst({ where: { code: 'CS2050' } });
  const mth1410 = await prisma.course.findFirst({ where: { code: 'MTH1410' } });

  // Add completed courses
  const completedCourses = [
    { courseId: cs1030.id, grade: 'A', semester: 'Fall 2023' },
    { courseId: cs1050.id, grade: 'A-', semester: 'Spring 2024' },
    { courseId: cs1400.id, grade: 'B+', semester: 'Spring 2024' },
    { courseId: cs2050.id, grade: 'B', semester: 'Fall 2024' },
    { courseId: mth1410.id, grade: 'A', semester: 'Fall 2023' }
  ];

  for (const cc of completedCourses) {
    await prisma.completedCourse.create({
      data: {
        userId: testUser.id,
        ...cc
      }
    });
  }

  console.log(`✓ Added ${completedCourses.length} completed courses`);

  // Summary
  const userWithCourses = await prisma.user.findUnique({
    where: { id: testUser.id },
    include: {
      completedCourses: {
        include: {
          course: true
        }
      }
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Test user created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📊 User ID: ${testUser.id}`);
  console.log(`📧 Email: ${testUser.email}`);
  console.log(`\nCompleted Courses:`);
  userWithCourses.completedCourses.forEach(cc => {
    console.log(`  - ${cc.course.code}: ${cc.course.name} (Grade: ${cc.grade})`);
  });
  console.log(`\n📍 Use this User ID in the test page: test-user-123`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

createTestUser()
  .catch((e) => {
    console.error('Error creating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
