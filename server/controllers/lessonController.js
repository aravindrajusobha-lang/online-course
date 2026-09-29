const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const isCourseOwner = (course, userId) => course && course.instructor && course.instructor.toString() === userId;

const sanitizeLesson = async (lesson, userId) => {
  const course = await Course.findById(lesson.course).select('instructor');
  const isOwner = isCourseOwner(course, userId);
  const isEnrolled = !!(userId && (await Enrollment.exists({ user: userId, course: lesson.course })));

  if (isOwner || isEnrolled) {
    return lesson.toObject();
  }

  const lessonObj = lesson.toObject();
  delete lessonObj.content;
  return lessonObj;
};

const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, videoUrl, order, duration } = req.body;

    if (!title || !order) {
      return res.status(400).json({ message: 'Title and order are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      content: content || '',
      videoUrl: videoUrl || '',
      order,
      duration: duration || 0,
    });

    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const totalPages = Math.max(1, Math.ceil(totalLessons / limit));
    const safePage = Math.min(page, totalPages);

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    const visibleLessons = await Promise.all(
      lessons.map((lesson) => sanitizeLesson(lesson, req.user ? req.user.id : null)),
    );

    return res.status(200).json({
      data: visibleLessons,
      page: safePage,
      limit,
      totalPages,
      totalLessons,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course).select('instructor');
    const isOwner = isCourseOwner(course, req.user ? req.user.id : null);
    const isEnrolled = !!(req.user && (await Enrollment.exists({ user: req.user.id, course: lesson.course })));

    if (!isOwner && !isEnrolled) {
      const lessonObj = lesson.toObject();
      delete lessonObj.content;
      return res.status(200).json(lessonObj);
    }

    return res.status(200).json(lesson.toObject());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    const { title, content, videoUrl, order, duration } = req.body;

    if (title) lesson.title = title;
    if (content !== undefined) lesson.content = content;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (order !== undefined) lesson.order = order;
    if (duration !== undefined) lesson.duration = duration;

    const updated = await lesson.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    await lesson.deleteOne();
    return res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
