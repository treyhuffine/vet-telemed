export type UserRole = 'admin' | 'vet' | 'vet_tech';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId: string;
  isAvailable: boolean;
  licenseNumber?: string;
  specializations?: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'anna.tech@pawsclawsemergency.com',
    name: 'Anna Thompson',
    role: 'vet_tech',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    isAvailable: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'dr.lee@pawsclawsemergency.com',
    name: 'Dr. Sarah Lee',
    role: 'vet',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    isAvailable: true,
    licenseNumber: 'CA-VET-12345',
    specializations: ['Emergency Medicine', 'Surgery'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'dr.chen@pawsclawsemergency.com',
    name: 'Dr. Michael Chen',
    role: 'vet',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    isAvailable: false,
    licenseNumber: 'CA-VET-67890',
    specializations: ['Internal Medicine', 'Cardiology'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'morgan.admin@pawsclawsemergency.com',
    name: 'Morgan Williams',
    role: 'admin',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    isAvailable: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];