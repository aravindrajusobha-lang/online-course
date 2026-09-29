import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', form);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-floating-card">
            <span className="mini-label">Join now</span>
            <h2>Build a sharper future with expert-led learning.</h2>
            <p>Unlock path-based courses in photography, architecture, landscape design, life coaching, and future-ready skills.</p>
            <div className="auth-metrics">
              <div>
                <strong>20+</strong>
                <span>Live learning paths</span>
              </div>
              <div>
                <strong>48 hrs</strong>
                <span>Expert learning content</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-wrap">
                <div className="brand-mark">CN</div>
                <div className="brand-name">CourseNest</div>
              </div>
              <span className="auth-badge">Create account</span>
            </div>

            <h1>Start learning</h1>
            <p className="auth-subtitle">Set up your profile and choose your growth path.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Full name</span>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Email address</span>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Account type</span>
                <select className="auth-input auth-select" name="role" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </label>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-cta">
              Already have an account? <button type="button" className="link-btn" onClick={() => navigate('/login')}>Login</button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
