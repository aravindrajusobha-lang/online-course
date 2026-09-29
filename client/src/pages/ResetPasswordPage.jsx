import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Reset token is missing. Please request a new password reset link.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', { token, password: form.password });
      setMessage(response.data.message || 'Password reset successfully.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell single-form-shell">
        <section className="auth-form-panel full-width-panel">
          <div className="auth-card reset-card">
            <div className="auth-header">
              <div className="brand-wrap">
                <div className="brand-mark">CN</div>
                <div className="brand-name">CourseNest</div>
              </div>
              <span className="auth-badge">Create new password</span>
            </div>

            <h1>Reset password</h1>
            <p className="auth-subtitle">Choose a new password for your account.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>New password</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
              </label>

              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  className="auth-input"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  required
                />
              </label>

              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-success">{message}</p>}

              <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                {loading ? 'Updating...' : 'Reset password'}
              </button>
            </form>

            <p className="auth-cta">
              <button type="button" className="link-btn" onClick={() => navigate('/login')}>Back to login</button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
