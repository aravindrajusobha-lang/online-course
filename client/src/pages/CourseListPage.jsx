import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCourseVisual } from '../data/courseVisuals';

const categoryOptions = [
  'All',
  'Trading',
  'Programming',
  'Competitive Exams',
  'UI/UX Design',
  'Photography',
  'Architecture',
  'Landscape Design',
  'Life Coaching',
  'Study Skills',
  'Career Growth',
  'Productivity',
];

export default function CourseListPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState('');
  const [enrollmentError, setEnrollmentError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page: String(page), limit: '6' });
        if (search) query.set('search', search);
        if (category && category !== 'All') query.set('category', category);

        const response = await api.get(`/courses?${query.toString()}`);
        setCourses(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, search, category]);

  const handleEnroll = async (courseId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setEnrollingCourseId(courseId);
    setEnrollmentError(null);
    try {
      await api.post(`/enrollments/${courseId}`);
      navigate('/my-enrollments');
    } catch (error) {
      setEnrollmentError({
        courseId,
        message: error.response?.data?.message || 'Enrollment failed. Please try again.',
      });
    } finally {
      setEnrollingCourseId('');
    }
  };

  return (
    <main className="course-page-shell">
      <section className="course-hero">
        <div>
          <span className="section-tag">Learning paths</span>
          <h1>Pick a course that matches your next breakthrough.</h1>
        </div>
        <div className="course-hero-card">
          <span className="mini-label">Live trending</span>
          <strong>Top picks this week</strong>
          <ul>
            <li>Trading Mastery</li>
            <li>Architecture & Design</li>
            <li>Life Coaching</li>
          </ul>
        </div>
      </section>

      <div className="course-toolbar">
        <div className="search-wrap">
          <input
            type="text"
            value={search}
            onChange={(event) => { setPage(1); setSearch(event.target.value); }}
            placeholder="Search courses, skills, or topics"
          />
        </div>

        <div className="filter-row">
          {categoryOptions.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'filter-pill active' : 'filter-pill'}
              onClick={() => { setPage(1); setCategory(item); }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="course-loading">Loading curated courses...</div>
      ) : (
        <div className="course-grid-premium">
          {courses.map((course) => (
            <article key={course._id} className="course-card-premium">
              <img
                className="course-card-image"
                src={getCourseVisual(course.category, course.image, course.title)}
                alt={`${course.title} course`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getCourseVisual('General');
                }}
              />

              <div className="course-card-top">
                <span className="course-tag">{course.category || 'General'}</span>
                <strong className="course-price">${course.price}</strong>
              </div>

              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="course-meta">
                <span>Instructor: {course.instructor?.name || 'Unknown'}</span>
                <span>4.8 rating</span>
              </div>

              <div className="course-action-row">
                <Link to={`/courses/${course._id}`} className="secondary-btn course-secondary-btn">
                  View details
                </Link>
                <button
                  type="button"
                  className="primary-btn course-primary-btn"
                  onClick={() => handleEnroll(course._id)}
                  disabled={Boolean(enrollingCourseId)}
                >
                  {enrollingCourseId === course._id ? 'Enrolling...' : 'Enroll now'}
                </button>
              </div>
              {enrollmentError?.courseId === course._id && (
                <p className="course-enroll-error" role="alert">{enrollmentError.message}</p>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="pagination-row">
        <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
      </div>
    </main>
  );
}
