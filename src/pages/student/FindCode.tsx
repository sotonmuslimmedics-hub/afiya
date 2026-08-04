import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getThreadByCode } from '../../lib/api';

export default function FindCode() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleContinue() {
    const code = input.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    setError('');
    try {
      const thread = await getThreadByCode(code);
      if (thread) {
        navigate(`/thread/${code}`);
      } else {
        setError('No concern found for that code.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <div className="app-header">
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
        <h3>Find my thread</h3>
      </div>
      <div className="app-body">
        <div className="field">
          <label>Your concern code</label>
          <input
            className="input"
            placeholder="AFY-0000000000"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 8 }}
          disabled={!input.trim() || checking}
          onClick={handleContinue}
        >
          {checking ? 'Checking…' : 'Continue'}
        </button>
      </div>
    </>
  );
}
