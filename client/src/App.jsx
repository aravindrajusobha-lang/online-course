import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackdrop from './components/AnimatedBackdrop';
import { AuthProvider, useAuth } from './context/AuthContext';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseListPage from './pages/CourseListPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LessonViewPage from './pages/LessonViewPage';
import LoginPage from './pages/LoginPage';
import MyEnrollmentsPage from './pages/MyEnrollmentsPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const courseHighlights = [
  { title: 'Trading Mastery', meta: '14 lessons · stock market and technical analysis', price: '$49', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80' },
  { title: 'Programming Languages', meta: '20 lessons · Python, JavaScript, C++', price: '$59', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80' },
  { title: 'Competitive Exam Prep', meta: '18 lessons · aptitude, reasoning, and strategy', price: '$39', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
  { title: 'UI/UX Design', meta: '12 lessons · Figma, design systems, wireframes', price: '$44', image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80' },
  { title: 'Photography Essentials', meta: '10 lessons · camera technique, lighting, editing', price: '$36', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80' },
  { title: 'Architecture & Design', meta: '16 lessons · drafting, concept design, spatial thinking', price: '$52', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80' },
  { title: 'Landscape Design', meta: '12 lessons · outdoor spaces, planning, aesthetics', price: '$41', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80' },
  { title: 'Life Coaching', meta: '9 lessons · mindset, communication, personal growth', price: '$34', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80' },
];

const categories = ['Trading', 'Programming', 'Competitive Exams', 'UI/UX Design', 'Photography', 'Architecture', 'Landscape Design', 'Life Coaching', 'Study Skills', 'Career Growth', 'Productivity'];

const testimonials = [
  { name: 'Aisha T.', role: 'Product Designer', quote: 'The lessons are clear, practical, and motivating. I landed my first freelance role within months.' },
  { name: 'Daniel M.', role: 'Frontend Developer', quote: 'The platform feels premium and the progress tracking keeps me focused and consistent.' },
  { name: 'Priya S.', role: 'Startup Founder', quote: 'I used the business and product courses to sharpen my strategy and build a better roadmap.' },
];

function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Student-first learning hub</span>
          <h1>Build skills that move you closer to your dream career.</h1>
          <p>
            Learn from expert-led lessons, stay motivated with progress tracking, and discover a
            clear path for students, beginners, and career-focused learners to grow with confidence.
          </p>

          <div className="cta-row">
            <Link to="/register" className="primary-btn">Create account</Link>
            <Link to="/login" className="secondary-btn">Login</Link>
          </div>

          <div className="mini-stats">
            <div>
              <strong>12k+</strong>
              <span>Students</span>
            </div>
            <div>
              <strong>250+</strong>
              <span>Lessons</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card analytics-card">
          <div className="dashboard-header">
            <span className="dot pink" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>

          <div className="visual-bubble bubble-one" />
          <div className="visual-bubble bubble-two" />

          <div className="dashboard-panel">
            <div className="panel-row top-row">
              <div>
                <small>Learning streak</small>
                <strong>18 days</strong>
              </div>
              <span className="trend-badge">+24%</span>
            </div>

            <div className="chart-box">
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
              <span className="bar bar-4" />
              <span className="bar bar-5" />
              <span className="bar bar-6" />
            </div>

            <div className="code-lines">
              <span>{'const goal = "build skills";'}</span>
              <span>{'const plan = ["Learn", "Practice", "Ship"];'}</span>
            </div>

            <div className="course-preview-list">
              <div className="course-mini-item active">
                <div className="mini-pill purple" />
                <div>
                  <strong>UI/UX Design</strong>
                  <small>4 lessons today</small>
                </div>
              </div>

              <div className="course-mini-item">
                <div className="mini-pill blue" />
                <div>
                  <strong>Trading Mastery</strong>
                  <small>2 lessons left</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-showcase">
        <div className="showcase-header">
          <span className="section-tag">How it works</span>
          <h2>Everything you need to learn and grow.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon purple">1</div>
            <h3>Create account</h3>
            <p>Register quickly and build your personal learning profile in minutes.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon blue">2</div>
            <h3>Choose path</h3>
            <p>Explore skill-based courses tailored to your goals and interests.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon gold">3</div>
            <h3>Track progress</h3>
            <p>Stay motivated with clear milestones, scorecards, and dashboard insights.</p>
          </article>
        </div>
      </section>

      <section className="landing-courses">
        <div className="showcase-header two-up">
          <div>
            <span className="section-tag">Featured courses</span>
            <h2>Popular learning paths.</h2>
          </div>
          <Link to="/courses" className="text-link">Browse all</Link>
        </div>

        <div className="course-grid">
          {courseHighlights.slice(0, 4).map((course) => (
            <article key={course.title} className="course-card">
              <div
                className="course-visual"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.10), rgba(15,23,42,0.44)), url(${course.image})` }}
              />
              <div className="course-badge">Popular</div>
              <h3>{course.title}</h3>
              <p>{course.meta}</p>
              <div className="course-meta-row">
                <span>4.8 rating</span>
                <strong>{course.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AppShell() {
  const { user, logout, token } = useAuth();

  return (
    <div className="app-shell">
      <AnimatedBackdrop />
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">CN</div>
          <Link to="/" className="brand-name">CourseNest</Link>
        </div>

        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          {token && <Link to="/my-enrollments">My Enrollments</Link>}
        </nav>

        <div className="auth-actions">
          {token ? (
            <>
              <span className="welcome-text">Hi, {user?.name || 'Learner'}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-btn small">Register</Link>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/lessons/:id" element={<LessonViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/my-enrollments" element={<ProtectedRoute><MyEnrollmentsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
