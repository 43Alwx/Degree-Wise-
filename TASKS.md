# CodePath - Task Breakdown for Alex & Gigi

## 🔷 Alex's Tasks (Backend Developer)

### Phase 1: Database & Infrastructure (Week 1)

#### Database Setup
- [ ] Install PostgreSQL locally or set up cloud database (Supabase/Railway)
- [ ] Create `.env` file with `DATABASE_URL`
- [ ] Run `npx prisma generate` to create Prisma client
- [ ] Run `npx prisma migrate dev --name init` to create tables
- [ ] Verify schema in Prisma Studio (`npx prisma studio`)

#### Database Seeding
- [ ] Create `prisma/seed.js` file
- [ ] Parse course data from `data/msuDenverCS.js`
- [ ] Seed all CS courses into database
- [ ] Create prerequisite relationships
- [ ] Create requirement categories (Core, Electives, Math, Gen Ed)
- [ ] Link courses to requirements
- [ ] Run `npx prisma db seed`
- [ ] Verify data in Prisma Studio

### Phase 2: API Development (Week 1-2)

#### GET `/api/courses/index.js`
- [ ] Fetch all courses from database
- [ ] Include prerequisite relationships
- [ ] Add filtering by semester offering (Fall/Spring/Summer)
- [ ] Return courses with nested prerequisite data
- [ ] Add error handling

#### GET `/api/progress/[userId].js`
- [ ] Fetch user's completed courses
- [ ] Calculate total credits completed
- [ ] Calculate credits per requirement category
- [ ] Calculate percentage completion
- [ ] Return remaining courses needed
- [ ] Handle case when user has no courses

#### GET `/api/timeline/[userId].js`
- [ ] Get remaining course count for user
- [ ] Generate 4 scenarios (1, 2, 3, 4 courses per semester)
- [ ] Calculate semesters needed for each scenario
- [ ] Determine graduation dates (considering Fall/Spring cycles)
- [ ] Return timeline data with semester breakdowns

#### GET `/api/available-courses/[userId].js`
- [ ] Accept query parameter: `?semester=fall|spring|summer`
- [ ] Fetch user's completed courses
- [ ] Use `lib/prerequisiteChecker.js` to filter eligible courses
- [ ] Filter by semester offering
- [ ] Return available courses with details

### Phase 3: Business Logic Enhancement (Week 2)

#### `lib/prerequisiteChecker.js` Improvements
- [ ] Handle courses with multiple prerequisites (AND logic)
- [ ] Handle courses with alternative prerequisites (OR logic)
- [ ] Handle co-requisites (must take together)
- [ ] Add unit tests for prerequisite logic

#### `lib/timelineCalculator.js` Improvements
- [ ] Optimize course ordering (take prerequisites first)
- [ ] Respect course offering schedules
- [ ] Distribute courses evenly across semesters
- [ ] Account for summer semester availability
- [ ] Return detailed semester-by-semester plan

#### Additional Utilities
- [ ] Create `lib/gpaCalculator.js`
- [ ] Create `lib/courseValidator.js` for input validation
- [ ] Create `lib/degreeAudit.js` for graduation requirements check

### Phase 4: Testing & Documentation (Week 2)

- [ ] Create test user with sample completed courses
- [ ] Test all API endpoints with Postman/Thunder Client
- [ ] Write API documentation in `API.md`
- [ ] Create example requests/responses
- [ ] Test error cases (invalid userId, missing data, etc.)

---

## 🔶 Gigi's Tasks (Frontend Developer)

### Phase 1: Component Library (Week 1)

#### Create `components/` folder with:

**`components/ProgressCard.js`**
- [ ] Display requirement name
- [ ] Show completed vs total courses
- [ ] Animated progress bar
- [ ] Color-coded by completion percentage

**`components/CourseCard.js`**
- [ ] Display course code and name
- [ ] Show credits and description
- [ ] List prerequisites
- [ ] Indicate semester availability (Fall/Spring/Summer)
- [ ] Add hover effects

**`components/TimelineCard.js`**
- [ ] Show courses per semester
- [ ] Display graduation date
- [ ] Show semesters remaining
- [ ] Make clickable for detailed view

**`components/TranscriptUploader.js`**
- [ ] File upload drag & drop zone
- [ ] Camera access for mobile photo
- [ ] File preview before upload
- [ ] Upload progress indicator

**`components/CourseSelector.js`**
- [ ] Searchable course dropdown
- [ ] Add semester input
- [ ] Add grade input
- [ ] Form validation

**`components/Layout.js`**
- [ ] Header with navigation
- [ ] Footer
- [ ] Responsive sidebar (mobile menu)

**`components/LoadingSpinner.js`**
- [ ] Reusable loading animation

**`components/ErrorMessage.js`**
- [ ] Error display component

### Phase 2: Dashboard Integration (Week 2-3)

#### Progress Tab (`pages/dashboard.js`)
- [ ] Fetch data from `/api/progress/[userId]`
- [ ] Display overall progress with real data
- [ ] Show requirement breakdown
- [ ] List recently completed courses
- [ ] Add loading states

#### Timeline Tab
- [ ] Fetch data from `/api/timeline/[userId]`
- [ ] Display 4 graduation scenarios
- [ ] Make scenarios interactive (click for details)
- [ ] Show semester-by-semester breakdown
- [ ] Add export to PDF button (future)

#### Available Courses Tab
- [ ] Fetch from `/api/available-courses/[userId]`
- [ ] Add semester selector (Fall/Spring/Summer)
- [ ] Display course cards in grid
- [ ] Add filtering and search
- [ ] Show prerequisite info on hover

### Phase 3: Transcript Upload Feature (Week 3)

#### Photo Upload
- [ ] Implement file upload to server
- [ ] Add image preview
- [ ] Prepare for OCR integration (placeholder)
- [ ] Show processing status

#### Manual Entry
- [ ] Build multi-step form
- [ ] Add course autocomplete/search
- [ ] Validate course codes against database
- [ ] Allow adding multiple courses
- [ ] Show added courses in table
- [ ] Submit all to API

#### Course Confirmation
- [ ] Create review page for uploaded courses
- [ ] Allow editing before final submission
- [ ] Match user input to database courses
- [ ] Handle unmatched courses

### Phase 4: UI/UX Polish (Week 3-4)

#### Responsive Design
- [ ] Test on mobile (320px - 428px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Fix layout issues

#### Interactions
- [ ] Add loading skeletons
- [ ] Add success/error toast notifications
- [ ] Add smooth page transitions
- [ ] Add hover states and tooltips

#### Accessibility
- [ ] Add ARIA labels
- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test with screen reader
- [ ] Ensure proper color contrast

---

## 🤝 Shared Tasks

### Week 4: User Authentication
- [ ] Install `next-auth` package
- [ ] Create `/pages/api/auth/[...nextauth].js`
- [ ] Set up email/password provider
- [ ] Create login page (`/pages/login.js`)
- [ ] Create signup page (`/pages/signup.js`)
- [ ] Add session middleware
- [ ] Protect dashboard route
- [ ] Add user profile page

### Week 5: Integration & Testing
- [ ] Connect all frontend forms to APIs
- [ ] Test complete user flows:
  - [ ] New user signup → upload transcript → view progress → see timeline
  - [ ] Returning user → view courses → plan semester
- [ ] Fix integration bugs
- [ ] Optimize performance (caching, lazy loading)
- [ ] Add Google Analytics (optional)

### Week 6: Deployment
- [ ] Push code to GitHub
- [ ] Connect Vercel to repository
- [ ] Set up production database (Supabase/Railway)
- [ ] Add environment variables in Vercel
- [ ] Deploy and test production
- [ ] Set up custom domain (optional)
- [ ] Monitor errors with Sentry (optional)

---

## 📈 Progress Tracking

### Completed ✅
- [x] Project initialization
- [x] Git setup with proper .gitignore
- [x] Database schema design
- [x] Basic routing structure
- [x] Tailwind CSS configuration

### In Progress 🚧
- Database seeding (Alex)
- Component library (Gigi)

### Blocked ⛔
- Authentication (waiting for core features)
- Deployment (waiting for completion)

---

## 🔄 Daily Workflow

### Alex's Daily Tasks:
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b alex/feature-name`
3. Work on backend tasks
4. Test with Prisma Studio and Postman
5. Commit and push: `git push origin alex/feature-name`
6. Create PR for review

### Gigi's Daily Tasks:
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b gigi/feature-name`
3. Work on frontend components
4. Test in browser (dev server: `npm run dev`)
5. Commit and push: `git push origin gigi/feature-name`
6. Create PR for review

### Communication:
- Daily standup: Share progress and blockers
- Code review each other's PRs
- Merge to main after approval
- Keep this task file updated

---

## 🆘 Need Help?

### Alex Resources:
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### Gigi Resources:
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Pages](https://nextjs.org/docs/pages)

### Debugging:
- Check browser console (F12)
- Check terminal for errors
- Use `console.log()` for debugging
- Check Network tab for API calls
