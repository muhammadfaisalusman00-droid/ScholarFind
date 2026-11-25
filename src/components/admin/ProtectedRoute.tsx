import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      if (!supabase) {
        if (!cancelled) setAuthorized(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        if (!cancelled) setAuthorized(false);
        return;
      }

      const { data: adminRecord, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cancelled) setAuthorized(!error && Boolean(adminRecord));
    };

    verifyAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 text-sm">
        Verifying administrator access...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
