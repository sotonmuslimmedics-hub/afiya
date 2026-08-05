import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setSubmitting(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Incorrect email or password.');
      setSubmitting(false);
      return;
    }
    navigate('/welfare', { replace: true });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div className="app-header" style={{ borderBottom: 'none' }}>
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
      </div>
      <div className="centered-hero" style={{ paddingTop: 8 }}>
        <img src="/logo.png" alt="Muslim Medics Southampton" style={{ width: 100, height: 100, objectFit: 'contain' }} />
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 26 }}>Welfare Team</h2>
          <div className="hero-kicker" style={{ marginTop: 0 }}>Sign in</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 8, textAlign: 'left' }}>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 4 }}
          disabled={!email || !password || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </div>
    </div>
  );
}
