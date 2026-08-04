import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <div className="center-loading">Loading…</div>;
  if (!session) return <Navigate to="/welfare/login" replace />;

  return <>{children}</>;
}
