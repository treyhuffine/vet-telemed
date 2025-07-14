export interface Vitals {
  id: string;
  caseId: string;
  recordedById: string;
  temperatureCelsius?: number;
  heartRate?: number;
  respiratoryRate?: number;
  weightKg?: number;
  mucousMembraneColor?: string;
  capillaryRefillTime?: number;
  painScale?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  notes?: string;
  recordedAt: string;
  createdAt: string;
}

export const mockVitals: Vitals[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440040',
    caseId: '550e8400-e29b-41d4-a716-446655440030',
    recordedById: '550e8400-e29b-41d4-a716-446655440002',
    temperatureCelsius: 39.5, // 103.1°F - elevated
    heartRate: 145, // elevated
    respiratoryRate: 45, // elevated
    weightKg: 29.5,
    mucousMembraneColor: 'pale',
    capillaryRefillTime: 3,
    painScale: 7,
    notes: 'Patient appears distressed, rapid shallow breathing',
    recordedAt: new Date(Date.now() - 4 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440041',
    caseId: '550e8400-e29b-41d4-a716-446655440031',
    recordedById: '550e8400-e29b-41d4-a716-446655440002',
    temperatureCelsius: 38.5, // normal
    heartRate: 120,
    respiratoryRate: 24,
    weightKg: 4.2,
    mucousMembraneColor: 'pink',
    capillaryRefillTime: 2,
    painScale: 4,
    notes: 'Dehydrated, abdomen slightly tender',
    recordedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440042',
    caseId: '550e8400-e29b-41d4-a716-446655440032',
    recordedById: '550e8400-e29b-41d4-a716-446655440002',
    temperatureCelsius: 38.8,
    heartRate: 90,
    respiratoryRate: 20,
    weightKg: 35.0,
    mucousMembraneColor: 'pink',
    capillaryRefillTime: 2,
    painScale: 6,
    notes: 'Non-weight bearing on right hind leg, swelling noted',
    recordedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
  },
];