import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, termCode } = req.query;

    // Build where clause
    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    // Fetch all courses with their offerings
    const courses = await prisma.course.findMany({
      where,
      include: {
        courseOfferings: {
          where: termCode ? { termCode } : {},
          include: {
            sections: {
              include: {
                instructors: true,
                schedules: true
              }
            }
          }
        },
        prerequisites: {
          include: {
            prerequisite: {
              select: {
                code: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { code: 'asc' }
      ]
    });

    // Format the response
    const formattedCourses = courses.map(course => {
      const offering = course.courseOfferings[0]; // Get first (current) offering

      return {
        id: course.id,
        code: course.code,
        name: course.name,
        credits: course.credits,
        description: course.description,
        category: course.category,
        isSeniorExperience: course.isSeniorExperience,
        isElective: course.isElective,
        scienceGroup: course.scienceGroup,
        prerequisites: course.prerequisites.map(p => p.prerequisite.code),

        // Current offering data
        currentOffering: offering ? {
          termCode: offering.termCode,
          termDescription: offering.termDescription,
          isOffered: offering.isOffered,
          availabilityStatus: offering.availabilityStatus,
          totalSections: offering.totalSections,
          totalSeatsAvailable: offering.totalSeatsAvailable,
          totalCapacity: offering.totalCapacity,

          // Sections with instructors and schedules
          sections: offering.sections.map(section => ({
            crn: section.crn,
            sectionNumber: section.sectionNumber,
            seatsAvailable: section.seatsAvailable,
            maximumEnrollment: section.maximumEnrollment,
            currentEnrollment: section.currentEnrollment,
            instructionalMethod: section.instructionalMethod,
            campus: section.campus,

            instructors: section.instructors.map(inst => ({
              name: inst.name,
              email: inst.email,
              isPrimary: inst.isPrimary
            })),

            schedules: section.schedules.map(sched => ({
              days: sched.days,
              time: sched.time,
              building: sched.building,
              room: sched.room,
              buildingDescription: sched.buildingDescription
            }))
          }))
        } : null
      };
    });

    res.status(200).json({
      success: true,
      count: formattedCourses.length,
      courses: formattedCourses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
      message: error.message
    });
  }
}
