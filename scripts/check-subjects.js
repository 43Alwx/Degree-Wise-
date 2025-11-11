
const axios = require('axios');

const BASE_URL = 'https://ssb.msudenver.edu/StudentRegistrationSsb';

async function checkSubjects(termCode = '202630') {
  try {
    console.log(`Fetching subjects for term ${termCode}...\n`);

    const response = await axios.get(`${BASE_URL}/ssb/classSearch/get_subject`, {
      params: {
        term: termCode,
        offset: 1,
        max: 500
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const subjects = response.data;
    console.log(`Found ${subjects.length} subjects\n`);

    // Look for CS/Computer Science
    const csSubjects = subjects.filter(s =>
      s.code.includes('CS') ||
      s.description.toLowerCase().includes('computer')
    );

    console.log('Computer Science related subjects:');
    csSubjects.forEach(s => {
      console.log(`  ${s.code}: ${s.description}`);
    });

    console.log('\nAll subjects (first 20):');
    subjects.slice(0, 20).forEach(s => {
      console.log(`  ${s.code}: ${s.description}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

const termCode = process.argv[2] || '202630';
checkSubjects(termCode);
