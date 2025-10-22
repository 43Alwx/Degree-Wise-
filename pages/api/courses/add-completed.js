import { prisma } from '../../../lib/prisma'
import {
  validateCourseCode,
  validateGrade,
  validateSemester,
  validateCompletedCourse,
  validateCourseExists
} from '../../../lib/courseValidator'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, courses } = req.body

      // Validate request
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' })
      }

      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ error: 'courses array is required' })
      }

      // Verify user exists
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const added = []
      const errors = []

      // Process each course
      for (const courseData of courses) {
        try {
          // Validate course data
          const validation = validateCompletedCourse(courseData)
          if (!validation.isValid) {
            errors.push({
              course: courseData.code,
              errors: validation.errors
            })
            continue
          }

          // Find course in database
          const course = await prisma.course.findFirst({
            where: { code: courseData.code }
          })

          if (!course) {
            errors.push({
              course: courseData.code,
              errors: [`Course ${courseData.code} not found in catalog`]
            })
            continue
          }

          // Check if already completed
          const existing = await prisma.completedCourse.findFirst({
            where: {
              userId: userId,
              courseId: course.id
            }
          })

          if (existing) {
            errors.push({
              course: courseData.code,
              errors: ['Course already marked as completed']
            })
            continue
          }

          // Add completed course
          const completedCourse = await prisma.completedCourse.create({
            data: {
              userId: userId,
              courseId: course.id,
              semester: courseData.semester,
              grade: courseData.grade
            },
            include: {
              course: true
            }
          })

          added.push({
            code: course.code,
            name: course.name,
            semester: completedCourse.semester,
            grade: completedCourse.grade,
            credits: course.credits
          })

        } catch (err) {
          errors.push({
            course: courseData.code || 'unknown',
            errors: [err.message]
          })
        }
      }

      // Return results
      res.status(200).json({
        success: true,
        added: added,
        addedCount: added.length,
        errors: errors,
        errorCount: errors.length,
        message: `Successfully added ${added.length} course(s). ${errors.length} error(s).`
      })

    } catch (error) {
      console.error('Error adding completed courses:', error)
      res.status(500).json({
        error: 'Failed to add completed courses',
        message: error.message
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
