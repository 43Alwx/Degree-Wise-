import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { coreCourses, mathCourses, ancillaryCourses, commonElectives } from '../data/msuDenverCS'

export default function CoursesPage() {
  const [filter, setFilter] = useState('all')

  const allCourses = [
    ...coreCourses.map(c => ({ ...c, category: 'Core CS' })),
    ...mathCourses.map(c => ({ ...c, category: 'Mathematics' })),
    ...ancillaryCourses.map(c => ({ ...c, category: 'Ancillary' })),
    ...commonElectives.map(c => ({ ...c, category: 'Electives' }))
  ]

  const filteredCourses = filter === 'all'
    ? allCourses
    : allCourses.filter(c => c.category === filter)

  return (
    <>
      <Head>
        <title>All Courses - CodePath</title>
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <h1 className="text-2xl font-display text-primary">CodePath</h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-primary hover:text-accent transition-colors">
                Dashboard
              </Link>
              <Link href="/courses" className="text-accent font-bold">
                All Courses
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 py-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-display text-primary mb-2">
              MSU Denver CS Course Catalog
            </h2>
            <p className="text-primary-light text-lg">
              Complete list of courses for the Computer Science B.S. degree
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All Courses ({allCourses.length})
            </FilterButton>
            <FilterButton
              active={filter === 'Core CS'}
              onClick={() => setFilter('Core CS')}
            >
              Core CS ({coreCourses.length})
            </FilterButton>
            <FilterButton
              active={filter === 'Mathematics'}
              onClick={() => setFilter('Mathematics')}
            >
              Mathematics ({mathCourses.length})
            </FilterButton>
            <FilterButton
              active={filter === 'Electives'}
              onClick={() => setFilter('Electives')}
            >
              Electives ({commonElectives.length})
            </FilterButton>
            <FilterButton
              active={filter === 'Ancillary'}
              onClick={() => setFilter('Ancillary')}
            >
              Ancillary ({ancillaryCourses.length})
            </FilterButton>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.code} course={course} />
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-sans font-semibold transition-all ${
        active
          ? 'bg-accent text-white shadow-lg'
          : 'bg-white text-primary-light hover:bg-gray-100 border-2 border-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function CourseCard({ course }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Core CS':
        return 'bg-blue-100 text-blue-800'
      case 'Mathematics':
        return 'bg-green-100 text-green-800'
      case 'Electives':
        return 'bg-purple-100 text-purple-800'
      case 'Ancillary':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card hover:shadow-xl transition-shadow">
      {/* Category Badge */}
      <div className="mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(course.category)}`}>
          {course.category}
        </span>
      </div>

      {/* Course Code & Credits */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-primary font-sans">{course.code}</h3>
        <span className="text-sm font-semibold text-accent">{course.credits} credits</span>
      </div>

      {/* Course Name */}
      <h4 className="text-lg text-primary mb-3 font-sans">{course.name}</h4>

      {/* Description */}
      <p className="text-primary-light text-sm mb-4">{course.description}</p>

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-primary mb-1">Prerequisites:</p>
          <div className="flex flex-wrap gap-2">
            {course.prerequisites.map((prereq) => (
              <span
                key={prereq}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
              >
                {prereq}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Special Indicators */}
      {course.isSeniorExperience && (
        <div className="mt-3">
          <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded">
            Capstone Course
          </span>
        </div>
      )}
    </div>
  )
}
