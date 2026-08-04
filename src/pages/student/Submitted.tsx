import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function Submitted() {
  const location = useLocation();
  const navigate = useNavigate();
  const code = (location.state as { code?: string } | null)?.code;

  useEffect(() => {
    if (code) sessionStorage.setItem('afiya-active-code', code);
  }, [code]);

  if (!code) return <Navigate to="/" replace />;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code!);
    } catch {
      // clipboard access can be denied; the code is still shown on screen
    }
  }

  return (
    <div className="centered-hero">
      <div className="tag tag-accent">Sent to the Welfare Team</div>
      <p className="text-muted" style={{ fontSize: 16, margin: 0 }}>
        Your concern was submitted anonymously. Save this code — it's the only way to find your thread again.
      </p>
      <div className="concern-code">{code}</div>
      <div className="hero-actions">
        <button className="btn btn-secondary btn-block" onClick={copyCode}>
          Copy code
        </button>
        <button className="btn btn-primary btn-block" onClick={() => navigate(`/thread/${code}`)}>
          View my thread
        </button>
      </div>
    </div>
  );
}
