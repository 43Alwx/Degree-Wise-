import { prisma } from '../../../lib/prisma'
import { getAvailableCourses } from '../../../lib/prerequisiteChecker'

export default async function handler(req, res) {
  const { userId } = req.query
  const { semester = 'fall' } = req.query

  if (req.method === 'GET') {
    try {
      // Get completed courses
      const completedCourses = await prisma.completedCourse.findMany({
        where: { userId },
        include: {
          course: true
        }
      })

      // Get all courses with prerequisites
      const allCourses = await prisma.course.findMany({
        include: {
          prerequisites: {
            include: {
              prerequisite: true
            }
          }
        }
      })

      // Get available courses
      const availableCourses = getAvailableCourses(
        allCourses,
        completedCourses,
        semester
      )

      res.status(200).json({
        availableCourses,
        semester,
        count: availableCourses.length
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch available courses' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
