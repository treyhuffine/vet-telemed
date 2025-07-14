'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Info, MapPin, Phone, Search, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { SpeciesType } from '@/constants/mocks/pets';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDemoData } from '@/context/DemoData';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface OwnerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface PetData {
  name: string;
  species: SpeciesType | '';
  breed: string;
  ageYears: string;
  ageMonths: string;
  weightKg: string;
  sex: string;
  isNeutered: boolean;
  microchipId: string;
  allergies: string;
  currentMedications: string;
  medicalHistory: string;
}

export default function NewPatientScreen() {
  const router = useRouter();
  const { owners, addOwner, addPatient } = useDemoData();
  const [step, setStep] = useState<'search' | 'owner' | 'pet'>('search');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [existingOwner, setExistingOwner] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

  const [ownerData, setOwnerData] = useState<OwnerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [petData, setPetData] = useState<PetData>({
    name: '',
    species: '',
    breed: '',
    ageYears: '',
    ageMonths: '',
    weightKg: '',
    sex: '',
    isNeutered: false,
    microchipId: '',
    allergies: '',
    currentMedications: '',
    medicalHistory: '',
  });

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);

    // Search for existing owner by phone
    setTimeout(() => {
      const cleanPhone = searchPhone.replace(/\D/g, '');
      const foundOwner = owners.find(o => o.phone.replace(/\D/g, '') === cleanPhone);
      
      if (foundOwner) {
        setExistingOwner(true);
        setSelectedOwnerId(foundOwner.id);
        toast.info(`Found existing owner: ${foundOwner.firstName} ${foundOwner.lastName}`);
        setStep('pet');
      } else {
        setExistingOwner(false);
        setStep('owner');
        setOwnerData({ ...ownerData, phone: searchPhone });
      }
      setSearchLoading(false);
    }, 500);
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new owner
    const newOwner = addOwner({
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      email: ownerData.email || undefined,
      phone: ownerData.phone,
      alternatePhone: ownerData.alternatePhone || undefined,
      address: ownerData.address || undefined,
      emergencyContactName: ownerData.emergencyContactName || undefined,
      emergencyContactPhone: ownerData.emergencyContactPhone || undefined,
    });
    
    setSelectedOwnerId(newOwner.id);
    toast.success('Owner information saved');
    setStep('pet');
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOwnerId) {
      toast.error('Owner information is required');
      return;
    }
    
    // Create new pet
    const newPet = addPatient({
      ownerId: selectedOwnerId,
      name: petData.name,
      species: petData.species as SpeciesType,
      breed: petData.breed || 'Mixed',
      ageYears: parseInt(petData.ageYears) || 0,
      ageMonths: parseInt(petData.ageMonths) || 0,
      weight: parseFloat(petData.weightKg) || 0,
      sex: petData.sex as 'male' | 'female' || 'male',
      isNeutered: petData.isNeutered,
      microchipId: petData.microchipId || undefined,
      allergies: petData.allergies ? petData.allergies.split(',').map(a => a.trim()) : [],
      currentMedications: petData.currentMedications ? petData.currentMedications.split(',').map(m => m.trim()) : [],
      medicalHistory: petData.medicalHistory ? [petData.medicalHistory] : [],
    });
    
    toast.success('Pet information saved');
    // Redirect to vitals capture with the new pet ID
    router.push(`/intake/vitals/${newPet.id}`);
  };

  const formatPhone = (value: string) => {
    const phone = value.replace(/\D/g, '');
    const match = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Patient Check-In</h1>
              <p className="mt-1 text-sm text-gray-600">Quick and efficient intake process</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Badge
            variant={step === 'search' ? 'default' : 'secondary'}
            className={step === 'search' ? 'bg-primary' : ''}
          >
            1. Search
          </Badge>
          <div className="h-1 flex-1 bg-gray-200">
            <div
              className={`h-1 bg-primary transition-all ${
                step === 'owner' ? 'w-1/2' : step === 'pet' ? 'w-full' : 'w-0'
              }`}
            />
          </div>
          <Badge
            variant={step === 'owner' ? 'default' : 'secondary'}
            className={step === 'owner' ? 'bg-primary' : ''}
          >
            2. Owner Info
          </Badge>
          <div className="h-1 flex-1 bg-gray-200">
            <div className={`h-1 bg-primary transition-all ${step === 'pet' ? 'w-full' : 'w-0'}`} />
          </div>
          <Badge
            variant={step === 'pet' ? 'default' : 'secondary'}
            className={step === 'pet' ? 'bg-primary' : ''}
          >
            3. Pet Info
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Step 1: Phone Search */}
          {step === 'search' && (
            <Card>
              <CardHeader>
                <CardTitle>Search for Existing Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhoneSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(formatPhone(e.target.value))}
                        className="h-12 pl-10 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="h-12 w-full text-lg" disabled={searchLoading}>
                    {searchLoading ? (
                      <>Searching...</>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Search
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button type="button" variant="link" onClick={() => setStep('owner')}>
                      Skip search and create new owner
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Owner Information */}
          {step === 'owner' && (
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOwnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={ownerData.firstName}
                        onChange={(e) => setOwnerData({ ...ownerData, firstName: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={ownerData.lastName}
                        onChange={(e) => setOwnerData({ ...ownerData, lastName: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerPhone">Primary Phone *</Label>
                      <Input
                        id="ownerPhone"
                        type="tel"
                        value={ownerData.phone}
                        onChange={(e) =>
                          setOwnerData({ ...ownerData, phone: formatPhone(e.target.value) })
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alternatePhone">Alternate Phone</Label>
                      <Input
                        id="alternatePhone"
                        type="tel"
                        value={ownerData.alternatePhone}
                        onChange={(e) =>
                          setOwnerData({
                            ...ownerData,
                            alternatePhone: formatPhone(e.target.value),
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ownerData.email}
                      onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={ownerData.address}
                      onChange={(e) => setOwnerData({ ...ownerData, address: e.target.value })}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="mb-3 font-medium">Emergency Contact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyName">Contact Name</Label>
                        <Input
                          id="emergencyName"
                          value={ownerData.emergencyContactName}
                          onChange={(e) =>
                            setOwnerData({ ...ownerData, emergencyContactName: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={ownerData.emergencyContactPhone}
                          onChange={(e) =>
                            setOwnerData({
                              ...ownerData,
                              emergencyContactPhone: formatPhone(e.target.value),
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('search')}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue to Pet Info
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pet Information */}
          {step === 'pet' && (
            <Card>
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePetSubmit} className="space-y-4">
                  {/* Pet Photo */}
                  <div className="mb-6 flex justify-center">
                    <button
                      type="button"
                      className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                    >
                      <Camera className="h-8 w-8 text-gray-400" />
                      <span className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white">
                        <Camera className="h-4 w-4" />
                      </span>
                    </button>
                  </div>

                  <div>
                    <Label htmlFor="petName">Pet Name *</Label>
                    <Input
                      id="petName"
                      value={petData.name}
                      onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                      required
                      className="mt-1"
                      placeholder="e.g., Buddy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="species">Species *</Label>
                      <Select
                        value={petData.species}
                        onValueChange={(value) =>
                          setPetData({ ...petData, species: value as SpeciesType })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={petData.breed}
                        onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                        className="mt-1"
                        placeholder="e.g., Golden Retriever"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ageYears">Age (Years)</Label>
                      <Input
                        id="ageYears"
                        type="number"
                        min="0"
                        value={petData.ageYears}
                        onChange={(e) => setPetData({ ...petData, ageYears: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ageMonths">Age (Months)</Label>
                      <Input
                        id="ageMonths"
                        type="number"
                        min="0"
                        max="11"
                        value={petData.ageMonths}
                        onChange={(e) => setPetData({ ...petData, ageMonths: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={petData.weightKg}
                        onChange={(e) => setPetData({ ...petData, weightKg: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sex">Sex</Label>
                      <Select
                        value={petData.sex}
                        onValueChange={(value) => setPetData({ ...petData, sex: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="neutered">Spayed/Neutered</Label>
                      <Select
                        value={petData.isNeutered ? 'yes' : 'no'}
                        onValueChange={(value) =>
                          setPetData({ ...petData, isNeutered: value === 'yes' })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="microchip">Microchip ID</Label>
                    <Input
                      id="microchip"
                      value={petData.microchipId}
                      onChange={(e) => setPetData({ ...petData, microchipId: e.target.value })}
                      className="mt-1"
                      placeholder="15-digit number"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="mb-3 flex items-center gap-2 font-medium">
                      Medical Information
                      <Info className="h-4 w-4 text-gray-400" />
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="allergies">Known Allergies</Label>
                        <Textarea
                          id="allergies"
                          value={petData.allergies}
                          onChange={(e) => setPetData({ ...petData, allergies: e.target.value })}
                          rows={2}
                          className="mt-1"
                          placeholder="List any known allergies..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="medications">Current Medications</Label>
                        <Textarea
                          id="medications"
                          value={petData.currentMedications}
                          onChange={(e) =>
                            setPetData({ ...petData, currentMedications: e.target.value })
                          }
                          rows={2}
                          className="mt-1"
                          placeholder="List current medications and dosages..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="history">Medical History</Label>
                        <Textarea
                          id="history"
                          value={petData.medicalHistory}
                          onChange={(e) =>
                            setPetData({ ...petData, medicalHistory: e.target.value })
                          }
                          rows={3}
                          className="mt-1"
                          placeholder="Previous surgeries, chronic conditions, etc..."
                        />
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      After saving, you'll proceed to capture vitals and triage information.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('owner')}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-blue-700">
                      Continue to Vitals
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
