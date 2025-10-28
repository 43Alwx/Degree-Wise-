# CodePath API Documentation

## Base URL
Development: `http://localhost:3002/api`

## Test User
- **User ID**: `test-user-123`
- **Email**: test@student.com
- **Completed Courses**: 5 (CS1030, CS1050, CS1400, CS2050, MTH1410)

---

## Endpoints

### 1. GET /api/courses
**Description**: Fetch all courses with prerequisites

**Response**:
```json
[
  {
    "id": "...",
    "code": "CS1050",
    "name": "Computer Science 1",
    "credits": 4,
    "description": "First course in computer science",
    "offeredFall": true,
    "offeredSpring": true,
    "offeredSummer": false,
    "prerequisites": [
      {
        "prerequisite": {
          "code": "CS1030",
          "name": "Computer Science Principles"
        }
      }
    ]
  }
]
```

---

### 2. GET /api/progress/[userId]
**Description**: Get user's completion progress

**Parameters**:
- `userId` (path) - User ID

**Response**:
```json
{
  "completedCourses": [
    {
      "id": "...",
      "semester": "Fall 2023",
      "grade": "A",
      "course": {
        "code": "CS1030",
        "name": "Computer Science Principles",
        "credits": 4
      }
    }
  ],
  "totalCredits": 20,
  "progress": 16.67,
  "coursesCompleted": 5
}
```

---

### 3. GET /api/timeline/[userId]
**Description**: Generate graduation timeline scenarios

**Parameters**:
- `userId` (path) - User ID

**Response**:
```json
{
  "scenarios": [
    {
      "coursesPerSemester": 4,
      "semestersNeeded": 10,
      "graduationDate": "Spring 2027",
      "graduationYear": 2027,
      "graduationSemester": "Spring"
    },
    {
      "coursesPerSemester": 3,
      "semestersNeeded": 13,
      "graduationDate": "Fall 2027",
      "graduationYear": 2027,
      "graduationSemester": "Fall"
    }
  ],
  "remainingCourses": 37,
  "completedCourses": 5
}
```

---

### 4. GET /api/available-courses/[userId]
**Description**: Get courses available for next semester based on completed prerequisites

**Parameters**:
- `userId` (path) - User ID
- `semester` (query) - Semester to check (fall|spring|summer) - Default: fall

**Example**: `/api/available-courses/test-user-123?semester=spring`

**Response**:
```json
{
  "availableCourses": [
    {
      "id": "...",
      "code": "CS2240",
      "name": "Discrete Structures for Computer Science",
      "credits": 4,
      "description": "Mathematical foundations for computer science",
      "prerequisites": [...]
    }
  ],
  "semester": "spring",
  "count": 12
}
```

---

### 5. POST /api/courses/add-completed
**Description**: Add completed courses for a user

**Request Body**:
```json
{
  "userId": "test-user-123",
  "courses": [
    {
      "code": "CS2240",
      "semester": "Fall 2024",
      "grade": "A"
    },
    {
      "code": "CS2400",
      "semester": "Fall 2024",
      "grade": "B+"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "added": [
    {
      "code": "CS2240",
      "name": "Discrete Structures for Computer Science",
      "semester": "Fall 2024",
      "grade": "A",
      "credits": 4
    }
  ],
  "addedCount": 2,
  "errors": [],
  "errorCount": 0,
  "message": "Successfully added 2 course(s). 0 error(s)."
}
```

**Validation Rules**:
- Course code must exist in catalog
- Valid grade: A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
- Valid semester format: "Fall 2024", "Spring 2025", "Summer 2024"
- No duplicate enrollments

---

### 6. GET /api/degree-audit/[userId]
**Description**: Comprehensive degree audit with graduation eligibility check

**Parameters**:
- `userId` (path) - User ID

**Response**:
```json
{
  "user": {
    "id": "test-user-123",
    "name": "Test Student",
    "email": "test@student.com"
  },
  "academicStanding": {
    "totalCredits": 20,
    "gpa": 3.67,
    "seniorStanding": false,
    "standing": "Good Standing"
  },
  "audit": {
    "requirements": [
      {
        "name": "Required Computer Science Courses",
        "type": "CORE",
        "creditsRequired": 62,
        "creditsCompleted": 12,
        "percentComplete": 19,
        "completed": false,
        "remainingCourses": ["CS2240", "CS2400", "CS3210", ...]
      }
    ],
    "overallProgress": {
      "creditsCompleted": 20,
      "creditsRequired": 120,
      "percentComplete": 17
    }
  },
  "graduation": {
    "eligible": false,
    "missingRequirements": [
      "Required Computer Science Courses",
      "CS Upper Division Electives",
      "Required Mathematics"
    ],
    "creditsNeeded": 100,
    "gpaRequirementMet": true
  },
  "recommendations": [
    {
      "course": "CS2240",
      "reason": "Required for major, prerequisites met",
      "priority": "high"
    }
  ],
  "completedCourses": 5,
  "generatedAt": "2025-10-22T17:10:00.000Z"
}
```

---

## Testing

### Using the Test Page
Navigate to: **http://localhost:3002/api-test**

Click "Test All Endpoints" to test all APIs at once.

### Using curl

**Test GET endpoint**:
```bash
curl http://localhost:3002/api/progress/test-user-123
```

**Test POST endpoint**:
```bash
curl -X POST http://localhost:3002/api/courses/add-completed \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "courses": [
      {
        "code": "CS2240",
        "semester": "Fall 2024",
        "grade": "A"
      }
    ]
  }'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "userId is required"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch data",
  "message": "Database connection error"
}
```

---

## For Gigi (Frontend Integration)

### Example: Fetch Progress
```javascript
const fetchProgress = async (userId) => {
  const response = await fetch(`/api/progress/${userId}`)
  const data = await response.json()
  return data
}
```

### Example: Add Completed Course
```javascript
const addCourses = async (userId, courses) => {
  const response = await fetch('/api/courses/add-completed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, courses })
  })
  const data = await response.json()
  return data
}

// Usage
const result = await addCourses('test-user-123', [
  { code: 'CS2240', semester: 'Fall 2024', grade: 'A' }
])
```

---

## Database

### View Data
Open Prisma Studio: **http://localhost:5555**

### Tables
- User
- Course
- Prerequisite
- CompletedCourse
- Requirement
- RequirementCourse
- Timeline

---

## Next Steps

1. ✅ All core GET endpoints working
2. ✅ POST endpoint for adding courses
3. ✅ Degree audit endpoint
4. ⏳ Upload transcript endpoint (for Gigi's photo upload feature)
5. ⏳ Authentication (NextAuth.js)
6. ⏳ Connect dashboard to APIs

---

## Notes

- All APIs tested with `test-user-123`
- Database seeded with 42 courses
- 34 prerequisite relationships configured
- GPA calculator, prerequisite checker, timeline calculator all integrated
- Course validator ensures data integrity
