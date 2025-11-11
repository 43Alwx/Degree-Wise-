/**
 * Integrate all scraped courses with static degree requirements
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Integrate all subjects with static requirements
 */
async function integrateAllCourses(staticDataPath, allCoursesPath, outputPath = null) {
  console.log('Complete CS Degree Data Integration\n');

  try {
    // Load static requirements
    console.log('1. Loading static course requirements...');
    const staticModule = require(path.resolve(staticDataPath));
    const {
      coreCourses,
      mathCourses,
      ancillaryCourses,
      commonElectives,
      scienceCourseGroups,
      degreeSummary
    } = staticModule;

    // Combine all static courses
    let allStaticCourses = [
      ...coreCourses.map(c => ({ ...c, category: 'Core CS' })),
      ...mathCourses.map(c => ({ ...c, category: 'Mathematics' })),
      ...ancillaryCourses.map(c => ({ ...c, category: 'Ancillary' })),
      ...commonElectives.map(c => ({ ...c, category: 'CS Electives' }))
    ];

    // Add science courses
    scienceCourseGroups.forEach(group => {
      group.courses.forEach(c => {
        allStaticCourses.push({ ...c, category: 'Science', scienceGroup: group.groupName });
      });
    });

    console.log(`  Found ${allStaticCourses.length} static course definitions`);

    // Load all scraped courses
    console.log('2. Loading all scraped courses...');
    const allCoursesData = JSON.parse(await fs.readFile(allCoursesPath, 'utf8'));
    console.log(`  Found ${allCoursesData.statistics.totalCourses} courses across ${allCoursesData.statistics.totalSubjects} subjects`);

    // Create a map of all live courses by course code
    const liveCoursesMap = {};
    Object.keys(allCoursesData.subjects).forEach(subjectCode => {
      const subject = allCoursesData.subjects[subjectCode];
      subject.courses.forEach(course => {
        liveCoursesMap[course.code] = course;
      });
    });

    // Merge the data
    console.log('3. Merging course data...\n');
    const integratedCourses = [];
    let matchedCount = 0;
    let unmatchedCount = 0;

    allStaticCourses.forEach(staticCourse => {
      const courseCode = staticCourse.code;
      const liveCourse = liveCoursesMap[courseCode];

      if (liveCourse) {
        // Merge static and live data
        const integrated = {
          // Basic info
          code: courseCode,
          name: staticCourse.name,
          credits: staticCourse.credits,
          category: staticCourse.category,

          // Static catalog data
          prerequisites: staticCourse.prerequisites || [],
          description: staticCourse.description,
          isSeniorExperience: staticCourse.isSeniorExperience || false,
          isElective: staticCourse.isElective || false,
          alternativeTo: staticCourse.alternativeTo || null,
          scienceGroup: staticCourse.scienceGroup || null,

          // Live offerings
          currentOffering: {
            term: allCoursesData.term,
            scrapedAt: allCoursesData.scrapedAt,
            isOffered: true,
            totalSections: liveCourse.sections.length,
            sections: liveCourse.sections,

            // Summary statistics
            availabilityStatus: calculateAvailability(liveCourse.sections),
            instructors: getAllInstructors(liveCourse.sections),
            meetingPatterns: getMeetingPatterns(liveCourse.sections),
            totalSeatsAvailable: liveCourse.sections.reduce((sum, s) => sum + (s.enrollment?.available || 0), 0),
            totalCapacity: liveCourse.sections.reduce((sum, s) => sum + (s.enrollment?.maximum || 0), 0),
            campuses: [...new Set(liveCourse.sections.map(s => s.campus).filter(Boolean))]
          }
        };

        integratedCourses.push(integrated);
        matchedCount++;

        const statusIcon = integrated.currentOffering.availabilityStatus === 'available' ? '✓' :
                          integrated.currentOffering.availabilityStatus === 'limited' ? '~' :
                          integrated.currentOffering.availabilityStatus === 'full' ? '✗' : '-';

        console.log(`  ${statusIcon} ${courseCode}: ${staticCourse.name} [${staticCourse.category}] - ${liveCourse.sections.length} sections`);
      } else {
        // Course not offered this term
        const integrated = {
          code: courseCode,
          name: staticCourse.name,
          credits: staticCourse.credits,
          category: staticCourse.category,
          prerequisites: staticCourse.prerequisites || [],
          description: staticCourse.description,
          isSeniorExperience: staticCourse.isSeniorExperience || false,
          isElective: staticCourse.isElective || false,
          alternativeTo: staticCourse.alternativeTo || null,
          scienceGroup: staticCourse.scienceGroup || null,
          currentOffering: {
            term: allCoursesData.term,
            scrapedAt: allCoursesData.scrapedAt,
            isOffered: false,
            totalSections: 0,
            sections: [],
            availabilityStatus: 'not_offered',
            instructors: [],
            meetingPatterns: [],
            totalSeatsAvailable: 0,
            totalCapacity: 0,
            campuses: []
          }
        };

        integratedCourses.push(integrated);
        unmatchedCount++;

        console.log(`  - ${courseCode}: ${staticCourse.name} [${staticCourse.category}] - Not offered`);
      }
    });

    // Group by category
    const coursesByCategory = {};
    integratedCourses.forEach(course => {
      if (!coursesByCategory[course.category]) {
        coursesByCategory[course.category] = [];
      }
      coursesByCategory[course.category].push(course);
    });

    console.log(`\n4. Summary:`);
    console.log(`  Total required courses: ${integratedCourses.length}`);
    console.log(`  Currently offered: ${matchedCount} (${((matchedCount/integratedCourses.length)*100).toFixed(0)}%)`);
    console.log(`  Not offered: ${unmatchedCount}`);

    console.log('\n  By Category:');
    Object.keys(coursesByCategory).forEach(category => {
      const courses = coursesByCategory[category];
      const offered = courses.filter(c => c.currentOffering.isOffered).length;
      console.log(`    ${category}: ${offered}/${courses.length} offered`);
    });

    // Create comprehensive output - ONLY with required courses, no extra data
    const output = {
      metadata: {
        institution: degreeSummary.institution,
        program: degreeSummary.programName,
        department: degreeSummary.department,
        term: allCoursesData.term,
        integratedAt: new Date().toISOString(),
        totalCreditsRequired: degreeSummary.totalCredits,
        minimumGrade: degreeSummary.minimumGrade,
        accreditation: degreeSummary.accreditation,
        note: 'This file contains ONLY the courses required for the CS degree, not all available courses'
      },

      courses: integratedCourses,

      coursesByCategory: coursesByCategory,

      statistics: {
        totalRequiredCourses: integratedCourses.length,
        currentlyOffered: matchedCount,
        notOffered: unmatchedCount,
        offeringPercentage: ((matchedCount/integratedCourses.length)*100).toFixed(1),
        totalSectionsAvailable: integratedCourses.reduce((sum, c) => sum + c.currentOffering.totalSections, 0),
        totalSeatsAvailable: integratedCourses.reduce((sum, c) => sum + c.currentOffering.totalSeatsAvailable, 0)
      }

      // NOTE: Extra scraped courses that are NOT required for CS degree are excluded from this file
    };

    // Save to file
    if (!outputPath) {
      outputPath = path.join(path.dirname(allCoursesPath), 'msu-cs-degree-complete.json');
    }

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Complete integrated data saved to ${outputPath}`);

    return output;

  } catch (error) {
    console.error('\nError:', error.message);
    throw error;
  }
}

/**
 * Calculate availability status
 */
function calculateAvailability(sections) {
  if (sections.length === 0) return 'not_offered';

  const totalAvailable = sections.reduce((sum, s) => sum + (s.enrollment?.available || 0), 0);
  const totalCapacity = sections.reduce((sum, s) => sum + (s.enrollment?.maximum || 0), 0);

  if (totalAvailable === 0) return 'full';
  if (totalAvailable / totalCapacity > 0.5) return 'available';
  if (totalAvailable / totalCapacity > 0.1) return 'limited';
  return 'almost_full';
}

/**
 * Get all unique instructors
 */
function getAllInstructors(sections) {
  const instructorsMap = {};

  sections.forEach(section => {
    section.instructors.forEach(instructor => {
      const key = instructor.email || instructor.name;
      if (key && !instructorsMap[key]) {
        instructorsMap[key] = {
          name: instructor.name,
          email: instructor.email,
          sectionsTeaching: []
        };
      }
      if (key) {
        instructorsMap[key].sectionsTeaching.push(section.sectionNumber);
      }
    });
  });

  return Object.values(instructorsMap);
}

/**
 * Get meeting patterns
 */
function getMeetingPatterns(sections) {
  const patterns = [];

  sections.forEach(section => {
    section.schedule.forEach(schedule => {
      if (schedule.days && schedule.time) {
        patterns.push({
          days: schedule.days,
          time: schedule.time,
          instructionalMethod: section.instructionalMethod,
          campus: section.campus
        });
      }
    });
  });

  // Remove duplicates
  return patterns.filter((pattern, index, self) =>
    index === self.findIndex(p =>
      p.days === pattern.days &&
      p.time === pattern.time &&
      p.instructionalMethod === pattern.instructionalMethod
    )
  );
}

// Run if called directly
if (require.main === module) {
  const staticDataPath = process.argv[2] || path.join(__dirname, '../data/msuDenverCS.js');
  const allCoursesPath = process.argv[3] || path.join(__dirname, '../data/msu-all-courses-202630.json');
  const outputPath = process.argv[4];

  integrateAllCourses(staticDataPath, allCoursesPath, outputPath)
    .then(() => {
      console.log('\n✓ Integration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n✗ Integration failed');
      process.exit(1);
    });
}

module.exports = { integrateAllCourses };
