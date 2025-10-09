import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const courses = await prisma.course.findMany({
        include: {
          prerequisites: {
            include: {
              prerequisite: true
            }
          }
        },
        orderBy: {
          code: 'asc'
        }
      })

      res.status(200).json(courses)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
