export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const mockClinics: Clinic[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Paws & Claws Emergency Vet',
    address: '123 Main Street, San Francisco, CA 94105',
    phone: '(415) 555-0123',
    email: 'contact@pawsclawsemergency.com',
    timezone: 'America/Los_Angeles',
    settings: {
      allowVideoConsults: true,
      autoAssignCases: true,
      maxQueueSize: 20,
    },
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];