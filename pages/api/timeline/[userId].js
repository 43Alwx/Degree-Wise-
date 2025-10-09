import { prisma } from '../../../lib/prisma'
import { generateTimelineScenarios } from '../../../lib/timelineCalculator'

export default async function handler(req, res) {
  const { userId } = req.query

  if (req.method === 'GET') {
    try {
      // Get completed courses
      const completedCourses = await prisma.completedCourse.findMany({
        where: { userId },
        include: { course: true }
      })

      // Get all courses
      const allCourses = await prisma.course.findMany()

      // Find remaining courses (simplified - should check requirements)
      const completedCodes = new Set(completedCourses.map(cc => cc.course.code))
      const remainingCourses = allCourses.filter(
        course => !completedCodes.has(course.code)
      )

      // Generate timeline scenarios
      const currentSemester = new Date().getMonth() < 6 ? 'spring' : 'fall'
      const currentYear = new Date().getFullYear()

      const scenarios = generateTimelineScenarios(
        remainingCourses,
        currentSemester,
        currentYear
      )

      res.status(200).json({
        scenarios,
        remainingCourses: remainingCourses.length,
        completedCourses: completedCourses.length
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate timeline' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
