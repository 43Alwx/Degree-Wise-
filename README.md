# DegreeWise

Smart graduation planner for Computer Science students at MSU Denver. Plan your path to graduation with intelligent course recommendations and timeline scenarios.

---

## Overview

**DegreeWise** is a web application designed specifically for Computer Science students at Metropolitan State University of Denver (MSU Denver). It helps students track their academic progress, plan their path to graduation, and make informed decisions about course selection.

---

## What It Does

DegreeWise provides six core functionalities:

### 1. Progress Tracking
- Visualizes completed credits vs. total required (120 credits)
- Shows progress across degree requirement categories (Core CS, Electives, Math, General Education)
- Displays recently completed courses

### 2. Transcript Upload
- **Photo Upload**: Take a photo or drag-and-drop an image of your transcript
- **PDF Support**: Upload PDF transcripts directly
- **Manual Entry**: Enter completed courses one at a time
- Uses **Tesseract.js OCR** to extract course information from images

### 3. Smart Course Matching
- Automatically matches extracted courses to MSU Denver's CS curriculum
- Identifies unmatched courses (general education, electives)
- Validates course codes and credits

### 4. Prerequisite Checking
- Determines which courses you're eligible to take
- Blocks courses where prerequisites aren't met
- Shows availability status for each course

### 5. Graduation Timeline
- Generates multiple graduation scenarios:
  - 4 courses/semester: Graduate in ~8 semesters
  - 3 courses/semester: Graduate in ~11 semesters
  - 2 courses/semester: Graduate in ~15 semesters
  - 1 course/semester: Graduate in ~30 semesters

### 6. Course Recommendations
- Suggests courses for next semester based on:
  - Completed prerequisites
  - Semester availability (Fall/Spring/Summer)
  - Degree requirements priority

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 15.5.4 |
| **UI Framework** | React | 19.2.0 |
| **Styling** | Tailwind CSS | 4.1.14 |
| **Backend** | Next.js API Routes | - |
| **Database** | PostgreSQL (Supabase) | - |
| **ORM** | Prisma | 6.17.0 |
| **OCR** | Tesseract.js | 6.0.1 |
| **File Handling** | Formidable | 3.5.4 |
| **HTTP Client** | Axios | 1.13.2 |
| **Web Scraping** | Puppeteer | 24.29.1 |
| **Code Quality** | ESLint + Husky | 9.38.0 / 9.1.7 |
| **Hosting** | Vercel | - |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- PostgreSQL database (Supabase free tier recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/43Alwx/Degree-Wise-.git
cd Degree-Wise-

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials:
# DATABASE_URL="postgresql://postgres:PASSWORD@YOUR_SUPABASE_URL:5432/postgres"
# NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# NEXTAUTH_URL="http://localhost:3002"

# 4. Set up the database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
node prisma/seed.js      # Seed MSU Denver CS courses
node prisma/addTestUser.js  # (Optional) Create test user

# 5. Run the development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## Development Commands

### Running the App

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3002) |
| `npm run build` | Build for production |
| `npm start` | Run production build |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix linting issues |

**Note**: Linting runs automatically before each commit via Husky pre-commit hooks.

### Database Operations

| Command | Description |
|---------|-------------|
| `npx prisma studio` | Visual database browser (localhost:5555) |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma migrate reset` | Reset database (deletes all data) |
| `node prisma/seed.js` | Seed courses data |
| `node prisma/addTestUser.js` | Create test user |

### Security

| Command | Description |
|---------|-------------|
| `npm audit` | Check for vulnerabilities |
| `npm audit fix` | Auto-fix vulnerabilities |

---

## Project Structure

```
DegreeWise/
├── pages/                          # Next.js pages
│   ├── index.js                    # Homepage/landing page
│   ├── dashboard.js                # Main dashboard with tabs
│   ├── courses.js                  # Course catalog
│   ├── api-test.js                 # API testing page
│   ├── _app.js                     # App wrapper
│   └── api/                        # API endpoints
│       ├── courses/
│       │   ├── index.js            # GET all courses
│       │   └── add-completed.js    # POST add completed courses
│       ├── courses.js              # Course operations
│       ├── upload-transcript.js    # POST transcript OCR processing
│       ├── progress/[userId].js    # GET user progress
│       ├── timeline/[userId].js    # GET graduation timeline
│       ├── available-courses/[userId].js  # GET available courses
│       └── degree-audit/[userId].js       # GET full degree audit
│
├── components/                     # React components
│   ├── TranscriptUploader.js       # Drag-drop file upload with OCR
│   ├── ImagePreview.js             # Image preview component
│   └── CourseReviewTable.js        # Course review/editing table
│
├── lib/                            # Business logic & utilities
│   ├── prisma.js                   # Prisma client singleton
│   ├── security.js                 # Security middleware (rate limiting, CORS)
│   ├── ocrProcessor.js             # Tesseract OCR integration
│   ├── courseValidator.js          # Input validation
│   ├── prerequisiteChecker.js      # Prerequisite logic
│   ├── timelineCalculator.js       # Timeline generation
│   ├── gpaCalculator.js            # GPA calculations
│   ├── degreeAudit.js              # Degree audit system
│   ├── recommendationEngine.js     # Course recommendations
│   └── supabase.js                 # Supabase client
│
├── data/                           # Static data
│   ├── msuDenverCS.js              # MSU Denver CS curriculum
│   └── msu-cs-degree-complete.json # Complete degree requirements
│
├── prisma/                         # Database
│   ├── schema.prisma               # Database schema (12 models)
│   ├── seed.js                     # Database seeding
│   ├── addTestUser.js              # Test data creation
│   └── migrations/                 # Database migrations
│
├── scripts/                        # Utility scripts
│   ├── scrape-msu-courses-v2.js    # Course scraper
│   ├── scrape-all-degree-courses.js
│   ├── integrate-all-courses.js
│   ├── import-to-database.js
│   └── check-subjects.js
│
├── styles/
│   └── globals.css                 # Global styles with Tailwind
│
├── .husky/                         # Git hooks
│   └── pre-commit                  # Auto-lint before commits
│
├── Configuration Files
│   ├── package.json
│   ├── eslint.config.mjs
│   ├── postcss.config.js
│   ├── .env.example
│   └── .gitignore
│
└── Documentation
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── SECURITY.md
    ├── QUICK_START.md
    ├── SUPABASE_SETUP.md
    └── TASKS.md
```

---

## Database Schema

The application uses **12 Prisma models**:

| Model | Purpose |
|-------|---------|
| `User` | Student accounts |
| `Course` | MSU Denver course catalog |
| `CourseOffering` | Term-specific course offerings |
| `CourseSection` | Individual sections (001, 002, etc.) |
| `Instructor` | Section instructors |
| `Schedule` | Meeting times and locations |
| `Prerequisite` | Course prerequisite relationships |
| `CompletedCourse` | User's completed courses |
| `Requirement` | Degree requirement categories |
| `RequirementCourse` | Courses that fulfill requirements |
| `Timeline` | User's graduation scenarios |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/courses` | GET | Get all courses |
| `/api/courses/add-completed` | POST | Add completed courses |
| `/api/upload-transcript` | POST | Upload & process transcript |
| `/api/progress/[userId]` | GET | Get user progress |
| `/api/timeline/[userId]` | GET | Get graduation timeline |
| `/api/available-courses/[userId]` | GET | Get available courses |
| `/api/degree-audit/[userId]` | GET | Full degree audit |

**Test User ID**: `test-user-123`

**Visual API Testing**: http://localhost:3002/api-test

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full API reference.

---

## Development Team

### Alex (Backend Developer)

**Completed Work:**
- Database architecture & Prisma schema design
- All 7 API endpoints implementation
- Security middleware (rate limiting, input sanitization, CORS)
- Business logic libraries:
  - GPA Calculator
  - Degree Audit System
  - Prerequisite Checker
  - Timeline Calculator
  - Recommendation Engine
- Database seeding with MSU Denver CS courses
- Course scraping scripts
- Upload transcript API with OCR integration

### Gigi (Frontend Developer)

**Completed Work:**
- TranscriptUploader component with drag-drop functionality
- ImagePreview component
- CourseReviewTable component
- Upload results UI with:
  - Course matching display
  - Progress statistics
  - Recommendations display
- Dashboard integration with APIs

### Shared Responsibilities
- User authentication (NextAuth.js) - In Progress
- Deployment to Vercel - Pending
- Testing & bug fixes - Ongoing

---

## Key Features Implementation

### OCR Transcript Processing
1. User uploads image/PDF via TranscriptUploader component
2. Server receives file via Formidable
3. Tesseract.js extracts text from image
4. ocrProcessor.js parses course patterns (e.g., "CS 1050 Computer Science I A 4.00")
5. Courses matched against database
6. Progress calculated and recommendations generated
7. Results displayed to user

### Course Availability
- Courses scraped from MSU Denver registration system
- Live section data including:
  - Instructor names
  - Meeting times/days
  - Room locations
  - Seat availability

---

## Security Features

- Rate limiting on API endpoints
- Input sanitization
- CORS configuration
- Environment variable protection
- Pre-commit linting hooks

### Environment Variables
- **NEVER commit `.env`** to Git (already in `.gitignore`)
- Use `.env.example` as template
- Share credentials securely (1Password, not Slack/email)

See [SECURITY.md](./SECURITY.md) for full security guide.

---

## Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Connect Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Vercel auto-detects Next.js

3. **Add Environment Variables** in Vercel dashboard:
```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=generate_with_openssl
NEXTAUTH_URL=https://your-domain.vercel.app
```

4. **Deploy!**
   - Vercel deploys automatically on push to `main`
   - Preview deployments for pull requests

---

## Troubleshooting

### Database Issues
```bash
npx prisma migrate reset    # Reset database (WARNING: deletes all data)
npx prisma generate         # Regenerate Prisma client
npx prisma db push          # Check database connection
```

### Linting Blocked Your Commit?
```bash
npm run lint:fix            # Fix linting errors
git commit -m "your message"  # Try commit again
```

### Dev Server Issues
```bash
rm -rf .next                # Clear Next.js cache
rm -rf node_modules && npm install  # Reinstall dependencies
```

---

## License

ISC License - See LICENSE file for details

---

## Acknowledgments

- MSU Denver Computer Science Department
- Course data based on MSU Denver 2023-2024 catalog
- Built with Next.js, React, Prisma, and Tailwind CSS

---

**DegreeWise** - Your Smart Graduation Planner

**Live**: TBD | **Docs**: [API Docs](./API_DOCUMENTATION.md) | **Security**: [Security Guide](./SECURITY.md)

*Built by Alex & Gigi for MSU Denver CS Students*
