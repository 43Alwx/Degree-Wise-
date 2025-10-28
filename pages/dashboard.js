import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import TranscriptUploader from '../components/TranscriptUploader'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('progress')

  return (
    <>
      <Head>
        <title>Dashboard - CodePath</title>
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
            <nav className="flex gap-6 items-center">
              <Link href="/courses" className="text-primary hover:text-accent transition-colors">
                All Courses
              </Link>
              <span className="text-primary font-sans">Welcome, Student!</span>
              <button className="text-primary hover:text-accent transition-colors">Sign Out</button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-light text-white rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-display mb-2">Your Graduation Journey</h2>
            <p className="text-white/90 font-sans text-lg">Track your progress and plan your path to graduation</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <TabButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
              Progress
            </TabButton>
            <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>
              Timeline
            </TabButton>
            <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
              Available Courses
            </TabButton>
            <TabButton active={activeTab === 'transcript'} onClick={() => setActiveTab('transcript')}>
              Upload Transcript
            </TabButton>
          </div>

          {/* Tab Content */}
          {activeTab === 'progress' && <ProgressTab />}
          {activeTab === 'timeline' && <TimelineTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'transcript' && <TranscriptTab />}
        </main>
      </div>
    </>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-sans font-semibold transition-colors ${
        active
          ? 'text-accent border-b-2 border-accent'
          : 'text-primary-light hover:text-primary'
      }`}
    >
      {children}
    </button>
  )
}

function ProgressTab() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Progress */}
      <div className="card">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Overall Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-sans text-primary-light">Completed Credits</span>
            <span className="font-sans font-bold text-primary">0 / 120</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-accent h-4 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
        <p className="text-primary-light">Upload your transcript to see your progress!</p>
      </div>

      {/* Requirements Breakdown */}
      <div className="card">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Requirements</h3>
        <div className="space-y-4">
          <RequirementItem name="Core CS Courses" completed={0} total={10} />
          <RequirementItem name="CS Electives" completed={0} total={4} />
          <RequirementItem name="Math Requirements" completed={0} total={5} />
          <RequirementItem name="General Education" completed={0} total={6} />
        </div>
      </div>

      {/* Recently Completed */}
      <div className="card md:col-span-2">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Recently Completed Courses</h3>
        <p className="text-primary-light">No courses completed yet. Upload your transcript to get started!</p>
      </div>
    </div>
  )
}

function RequirementItem({ name, completed, total }) {
  const percentage = (completed / total) * 100

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-sans text-primary">{name}</span>
        <span className="font-sans text-sm text-primary-light">{completed}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-accent h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function TimelineTab() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Graduation Scenarios</h3>
        <p className="text-primary-light mb-6">
          Explore different timelines based on how many courses you take per semester
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <TimelineScenario courses={4} semesters={8} date="Spring 2027" />
          <TimelineScenario courses={3} semesters={11} date="Fall 2027" />
          <TimelineScenario courses={2} semesters={15} date="Spring 2029" />
          <TimelineScenario courses={1} semesters={30} date="Spring 2032" />
        </div>
      </div>
    </div>
  )
}

function TimelineScenario({ courses, semesters, date }) {
  return (
    <div className="border-2 border-primary/20 rounded-lg p-6 hover:border-accent transition-colors">
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-accent mb-2">{courses}</div>
        <div className="text-sm text-primary-light font-sans">courses per semester</div>
      </div>
      <div className="space-y-2 text-center">
        <div className="text-primary font-sans">
          <span className="font-bold">{semesters}</span> semesters remaining
        </div>
        <div className="text-xl font-bold text-primary">Graduate: {date}</div>
      </div>
    </div>
  )
}

function CoursesTab() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Available Next Semester</h3>
        <p className="text-primary-light mb-6">
          Based on your completed prerequisites, here are courses you can take:
        </p>

        <div className="text-center text-primary-light py-8">
          Upload your transcript to see personalized course recommendations!
        </div>
      </div>
    </div>
  )
}

function TranscriptTab() {
  const [uploadMethod, setUploadMethod] = useState('photo')
  const [extractedCourses, setExtractedCourses] = useState(null)

  const handleUploadComplete = (data) => {
    setExtractedCourses(data.courses || [])
    // TODO: Show CourseReviewTable component
    console.log('Upload complete:', data)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h3 className="text-2xl font-sans font-bold text-primary mb-4">Upload Your Transcript</h3>
        <p className="text-primary-light mb-6">
          Choose how you'd like to add your completed courses
        </p>

        {/* Upload Method Selection */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setUploadMethod('photo')}
            className={`flex-1 py-4 px-6 rounded-lg border-2 font-sans font-semibold transition-all ${
              uploadMethod === 'photo'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-300 text-primary-light hover:border-accent'
            }`}
          >
            📸 Photo Upload
          </button>
          <button
            onClick={() => setUploadMethod('manual')}
            className={`flex-1 py-4 px-6 rounded-lg border-2 font-sans font-semibold transition-all ${
              uploadMethod === 'manual'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-300 text-primary-light hover:border-accent'
            }`}
          >
            ✏️ Manual Entry
          </button>
        </div>

        {/* Upload Content */}
        {uploadMethod === 'photo' ? (
          <TranscriptUploader onUploadComplete={handleUploadComplete} />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-sans font-semibold text-primary mb-2">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g., CS 1050"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block font-sans font-semibold text-primary mb-2">
                Course Name
              </label>
              <input
                type="text"
                placeholder="e.g., Computer Science I"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans font-semibold text-primary mb-2">
                  Semester
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fall 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block font-sans font-semibold text-primary mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  placeholder="e.g., A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <button className="btn-primary w-full">
              Add Course
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
