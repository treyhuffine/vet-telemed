export interface Owner {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockOwners: Owner[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'John',
    lastName: 'Martinez',
    email: 'john.martinez@email.com',
    phone: '(415) 555-0199',
    alternatePhone: '(415) 555-0200',
    address: '456 Oak Street, San Francisco, CA 94102',
    emergencyContactName: 'Maria Martinez',
    emergencyContactPhone: '(415) 555-0201',
    notes: 'Prefers text messages for updates',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.j@email.com',
    phone: '(415) 555-0202',
    address: '789 Pine Avenue, San Francisco, CA 94103',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440022',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'Robert',
    lastName: 'Thompson',
    email: 'robert.thompson@email.com',
    phone: '(415) 555-0203',
    alternatePhone: '(650) 555-0204',
    address: '321 Maple Drive, San Francisco, CA 94104',
    emergencyContactName: 'Susan Thompson',
    emergencyContactPhone: '(650) 555-0205',
    notes: 'Works night shifts, may be hard to reach during day',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];