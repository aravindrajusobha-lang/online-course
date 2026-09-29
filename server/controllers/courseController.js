const Course = require('../models/Course');

const createCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: 'Title, description, price, and category are required' });
    }

    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    const course = await Course.create({
      title,
      description,
      instructor: req.user.id,
      price,
      category,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const totalCourses = await Course.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalCourses / limit));
    const safePage = Math.min(page, totalPages);

    const courses = await Course.find(filter)
      .populate('instructor', 'name email role')
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      data: courses,
      page: safePage,
      limit,
      totalPages,
      totalCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email role');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to update this course' });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (category) course.category = category;

    const updatedCourse = await course.save();
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this course' });
    }

    await course.deleteOne();
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
