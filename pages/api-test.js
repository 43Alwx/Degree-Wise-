import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function APITestPage() {
  const [testUserId] = useState('test-user-123')
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})

  const testEndpoint = async (name, url) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    try {
      const res = await fetch(url)
      const data = await res.json()
      setResults(prev => ({ ...prev, [name]: { success: true, data } }))
    } catch (error) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  const testAll = () => {
    testEndpoint('courses', '/api/courses')
    testEndpoint('progress', `/api/progress/${testUserId}`)
    testEndpoint('timeline', `/api/timeline/${testUserId}`)
    testEndpoint('availableCourses', `/api/available-courses/${testUserId}?semester=spring`)
    testEndpoint('degreeAudit', `/api/degree-audit/${testUserId}`)
  }

  return (
    <>
      <Head>
        <title>API Testing - CodePath</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <h1 className="text-2xl font-display text-primary">CodePath API Tests</h1>
            </Link>
            <Link href="/dashboard" className="text-primary hover:text-accent">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 py-8">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">API Endpoint Testing</h2>
            <p className="text-gray-600 mb-4">
              Testing with User ID: <code className="bg-gray-100 px-2 py-1 rounded">{testUserId}</code>
            </p>
            <button
              onClick={testAll}
              className="btn-primary"
            >
              Test All Endpoints
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Courses API */}
            <TestCard
              title="GET /api/courses"
              description="Fetch all courses with prerequisites"
              onTest={() => testEndpoint('courses', '/api/courses')}
              loading={loading.courses}
              result={results.courses}
            />

            {/* Progress API */}
            <TestCard
              title={`GET /api/progress/${testUserId}`}
              description="Get user's completion progress"
              onTest={() => testEndpoint('progress', `/api/progress/${testUserId}`)}
              loading={loading.progress}
              result={results.progress}
            />

            {/* Timeline API */}
            <TestCard
              title={`GET /api/timeline/${testUserId}`}
              description="Generate graduation timeline scenarios"
              onTest={() => testEndpoint('timeline', `/api/timeline/${testUserId}`)}
              loading={loading.timeline}
              result={results.timeline}
            />

            {/* Available Courses API */}
            <TestCard
              title={`GET /api/available-courses/${testUserId}`}
              description="Get courses available for next semester"
              onTest={() => testEndpoint('availableCourses', `/api/available-courses/${testUserId}?semester=spring`)}
              loading={loading.availableCourses}
              result={results.availableCourses}
            />

            {/* Degree Audit API */}
            <TestCard
              title={`GET /api/degree-audit/${testUserId}`}
              description="Comprehensive degree audit with graduation eligibility"
              onTest={() => testEndpoint('degreeAudit', `/api/degree-audit/${testUserId}`)}
              loading={loading.degreeAudit}
              result={results.degreeAudit}
            />
          </div>
        </main>
      </div>
    </>
  )
}

function TestCard({ title, description, onTest, loading, result }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <button
        onClick={onTest}
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Testing...' : 'Test Endpoint'}
      </button>

      {result && (
        <div className={`p-4 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-bold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.success ? '✓ Success' : '✗ Failed'}
            </span>
          </div>

          {result.success ? (
            <details className="cursor-pointer">
              <summary className="text-sm text-gray-700 font-semibold">View Response</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          ) : (
            <p className="text-sm text-red-700">{result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
