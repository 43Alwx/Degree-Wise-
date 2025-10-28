import { useState } from 'react'

export default function CourseReviewTable({ courses, onConfirm, onBack }) {
  const [editedCourses, setEditedCourses] = useState(courses)
  const [editingIndex, setEditingIndex] = useState(null)

  const handleEdit = (index, field, value) => {
    const updated = [...editedCourses]
    updated[index] = { ...updated[index], [field]: value }
    setEditedCourses(updated)
  }

  const handleDelete = (index) => {
    const updated = editedCourses.filter((_, i) => i !== index)
    setEditedCourses(updated)
  }

  const handleAddCourse = () => {
    setEditedCourses([
      ...editedCourses,
      {
        code: '',
        name: '',
        semester: '',
        grade: '',
        credits: ''
      }
    ])
    setEditingIndex(editedCourses.length)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(editedCourses)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Review Extracted Courses</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Please review:</strong> Verify that all course information is correct. You can edit or delete any entries.
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {editedCourses.map((course, index) => (
                <tr
                  key={index}
                  className={editingIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) => handleEdit(index, 'code', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="CS1050"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{course.code}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => handleEdit(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Computer Science I"
                      />
                    ) : (
                      <span className="text-gray-900">{course.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={course.semester}
                        onChange={(e) => handleEdit(index, 'semester', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Fall 2023"
                      />
                    ) : (
                      <span className="text-gray-900">{course.semester}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={course.grade}
                        onChange={(e) => handleEdit(index, 'grade', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="A"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{course.grade}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={course.credits}
                        onChange={(e) => handleEdit(index, 'credits', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="4"
                      />
                    ) : (
                      <span className="text-gray-900">{course.credits}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editingIndex === index ? (
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editedCourses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No courses found. Click "Add Course" to add manually.
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>Total Courses: {editedCourses.length}</span>
        <span>
          Total Credits:{' '}
          {editedCourses.reduce((sum, course) => sum + (parseInt(course.credits) || 0), 0)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleAddCourse}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          + Add Course
        </button>
        <button
          onClick={handleConfirm}
          disabled={editedCourses.length === 0}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  )
}
