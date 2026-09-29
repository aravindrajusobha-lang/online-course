const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    order: { type: Number, required: true, min: 1 },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Lesson', lessonSchema);
