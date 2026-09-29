const courseVisuals = {
  Trading: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  Programming: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  'Full Stack': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'MERN Stack': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'Competitive Exams': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'UI/UX Design': 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
  Photography: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  Architecture: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
  'Landscape Design': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'Life Coaching': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
  'Study Skills': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  'Career Growth': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  Productivity: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  General: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'Business & Strategy': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'Finance & Investing': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
};

const courseVisualsByTitle = {
  'Full Stack Web Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'MERN Stack Mastery': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'Trading Mastery': courseVisuals.Trading,
  'Programming Languages': courseVisuals.Programming,
  'Competitive Exam Prep': courseVisuals['Competitive Exams'],
  'UI/UX Design': courseVisuals['UI/UX Design'],
  'Photography Foundations': courseVisuals.Photography,
  'Photography Essentials': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
  'Architecture & Design': courseVisuals.Architecture,
  'Landscape Design': courseVisuals['Landscape Design'],
  'Life Coaching': courseVisuals['Life Coaching'],
  'Study Skills': courseVisuals['Study Skills'],
  'Career Growth': courseVisuals['Career Growth'],
  Productivity: courseVisuals.Productivity,
  'AI for Beginners': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
};

export const getCourseVisual = (category, fallback, title) => {
  if (title && courseVisualsByTitle[title]) return courseVisualsByTitle[title];
  if (category && courseVisuals[category]) return courseVisuals[category];
  return fallback || courseVisuals.General;
};

export default courseVisuals;
