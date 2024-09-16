import React from 'react';
import { AuthProvider } from 'src/hooks/useAuth'
import { UserProvider } from 'src/hooks/useUser'
import AppNavigation from 'src/navigations/AppNavigation';

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </UserProvider>
  );
}
