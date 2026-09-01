import { Link, useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="centered-hero">
      <img src="/logo.png" alt="Muslim Medics Southampton" className="hero-logo" />
      <div>
        <h2 style={{ margin: '0 0 6px', fontSize: 44 }}>Afiya</h2>
        <div className="hero-kicker">Muslim Medics Southampton</div>
      </div>
      <img
        src="/ayah-with-hardship-comes-ease.png"
        alt="For indeed, with hardship comes ease — Qur'an 94:5-6"
        className="hero-ayah"
      />
      <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0 }} className="text-muted">
        Share what's on your mind, privately. No account, no name — just a code only you hold.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary btn-block" onClick={() => navigate('/submit')}>
          Share a concern
        </button>
        <button className="btn btn-secondary btn-block" onClick={() => navigate('/find')}>
          I already have a code
        </button>
      </div>
      <Link to="/how-it-works" style={{ fontSize: 15, marginTop: 4 }}>
        How does Afiya work?
      </Link>
      <div className="text-muted" style={{ display: 'flex', gap: 8, fontSize: 13, marginTop: 22 }}>
        <Link to="/welfare/login" className="text-muted">
          Welfare Team login
        </Link>
        <span>·</span>
        <Link to="/privacy" className="text-muted">
          Privacy notice
        </Link>
      </div>
    </div>
  );
}
