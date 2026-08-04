import { Navigate, Route, Routes } from 'react-router-dom';
import Welcome from './pages/student/Welcome';
import Submit from './pages/student/Submit';
import Submitted from './pages/student/Submitted';
import FindCode from './pages/student/FindCode';
import Thread from './pages/student/Thread';
import HowItWorks from './pages/student/HowItWorks';
import Login from './pages/welfare/Login';
import Inbox from './pages/welfare/Inbox';
import Detail from './pages/welfare/Detail';
import RequireAuth from './pages/welfare/RequireAuth';

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/find" element={<FindCode />} />
          <Route path="/thread/:code" element={<Thread />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

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
      </div>
    </div>
  );
}
