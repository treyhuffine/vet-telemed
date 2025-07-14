// Mock user accounts for demo purposes
export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'vet_tech' | 'vet' | 'admin';
  clinicId: string;
  clinicName: string;
  profileImage?: string;
  isActive: boolean;
  permissions?: string[];
}

export const mockUsers: MockUser[] = [
  // Vet Tech Accounts
  {
    id: 'tech-1',
    email: 'sarah.tech@example.com',
    password: 'demo123',
    name: 'Sarah Thompson',
    role: 'vet_tech',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    profileImage: '/images/avatars/sarah.jpg',
    isActive: true,
    permissions: ['patient_intake', 'vitals_entry', 'queue_view', 'file_upload']
  },
  {
    id: 'tech-2',
    email: 'tech@example.com',
    password: 'password123',
    name: 'John Smith',
    role: 'vet_tech',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    isActive: true,
    permissions: ['patient_intake', 'vitals_entry', 'queue_view', 'file_upload']
  },

  // Veterinarian Accounts
  {
    id: 'vet-1',
    email: 'dr.johnson@example.com',
    password: 'demo123',
    name: 'Dr. Emily Johnson',
    role: 'vet',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    profileImage: '/images/avatars/emily.jpg',
    isActive: true,
    permissions: ['consultation', 'prescribe', 'diagnosis', 'case_management', 'queue_manage']
  },
  {
    id: 'vet-2',
    email: 'vet@example.com',
    password: 'password123',
    name: 'Dr. Michael Chen',
    role: 'vet',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    isActive: true,
    permissions: ['consultation', 'prescribe', 'diagnosis', 'case_management', 'queue_manage']
  },
  {
    id: 'vet-3',
    email: 'dr.patel@example.com',
    password: 'demo123',
    name: 'Dr. Priya Patel',
    role: 'vet',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    isActive: true,
    permissions: ['consultation', 'prescribe', 'diagnosis', 'case_management', 'queue_manage']
  },

  // Admin Accounts
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    profileImage: '/images/avatars/admin.jpg',
    isActive: true,
    permissions: ['*'] // Full access
  },
  {
    id: 'admin-2',
    email: 'clinic.manager@example.com',
    password: 'demo123',
    name: 'Jessica Martinez',
    role: 'admin',
    clinicId: 'clinic-1',
    clinicName: 'Emergency Pet Care SF',
    isActive: true,
    permissions: ['*'] // Full access
  }
];

// Quick login presets for easy demo access
export const quickLoginPresets = [
  {
    title: 'Vet Tech',
    subtitle: 'Sarah Thompson',
    email: 'sarah.tech@example.com',
    password: 'demo123',
    description: 'Access patient intake, vitals entry, and queue viewing',
    icon: '👩‍⚕️'
  },
  {
    title: 'Veterinarian',
    subtitle: 'Dr. Emily Johnson',
    email: 'dr.johnson@example.com',
    password: 'demo123',
    description: 'Conduct consultations, write notes, and manage cases',
    icon: '👨‍⚕️'
  },
  {
    title: 'Administrator',
    subtitle: 'Jessica Martinez',
    email: 'clinic.manager@example.com',
    password: 'demo123',
    description: 'Full system access, user management, and analytics',
    icon: '👩‍💼'
  }
];

// Helper function to authenticate mock user
export function authenticateMockUser(email: string, password: string): MockUser | null {
  const user = mockUsers.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password &&
    u.isActive
  );
  return user || null;
}

// Helper function to get user by ID
export function getMockUserById(id: string): MockUser | null {
  return mockUsers.find(u => u.id === id && u.isActive) || null;
}

// Helper function to check if user has permission
export function userHasPermission(user: MockUser, permission: string): boolean {
  if (user.permissions?.includes('*')) return true; // Admin has all permissions
  return user.permissions?.includes(permission) || false;
}