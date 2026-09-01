import { Link, useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-header">
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
        <h3>How Afiya works</h3>
      </div>
      <div className="info-copy">
        <p>Afiya was built for students to raise a concern without anyone knowing it was them.</p>
        <p>
          <strong>No sign-up.</strong> You never give a name, email or student ID.
        </p>
        <p>
          <strong>Your code is your only key.</strong> It's how you and only you can return to read a
          reply. If you lose it, the thread can't be recovered.
        </p>
        <p>
          <strong>The Welfare Team never sees who you are.</strong> They see your message, your chosen
          category, and your code — nothing else.
        </p>
        <p>
          <strong>Replies are private.</strong> No other student can see your concern or its replies, and
          your concern is never shared outside the Welfare Team.
        </p>
        <p className="info-disclaimer">
          <strong>DISCLAIMER:</strong>&nbsp;In the event of a safeguarding concern, our team may advise you
          to contact Student Services for further support with your welfare query.
        </p>
        <p>
          <Link to="/privacy">Read the full privacy notice</Link> for exactly what's stored and
          what isn't.
        </p>
      </div>
    </>
  );
}
