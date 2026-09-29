import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const response = await api.post('/auth/login', form);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="auth-floating-card">
            <span className="mini-label">Welcome back</span>
            <h2>Continue your growth journey.</h2>
            <p>Learn smarter with premium courses in trading, programming, photography, architecture, landscape design, and life coaching.</p>
            <div className="auth-metrics">
              <div>
                <strong>4.9/5</strong>
                <span>Student rating</span>
              </div>
              <div>
                <strong>12K+</strong>
                <span>Active learners</span>
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
              <span className="auth-badge">Student login</span>
            </div>

            <h1>Sign in</h1>
            <p className="auth-subtitle">Access your dashboard and continue learning.</p>

            <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="auth-cta auth-link-row">
              <button type="button" className="link-btn" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
            </p>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <p className="auth-cta">
              New here? <button type="button" className="link-btn" onClick={() => navigate('/register')}>Create account</button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
