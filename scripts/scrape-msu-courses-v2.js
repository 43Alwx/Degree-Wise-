/**
 * MSU Denver Course Data Scraper (Version 2)
 * Fixed to properly maintain session cookies
 */

const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'https://ssb.msudenver.edu/StudentRegistrationSsb';

/**
 * Main scraping function with proper session management
 */
async function scrapeCourses(subjectCode = 'CS', termCode = '202630', outputFile = null) {
  console.log('MSU Denver Course Scraper\n');

  // Create axios instance with cookie support
  const jar = new CookieJar();
  const client = wrapper(axios.create({
    jar,
    baseURL: BASE_URL,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    }
  }));

  try {
    // Step 1: Load the term selection page to establish session
    console.log('1. Establishing session...');
    await client.get('/ssb/term/termSelection?mode=search');

    // Step 2: POST the selected term
    console.log('2. Setting term...');
    await client.post('/ssb/term/search?mode=search', `term=${termCode}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Step 3: Navigate to the class search page
    console.log('3. Loading class search page...');
    await client.get('/ssb/classSearch/classSearch');

    // Step 4: Reset the search form
    await client.post('/ssb/classSearch/resetDataForm', '', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Step 5: Search for courses
    console.log(`4. Searching for ${subjectCode} courses...\n`);

    let allCourses = [];
    let pageOffset = 0;
    const pageMaxSize = 50;
    let hasMore = true;
    const uniqueSessionId = `session${Date.now()}`;

    while (hasMore) {
      const response = await client.get('/ssb/searchResults/searchResults', {
        params: {
          txt_subject: subjectCode,
          txt_term: termCode,
          startDatepicker: '',
          endDatepicker: '',
          uniqueSessionId: uniqueSessionId,
          pageOffset: pageOffset,
          pageMaxSize: pageMaxSize,
          sortColumn: 'subjectDescription',
          sortDirection: 'asc'
        },
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = response.data;

      if (data.success && data.data && data.data.length > 0) {
        allCourses = allCourses.concat(data.data);
        console.log(`  Fetched ${data.data.length} courses (total: ${allCourses.length}/${data.totalCount})`);

        if (allCourses.length >= data.totalCount) {
          hasMore = false;
        } else {
          pageOffset += pageMaxSize;
        }
      } else {
        console.log('  No more results');
        hasMore = false;
      }
    }

    if (allCourses.length === 0) {
      console.log('\nNo courses found!');
      return null;
    }

    console.log(`\n✓ Found ${allCourses.length} course sections\n`);

    // Format the data
    console.log('5. Formatting course data...');
    const formattedCourses = allCourses.map(course => formatCourseData(course, termCode));
    const groupedCourses = groupByCourse(formattedCourses);

    console.log(`Processed ${groupedCourses.length} unique courses\n`);

    // Prepare output
    const output = {
      term: {
        code: termCode,
        description: allCourses[0]?.termDesc || `Term ${termCode}`
      },
      subject: subjectCode,
      scrapedAt: new Date().toISOString(),
      totalCourses: groupedCourses.length,
      totalSections: formattedCourses.length,
      courses: groupedCourses
    };

    // Save to file
    if (outputFile) {
      const outputPath = path.join(__dirname, '..', 'data', outputFile);
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
      console.log(`✓ Data saved to ${outputPath}`);
    }

    // Display sample
    console.log('\nSample course:');
    console.log(JSON.stringify(groupedCourses[0], null, 2));

    return output;

  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data).substring(0, 200));
    }
    throw error;
  }
}

/**
 * Format course data
 */
function formatCourseData(course, termCode) {
  return {
    courseNumber: course.courseNumber,
    subject: course.subject,
    subjectCourse: `${course.subject}${course.courseNumber}`,
    courseTitle: course.courseTitle,
    creditHours: course.creditHour || course.creditHourLow || 0,

    instructors: course.faculty ? course.faculty.map(f => ({
      name: f.displayName,
      email: f.emailAddress || null,
      isPrimary: f.primaryIndicator
    })) : [],

    schedule: course.meetingsFaculty ? course.meetingsFaculty.map(meeting => ({
      days: formatDays(meeting),
      time: formatTime(meeting),
      startDate: meeting.meetingTime?.beginTime,
      endDate: meeting.meetingTime?.endTime,
      building: meeting.meetingTime?.building,
      room: meeting.meetingTime?.room,
      meetingType: meeting.meetingTime?.meetingType,
      buildingDescription: meeting.meetingTime?.buildingDescription,
      campus: meeting.meetingTime?.campus
    })) : [],

    enrollment: {
      current: course.enrollment,
      maximum: course.maximumEnrollment,
      available: course.seatsAvailable,
      waitlistAvailable: course.waitAvailable || 0,
      waitlistCapacity: course.waitCapacity || 0
    },

    courseReferenceNumber: course.courseReferenceNumber,
    sectionNumber: course.sequenceNumber,
    campusDescription: course.campusDescription,
    scheduleTypeDescription: course.scheduleTypeDescription,
    instructionalMethod: course.instructionalMethod,
    instructionalMethodDescription: course.instructionalMethodDescription,
    term: termCode
  };
}

/**
 * Format meeting days
 */
function formatDays(meeting) {
  const days = [];
  if (meeting.meetingTime?.monday) days.push('M');
  if (meeting.meetingTime?.tuesday) days.push('T');
  if (meeting.meetingTime?.wednesday) days.push('W');
  if (meeting.meetingTime?.thursday) days.push('R');
  if (meeting.meetingTime?.friday) days.push('F');
  if (meeting.meetingTime?.saturday) days.push('S');
  if (meeting.meetingTime?.sunday) days.push('U');
  return days.join('');
}

/**
 * Format meeting time
 */
function formatTime(meeting) {
  const start = meeting.meetingTime?.beginTime;
  const end = meeting.meetingTime?.endTime;
  if (start && end) {
    return `${start} - ${end}`;
  }
  return 'TBA';
}

/**
 * Group course sections by course number
 */
function groupByCourse(courses) {
  const grouped = {};

  courses.forEach(course => {
    const courseCode = course.subjectCourse;
    if (!grouped[courseCode]) {
      grouped[courseCode] = {
        code: courseCode,
        subject: course.subject,
        number: course.courseNumber,
        title: course.courseTitle,
        credits: course.creditHours,
        sections: []
      };
    }

    grouped[courseCode].sections.push({
      crn: course.courseReferenceNumber,
      sectionNumber: course.sectionNumber,
      instructors: course.instructors,
      schedule: course.schedule,
      enrollment: course.enrollment,
      instructionalMethod: course.instructionalMethodDescription,
      campus: course.campusDescription
    });
  });

  return Object.values(grouped);
}

// Run if called directly
if (require.main === module) {
  const subjectCode = process.argv[2] || 'CS';
  const termCode = process.argv[3] || '202630';
  const outputFile = process.argv[4] || `msu-${subjectCode.toLowerCase()}-live.json`;

  scrapeCourses(subjectCode, termCode, outputFile)
    .then(() => {
      console.log('\n✓ Scraping completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n✗ Scraping failed');
      process.exit(1);
    });
}

module.exports = { scrapeCourses };
