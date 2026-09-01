import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './pages/welfare/RequireAuth';

const Welcome = lazy(() => import('./pages/student/Welcome'));
const Submit = lazy(() => import('./pages/student/Submit'));
const Submitted = lazy(() => import('./pages/student/Submitted'));
const FindCode = lazy(() => import('./pages/student/FindCode'));
const Thread = lazy(() => import('./pages/student/Thread'));
const HowItWorks = lazy(() => import('./pages/student/HowItWorks'));
const Privacy = lazy(() => import('./pages/student/Privacy'));

const Login = lazy(() => import('./pages/welfare/Login'));
const Inbox = lazy(() => import('./pages/welfare/Inbox'));
const Detail = lazy(() => import('./pages/welfare/Detail'));

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-screen">
        <Suspense fallback={<div className="center-loading">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/submitted" element={<Submitted />} />
            <Route path="/find" element={<FindCode />} />
            <Route path="/thread/:code" element={<Thread />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route path="/welfare/login" element={<Login />} />
            <Route
              path="/welfare"
              element={
                <RequireAuth>
                  <Inbox />
                </RequireAuth>
              }
            />
            <Route
              path="/welfare/c/:id"
              element={
                <RequireAuth>
                  <Detail />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
