import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    api.get('/enrollments/admin/report', { signal: controller.signal })
      .then(({ data }) => setEnrollments(data.enrollments || []))
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError') {
          setError(requestError.response?.data?.message || 'Could not load enrollment activity.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const instructors = [...new Map(
    enrollments.map(({ instructor }) => [instructor._id, instructor]),
  ).values()].sort((first, second) => first.name.localeCompare(second.name));

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesInstructor = !selectedInstructor || enrollment.instructor._id === selectedInstructor;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      enrollment.student.name,
      enrollment.student.email,
      enrollment.course.title,
      enrollment.instructor.name,
    ].some((value) => value.toLowerCase().includes(query));

    return matchesInstructor && matchesSearch;
  });

  const groups = Object.values(filteredEnrollments.reduce((result, enrollment) => {
    const instructorId = enrollment.instructor._id;
    if (!result[instructorId]) {
      result[instructorId] = { instructor: enrollment.instructor, enrollments: [] };
    }
    result[instructorId].enrollments.push(enrollment);
    return result;
  }, {})).sort((first, second) => first.instructor.name.localeCompare(second.instructor.name));

  const studentCount = new Set(enrollments.map(({ student }) => student._id)).size;
  const courseCount = new Set(enrollments.map(({ course }) => course._id)).size;

  return (
    <main className="admin-page">
      <header className="admin-heading">
        <div>
          <span className="eyebrow">Platform operations</span>
          <h1>Enrollment activity</h1>
          <p>Track enrolled students and courses by instructor.</p>
        </div>
        <span className="admin-greeting">Welcome, {user?.name || 'Admin'}</span>
      </header>

      <section className="admin-metrics" aria-label="Enrollment totals">
        <div><strong>{enrollments.length}</strong><span>Total enrollments</span></div>
        <div><strong>{studentCount}</strong><span>Students enrolled</span></div>
        <div><strong>{courseCount}</strong><span>Courses with enrollments</span></div>
        <div><strong>{instructors.length}</strong><span>Instructors</span></div>
      </section>

      <section className="admin-report" aria-label="Enrollment records">
        <div className="admin-report-heading">
          <div>
            <h2>By instructor</h2>
            <p>Course prices shown are listed prices, not recorded payments.</p>
          </div>
          <div className="admin-filters">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students or courses"
              aria-label="Search students, courses, or instructors"
            />
            <select
              value={selectedInstructor}
              onChange={(event) => setSelectedInstructor(event.target.value)}
              aria-label="Filter by instructor"
            >
              <option value="">All instructors</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="admin-state">Loading enrollment activity...</p>}
        {!loading && error && <p className="admin-state admin-error" role="alert">{error}</p>}
        {!loading && !error && groups.length === 0 && (
          <p className="admin-state">No enrollments match these filters.</p>
        )}

        {!loading && !error && groups.map(({ instructor, enrollments: instructorEnrollments }) => (
          <section className="instructor-group" key={instructor._id}>
            <header className="instructor-group-heading">
              <div>
                <h3>{instructor.name}</h3>
                <span>{instructor.email}</span>
              </div>
              <strong>{instructorEnrollments.length} {instructorEnrollments.length === 1 ? 'enrollment' : 'enrollments'}</strong>
            </header>
            <div className="enrollment-table-wrap">
              <table className="enrollment-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Listed price</th>
                  </tr>
                </thead>
                <tbody>
                  {instructorEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>
                        <strong>{enrollment.student.name}</strong>
                        <span>{enrollment.student.email}</span>
                      </td>
                      <td>
                        <strong>{enrollment.course.title}</strong>
                        <span>{enrollment.course.category}</span>
                      </td>
                      <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                      <td>${Number(enrollment.course.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
