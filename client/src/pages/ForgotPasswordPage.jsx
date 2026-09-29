import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      const token = response.data?.resetToken;
      if (token) {
        navigate(`/reset-password?token=${token}`);
        return;
      }

      setMessage(response.data?.message || 'If an account exists, instructions were sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request.');
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
              <span className="auth-badge">Reset access</span>
            </div>

            <h1>Forgot password</h1>
            <p className="auth-subtitle">Enter your email to receive a password reset link.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Email address</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-success">{message}</p>}

              <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
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
