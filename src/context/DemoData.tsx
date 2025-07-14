'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { mockCases, mockPets, mockOwners, mockVitals } from '@/constants/mocks';

// Types
export interface DemoOwner {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface DemoPatient {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  photoUrl?: string;
  microchipId?: string;
}

export interface DemoCase {
  id: string;
  petId: string;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  species: 'dog' | 'cat' | 'other';
  triageLevel: 'red' | 'yellow' | 'green';
  status: 'waiting' | 'ready' | 'in_consultation' | 'completed';
  chiefComplaint: string;
  createdAt: Date;
  assignedVetId?: string;
  assignedVetName?: string;
  waitTime: number;
  vitals: {
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
    weight: number;
    mmColor: string;
    crt: string;
    painScale?: number;
    bloodPressure?: string;
  };
  files?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  notes?: string;
  treatmentPlan?: string;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
}

export interface DemoVideoCall {
  id: string;
  caseId: string;
  participants: string[];
  isActive: boolean;
  startTime: Date;
  screenShare?: {
    userId: string;
    isActive: boolean;
  };
}

interface DemoDataContextType {
  // Owners
  owners: DemoOwner[];
  addOwner: (owner: Omit<DemoOwner, 'id' | 'name'>) => DemoOwner;
  
  // Patients
  patients: DemoPatient[];
  addPatient: (patient: Omit<DemoPatient, 'id'>) => DemoPatient;
  updatePatient: (id: string, updates: Partial<DemoPatient>) => void;
  getPatient: (id: string) => DemoPatient | undefined;
  
  // Cases
  cases: DemoCase[];
  addCase: (caseData: Omit<DemoCase, 'id' | 'createdAt' | 'waitTime'>) => DemoCase;
  updateCase: (id: string, updates: Partial<DemoCase>) => void;
  getCase: (id: string) => DemoCase | undefined;
  assignCase: (caseId: string, vetId: string, vetName: string) => void;
  
  // Video Calls
  videoCalls: DemoVideoCall[];
  startVideoCall: (caseId: string, userId: string) => DemoVideoCall;
  joinVideoCall: (callId: string, userId: string) => void;
  endVideoCall: (callId: string) => void;
  toggleScreenShare: (callId: string, userId: string) => void;
  getActiveCall: (caseId: string) => DemoVideoCall | undefined;
  
  // Queue Management
  getQueueStats: () => {
    totalCases: number;
    waitingCases: number;
    redTriageCases: number;
    avgWaitTime: number;
  };
  
  // Real-time simulation
  broadcastUpdate: (type: string, data: any) => void;
  subscribeToUpdates: (callback: (type: string, data: any) => void) => () => void;
  
  // Demo controls
  resetDemoData: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

// Broadcast channel for cross-tab communication
const BROADCAST_CHANNEL = 'vet-telemed-demo';

export function DemoDataProvider({ children }: { children: ReactNode }) {
  // Initialize with mock data
  const [owners, setOwners] = useState<DemoOwner[]>(
    mockOwners.map(owner => ({
      ...owner,
      name: `${owner.firstName} ${owner.lastName}`,
    }))
  );
  
  const [patients, setPatients] = useState<DemoPatient[]>(
    mockPets.map(pet => ({
      id: pet.id,
      name: pet.name,
      species: pet.species as 'dog' | 'cat' | 'other',
      breed: pet.breed,
      age: pet.ageYears,
      weight: pet.weightKg,
      ownerId: pet.ownerId,
      medicalHistory: Array.isArray(pet.medicalHistory) ? pet.medicalHistory : [],
      allergies: pet.allergies || [],
      medications: pet.currentMedications || [],
      photoUrl: pet.photoUrl,
      microchipId: pet.microchipId,
    }))
  );
  
  // Initialize cases from mockCases with proper data transformation
  const [cases, setCases] = useState<DemoCase[]>(
    mockCases.map(mockCase => {
      const pet = mockPets.find(p => p.id === mockCase.petId);
      const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;
      const mockVital = mockVitals.find(v => v.caseId === mockCase.id);
      
      return {
        id: mockCase.id,
        petId: mockCase.petId,
        petName: pet?.name || 'Unknown',
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
        ownerPhone: owner?.phone || '',
        species: (pet?.species || 'other') as 'dog' | 'cat' | 'other',
        triageLevel: mockCase.triageLevel,
        status: mockCase.status === 'in_consult' ? 'in_consultation' : mockCase.status as any,
        chiefComplaint: mockCase.presentingComplaint,
        createdAt: new Date(mockCase.checkInTime),
        assignedVetId: mockCase.assignedVetId,
        assignedVetName: mockCase.assignedVetId ? 'Dr. Remote Vet' : undefined,
        waitTime: Math.floor((Date.now() - new Date(mockCase.checkInTime).getTime()) / 60000),
        vitals: mockVital ? {
          temperature: mockVital.temperatureCelsius || 38.5,
          heartRate: mockVital.heartRate || 100,
          respiratoryRate: mockVital.respiratoryRate || 20,
          weight: mockVital.weightKg || 20,
          mmColor: mockVital.mucousMembraneColor || 'Pink',
          crt: mockVital.capillaryRefillTime || '< 2 sec',
          painScale: mockVital.painScore,
          bloodPressure: mockVital.bloodPressure,
        } : {
          temperature: 38.5,
          heartRate: 100,
          respiratoryRate: 20,
          weight: 20,
          mmColor: 'Pink',
          crt: '< 2 sec',
        },
        notes: mockCase.chiefConcern,
        consultationStartTime: mockCase.consultationStartTime ? new Date(mockCase.consultationStartTime) : undefined,
        consultationEndTime: mockCase.consultationEndTime ? new Date(mockCase.consultationEndTime) : undefined,
      };
    })
  );
  const [videoCalls, setVideoCalls] = useState<DemoVideoCall[]>([]);
  
  // Broadcast channel for real-time updates
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);
  const callbacksRef = useRef<Array<(type: string, data: any) => void>>([]);

  useEffect(() => {
    // Initialize broadcast channel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL);
      setBroadcastChannel(channel);
      
      // Listen for updates from other tabs/windows
      channel.onmessage = (event) => {
        const { type, data } = event.data;
        handleBroadcastUpdate(type, data);
        
        // Notify subscribers using ref to avoid stale closures
        callbacksRef.current.forEach(callback => callback(type, data));
      };
      
      return () => {
        channel.close();
      };
    }
  }, []); // Remove updateCallbacks dependency to prevent infinite loop

  const handleBroadcastUpdate = (type: string, data: any) => {
    switch (type) {
      case 'patient_added':
        setPatients(prev => [...prev, data]);
        break;
      case 'patient_updated':
        setPatients(prev => prev.map(p => p.id === data.id ? { ...p, ...data.updates } : p));
        break;
      case 'case_added':
        setCases(prev => {
          const newCase = { ...data };
          // Convert date strings back to Date objects
          if (newCase.createdAt && typeof newCase.createdAt === 'string') {
            newCase.createdAt = new Date(newCase.createdAt);
          }
          if (newCase.consultationStartTime && typeof newCase.consultationStartTime === 'string') {
            newCase.consultationStartTime = new Date(newCase.consultationStartTime);
          }
          if (newCase.consultationEndTime && typeof newCase.consultationEndTime === 'string') {
            newCase.consultationEndTime = new Date(newCase.consultationEndTime);
          }
          return [...prev, newCase];
        });
        break;
      case 'case_updated':
        setCases(prev => prev.map(c => {
          if (c.id === data.id) {
            const updates = { ...data.updates };
            // Convert date strings back to Date objects
            if (updates.createdAt && typeof updates.createdAt === 'string') {
              updates.createdAt = new Date(updates.createdAt);
            }
            if (updates.consultationStartTime && typeof updates.consultationStartTime === 'string') {
              updates.consultationStartTime = new Date(updates.consultationStartTime);
            }
            if (updates.consultationEndTime && typeof updates.consultationEndTime === 'string') {
              updates.consultationEndTime = new Date(updates.consultationEndTime);
            }
            return { ...c, ...updates };
          }
          return c;
        }));
        break;
      case 'video_call_started':
        setVideoCalls(prev => [...prev, data]);
        break;
      case 'video_call_updated':
        setVideoCalls(prev => prev.map(vc => vc.id === data.id ? { ...vc, ...data.updates } : vc));
        break;
      case 'video_call_ended':
        setVideoCalls(prev => prev.map(vc => vc.id === data.id ? { ...vc, isActive: false } : vc));
        break;
      case 'owner_added':
        setOwners(prev => [...prev, data]);
        break;
      case 'demo_reset':
        // Handle reset from another tab
        window.location.reload();
        break;
    }
  };

  const broadcastUpdate = (type: string, data: any) => {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type, data });
    }
    // Also handle locally
    handleBroadcastUpdate(type, data);
  };

  const subscribeToUpdates = (callback: (type: string, data: any) => void) => {
    callbacksRef.current = [...callbacksRef.current, callback];
    return () => {
      callbacksRef.current = callbacksRef.current.filter(cb => cb !== callback);
    };
  };

  // Owner Management
  const addOwner = (ownerData: Omit<DemoOwner, 'id' | 'name'>): DemoOwner => {
    const newOwner: DemoOwner = {
      ...ownerData,
      id: `owner-${Date.now()}`,
      name: `${ownerData.firstName} ${ownerData.lastName}`,
    };
    setOwners(prev => [...prev, newOwner]);
    broadcastUpdate('owner_added', newOwner);
    return newOwner;
  };

  // Patient Management
  const addPatient = (patientData: Omit<DemoPatient, 'id'>): DemoPatient => {
    const newPatient: DemoPatient = {
      ...patientData,
      id: `patient-${Date.now()}`,
    };
    broadcastUpdate('patient_added', newPatient);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<DemoPatient>) => {
    broadcastUpdate('patient_updated', { id, updates });
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);

  // Case Management
  const addCase = (caseData: Omit<DemoCase, 'id' | 'createdAt' | 'waitTime'>): DemoCase => {
    const newCase: DemoCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      createdAt: new Date(),
      waitTime: 0,
    };
    broadcastUpdate('case_added', newCase);
    return newCase;
  };

  const updateCase = (id: string, updates: Partial<DemoCase>) => {
    broadcastUpdate('case_updated', { id, updates });
  };

  const getCase = (id: string) => cases.find(c => c.id === id);

  const assignCase = (caseId: string, vetId: string, vetName: string) => {
    updateCase(caseId, {
      assignedVetId: vetId,
      assignedVetName: vetName,
      status: 'ready',
    });
  };

  // Video Call Management
  const startVideoCall = (caseId: string, userId: string): DemoVideoCall => {
    const newCall: DemoVideoCall = {
      id: `call-${Date.now()}`,
      caseId,
      participants: [userId],
      isActive: true,
      startTime: new Date(),
    };
    
    // Update case status
    updateCase(caseId, {
      status: 'in_consultation',
      consultationStartTime: new Date(),
    });
    
    broadcastUpdate('video_call_started', newCall);
    return newCall;
  };

  const joinVideoCall = (callId: string, userId: string) => {
    const call = videoCalls.find(vc => vc.id === callId);
    if (call && !call.participants.includes(userId)) {
      const updates = {
        participants: [...call.participants, userId],
      };
      broadcastUpdate('video_call_updated', { id: callId, updates });
    }
  };

  const endVideoCall = (callId: string) => {
    const call = videoCalls.find(vc => vc.id === callId);
    if (call) {
      // Update case status
      const caseToUpdate = cases.find(c => c.id === call.caseId);
      if (caseToUpdate) {
        updateCase(call.caseId, {
          status: 'completed',
          consultationEndTime: new Date(),
        });
      }
      
      broadcastUpdate('video_call_ended', { id: callId });
    }
  };

  const toggleScreenShare = (callId: string, userId: string) => {
    const call = videoCalls.find(vc => vc.id === callId);
    if (call) {
      const updates = {
        screenShare: call.screenShare?.isActive
          ? { userId, isActive: false }
          : { userId, isActive: true },
      };
      broadcastUpdate('video_call_updated', { id: callId, updates });
    }
  };

  const getActiveCall = (caseId: string) => {
    return videoCalls.find(vc => vc.caseId === caseId && vc.isActive);
  };

  // Queue Statistics
  const getQueueStats = () => {
    const waitingCases = cases.filter(c => c.status === 'waiting' || c.status === 'ready');
    const redTriageCases = cases.filter(c => c.triageLevel === 'red' && c.status !== 'completed');
    
    const avgWaitTime = waitingCases.length > 0
      ? waitingCases.reduce((sum, c) => {
          const waitMinutes = Math.floor((Date.now() - c.createdAt.getTime()) / 60000);
          return sum + waitMinutes;
        }, 0) / waitingCases.length
      : 0;

    return {
      totalCases: cases.length,
      waitingCases: waitingCases.length,
      redTriageCases: redTriageCases.length,
      avgWaitTime: Math.round(avgWaitTime),
    };
  };

  // Update wait times periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCases(prev => prev.map(c => {
        if ((c.status === 'waiting' || c.status === 'ready') && c.createdAt instanceof Date) {
          const waitMinutes = Math.floor((Date.now() - c.createdAt.getTime()) / 60000);
          return { ...c, waitTime: waitMinutes };
        }
        return c;
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset demo data
  const resetDemoData = () => {
    // Reset to initial mock data
    setOwners(
      mockOwners.map(owner => ({
        ...owner,
        name: `${owner.firstName} ${owner.lastName}`,
      }))
    );
    
    setPatients(
      mockPets.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species as 'dog' | 'cat' | 'other',
        breed: pet.breed,
        age: pet.ageYears,
        weight: pet.weightKg,
        ownerId: pet.ownerId,
        medicalHistory: Array.isArray(pet.medicalHistory) ? pet.medicalHistory : [],
        allergies: pet.allergies || [],
        medications: pet.currentMedications || [],
        photoUrl: pet.photoUrl,
        microchipId: pet.microchipId,
      }))
    );
    
    // Reset cases with proper data transformation
    setCases(
      mockCases.map(mockCase => {
        const pet = mockPets.find(p => p.id === mockCase.petId);
        const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;
        const mockVital = mockVitals.find(v => v.caseId === mockCase.id);
        
        return {
          id: mockCase.id,
          petId: mockCase.petId,
          petName: pet?.name || 'Unknown',
          ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
          ownerPhone: owner?.phone || '',
          species: (pet?.species || 'other') as 'dog' | 'cat' | 'other',
          triageLevel: mockCase.triageLevel,
          status: mockCase.status === 'in_consult' ? 'in_consultation' : mockCase.status as any,
          chiefComplaint: mockCase.presentingComplaint,
          createdAt: new Date(mockCase.checkInTime),
          assignedVetId: mockCase.assignedVetId,
          assignedVetName: mockCase.assignedVetId ? 'Dr. Remote Vet' : undefined,
          waitTime: Math.floor((Date.now() - new Date(mockCase.checkInTime).getTime()) / 60000),
          vitals: mockVital ? {
            temperature: mockVital.temperatureCelsius || 38.5,
            heartRate: mockVital.heartRate || 100,
            respiratoryRate: mockVital.respiratoryRate || 20,
            weight: mockVital.weightKg || 20,
            mmColor: mockVital.mucousMembraneColor || 'Pink',
            crt: mockVital.capillaryRefillTime ? mockVital.capillaryRefillTime.toString() : '< 2 sec',
            painScale: mockVital.painScore,
            bloodPressure: mockVital.bloodPressure,
          } : {
            temperature: 38.5,
            heartRate: 100,
            respiratoryRate: 20,
            weight: 20,
            mmColor: 'Pink',
            crt: '< 2 sec',
          },
          notes: mockCase.chiefConcern,
          consultationStartTime: mockCase.consultationStartTime ? new Date(mockCase.consultationStartTime) : undefined,
          consultationEndTime: mockCase.consultationEndTime ? new Date(mockCase.consultationEndTime) : undefined,
        };
      })
    );
    
    setVideoCalls([]);
    
    // Broadcast reset
    broadcastUpdate('demo_reset', {});
  };

  return (
    <DemoDataContext.Provider
      value={{
        owners,
        addOwner,
        patients,
        addPatient,
        updatePatient,
        getPatient,
        cases,
        addCase,
        updateCase,
        getCase,
        assignCase,
        videoCalls,
        startVideoCall,
        joinVideoCall,
        endVideoCall,
        toggleScreenShare,
        getActiveCall,
        getQueueStats,
        broadcastUpdate,
        subscribeToUpdates,
        resetDemoData,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within DemoDataProvider');
  }
  return context;
};