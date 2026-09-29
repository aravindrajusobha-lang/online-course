const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      completedLessons: [],
    });

    return res.status(201).json(enrollment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const myCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate({
      path: 'course',
      select: 'title description instructor price category',
      populate: { path: 'instructor', select: 'name email role' },
    });

    const data = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = await Lesson.countDocuments({ course: enrollment.course._id });
        const completedLessons = enrollment.completedLessons.length;
        const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        return {
          _id: enrollment._id,
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          completedLessons: enrollment.completedLessons.length,
          progressPercent,
        };
      }),
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAdminEnrollmentReport = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is required' });
  }

  try {
    const enrollments = await Enrollment.find()
      .sort({ enrolledAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'course',
        select: 'title price category instructor',
        populate: { path: 'instructor', select: 'name email' },
      });

    const report = enrollments
      .filter((enrollment) => enrollment.user && enrollment.course && enrollment.course.instructor)
      .map((enrollment) => ({
        _id: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        student: enrollment.user,
        course: enrollment.course,
        instructor: enrollment.course.instructor,
      }));

    return res.status(200).json({ enrollments: report });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.course.toString() !== courseId) {
      return res.status(404).json({ message: 'Lesson not found in this course' });
    }

    if (enrollment.completedLessons.some((id) => id.toString() === lessonId)) {
      return res.status(200).json({
        message: 'Lesson already marked complete',
        completedLessons: enrollment.completedLessons,
      });
    }

    enrollment.completedLessons.push(lessonId);
    await enrollment.save();

    return res.status(200).json({
      message: 'Lesson marked complete',
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedLessonsCount = enrollment.completedLessons.length;
    const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessonsCount / totalLessons) * 100);

    return res.status(200).json({
      totalLessons,
      completedLessons: completedLessonsCount,
      progressPercent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollInCourse,
  myCourses,
  getAdminEnrollmentReport,
  markLessonComplete,
  getCourseProgress,
};
