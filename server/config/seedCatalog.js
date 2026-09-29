const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const catalog = [
  {
    title: 'Full Stack Web Development',
    category: 'Full Stack',
    description: 'Build production-ready web apps from responsive interfaces to secure APIs, databases, and deployment.',
    price: 69,
    lessons: ['Web foundations and semantic HTML', 'Responsive CSS and accessibility', 'Modern JavaScript patterns', 'React interfaces and state', 'REST APIs with Node and Express', 'MongoDB data modeling'],
  },
  {
    title: 'MERN Stack Mastery',
    category: 'MERN Stack',
    description: 'Ship a complete JavaScript product with MongoDB, Express, React, and Node through a guided project path.',
    price: 79,
    lessons: ['MERN architecture overview', 'React routing and reusable components', 'Express API design', 'MongoDB queries and indexes', 'Authentication with JWT', 'Deploying a full MERN application'],
  },
  {
    title: 'Trading Mastery',
    category: 'Trading',
    description: 'Learn technical analysis, risk management, and smart market decision-making for confident trading.',
    price: 49,
    lessons: ['Market foundations', 'Reading price charts', 'Technical analysis essentials', 'Risk management strategies'],
  },
  {
    title: 'Programming Languages',
    category: 'Programming',
    description: 'Build practical coding skills in Python, JavaScript, and C++ with project-based learning.',
    price: 59,
    lessons: ['Programming fundamentals', 'Python projects', 'JavaScript applications', 'C++ problem solving'],
  },
  {
    title: 'Competitive Exam Prep',
    category: 'Competitive Exams',
    description: 'Prepare for competitive exams with reasoning, aptitude, and strategy from expert mentors.',
    price: 39,
    lessons: ['Exam planning and pacing', 'Quantitative aptitude', 'Logical reasoning', 'Practice tests and review'],
  },
  {
    title: 'UI/UX Design',
    category: 'UI/UX Design',
    description: 'Design user-focused interfaces and prototypes with modern Figma workflow and design thinking.',
    price: 44,
    lessons: ['Design thinking foundations', 'User research and personas', 'Interface systems in Figma', 'Prototyping and usability tests'],
  },
  {
    title: 'Photography Foundations',
    category: 'Photography',
    description: 'Learn camera basics and storytelling.',
    price: 49,
    lessons: ['Camera and lens essentials', 'Exposure and focus', 'Composition fundamentals', 'Visual storytelling'],
  },
  {
    title: 'Photography Essentials',
    category: 'Photography',
    description: 'Understand camera settings, framing, lighting, and post-processing to create sharper images.',
    price: 36,
    lessons: ['Manual camera settings', 'Framing and composition', 'Working with natural light', 'Editing a photo series'],
  },
  {
    title: 'Architecture & Design',
    category: 'Architecture',
    description: 'Explore creative concept design, spatial planning, and real-world architectural thinking.',
    price: 52,
    lessons: ['Architectural concept development', 'Space planning', 'Materials and form', 'Presenting a design proposal'],
  },
  {
    title: 'Landscape Design',
    category: 'Landscape Design',
    description: 'Learn to shape outdoor spaces through planning, aesthetics, and sustainable design principles.',
    price: 41,
    lessons: ['Reading a site and its climate', 'Outdoor space planning', 'Planting and materials', 'Sustainable landscape plans'],
  },
  {
    title: 'Life Coaching',
    category: 'Life Coaching',
    description: 'Strengthen mindset, communication, and personal growth with guided coaching strategies.',
    price: 34,
    lessons: ['Setting meaningful goals', 'Building self-awareness', 'Communication and active listening', 'Creating lasting habits'],
  },
  {
    title: 'Study Skills',
    category: 'Study Skills',
    description: 'Optimize memory, concentration, and daily study habits for academic and career success.',
    price: 29,
    lessons: ['Planning focused study sessions', 'Memory and recall techniques', 'Managing distractions', 'Reviewing and retaining knowledge'],
  },
  {
    title: 'Career Growth',
    category: 'Career Growth',
    description: 'Build communication, branding, and career strategy skills that help you move forward faster.',
    price: 46,
    lessons: ['Career direction and strengths', 'Resume and portfolio storytelling', 'Interview communication', 'Building a growth plan'],
  },
  {
    title: 'Productivity',
    category: 'Productivity',
    description: 'Master focus, planning, and execution systems for higher output and better work habits.',
    price: 31,
    lessons: ['Priorities and weekly planning', 'Focus and attention systems', 'Managing projects and tasks', 'Reviewing progress'],
  },
  {
    title: 'AI for Beginners',
    category: 'Programming',
    description: 'Master AI fundamentals with real projects and industry-ready workflows.',
    price: 49,
    lessons: ['AI concepts and terminology', 'Working with AI tools', 'Prompting and evaluation', 'Building a small AI-assisted project'],
  },
];

async function seedCatalog() {
  const password = await bcrypt.hash('catalog-instructor-only', 10);
  const instructor = await User.findOneAndUpdate(
    { email: 'catalog@learnhive.local' },
    { $setOnInsert: { name: 'LearnHive Academy', email: 'catalog@learnhive.local', password, role: 'instructor' } },
    { new: true, upsert: true },
  );

  for (const item of catalog) {
    const course = await Course.findOneAndUpdate(
      { title: item.title },
      { $setOnInsert: { title: item.title, category: item.category, description: item.description, price: item.price, instructor: instructor._id } },
      { new: true, upsert: true },
    );

    const lessonCount = await Lesson.countDocuments({ course: course._id });
    if (lessonCount === 0) {
      await Lesson.insertMany(item.lessons.map((title, index) => ({
        course: course._id,
        title,
        order: index + 1,
        duration: 35 + (index * 5),
        content: `A practical ${title.toLowerCase()} lesson from the ${item.title} learning path.`,
      })));
    }
  }

  console.log('Course catalog ready: Full Stack and MERN Stack');
}

module.exports = seedCatalog;