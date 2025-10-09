# 🚀 Quick Start Guide - CodePath

## 👤 For Alex (Backend)

### Setup (Day 1)
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/codepath"

# 3. Initialize database
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio  # View database
```

### Your Focus Areas
- **Database** → Prisma, PostgreSQL
- **API Routes** → `/pages/api/`
- **Business Logic** → `/lib/` folder
- **Testing** → Postman/Thunder Client

### Daily Commands
```bash
# Start dev server
npm run dev

# View database
npx prisma studio

# Create migration after schema change
npx prisma migrate dev --name your_change_name

# Seed database
npx prisma db seed
```

---

## 👤 For Gigi (Frontend)

### Setup (Day 1)
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# Go to: http://localhost:3000
```

### Your Focus Areas
- **Components** → Create in `/components/` folder
- **Pages** → Edit `/pages/dashboard.js` and `/pages/index.js`
- **Styling** → Tailwind CSS classes
- **API Integration** → `fetch()` or React hooks

### Daily Commands
```bash
# Start dev server
npm run dev

# Build for production (test)
npm run build
npm start
```

---

## 📁 Project Structure

```
degree-wise/
├── pages/
│   ├── index.js              # ← Homepage
│   ├── dashboard.js          # ← Main dashboard (Gigi)
│   └── api/                  # ← API routes (Alex)
│       ├── courses/
│       ├── progress/
│       ├── timeline/
│       └── available-courses/
│
├── components/               # ← Gigi creates these
│   ├── ProgressCard.js
│   ├── CourseCard.js
│   ├── TimelineCard.js
│   └── ...
│
├── lib/                     # ← Alex works here
│   ├── prisma.js
│   ├── prerequisiteChecker.js
│   ├── timelineCalculator.js
│   └── ...
│
├── prisma/
│   ├── schema.prisma        # ← Database schema (Alex)
│   └── seed.js              # ← Database seeder (Alex)
│
├── data/
│   └── msuDenverCS.js       # ← Course data
│
├── styles/
│   └── globals.css          # ← Global styles (Gigi)
│
├── TASKS.md                 # ← Detailed task list
└── README.md                # ← Project overview
```

---

## 🔄 Git Workflow

### Daily Routine
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create your branch
git checkout -b alex/task-name   # Alex
git checkout -b gigi/task-name   # Gigi

# 3. Make changes...

# 4. Commit changes
git add .
git commit -m "Description of changes"

# 5. Push to GitHub
git push origin your-branch-name

# 6. Create Pull Request on GitHub
# 7. Review each other's code
# 8. Merge to main
```

### Branch Naming
- **Alex:** `alex/feature-name` (e.g., `alex/api-progress`)
- **Gigi:** `gigi/feature-name` (e.g., `gigi/progress-card`)

---

## 🎯 Week 1 Priority Tasks

### Alex's Week 1 Goals
1. ✅ Set up PostgreSQL database
2. ✅ Run Prisma migrations
3. ✅ Create seed script
4. ✅ Seed database with courses
5. ✅ Complete `/api/courses` endpoint
6. ✅ Complete `/api/progress/[userId]` endpoint

### Gigi's Week 1 Goals
1. ✅ Create `components/` folder structure
2. ✅ Build `ProgressCard` component
3. ✅ Build `CourseCard` component
4. ✅ Build `TimelineCard` component
5. ✅ Make dashboard responsive
6. ✅ Add loading states

---

## 🧪 Testing Your Work

### Alex - Test APIs
```bash
# Use Thunder Client (VS Code) or Postman

# Test 1: Get all courses
GET http://localhost:3000/api/courses

# Test 2: Get user progress
GET http://localhost:3000/api/progress/user123

# Test 3: Get timeline
GET http://localhost:3000/api/timeline/user123

# Test 4: Get available courses
GET http://localhost:3000/api/available-courses/user123?semester=fall
```

### Gigi - Test UI
1. Open browser: `http://localhost:3000`
2. Navigate to dashboard
3. Test each tab
4. Test mobile view (browser DevTools → Responsive Mode)
5. Check browser console for errors (F12)

---

## 🐛 Common Issues & Fixes

### Database Connection Error
```bash
# Check if PostgreSQL is running
# Update DATABASE_URL in .env
# Run: npx prisma generate
```

### Port 3000 Already in Use
```bash
# Kill the process
lsof -ti:3000 | xargs kill
# Or use different port:
npm run dev -- -p 3001
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npx prisma generate
```

---

## 📞 Communication Checklist

### Daily Standup (5 min)
- [ ] What did I complete yesterday?
- [ ] What am I working on today?
- [ ] Any blockers or help needed?

### Before Merging to Main
- [ ] Code works locally
- [ ] No console errors
- [ ] Tested all changes
- [ ] Created pull request
- [ ] Code reviewed by teammate
- [ ] Conflicts resolved

---

## 🎨 Design Tokens (Gigi)

### Colors
```css
/* In your components: */
className="bg-primary"      /* #25283B - dark blue */
className="bg-accent"       /* #ff6b35 - orange */
className="bg-background"   /* #CBCBCB - light gray */
className="text-primary"
className="text-accent"
```

### Fonts (Already configured)
- **Display:** Odibee Sans
- **Headings:** Libre Baskerville
- **Body:** Poppins

---

## 📚 Helpful Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

### Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Thunder Client](https://www.thunderclient.com/) - API Testing
- [Vercel](https://vercel.com) - Deployment

---

## ✅ Definition of Done

### A task is complete when:
- [ ] Code works as expected
- [ ] No errors in console
- [ ] Code is committed to your branch
- [ ] Pull request created
- [ ] Reviewed by teammate
- [ ] Merged to main
- [ ] Checked off in TASKS.md

---

**Let's build something amazing! 🚀**
