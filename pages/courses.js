import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CoursesPage() {
  const [filter, setFilter] = useState('all')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const response = await fetch('/data/msu-cs-degree-complete.json')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()

        // Transform the data to match expected format
        const transformedCourses = data.courses.map(course => ({
          ...course,
          currentOffering: course.currentOffering ? {
            ...course.currentOffering,
            sections: course.currentOffering.sections?.map(section => ({
              crn: section.crn,
              sectionNumber: section.sectionNumber,
              currentEnrollment: section.enrollment?.current || 0,
              maximumEnrollment: section.enrollment?.maximum || 0,
              seatsAvailable: section.enrollment?.available || 0,
              instructionalMethod: section.instructionalMethod,
              campus: section.campus,
              instructors: section.instructors || [],
              schedules: section.schedule || []
            })) || []
          } : null
        }))

        setCourses(transformedCourses)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const allCourses = courses

  const filteredCourses = filter === 'all'
    ? allCourses
    : allCourses.filter(c => c.category === filter)

  // Calculate category counts
  const categoryCounts = {
    all: allCourses.length,
    'Core CS': allCourses.filter(c => c.category === 'Core CS').length,
    'Mathematics': allCourses.filter(c => c.category === 'Mathematics').length,
    'CS Electives': allCourses.filter(c => c.category === 'CS Electives').length,
    'Ancillary': allCourses.filter(c => c.category === 'Ancillary').length,
    'Science': allCourses.filter(c => c.category === 'Science').length,
  }

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
              Complete list of courses for the Computer Science B.S. degree (Spring 2026)
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All Courses ({categoryCounts.all})
            </FilterButton>
            <FilterButton
              active={filter === 'Core CS'}
              onClick={() => setFilter('Core CS')}
            >
              Core CS ({categoryCounts['Core CS']})
            </FilterButton>
            <FilterButton
              active={filter === 'Mathematics'}
              onClick={() => setFilter('Mathematics')}
            >
              Mathematics ({categoryCounts['Mathematics']})
            </FilterButton>
            <FilterButton
              active={filter === 'CS Electives'}
              onClick={() => setFilter('CS Electives')}
            >
              CS Electives ({categoryCounts['CS Electives']})
            </FilterButton>
            <FilterButton
              active={filter === 'Science'}
              onClick={() => setFilter('Science')}
            >
              Science ({categoryCounts['Science']})
            </FilterButton>
            <FilterButton
              active={filter === 'Ancillary'}
              onClick={() => setFilter('Ancillary')}
            >
              Ancillary ({categoryCounts['Ancillary']})
            </FilterButton>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-primary-light text-lg">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-800 font-semibold">Error loading courses: {error}</p>
            </div>
          )}

          {/* Course Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          )}
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
  const [showSections, setShowSections] = useState(false)

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Core CS':
        return 'bg-blue-100 text-blue-800'
      case 'Mathematics':
        return 'bg-green-100 text-green-800'
      case 'CS Electives':
        return 'bg-purple-100 text-purple-800'
      case 'Science':
        return 'bg-teal-100 text-teal-800'
      case 'Ancillary':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded">Available</span>
      case 'limited':
        return <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Limited</span>
      case 'almost_full':
        return <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-800 rounded">Almost Full</span>
      case 'full':
        return <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded">Full</span>
      case 'not_offered':
        return <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-800 rounded">Not Offered</span>
      default:
        return null
    }
  }

  const offering = course.currentOffering

  return (
    <div className="card hover:shadow-xl transition-shadow">
      {/* Category Badge & Availability */}
      <div className="mb-3 flex justify-between items-center">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(course.category)}`}>
          {course.category}
        </span>
        {offering && getAvailabilityBadge(offering.availabilityStatus)}
      </div>

      {/* Course Code & Credits */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-primary font-sans">{course.code}</h3>
        <span className="text-sm font-semibold text-accent">{course.credits} credits</span>
      </div>

      {/* Course Name */}
      <h4 className="text-lg text-primary mb-3 font-sans">{course.name}</h4>

      {/* Description */}
      {course.description && (
        <p className="text-primary-light text-sm mb-4">{course.description}</p>
      )}

      {/* Offering Summary */}
      {offering && offering.isOffered && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-primary-light">
              {offering.totalSections} {offering.totalSections === 1 ? 'section' : 'sections'}
            </span>
            <span className="text-primary-light">
              {offering.totalSeatsAvailable} / {offering.totalCapacity} seats
            </span>
          </div>

          {offering.sections && offering.sections.length > 0 && (
            <button
              onClick={() => setShowSections(!showSections)}
              className="text-accent text-sm font-semibold hover:underline"
            >
              {showSections ? 'Hide sections ▲' : 'View sections ▼'}
            </button>
          )}
        </div>
      )}

      {/* Sections Details */}
      {showSections && offering && offering.sections && (
        <div className="border-t pt-3 mb-3 space-y-3">
          {offering.sections.map((section) => (
            <div key={section.crn} className="bg-blue-50 rounded p-3 text-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-primary">Section {section.sectionNumber}</span>
                  <span className="text-primary-light ml-2">(CRN: {section.crn})</span>
                </div>
                <span className={`text-xs font-bold ${section.seatsAvailable > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {section.seatsAvailable} / {section.maximumEnrollment} seats
                </span>
              </div>

              {section.instructors && section.instructors.length > 0 && (
                <div className="mb-2">
                  <span className="text-primary-light font-semibold">Instructor: </span>
                  <span className="text-primary">
                    {section.instructors.map(i => i.name).join(', ')}
                  </span>
                </div>
              )}

              {section.schedules && section.schedules.length > 0 && (
                <div>
                  {section.schedules.map((schedule, idx) => (
                    <div key={idx} className="text-primary-light">
                      <span className="font-semibold">{schedule.days}</span> {schedule.time}
                      {schedule.building && schedule.room && (
                        <span> • {schedule.building} {schedule.room}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.instructionalMethod && (
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-white rounded text-primary-light">
                    {section.instructionalMethod}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
