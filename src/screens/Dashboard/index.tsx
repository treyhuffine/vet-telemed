'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVetAuth } from '@/context/VetAuth';
import VetTechDashboard from './VetTechDashboard';
import VetDashboard from './VetDashboard';
import AdminDashboard from './AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useVetAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && user?.role === 'admin') {
      // Redirect admin users to admin dashboard
      router.push('/admin');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'vet_tech':
      return <VetTechDashboard />;
    case 'vet':
      return <VetDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <VetTechDashboard />;
  }
}