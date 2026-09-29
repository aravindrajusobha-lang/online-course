const express = require('express');
const auth = require('../middleware/auth');
const {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');

const router = express.Router({ mergeParams: true });

router.post('/', auth, createLesson);
router.get('/', getCourseLessons);
router.get('/:id', getLessonById);
router.put('/:id', auth, updateLesson);
router.delete('/:id', auth, deleteLesson);

module.exports = router;
