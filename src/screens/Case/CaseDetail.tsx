'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Video,
  FileText,
  Clock,
  Phone,
  MapPin,
  Heart,
  Thermometer,
  Wind,
  Activity,
  AlertCircle,
  Edit,
  Plus,
  Download,
  Share2,
  Stethoscope,
  UserPlus
} from 'lucide-react';
import { mockCases, mockPets, mockOwners, mockVitals, mockUsers } from '@/constants/mocks';
import { formatDistanceToNow } from 'date-fns';
import { useVetAuth } from '@/context/VetAuth';
import CaseTransferDialog from '@/components/CaseTransfer/CaseTransferDialog';

export default function CaseDetailScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  
  // Mock data - in real app would come from props/query
  const caseData = mockCases[0];
  const pet = mockPets.find(p => p.id === caseData.petId)!;
  const owner = mockOwners.find(o => o.id === pet.ownerId)!;
  const vitals = mockVitals.find(v => v.caseId === caseData.id)!;
  const assignedTech = mockUsers.find(u => u.id === caseData.assignedTechId);
  const assignedVet = mockUsers.find(u => u.id === caseData.assignedVetId);

  const waitTime = formatDistanceToNow(new Date(caseData.checkInTime), { addSuffix: false });

  const handleTransferCase = (toVetId: string, reason: string) => {
    console.log('Transferring case to:', toVetId, 'Reason:', reason);
    // In real app, this would update the case via API
    // For now, just close the dialog
    setIsTransferDialogOpen(false);
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-gray-500';
      case 'ready': return 'bg-blue-500';
      case 'in_consult': return 'bg-purple-500';
      case 'complete': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const startConsultation = () => {
    router.push(`/consultation/${caseData.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                  <div className={`w-3 h-3 rounded-full ${getTriageColor(caseData.triageLevel)}`} />
                  <Badge className={getStatusColor(caseData.status)}>
                    {caseData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {pet.species}, {pet.breed} • {pet.ageYears}y {pet.ageMonths}m • {pet.weightKg}kg
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.isVet && caseData.status === 'waiting' && (
                <Button onClick={startConsultation} size="lg">
                  <Video className="mr-2 h-4 w-4" />
                  Start Consultation
                </Button>
              )}
              {caseData.status === 'in_consult' && (
                <Button onClick={() => router.push(`/consultation/${caseData.id}`)} size="lg">
                  <Video className="mr-2 h-4 w-4" />
                  Join Consultation
                </Button>
              )}
              {(user?.role === 'vet' || user?.role === 'admin') && caseData.assignedVetId && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsTransferDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Transfer Case
                </Button>
              )}
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Wait Time</p>
                    <p className="text-xl font-bold">{waitTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Queue Position</p>
                    <p className="text-xl font-bold">#{caseData.queuePosition || 'N/A'}</p>
                  </div>
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assigned Vet</p>
                    <p className="text-lg font-medium">{assignedVet?.name || 'Unassigned'}</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tech</p>
                    <p className="text-lg font-medium">{assignedTech?.name || 'N/A'}</p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={assignedTech?.avatarUrl} />
                    <AvatarFallback>{assignedTech?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Presenting Complaint */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Presenting Complaint</span>
                        <Badge variant="outline" className={`${
                          caseData.triageLevel === 'red' ? 'text-red-700 border-red-300' :
                          caseData.triageLevel === 'yellow' ? 'text-yellow-700 border-yellow-300' :
                          'text-green-700 border-green-300'
                        }`}>
                          {caseData.triageLevel.toUpperCase()} Priority
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Chief Concern</p>
                          <p className="text-lg font-medium">{caseData.chiefConcern}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Description</p>
                          <p className="text-gray-900">{caseData.presentingComplaint}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pet Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pet Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        {pet.photoUrl && (
                          <img 
                            src={pet.photoUrl} 
                            alt={pet.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Species/Breed</p>
                            <p className="font-medium">{pet.species} - {pet.breed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Age</p>
                            <p className="font-medium">{pet.ageYears}y {pet.ageMonths}m</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="font-medium">{pet.weightKg}kg ({(pet.weightKg * 2.205).toFixed(1)}lbs)</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sex</p>
                            <p className="font-medium">{pet.sex} {pet.isNeutered ? '(Neutered)' : '(Intact)'}</p>
                          </div>
                          {pet.microchipId && (
                            <div>
                              <p className="text-sm text-gray-600">Microchip</p>
                              <p className="font-medium">{pet.microchipId}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {(pet.allergies.length > 0 || pet.currentMedications.length > 0) && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          {pet.allergies.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Allergies</p>
                              <div className="flex flex-wrap gap-2">
                                {pet.allergies.map((allergy, idx) => (
                                  <Badge key={idx} variant="destructive">{allergy}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {pet.currentMedications.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Current Medications</p>
                              <div className="flex flex-wrap gap-2">
                                {pet.currentMedications.map((med, idx) => (
                                  <Badge key={idx} variant="secondary">{med}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {pet.medicalHistory && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-1">Medical History</p>
                          <p className="text-gray-900">{pet.medicalHistory}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Owner & Quick Actions */}
                <div className="space-y-6">
                  {/* Owner Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Owner Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Primary Phone</p>
                        <a href={`tel:${owner.phone}`} className="font-medium text-blue-600 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {owner.phone}
                        </a>
                      </div>
                      {owner.alternatePhone && (
                        <div>
                          <p className="text-sm text-gray-600">Alternate Phone</p>
                          <a href={`tel:${owner.alternatePhone}`} className="font-medium text-blue-600 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {owner.alternatePhone}
                          </a>
                        </div>
                      )}
                      {owner.email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{owner.email}</p>
                        </div>
                      )}
                      {owner.address && (
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium flex items-start gap-1">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {owner.address}
                          </p>
                        </div>
                      )}
                      {owner.emergencyContactName && (
                        <div className="pt-3 border-t">
                          <p className="text-sm text-gray-600">Emergency Contact</p>
                          <p className="font-medium">{owner.emergencyContactName}</p>
                          {owner.emergencyContactPhone && (
                            <a href={`tel:${owner.emergencyContactPhone}`} className="text-blue-600 flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {owner.emergencyContactPhone}
                            </a>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="mr-2 h-4 w-4" />
                        Update Information
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Files
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Add Notes
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Export Case
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Latest Vitals</span>
                    <span className="text-sm text-gray-600 font-normal">
                      Recorded {formatDistanceToNow(new Date(vitals.recordedAt), { addSuffix: true })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vitals.temperatureCelsius && (
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="text-2xl font-bold">
                            {(vitals.temperatureCelsius * 9/5 + 32).toFixed(1)}°F
                          </p>
                          <p className="text-xs text-gray-500">Normal: 99.5-102.5°F</p>
                        </div>
                      </div>
                    )}

                    {vitals.heartRate && (
                      <div className="flex items-center gap-3">
                        <Heart className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Heart Rate</p>
                          <p className="text-2xl font-bold">{vitals.heartRate} bpm</p>
                          <p className="text-xs text-gray-500">Normal: 60-140 bpm</p>
                        </div>
                      </div>
                    )}

                    {vitals.respiratoryRate && (
                      <div className="flex items-center gap-3">
                        <Wind className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Respiratory Rate</p>
                          <p className="text-2xl font-bold">{vitals.respiratoryRate} /min</p>
                          <p className="text-xs text-gray-500">Normal: 10-30 /min</p>
                        </div>
                      </div>
                    )}

                    {vitals.mucousMembraneColor && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-pink-200" />
                        <div>
                          <p className="text-sm text-gray-600">Mucous Membrane</p>
                          <p className="text-xl font-medium">{vitals.mucousMembraneColor}</p>
                        </div>
                      </div>
                    )}

                    {vitals.capillaryRefillTime !== undefined && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">CRT</p>
                          <p className="text-2xl font-bold">{vitals.capillaryRefillTime}s</p>
                          <p className="text-xs text-gray-500">Normal: &lt;2s</p>
                        </div>
                      </div>
                    )}

                    {vitals.painScale !== undefined && (
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Pain Scale</p>
                          <p className="text-2xl font-bold">{vitals.painScale}/10</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {vitals.notes && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-2">Notes</p>
                      <p className="text-gray-900">{vitals.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No files uploaded yet</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No clinical notes yet</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No previous visits recorded</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Case Transfer Dialog */}
      <CaseTransferDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        currentCase={caseData}
        onTransfer={handleTransferCase}
      />
    </div>
  );
}