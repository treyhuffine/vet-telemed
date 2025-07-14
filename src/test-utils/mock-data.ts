export const mockUser = {
  vet: {
    id: '1',
    email: 'vet@example.com',
    name: 'Dr. Sarah Johnson',
    role: 'vet' as const,
    clinicId: 'clinic-1',
  },
  vetTech: {
    id: '2',
    email: 'tech@example.com',
    name: 'John Smith',
    role: 'vet_tech' as const,
    clinicId: 'clinic-1',
  },
  admin: {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as const,
    clinicId: 'clinic-1',
  },
};

export const mockPet = {
  id: 'pet-1',
  name: 'Bella',
  species: 'dog' as const,
  breed: 'Golden Retriever',
  age: 3,
  weight: 65,
  ownerId: 'owner-1',
  medicalHistory: ['Vaccinated', 'Spayed'],
  allergies: ['None'],
  medications: [],
  photoUrl: '/images/pets/bella.jpg',
};

export const mockCase = {
  id: 'case-1',
  petId: 'pet-1',
  petName: 'Bella',
  ownerName: 'Emily Johnson',
  triageLevel: 'yellow' as const,
  status: 'waiting' as const,
  chiefComplaint: 'Vomiting and lethargy',
  createdAt: new Date('2024-01-15T10:30:00'),
  waitTime: 15,
  assignedVetId: null,
  vitals: {
    temperature: 101.5,
    heartRate: 120,
    respiratoryRate: 30,
    weight: 65,
    mmColor: 'pink',
    crt: '<2 seconds',
  },
};

export const mockVitals = {
  temperature: 101.5,
  heartRate: 120,
  respiratoryRate: 30,
  weight: 65,
  mmColor: 'pink' as const,
  crt: '<2 seconds',
  painScale: 3,
};

export const mockClinic = {
  id: 'clinic-1',
  name: 'Emergency Pet Care SF',
  address: '123 Main St, San Francisco, CA 94107',
  phone: '(555) 123-4567',
  email: 'contact@emergencypetcare.com',
  isActive: true,
};

export const createMockCase = (overrides?: Partial<typeof mockCase>) => ({
  ...mockCase,
  ...overrides,
  id: `case-${Date.now()}`,
});

export const createMockPet = (overrides?: Partial<typeof mockPet>) => ({
  ...mockPet,
  ...overrides,
  id: `pet-${Date.now()}`,
});