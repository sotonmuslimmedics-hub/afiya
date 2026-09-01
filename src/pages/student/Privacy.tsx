import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-header">
        <a href="#" className="app-header-back" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ‹
        </a>
        <h3>Privacy notice</h3>
      </div>
      <div className="info-copy">
        <p>
          This describes exactly what Afiya stores when you submit a concern, and what it doesn't.
        </p>

        <p>
          <strong>What we store.</strong> Your chosen category, the message you write, a randomly
          generated code, and timestamps for when it was submitted and last updated. That's it —
          there is no name, email, student ID, or account field anywhere in the submission form.
        </p>

        <p>
          <strong>What we don't store.</strong> We don't ask for or record your identity. The
          Welfare Team only ever sees the category, message, code, and timestamps — never who you
          are, unless you choose to include identifying details in your own message.
        </p>

        <p>
          <strong>Hosting-level logs.</strong> Like any website, our hosting providers (Netlify for
          the site, Supabase for the database) automatically keep short-term technical logs of
          requests — this can include IP address, browser type, and the page or API call requested
          — for security and abuse-prevention purposes. This is standard infrastructure logging,
          separate from and not linked to your concern's content, and outside the app's control. It
          is not something the Welfare Team can see or search by.
        </p>

        <p>
          <strong>Who can access concerns.</strong> Only Welfare Team members with an approved
          account can read submitted concerns and replies. Accounts are created individually by an
          admin — there is no public sign-up for the Welfare Team side.
        </p>

        <p>
          <strong>How long we keep it.</strong> [Society to confirm a retention period — e.g.
          resolved concerns deleted after N months.] Until a retention policy is set, concerns are
          kept indefinitely; the Welfare Team can manually delete a concern on request.
        </p>

        <p>
          <strong>No analytics or tracking.</strong> This site doesn't use Google Analytics,
          advertising trackers, or any third-party analytics script. Fonts are self-hosted rather
          than loaded from a third party, so visiting this site doesn't share your IP address with
          anyone beyond Netlify and Supabase as described above.
        </p>

        <p>
          <strong>Questions or requests.</strong> Contact [Welfare Team / society email] with any
          question about this notice, or to request a concern be deleted.
        </p>
      </div>
    </>
  );
}
