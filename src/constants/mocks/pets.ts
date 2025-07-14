export type SpeciesType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface Pet {
  id: string;
  ownerId: string;
  clinicId: string;
  name: string;
  species: SpeciesType;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  sex: string;
  isNeutered: boolean;
  microchipId?: string;
  medicalHistory?: string;
  allergies: string[];
  currentMedications: string[];
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPets: Pet[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    ownerId: '550e8400-e29b-41d4-a716-446655440020',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    ageYears: 5,
    ageMonths: 0,
    weightKg: 29.5,
    sex: 'Male',
    isNeutered: true,
    microchipId: '985141405268745',
    medicalHistory: 'Previous ear infections, allergic to chicken',
    allergies: ['Chicken'],
    currentMedications: [],
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    ownerId: '550e8400-e29b-41d4-a716-446655440021',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Mittens',
    species: 'cat',
    breed: 'Persian',
    ageYears: 3,
    ageMonths: 6,
    weightKg: 4.2,
    sex: 'Female',
    isNeutered: true,
    medicalHistory: 'Dental cleaning in 2023, sensitive stomach',
    allergies: [],
    currentMedications: ['Probiotic supplement'],
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    ownerId: '550e8400-e29b-41d4-a716-446655440022',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    ageYears: 7,
    ageMonths: 3,
    weightKg: 35.0,
    sex: 'Male',
    isNeutered: true,
    medicalHistory: 'Hip dysplasia diagnosed at age 5, on joint supplements',
    allergies: [],
    currentMedications: ['Glucosamine', 'Chondroitin'],
    photoUrl: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];