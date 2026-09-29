const express = require('express');
const auth = require('../middleware/auth');
const {
  enrollInCourse,
  myCourses,
  getAdminEnrollmentReport,
  markLessonComplete,
  getCourseProgress,
} = require('../controllers/enrollmentController');

const router = express.Router();

router.get('/my-courses', auth, myCourses);
router.get('/admin/report', auth, getAdminEnrollmentReport);
router.get('/:courseId/progress', auth, getCourseProgress);
router.patch('/:courseId/lessons/:lessonId/complete', auth, markLessonComplete);
router.post('/:courseId', auth, enrollInCourse);

module.exports = router;
