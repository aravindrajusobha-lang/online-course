import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getCourseVisual } from '../data/courseVisuals';

export default function MyEnrollmentsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        const response = await api.get('/enrollments/my-courses');
        setCourses(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEnrollments();
  }, []);

  const totalCourses = courses.length;
  const avgProgress = totalCourses
    ? Math.round(courses.reduce((sum, item) => sum + (item.progressPercent || 0), 0) / totalCourses)
    : 0;
  const completedCourses = courses.filter((item) => (item.progressPercent || 0) >= 100).length;

  if (loading) return <main className="page-shell"><div className="panel-card loading-panel">Loading your enrollments...</div></main>;

  return (
    <main className="page-shell dashboard-shell">
      <section className="dashboard-hero panel-card">
        <div className="dashboard-hero-copy">
          <span className="section-tag">My learning dashboard</span>
          <h2>Your learning journey</h2>
          <p>Track your enrolled programs, completed lessons, and growth across every course you are building.</p>
        </div>

        <div className="dashboard-metrics">
          <div className="metric-pill">
            <span>Total courses</span>
            <strong>{totalCourses}</strong>
          </div>
          <div className="metric-pill">
            <span>Average progress</span>
            <strong>{avgProgress}%</strong>
          </div>
          <div className="metric-pill">
            <span>Completed</span>
            <strong>{completedCourses}</strong>
          </div>
        </div>
      </section>

      {!courses.length ? (
        <div className="panel-card empty-state empty-dashboard-state">
          <h3>No enrollments yet.</h3>
          <p>Start with a course that matches your growth goals.</p>
          <Link to="/courses" className="primary-btn">Browse courses</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {courses.map((item) => (
            <article key={item._id} className="dashboard-card panel-card">
              <div
                className="dashboard-cover"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(41, 28, 15, 0.18), rgba(41, 28, 15, 0.56)), url(${getCourseVisual(item.course?.category, item.course?.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80')})`
                }}
              />

              <div className="dashboard-body">
                <div className="dashboard-meta-row">
                  <span className="dashboard-badge">{item.course?.category || 'Learning Path'}</span>
                  <strong>{item.progressPercent || 0}%</strong>
                </div>

                <h3>{item.course?.title}</h3>
                <p>{item.course?.description}</p>

                <div className="progress-track premium-progress">
                  <span style={{ width: `${item.progressPercent || 0}%` }} />
                </div>

                <div className="dashboard-footer">
                  <span>{item.completedLessons || 0} lessons completed</span>
                  <Link to={`/courses/${item.course?._id}`} className="text-link">Open course</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
