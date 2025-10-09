import { prisma } from '../../../lib/prisma'
import { calculateProgress } from '../../../lib/timelineCalculator'

export default async function handler(req, res) {
  const { userId } = req.query

  if (req.method === 'GET') {
    try {
      // Get user's completed courses
      const completedCourses = await prisma.completedCourse.findMany({
        where: { userId },
        include: {
          course: true
        }
      })

      // Calculate total credits
      const totalCredits = completedCourses.reduce(
        (sum, cc) => sum + cc.course.credits,
        0
      )

      // Calculate progress
      const progress = calculateProgress(totalCredits)

      res.status(200).json({
        completedCourses,
        totalCredits,
        progress,
        coursesCompleted: completedCourses.length
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
