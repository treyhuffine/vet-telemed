export type CaseStatus = 'waiting' | 'ready' | 'in_consult' | 'complete' | 'cancelled';
export type TriageLevel = 'green' | 'yellow' | 'red';

export interface Case {
  id: string;
  clinicId: string;
  petId: string;
  assignedVetId?: string;
  assignedTechId?: string;
  status: CaseStatus;
  triageLevel: TriageLevel;
  presentingComplaint: string;
  chiefConcern?: string;
  queuePosition?: number;
  checkInTime: string;
  consultationStartTime?: string;
  consultationEndTime?: string;
  videoRoomUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockCases: Case[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    petId: '550e8400-e29b-41d4-a716-446655440010',
    assignedTechId: '550e8400-e29b-41d4-a716-446655440002',
    status: 'waiting',
    triageLevel: 'red',
    presentingComplaint: 'Difficulty breathing, seems to be in distress',
    chiefConcern: 'Respiratory distress',
    queuePosition: 1,
    checkInTime: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440031',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    petId: '550e8400-e29b-41d4-a716-446655440011',
    assignedTechId: '550e8400-e29b-41d4-a716-446655440002',
    assignedVetId: '550e8400-e29b-41d4-a716-446655440003',
    status: 'in_consult',
    triageLevel: 'yellow',
    presentingComplaint: 'Vomiting multiple times today, not eating',
    chiefConcern: 'Vomiting',
    checkInTime: new Date(Date.now() - 12 * 60000).toISOString(), // 12 minutes ago
    consultationStartTime: new Date(Date.now() - 3 * 60000).toISOString(), // 3 minutes ago
    videoRoomUrl: 'https://daily.co/vet-room-12345',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440032',
    clinicId: '550e8400-e29b-41d4-a716-446655440001',
    petId: '550e8400-e29b-41d4-a716-446655440012',
    assignedTechId: '550e8400-e29b-41d4-a716-446655440002',
    status: 'waiting',
    triageLevel: 'yellow',
    presentingComplaint: 'Limping on right hind leg, started this morning',
    chiefConcern: 'Lameness',
    queuePosition: 2,
    checkInTime: new Date(Date.now() - 8 * 60000).toISOString(), // 8 minutes ago
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
];