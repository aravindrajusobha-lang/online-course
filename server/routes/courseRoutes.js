const express = require('express');
const auth = require('../middleware/auth');
const lessonRoutes = require('./lessonRoutes');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const router = express.Router();

router.use('/:courseId/lessons', lessonRoutes);
router.post('/', auth, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

module.exports = router;
