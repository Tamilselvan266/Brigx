import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { SplashScreen } from './components/SplashScreen';
import { MobileAuth } from './components/MobileAuth';
import { RoleSelection, UserRole } from './components/RoleSelection';
import { HomeOwnerDashboard } from './components/dashboards/HomeOwnerDashboard';
import { ArchitectDashboard } from './components/dashboards/ArchitectDashboard';
import { EngineerDashboard } from './components/dashboards/EngineerDashboard';
import { BuilderDashboard } from './components/dashboards/BuilderDashboard';
import { SupplierDashboard } from './components/dashboards/SupplierDashboard';
import { GovernmentDashboard } from './components/dashboards/GovernmentDashboard';

type AppState = 'splash' | 'auth' | 'role-selection' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [mobile, setMobile] = useState('');

  const handleAuthSuccess = (isNewUser: boolean, mobileNumber: string) => {
    setMobile(mobileNumber);
    if (isNewUser) {
      setAppState('role-selection');
    } else {
      // For returning users, randomly assign a role for demo
      const roles: UserRole[] = ['homeowner', 'architect', 'engineer', 'builder', 'supplier', 'government'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      setUserRole(randomRole);
      setAppState('dashboard');
    }
  };

  const handleRoleSelected = (role: UserRole) => {
    setUserRole(role);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setAppState('auth');
    setUserRole(null);
    setMobile('');
  };

  return (
    <div className="size-full bg-white">
      {appState === 'splash' && (
        <SplashScreen onComplete={() => setAppState('auth')} />
      )}

      {appState === 'auth' && (
        <MobileAuth onAuthSuccess={handleAuthSuccess} />
      )}

      {appState === 'role-selection' && (
        <RoleSelection onRoleSelected={handleRoleSelected} />
      )}

      {appState === 'dashboard' && userRole && (
        <>
          {userRole === 'homeowner' && (
            <HomeOwnerDashboard mobile={mobile} onLogout={handleLogout} />
          )}
          {userRole === 'architect' && (
            <ArchitectDashboard mobile={mobile} onLogout={handleLogout} />
          )}
          {userRole === 'engineer' && (
            <EngineerDashboard mobile={mobile} onLogout={handleLogout} />
          )}
          {userRole === 'builder' && (
            <BuilderDashboard mobile={mobile} onLogout={handleLogout} />
          )}
          {userRole === 'supplier' && (
            <SupplierDashboard mobile={mobile} onLogout={handleLogout} />
          )}
          {userRole === 'government' && (
            <GovernmentDashboard mobile={mobile} onLogout={handleLogout} />
          )}
        </>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
