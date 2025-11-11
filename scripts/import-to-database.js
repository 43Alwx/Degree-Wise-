/**
 * Import scraped course data into the database
 * Loads data from msu-cs-degree-complete.json into Prisma database
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

/**
 * Convert term code to description
 */
function getTermDescription(termCode) {
  const year = termCode.substring(0, 4);
  const termNum = termCode.substring(4, 6);

  const termMap = {
    '10': 'Spring',
    '30': 'Spring',
    '40': 'Summer',
    '50': 'Fall'
  };

  const term = termMap[termNum] || 'Unknown';
  return `${term} ${year}`;
}

/**
 * Import all courses and offerings into database
 */
async function importToDatabase(jsonFilePath = null) {
  console.log('Importing Course Data to Database\n');
  console.log('='.repeat(70));

  try {
    // Load the JSON data
    if (!jsonFilePath) {
      jsonFilePath = path.join(__dirname, '..', 'data', 'msu-cs-degree-complete.json');
    }

    console.log('1. Loading data from:', jsonFilePath);
    const data = JSON.parse(await fs.readFile(jsonFilePath, 'utf8'));
    console.log(`   Found ${data.courses.length} courses to import\n`);

    // Get term description from metadata
    const termCode = data.metadata.term || '202630';
    const termDescription = getTermDescription(termCode);

    // Statistics
    let stats = {
      coursesCreated: 0,
      coursesUpdated: 0,
      offeringsCreated: 0,
      sectionsCreated: 0,
      instructorsCreated: 0,
      schedulesCreated: 0,
      prerequisitesCreated: 0
    };

    console.log('2. Importing courses...\n');

    // Import each course
    for (const courseData of data.courses) {
      console.log(`   Processing ${courseData.code}: ${courseData.name}`);

      // Upsert the course
      const course = await prisma.course.upsert({
        where: { code: courseData.code },
        update: {
          name: courseData.name,
          credits: courseData.credits,
          description: courseData.description || null,
          category: courseData.category || null,
          isSeniorExperience: courseData.isSeniorExperience || false,
          isElective: courseData.isElective || false,
          alternativeTo: courseData.alternativeTo || null,
          scienceGroup: courseData.scienceGroup || null,
          updatedAt: new Date()
        },
        create: {
          code: courseData.code,
          name: courseData.name,
          credits: courseData.credits,
          description: courseData.description || null,
          category: courseData.category || null,
          isSeniorExperience: courseData.isSeniorExperience || false,
          isElective: courseData.isElective || false,
          alternativeTo: courseData.alternativeTo || null,
          scienceGroup: courseData.scienceGroup || null
        }
      });

      const isNew = !course.updatedAt || course.updatedAt.getTime() === course.createdAt.getTime();
      if (isNew) {
        stats.coursesCreated++;
      } else {
        stats.coursesUpdated++;
      }

      // Import current offering if available
      if (courseData.currentOffering && courseData.currentOffering.isOffered) {
        const offering = courseData.currentOffering;

        // Use the term from metadata (all offerings are for the same term)
        const offeringTermCode = termCode;
        const offeringTermDesc = termDescription;

        console.log(`     → Creating offering for ${offeringTermDesc}`);

        // Create or update the course offering
        const courseOffering = await prisma.courseOffering.upsert({
          where: {
            courseId_termCode: {
              courseId: course.id,
              termCode: offeringTermCode
            }
          },
          update: {
            termDescription: offeringTermDesc,
            isOffered: offering.isOffered,
            availabilityStatus: offering.availabilityStatus,
            totalSections: offering.totalSections,
            totalSeatsAvailable: offering.totalSeatsAvailable,
            totalCapacity: offering.totalCapacity,
            scrapedAt: new Date(offering.scrapedAt),
            updatedAt: new Date()
          },
          create: {
            courseId: course.id,
            termCode: offeringTermCode,
            termDescription: offeringTermDesc,
            isOffered: offering.isOffered,
            availabilityStatus: offering.availabilityStatus,
            totalSections: offering.totalSections,
            totalSeatsAvailable: offering.totalSeatsAvailable,
            totalCapacity: offering.totalCapacity,
            scrapedAt: new Date(offering.scrapedAt)
          }
        });

        stats.offeringsCreated++;

        // Delete existing sections for this offering (to avoid duplicates on re-import)
        await prisma.courseSection.deleteMany({
          where: { offeringId: courseOffering.id }
        });

        // Import sections
        for (const sectionData of offering.sections) {
          console.log(`       → Section ${sectionData.sectionNumber} (CRN: ${sectionData.crn})`);

          const section = await prisma.courseSection.create({
            data: {
              offeringId: courseOffering.id,
              crn: sectionData.crn,
              sectionNumber: sectionData.sectionNumber,
              currentEnrollment: sectionData.enrollment?.current || 0,
              maximumEnrollment: sectionData.enrollment?.maximum || 0,
              seatsAvailable: sectionData.enrollment?.available || 0,
              waitlistAvailable: sectionData.enrollment?.waitlistAvailable || 0,
              waitlistCapacity: sectionData.enrollment?.waitlistCapacity || 0,
              instructionalMethod: sectionData.instructionalMethod || null,
              campus: sectionData.campus || null
            }
          });

          stats.sectionsCreated++;

          // Import instructors
          if (sectionData.instructors && sectionData.instructors.length > 0) {
            for (const instructorData of sectionData.instructors) {
              await prisma.instructor.create({
                data: {
                  sectionId: section.id,
                  name: instructorData.name,
                  email: instructorData.email || null,
                  isPrimary: instructorData.isPrimary || false
                }
              });
              stats.instructorsCreated++;
            }
          }

          // Import schedules
          if (sectionData.schedule && sectionData.schedule.length > 0) {
            for (const scheduleData of sectionData.schedule) {
              await prisma.schedule.create({
                data: {
                  sectionId: section.id,
                  days: scheduleData.days || '',
                  time: scheduleData.time || '',
                  startTime: scheduleData.startDate || null,
                  endTime: scheduleData.endDate || null,
                  building: scheduleData.building || null,
                  room: scheduleData.room || null,
                  buildingDescription: scheduleData.buildingDescription || null,
                  campus: scheduleData.campus || null,
                  meetingType: scheduleData.meetingType || null
                }
              });
              stats.schedulesCreated++;
            }
          }
        }
      } else {
        console.log(`     → No offering this term`);
      }
    }

    console.log('\n3. Importing prerequisites...\n');

    // Import prerequisites
    for (const courseData of data.courses) {
      if (courseData.prerequisites && courseData.prerequisites.length > 0) {
        const course = await prisma.course.findUnique({
          where: { code: courseData.code }
        });

        if (!course) continue;

        console.log(`   ${courseData.code} requires: ${courseData.prerequisites.join(', ')}`);

        for (const prereqCode of courseData.prerequisites) {
          // Find the prerequisite course
          const prereqCourse = await prisma.course.findUnique({
            where: { code: prereqCode }
          });

          if (prereqCourse) {
            // Create prerequisite relationship if it doesn't exist
            try {
              await prisma.prerequisite.create({
                data: {
                  courseId: course.id,
                  prerequisiteId: prereqCourse.id
                }
              });
              stats.prerequisitesCreated++;
            } catch (error) {
              // Ignore if already exists
              if (!error.code || error.code !== 'P2002') {
                console.error(`     Error creating prerequisite: ${error.message}`);
              }
            }
          }
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('IMPORT COMPLETE');
    console.log('='.repeat(70));
    console.log('Statistics:');
    console.log(`  Courses created: ${stats.coursesCreated}`);
    console.log(`  Courses updated: ${stats.coursesUpdated}`);
    console.log(`  Offerings created: ${stats.offeringsCreated}`);
    console.log(`  Sections created: ${stats.sectionsCreated}`);
    console.log(`  Instructors created: ${stats.instructorsCreated}`);
    console.log(`  Schedules created: ${stats.schedulesCreated}`);
    console.log(`  Prerequisites created: ${stats.prerequisitesCreated}`);
    console.log('='.repeat(70));

    return stats;

  } catch (error) {
    console.error('\nError:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  const jsonFilePath = process.argv[2];

  importToDatabase(jsonFilePath)
    .then(() => {
      console.log('\n✓ Database import completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n✗ Database import failed');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { importToDatabase };
