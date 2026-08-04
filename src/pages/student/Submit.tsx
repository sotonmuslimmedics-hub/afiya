import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, type CategoryId } from '../../lib/categories';
import { submitConcern } from '../../lib/api';

export default function Submit() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = category !== null && text.trim().length > 0 && !submitting;

  async function handleSubmit() {
    if (!category || !text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const code = await submitConcern(category, text.trim());
      navigate('/submitted', { state: { code }, replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="app-header">
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
        <h3>New concern</h3>
      </div>
      <div className="app-body">
        <div>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 8 }} className="text-muted">
            What's this about?
          </label>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className={`chip${category === c.id ? ' is-selected' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Tell us what's going on</label>
          <textarea
            className="input"
            rows={7}
            placeholder="Write as much or as little as you like. Nothing here is linked to your name."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div className="app-footer">
        <button className="btn btn-primary btn-block" disabled={!canSubmit} onClick={handleSubmit}>
          {submitting ? 'Submitting…' : 'Submit privately'}
        </button>
      </div>
    </>
  );
}
