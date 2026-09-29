import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCourseVisual } from '../data/courseVisuals';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons?page=1&limit=20`),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      await api.post(`/enrollments/${id}`);
      navigate('/my-enrollments');
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <main className="page-shell page-panel"><div className="panel-card loading-panel">Loading course...</div></main>;
  if (error) return <main className="page-shell page-panel"><div className="panel-card error-panel"><p>{error}</p></div></main>;
  if (!course) return null;

  const coverImage = getCourseVisual(course?.category, course?.image, course?.title);

  return (
    <main className="page-shell">
      <section className="course-detail-hero">
        <div className="detail-visual" style={{ backgroundImage: `linear-gradient(135deg, rgba(139,69,19,0.28), rgba(15,23,42,0.18)), url(${coverImage})` }} />
        <div className="detail-panel panel-card">
          <span className="section-tag">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="detail-description">{course.description}</p>

          <div className="detail-meta-row">
            <div>
              <span>Instructor</span>
              <strong>{course.instructor?.name || 'Unknown'}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>${course.price}</strong>
            </div>
          </div>

          {token ? (
            <button className="primary-btn detail-action" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Enroll now'}
            </button>
          ) : (
            <Link to="/login" className="secondary-btn detail-action">Login to enroll</Link>
          )}
        </div>
      </section>

      <section className="detail-lessons">
        <div className="section-header">
          <span className="section-tag">Course curriculum</span>
          <h2>Lessons in this track</h2>
        </div>

        <div className="lesson-list">
          {lessons.map((lesson, index) => (
            <Link key={lesson._id} to={`/lessons/${lesson._id}`} className="lesson-item">
              <div className="lesson-count">0{index + 1}</div>
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.duration ? `${lesson.duration} min` : 'Lesson preview'}</p>
              </div>
              <span className="lesson-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
