'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope,
  Video,
  Shield,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface Role {
  id: 'vet_tech' | 'vet' | 'admin';
  title: string;
  description: string;
  icon: any;
  color: string;
}

const roles: Role[] = [
  {
    id: 'vet_tech',
    title: 'Veterinary Technician',
    description: 'Handle patient intake, record vitals, and manage the queue',
    icon: Stethoscope,
    color: 'bg-blue-500',
  },
  {
    id: 'vet',
    title: 'Veterinarian',
    description: 'Conduct remote consultations and provide medical care',
    icon: Video,
    color: 'bg-green-500',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage users, settings, and monitor system performance',
    icon: Shield,
    color: 'bg-purple-500',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // In a real app, this would update the user's role in the database
    // For now, we'll just redirect to the appropriate dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Role</h1>
          <p className="text-lg text-gray-600">
            Choose your role to access the appropriate features and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRole === role.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">{role.description}</p>
                  <Button 
                    className="w-full" 
                    variant={selectedRole === role.id ? 'default' : 'outline'}
                  >
                    {selectedRole === role.id ? 'Selected' : 'Select Role'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}