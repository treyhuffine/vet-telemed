'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Activity,
  TrendingUp,
  Clock,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  Shield,
  UserPlus,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { mockUsers, mockClinics } from '@/constants/mocks';
import { useVetAuth } from '@/context/VetAuth';
import { useDemoData } from '@/context/DemoData';
import SystemHealthMonitor from '@/components/SystemHealth/SystemHealthMonitor';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useVetAuth();
  const { cases, resetDemoData } = useDemoData();
  const clinic = mockClinics[0];

  const activeCases = cases.filter(c => c.status !== 'complete' && c.status !== 'cancelled');
  const completedToday = cases.filter(c => 
    c.status === 'complete' && 
    new Date(c.consultationEndTime || '').toDateString() === new Date().toDateString()
  ).length;
  
  const availableVets = mockUsers.filter(u => u.role === 'vet' && u.isAvailable).length;
  const totalVets = mockUsers.filter(u => u.role === 'vet').length;
  const activeStaff = mockUsers.filter(u => u.isAvailable).length;

  // Calculate average wait time (mock data)
  const avgWaitTime = 8; // minutes
  const avgConsultTime = 12; // minutes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinic Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">{clinic.name}</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Cases</p>
                  <p className="text-3xl font-bold">{activeCases.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Wait Time</p>
                  <p className="text-3xl font-bold">{avgWaitTime} min</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold">{completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vets Available</p>
                  <p className="text-3xl font-bold">{availableVets}/{totalVets}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Status */}
          <div className="lg:col-span-2">
            <SystemHealthMonitor />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Staff Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.map((staffMember) => (
                    <div key={staffMember.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${staffMember.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <p className="font-medium">{staffMember.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{staffMember.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={staffMember.isAvailable ? 'default' : 'secondary'}>
                        {staffMember.isAvailable ? 'Available' : 'Offline'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/users')}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/reports')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/analytics')}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Clinic Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/audit-log')}>
                  <Shield className="mr-2 h-4 w-4" />
                  View Audit Log
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/system-health')}>
                  <Activity className="mr-2 h-4 w-4" />
                  System Health
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    const url = '/DEMO_SCRIPT.md';
                    window.open(url, '_blank');
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Demo Script
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all demo data? This will clear all patients, cases, and video calls.')) {
                      resetDemoData();
                      toast.success('Demo data has been reset');
                    }
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Demo Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Avg Consult Time</p>
                  <p className="text-xl font-bold">{avgConsultTime} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cases per Hour</p>
                  <p className="text-xl font-bold">4.5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  <p className="text-xl font-bold">94%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}