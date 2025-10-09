# CodePath 🎓

Smart graduation planner for Computer Science students at MSU Denver. Plan your path to graduation with intelligent course recommendations and timeline scenarios.

## 🎯 What It Does

CodePath helps CS students at MSU Denver:
- **Track Progress**: See what courses you've completed and what's remaining
- **Upload Transcripts**: Photo upload or manual entry of completed courses
- **Check Prerequisites**: Automatically determines which courses you can take
- **Plan Timeline**: Generate graduation scenarios based on 1-4 courses per semester
- **Get Recommendations**: See exactly what courses are available next semester

## ✨ Features

### 📸 Transcript Upload
- Take a photo of your transcript for automatic OCR processing
- Or manually enter your completed courses
- Automatically maps courses to degree requirements

### ✅ Smart Prerequisite Checking
- Intelligent prerequisite validation
- Know exactly which courses you're eligible for
- See what's blocking your remaining courses

### 📅 Graduation Timeline Calculator
- Multiple scenario planning (1-4 courses per semester)
- Real graduation date predictions
- Semester-by-semester course planning

### 🎯 Course Recommendations
- Personalized course suggestions for next semester
- Considers course offering schedules (Fall/Spring/Summer)
- Optimizes your path to graduation

### 📊 Progress Tracking
- Visual progress indicators
- Requirement breakdowns (Core, Electives, Math, Gen Ed)
- Credits completed vs. total needed

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel (free tier)
- **Language**: JavaScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd 360
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/codepath?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Replace `username`, `password`, and `localhost:5432` with your PostgreSQL credentials.

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample CS courses
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/
├── pages/
│   ├── index.js                 # Homepage
│   ├── dashboard.js             # Main dashboard
│   ├── _app.js                  # Next.js app wrapper
│   └── api/                     # API routes
│       ├── courses/
│       ├── progress/
│       ├── timeline/
│       └── available-courses/
├── components/                  # React components (to be added)
├── lib/
│   ├── prisma.js               # Prisma client
│   ├── prerequisiteChecker.js  # Prerequisite logic
│   └── timelineCalculator.js   # Timeline generation
├── data/
│   └── msuDenverCS.js          # MSU Denver CS curriculum
├── prisma/
│   └── schema.prisma           # Database schema
├── styles/
│   └── globals.css             # Global styles & Tailwind
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## 🗄️ Database Schema

### Core Models:
- **User**: Student accounts
- **Course**: All CS courses with metadata
- **Prerequisite**: Course prerequisite relationships
- **CompletedCourse**: Student's completed courses
- **Requirement**: Degree requirements (Core, Electives, etc.)
- **Timeline**: Saved graduation scenarios

## 🎨 Design

The application maintains the visual aesthetic from the original project:
- **Colors**:
  - Primary: `#25283B` (dark blue-gray)
  - Accent: `#ff6b35` (orange)
  - Background: `#CBCBCB` (light gray)
- **Fonts**: Libre Baskerville (serif), Poppins (sans-serif), Odibee Sans (display)
- **Style**: Grid background, glass effects, smooth transitions

## 📚 API Routes

### `GET /api/courses`
Fetch all courses with prerequisites

### `GET /api/progress/[userId]`
Get student's completion progress

### `GET /api/timeline/[userId]`
Generate graduation timeline scenarios

### `GET /api/available-courses/[userId]?semester=fall`
Get courses available for next semester

## 🔧 Development

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL="your_production_postgres_url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 📝 TODO / Roadmap

- [ ] OCR integration for transcript upload (Tesseract.js or Google Vision API)
- [ ] User authentication (NextAuth.js)
- [ ] Email notifications for course availability
- [ ] Mobile app (React Native)
- [ ] Integration with MSU Denver course catalog API
- [ ] GPA tracking and predictions
- [ ] Course difficulty ratings and reviews
- [ ] Schedule conflict detection
- [ ] Export graduation plan to PDF
- [ ] Support for other MSU Denver majors

## 🤝 Contributing

This is a student project for MSU Denver CS students. Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License - See LICENSE file for details

## 👥 Development Team

**Alex & Gigi** - MSU Denver CS Students

### 📋 Task Division

#### 🔷 Alex's Responsibilities

**Backend & Core Logic:**
- [ ] **Database Setup & Seeding**
  - Configure PostgreSQL database
  - Create and run Prisma migrations
  - Seed database with MSU Denver CS course data from `data/msuDenverCS.js`
  - Test all database relationships

- [ ] **API Development**
  - Complete `/api/courses` endpoint - fetch all courses with prerequisites
  - Complete `/api/progress/[userId]` endpoint - calculate student progress
  - Complete `/api/timeline/[userId]` endpoint - generate graduation scenarios
  - Complete `/api/available-courses/[userId]` endpoint - filter eligible courses
  - Add error handling and validation to all API routes

- [ ] **Core Business Logic**
  - Enhance `lib/prerequisiteChecker.js` - add complex prerequisite logic (AND/OR conditions)
  - Enhance `lib/timelineCalculator.js` - improve graduation timeline algorithms
  - Add course offering schedule logic (Fall/Spring/Summer availability)
  - Implement GPA calculation utilities

- [ ] **Testing & Documentation**
  - Test all API endpoints with sample data
  - Write API documentation
  - Create Postman/Thunder Client collection

#### 🔶 Gigi's Responsibilities

**Frontend & User Experience:**
- [ ] **Component Development**
  - Create reusable UI components in `components/` folder:
    - `ProgressCard.js` - Display progress with animated bars
    - `CourseCard.js` - Show course details with prerequisites
    - `TimelineCard.js` - Graduation scenario cards
    - `TranscriptUploader.js` - File upload component
    - `CourseSelector.js` - Manual course selection

- [ ] **Dashboard Features**
  - Connect dashboard tabs to API endpoints
  - Implement real-time progress updates
  - Add course filtering and search
  - Create interactive timeline visualization
  - Build semester-by-semester course planner

- [ ] **Transcript Upload Feature**
  - Implement photo upload functionality
  - Add manual course entry form with validation
  - Create course matching logic (map user input to database courses)
  - Build course confirmation/review UI

- [ ] **UI/UX Polish**
  - Ensure responsive design for mobile/tablet
  - Add loading states and error messages
  - Implement smooth transitions and animations
  - Test accessibility (keyboard navigation, screen readers)

#### 🤝 Shared Tasks

**Together:**
- [ ] **User Authentication**
  - Implement NextAuth.js for login/signup
  - Create user profile pages
  - Add session management

- [ ] **Integration & Testing**
  - Connect frontend components to backend APIs
  - End-to-end testing of user flows
  - Bug fixing and optimization

- [ ] **Deployment**
  - Deploy to Vercel
  - Configure production database
  - Set up environment variables
  - Monitor and fix production issues

### 📊 Current Status

**✅ Completed:**
- Project setup and configuration
- Database schema design
- Basic page structure
- Core utility functions (prerequisite checker, timeline calculator)
- Tailwind CSS styling foundation

**🚧 In Progress:**
- API endpoint implementation
- Dashboard UI components
- Transcript upload feature

**📅 Next Sprint:**
- Complete all API endpoints (Alex)
- Build all UI components (Gigi)
- Integrate frontend with backend
- User authentication setup

### 🗓️ Development Timeline

**Week 1-2:** Backend & API Development (Alex) + Component Library (Gigi)
**Week 3-4:** Frontend Integration + Transcript Upload Feature
**Week 5:** User Authentication & Testing
**Week 6:** Deployment & Polish

## 🙏 Acknowledgments

- MSU Denver Computer Science Department
- All CS students who provided feedback
- Course data based on MSU Denver catalog

---

**CodePath** - Your Smart Graduation Planner 🎓
*Built by Alex & Gigi*
