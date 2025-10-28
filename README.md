# CodePath 🎓

Smart graduation planner for Computer Science students at MSU Denver. Plan your path to graduation with intelligent course recommendations and timeline scenarios.

## 🎯 What It Does

CodePath helps CS students at MSU Denver:
- **Track Progress**: See what courses you've completed and what's remaining
- **Upload Transcripts**: Photo upload or manual entry of completed courses
- **Check Prerequisites**: Automatically determines which courses you can take
- **Plan Timeline**: Generate graduation scenarios based on 1-4 courses per semester
- **Get Recommendations**: See exactly what courses are available next semester
- **Degree Audit**: Full graduation eligibility check with GPA tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.4, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes with security middleware
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Security**: Rate limiting, input sanitization, CORS
- **Code Quality**: ESLint with pre-commit hooks (Husky)
- **Hosting**: Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git
- PostgreSQL database (Supabase recommended, free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/43Alwx/360.git
cd Degree-Wise-
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_SUPABASE_URL:5432/postgres"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3002"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with MSU Denver CS courses
node prisma/seed.js

# (Optional) Create test user
node prisma/addTestUser.js
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

6. **View database (optional)**
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---


### Initial Setup (First Time)

```bash
# Clone the repo
git clone https://github.com/43Alwx/360.git
cd Degree-Wise-

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials
```

### Daily Workflow

**Before starting new work each day:**
```bash

# Get latest changes
git fetch 

git pull

# Resolve conflicts if any, then:
git add .
git commit -m "Merge main into feature branch"
git push
```

#### . **Make Your Changes**

Work on your code, then check what changed:
```bash
# See what files you modified
git status

# See the actual changes
git diff
```

#### . **Commit Your Changes**

Our repo has **automatic linting** - it checks your code before each commit!

```bash
# Stage your changes
git add .

# Commit (linting runs automatically!)
git commit -m "Add course API endpoint with security"

# Push the code to github (main)
git push main 
```



### Common Git Commands

```bash
# See current branch
git branch

# See all branches
git branch -a

# Switch branches
git checkout branch-name

# Delete a branch (after merged)
git branch -d branch-name

# Discard changes to a file
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See commit history
git log --oneline

# See who changed what
git blame filename
```

---

## 🔧 Development Commands

### Running the App

```bash
npm run dev          # Start development server (localhost:3002)
npm run build        # Build for production
npm start            # Run production build
```

### Code Quality

```bash
npm run lint         # Check code for errors
npm run lint:fix     # Auto-fix linting issues
```

**Note**: Linting runs automatically before each commit via Husky!

### Database

```bash
npx prisma studio              # Visual database browser
npx prisma generate            # Regenerate Prisma client
npx prisma db push             # Push schema changes to database
node prisma/seed.js            # Seed courses
node prisma/addTestUser.js     # Create test user
```

### Security

```bash
npm audit                      # Check for vulnerabilities
npm audit fix                  # Auto-fix vulnerabilities
git status                     # Verify .env not staged
```

---

## 📁 Project Structure

```
/
├── pages/
│   ├── index.js                      # Homepage
│   ├── dashboard.js                  # Main dashboard
│   ├── courses.js                    # Course catalog
│   ├── api-test.js                   # API testing page
│   └── api/                          # API routes
│       ├── courses/
│       │   ├── index.js              # GET all courses
│       │   └── add-completed.js      # POST add completed courses
│       ├── progress/[userId].js      # GET user progress
│       ├── timeline/[userId].js      # GET graduation timeline
│       ├── available-courses/[userId].js  # GET available courses
│       └── degree-audit/[userId].js  # GET full degree audit
├── components/                       # React components (Gigi's work)
├── lib/
│   ├── prisma.js                    # Prisma client
│   ├── security.js                  # Security middleware ✅
│   ├── prerequisiteChecker.js       # Prerequisite logic
│   ├── timelineCalculator.js        # Timeline generation
│   ├── gpaCalculator.js             # GPA calculations ✅
│   ├── degreeAudit.js               # Degree audit system ✅
│   └── courseValidator.js           # Input validation ✅
├── data/
│   └── msuDenverCS.js               # MSU Denver CS curriculum
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.js                      # Database seeding ✅
│   ├── addTestUser.js               # Test data ✅
│   └── migrations/                  # Database migrations
├── .husky/                          # Git hooks
│   └── pre-commit                   # Auto-lint before commits ✅
├── .env                             # Environment variables (NEVER COMMIT!)
├── .env.example                     # Template for .env ✅
├── .gitignore                       # Files to ignore in Git ✅
├── eslint.config.mjs                # Linting configuration ✅
├── SECURITY.md                      # Security guide ✅
├── API_DOCUMENTATION.md             # API reference ✅
└── GIGI_PHOTO_UPLOAD_TASKS.md       # Frontend tasks ✅
```

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full API reference.

### Quick API Reference

**Test User**: `test-user-123`

```bash
# Get all courses
curl http://localhost:3002/api/courses

# Get user progress
curl http://localhost:3002/api/progress/test-user-123

# Get graduation timeline
curl http://localhost:3002/api/timeline/test-user-123

# Get available courses
curl "http://localhost:3002/api/available-courses/test-user-123?semester=spring"

# Full degree audit
curl http://localhost:3002/api/degree-audit/test-user-123
```

**Visual API Testing**: http://localhost:3002/api-test

---

## 🔐 Security & Best Practices

### Environment Variables
- **NEVER commit `.env`** to Git (already in `.gitignore`)
- Use `.env.example` as template
- Share credentials securely (1Password, not Slack/email)

### Code Quality
- Linting runs automatically before commits
- Fix errors before pushing
- Run `npm run lint` to check manually

### Git Best Practices
- Always work in feature branches
- Pull latest `main` before starting new work
- Write clear commit messages
- Request code review before merging
- Never force push to `main`

### Security Checklist Before Deployment
- [ ] Environment variables set in Vercel
- [ ] Database URL using production database
- [ ] `NEXTAUTH_SECRET` generated: `openssl rand -base64 32`
- [ ] All API endpoints using `withSecurity()` middleware
- [ ] Run `npm audit` (should be 0 vulnerabilities)

See [SECURITY.md](./SECURITY.md) for full security guide.

---

## 👥 Development Team

**Alex & Gigi** - MSU Denver CS Students

### Task Division

#### 🔷 Alex (Backend)
- ✅ Database setup & seeding
- ✅ All API endpoints (6 total)
- ✅ Security middleware
- ✅ Business logic (GPA, degree audit, prerequisites)
- ⏳ Upload transcript API endpoint

#### 🔶 Gigi (Frontend)
- ⏳ Component library
- ⏳ Dashboard integration with APIs
- ⏳ Transcript upload UI
- ⏳ Course catalog improvements

#### 🤝 Shared
- ⏳ User authentication (NextAuth.js)
- ⏳ Deployment to Vercel
- ⏳ Testing & bug fixes

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Connect Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Vercel auto-detects Next.js

3. **Add Environment Variables**

In Vercel dashboard, add:
```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=generate_new_one_with_openssl
NEXTAUTH_URL=https://your-domain.vercel.app
```

4. **Deploy!**
   - Vercel deploys automatically on push to `main`
   - Preview deployments for pull requests

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate

# Check database connection
npx prisma db push
```

### Git Issues
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# Pull latest without merge conflicts
git fetch origin
git reset --hard origin/main
```

### Linting Blocked Your Commit?
```bash
# Fix linting errors
npm run lint:fix

# Try commit again
git commit -m "your message"

# Skip linting (NOT recommended)
git commit -m "your message" --no-verify
```

### Dev Server Issues
```bash
# Kill any running servers
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Maintenance

### Weekly Tasks
```bash
# Update dependencies
npm outdated          # Check what's outdated
npm update            # Update to latest

# Security check
npm audit             # Should be 0 vulnerabilities
```

### Monthly Tasks
- Review and rotate API keys if needed
- Check database size (Supabase dashboard)
- Review error logs (Vercel dashboard)
- Update dependencies: `npm update`

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- MSU Denver Computer Science Department
- Course data based on MSU Denver 2023-2024 catalog
- Built with Next.js, React, Prisma, and Tailwind CSS

---

**CodePath** - Your Smart Graduation Planner 🎓

**Live**: TBD | **Docs**: [API Docs](./API_DOCUMENTATION.md) | **Security**: [Security Guide](./SECURITY.md)

*Built by Alex & Gigi for MSU Denver CS Students*
