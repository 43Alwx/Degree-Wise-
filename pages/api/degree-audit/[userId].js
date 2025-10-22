import { prisma } from '../../../lib/prisma'
import {
  performDegreeAudit,
  checkGraduationEligibility,
  generateDegreeRecommendations,
  checkSeniorStanding
} from '../../../lib/degreeAudit'
import { calculateGPA } from '../../../lib/gpaCalculator'

export default async function handler(req, res) {
  const { userId } = req.query

  if (req.method === 'GET') {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Get completed courses with course details
      const completedCourses = await prisma.completedCourse.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              prerequisites: {
                include: {
                  prerequisite: true
                }
              }
            }
          }
        }
      })

      // Get all requirements
      const requirements = await prisma.requirement.findMany({
        include: {
          courses: {
            include: {
              course: {
                include: {
                  prerequisites: {
                    include: {
                      prerequisite: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      // Get all available courses
      const allCourses = await prisma.course.findMany({
        include: {
          prerequisites: {
            include: {
              prerequisite: true
            }
          }
        }
      })

      // Calculate GPA
      const gpa = calculateGPA(completedCourses)

      // Calculate total credits
      const totalCredits = completedCourses.reduce(
        (sum, cc) => sum + cc.course.credits,
        0
      )

      // Check senior standing
      const seniorStanding = checkSeniorStanding(completedCourses)

      // Perform degree audit
      const audit = performDegreeAudit(completedCourses, requirements)

      // Check graduation eligibility
      const eligibility = checkGraduationEligibility(
        completedCourses,
        requirements,
        gpa
      )

      // Generate recommendations
      const recommendations = generateDegreeRecommendations(
        completedCourses,
        requirements,
        allCourses
      )

      // Return comprehensive audit
      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        academicStanding: {
          totalCredits,
          gpa: gpa.cumulativeGPA,
          seniorStanding: seniorStanding.isSenior,
          standing: gpa.academicStanding
        },
        audit: {
          requirements: audit,
          overallProgress: {
            creditsCompleted: totalCredits,
            creditsRequired: 120, // Total degree requirement
            percentComplete: Math.round((totalCredits / 120) * 100)
          }
        },
        graduation: {
          eligible: eligibility.eligible,
          missingRequirements: eligibility.missingRequirements,
          creditsNeeded: eligibility.creditsNeeded,
          gpaRequirementMet: eligibility.gpaRequirementMet
        },
        recommendations: recommendations.slice(0, 10), // Top 10 recommendations
        completedCourses: completedCourses.length,
        generatedAt: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error performing degree audit:', error)
      res.status(500).json({
        error: 'Failed to perform degree audit',
        message: error.message
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
