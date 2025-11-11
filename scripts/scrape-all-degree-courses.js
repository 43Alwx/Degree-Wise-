/**
 * Scrape all courses needed for MSU Denver CS degree
 * Includes CS, Math, Science, Communication, and other requirements
 */

const { scrapeCourses } = require('./scrape-msu-courses-v2');
const fs = require('fs').promises;
const path = require('path');

// All subjects needed for CS degree at MSU Denver
const REQUIRED_SUBJECTS = [
  { code: 'CS', name: 'Computer Science' },
  { code: 'MTH', name: 'Mathematics' },
  { code: 'COMM', name: 'Communication' },
  { code: 'JMP', name: 'Journalism (Technical Writing)' },
  { code: 'PHI', name: 'Philosophy' },
  { code: 'BIO', name: 'Biology' },
  { code: 'CHE', name: 'Chemistry' },
  { code: 'GEL', name: 'Geology' },
  { code: 'MTR', name: 'Meteorology' },
  { code: 'PHY', name: 'Physics' },
  { code: 'ENV', name: 'Environmental Science' }
];

/**
 * Scrape all degree-required subjects
 */
async function scrapeAllDegreeCourses(termCode = '202630') {
  console.log('MSU Denver CS Degree - Complete Course Scraper\n');
  console.log(`Term: ${termCode}`);
  console.log(`Subjects to scrape: ${REQUIRED_SUBJECTS.length}\n`);

  const results = {
    term: termCode,
    scrapedAt: new Date().toISOString(),
    subjects: {},
    statistics: {
      totalSubjects: REQUIRED_SUBJECTS.length,
      successfulScrapes: 0,
      failedScrapes: 0,
      totalCourses: 0,
      totalSections: 0
    }
  };

  // Scrape each subject
  for (let i = 0; i < REQUIRED_SUBJECTS.length; i++) {
    const subject = REQUIRED_SUBJECTS[i];
    console.log(`[${i + 1}/${REQUIRED_SUBJECTS.length}] Scraping ${subject.name} (${subject.code})...`);

    try {
      const data = await scrapeCourses(subject.code, termCode, null);

      if (data && data.courses) {
        results.subjects[subject.code] = {
          name: subject.name,
          code: subject.code,
          totalCourses: data.totalCourses,
          totalSections: data.totalSections,
          courses: data.courses
        };

        results.statistics.successfulScrapes++;
        results.statistics.totalCourses += data.totalCourses;
        results.statistics.totalSections += data.totalSections;

        console.log(`  ✓ Found ${data.totalCourses} courses, ${data.totalSections} sections\n`);
      } else {
        console.log(`  - No courses found\n`);
        results.subjects[subject.code] = {
          name: subject.name,
          code: subject.code,
          totalCourses: 0,
          totalSections: 0,
          courses: []
        };
        results.statistics.successfulScrapes++;
      }

      // Small delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
      results.statistics.failedScrapes++;
      results.subjects[subject.code] = {
        name: subject.name,
        code: subject.code,
        error: error.message,
        totalCourses: 0,
        totalSections: 0,
        courses: []
      };
    }
  }

  // Save combined results
  const outputPath = path.join(__dirname, '..', 'data', `msu-all-courses-${termCode}.json`);
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('SCRAPING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Term: ${termCode}`);
  console.log(`Total subjects scraped: ${results.statistics.successfulScrapes}/${results.statistics.totalSubjects}`);
  console.log(`Total unique courses: ${results.statistics.totalCourses}`);
  console.log(`Total sections available: ${results.statistics.totalSections}`);
  console.log(`Failed scrapes: ${results.statistics.failedScrapes}`);
  console.log(`\nData saved to: ${outputPath}`);
  console.log('='.repeat(60));

  // Show breakdown by subject
  console.log('\nBreakdown by Subject:');
  console.log('-'.repeat(60));
  Object.keys(results.subjects).forEach(code => {
    const subject = results.subjects[code];
    const status = subject.error ? '✗ ERROR' : '✓';
    console.log(`${status} ${code.padEnd(6)} ${subject.name.padEnd(35)} ${subject.totalCourses} courses, ${subject.totalSections} sections`);
  });

  return results;
}

// Run if called directly
if (require.main === module) {
  const termCode = process.argv[2] || '202630';

  scrapeAllDegreeCourses(termCode)
    .then(() => {
      console.log('\n✓ All scraping completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n✗ Scraping failed:', error.message);
      process.exit(1);
    });
}

module.exports = { scrapeAllDegreeCourses };
