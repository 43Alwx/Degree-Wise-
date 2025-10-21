import { useState, useEffect } from 'react'

export default function TestPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('courses')

  // Fetch courses on load
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'courses', name: 'Courses API' },
    { id: 'progress', name: 'Progress API' },
    { id: 'timeline', name: 'Timeline API' },
    { id: 'available', name: 'Available Courses API' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 CodePath API Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Test all your backend APIs and business logic
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'courses' && <CoursesTab courses={courses} loading={loading} />}
            {activeTab === 'progress' && <ProgressTab />}
            {activeTab === 'timeline' && <TimelineTab />}
            {activeTab === 'available' && <AvailableCoursesTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Courses Tab Component
function CoursesTab({ courses, loading }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCourses = courses.filter(course =>
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
          <p className="text-gray-600">Total: {courses.length} courses</p>
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.slice(0, 12).map((course) => (
          <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-orange-600">{course.code}</span>
              <span className="text-sm text-gray-500">{course.credits} cr</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{course.description}</p>

            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
                <span className="font-semibold">Prerequisites:</span>{' '}
                {course.prerequisites.map(p => p.prerequisite.code).join(', ')}
              </div>
            )}

            <div className="flex gap-1 mt-2">
              {course.offeredFall && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Fall</span>
              )}
              {course.offeredSpring && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Spring</span>
              )}
              {course.offeredSummer && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Summer</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length > 12 && (
        <div className="text-center mt-4 text-gray-600">
          Showing 12 of {filteredCourses.length} courses
        </div>
      )}
    </div>
  )
}

// Progress Tab Component
function ProgressTab() {
  const [userId, setUserId] = useState('')
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchProgress = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/progress/${userId}`)
      const data = await res.json()
      setProgress(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Progress</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter User ID (or use 'test')"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={fetchProgress}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Fetch Progress
        </button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}

      {progress && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{progress.coursesCompleted}</div>
              <div className="text-sm text-gray-600">Courses Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{progress.totalCredits}</div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{progress.progress}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>

          <div className="mb-2 text-sm font-semibold text-gray-700">Overall Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-orange-500 h-4 rounded-full transition-all"
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2">Completed Courses:</h3>
          <div className="text-sm text-gray-600">
            {progress.completedCourses.length === 0 ? (
              <p className="italic">No courses completed yet</p>
            ) : (
              <ul className="list-disc list-inside">
                {progress.completedCourses.slice(0, 5).map((cc, idx) => (
                  <li key={idx}>{cc.course.code} - {cc.course.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Timeline Tab Component
function TimelineTab() {
  const [userId, setUserId] = useState('')
  const [timeline, setTimeline] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTimeline = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/timeline/${userId}`)
      const data = await res.json()
      setTimeline(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Graduation Timeline</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter User ID (or use 'test')"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={fetchTimeline}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Generate Timeline
        </button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}

      {timeline && (
        <div>
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <strong>Courses Remaining:</strong> {timeline.remainingCourses} |
              <strong> Courses Completed:</strong> {timeline.completedCourses}
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Graduation Scenarios:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeline.scenarios.map((scenario, idx) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="text-lg font-bold text-orange-800 mb-2">
                  {scenario.coursesPerSemester} Course{scenario.coursesPerSemester > 1 ? 's' : ''} per Semester
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {scenario.graduationDate}
                </div>
                <div className="text-sm text-gray-700">
                  {scenario.semestersRemaining} semester{scenario.semestersRemaining !== 1 ? 's' : ''} remaining
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {scenario.totalCreditsRemaining} credits · {scenario.coursesRemaining} courses
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Available Courses Tab Component
function AvailableCoursesTab() {
  const [userId, setUserId] = useState('')
  const [semester, setSemester] = useState('fall')
  const [available, setAvailable] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAvailable = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/available-courses/${userId}?semester=${semester}`)
      const data = await res.json()
      setAvailable(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Courses</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter User ID (or use 'test')"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="fall">Fall</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
        </select>
        <button
          onClick={fetchAvailable}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Find Courses
        </button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}

      {available && (
        <div>
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-800">
              <strong>{available.count}</strong> course{available.count !== 1 ? 's' : ''} available for <strong>{available.semester}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.availableCourses.slice(0, 9).map((course) => (
              <div key={course.id} className="bg-white rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-green-600">{course.code}</span>
                  <span className="text-sm text-gray-500">{course.credits} cr</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                <div className="text-xs text-green-600 font-semibold">✓ Prerequisites Met</div>
              </div>
            ))}
          </div>

          {available.count > 9 && (
            <div className="text-center mt-4 text-gray-600">
              Showing 9 of {available.count} courses
            </div>
          )}
        </div>
      )}
    </div>
  )
}
