'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Download,
  Send,
  Printer,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Phone,
  MapPin,
  Heart,
  Thermometer,
  Pill,
  Syringe,
  AlertCircle,
  Share2,
  Mail
} from 'lucide-react';
import { mockCases, mockPets, mockOwners, mockVitals, mockUsers } from '@/constants/mocks';
import { format } from 'date-fns';

// Mock data for demonstration
const mockSOAPNotes = {
  subjective: "Owner reports patient has been vomiting 3-4 times over the past 24 hours. Last normal bowel movement was yesterday morning. Appetite is decreased. No known dietary indiscretion.",
  objective: "Patient appears quiet but alert. Mucous membranes are pink and slightly tacky. CRT 2 seconds. Mild abdominal discomfort on palpation, no signs of bloat or obstruction. T: 101.8°F, HR: 120 bpm, RR: 24 /min",
  assessment: "Acute gastroenteritis, likely dietary indiscretion vs infectious etiology. Mild dehydration. No evidence of obstruction or systemic illness at this time.",
  plan: "1. Maropitant 1mg/kg SQ - administered\n2. Fluid therapy - LRS 60ml/kg/day subcutaneous\n3. NPO for 12 hours, then bland diet (boiled chicken and rice)\n4. Probiotics daily x 7 days\n5. Recheck if no improvement in 24-48 hours"
};

const mockTreatmentPlan = {
  medications: [
    { name: "Maropitant", dosage: "1mg/kg", route: "SQ", frequency: "SID", duration: "3 days" },
    { name: "Omeprazole", dosage: "1mg/kg", route: "PO", frequency: "SID", duration: "7 days" },
    { name: "Metronidazole", dosage: "15mg/kg", route: "PO", frequency: "BID", duration: "5 days" }
  ],
  procedures: [
    { name: "Subcutaneous Fluids", cost: "75", priority: "immediate" },
    { name: "Anti-nausea Injection", cost: "45", priority: "immediate" }
  ],
  dischargeInstructions: "Keep your pet calm and rested for the next 24-48 hours. Start with small amounts of water after 12 hours. If no vomiting, offer small amounts of bland diet. Gradually increase portions over 2-3 days. Monitor for continued vomiting, lethargy, or worsening symptoms.",
  followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  estimatedCostLow: "120",
  estimatedCostHigh: "120"
};

export default function CaseSummaryScreen() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Mock data
  const caseData = mockCases[1];
  const pet = mockPets.find(p => p.id === caseData.petId)!;
  const owner = mockOwners.find(o => o.id === pet.ownerId)!;
  const vitals = mockVitals.find(v => v.caseId === caseData.id)!;
  const vet = mockUsers.find(u => u.id === caseData.assignedVetId);
  const tech = mockUsers.find(u => u.id === caseData.assignedTechId);

  const handleExportPDF = () => {
    // In real app, would generate PDF
    console.log('Exporting PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToOwner = async () => {
    setSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    setSent(true);
  };

  const handleFinalize = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b print:hidden">
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
                <h1 className="text-2xl font-bold text-gray-900">Case Summary</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Ready for review and export
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button 
                onClick={handleSendToOwner}
                disabled={sending || sent}
              >
                {sent ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sent
                  </>
                ) : sending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Owner
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 print:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Clinic Header (for print) */}
          <div className="hidden print:block text-center mb-8">
            <h1 className="text-2xl font-bold">Paws & Claws Emergency Vet</h1>
            <p className="text-gray-600">123 Main Street, San Francisco, CA 94105</p>
            <p className="text-gray-600">(415) 555-0123</p>
          </div>

          {/* Case Information */}
          <Card>
            <CardHeader>
              <CardTitle>Visit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date of Visit</p>
                  <p className="font-medium">{format(new Date(caseData.checkInTime), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Case Number</p>
                  <p className="font-medium">#{caseData.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attending Veterinarian</p>
                  <p className="font-medium">{vet?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Veterinary Technician</p>
                  <p className="font-medium">{tech?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient & Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{pet.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Species/Breed</p>
                  <p className="font-medium">{pet.species} - {pet.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{pet.ageYears} years {pet.ageMonths} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{pet.weightKg} kg ({(pet.weightKg * 2.205).toFixed(1)} lbs)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {owner.phone}
                  </p>
                </div>
                {owner.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {owner.email}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Presenting Complaint & Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Reason for Visit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chief Complaint</p>
                <p className="font-medium">{caseData.presentingComplaint}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Vital Signs at Presentation</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="font-medium">{(vitals.temperatureCelsius! * 9/5 + 32).toFixed(1)}°F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Heart Rate</p>
                      <p className="font-medium">{vitals.heartRate} bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Resp Rate</p>
                      <p className="font-medium">{vitals.respiratoryRate} /min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Pain Scale</p>
                      <p className="font-medium">{vitals.painScale}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Assessment (SOAP)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">Subjective</p>
                <p className="text-gray-900">{mockSOAPNotes.subjective}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">Objective</p>
                <p className="text-gray-900">{mockSOAPNotes.objective}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">Assessment</p>
                <p className="text-gray-900">{mockSOAPNotes.assessment}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">Plan</p>
                <p className="text-gray-900 whitespace-pre-line">{mockSOAPNotes.plan}</p>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medications */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Medications Prescribed
                </h3>
                <div className="space-y-2">
                  {mockTreatmentPlan.medications.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gray-500">•</span>
                      <div>
                        <p className="font-medium">{med.name} - {med.dosage}</p>
                        <p className="text-sm text-gray-600">
                          {med.route}, {med.frequency} for {med.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Procedures */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Syringe className="h-4 w-4" />
                  Procedures Performed
                </h3>
                <div className="space-y-2">
                  {mockTreatmentPlan.procedures.map((proc, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>{proc.name}</span>
                      <span className="text-gray-600">${proc.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cost Summary */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cost Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-bold">
                    Total: ${mockTreatmentPlan.estimatedCostLow}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discharge Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Discharge Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 mb-4">{mockTreatmentPlan.dischargeInstructions}</p>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>When to return immediately:</strong> If your pet shows signs of worsening symptoms, difficulty breathing, continuous vomiting, lethargy, or any other concerning changes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Follow-up Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">
                Recommended follow-up appointment: <strong>{format(mockTreatmentPlan.followUpDate, 'EEEE, MMMM d, yyyy')}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please call {owner.phone} to schedule your follow-up appointment.
              </p>
            </CardContent>
          </Card>

          {/* Actions (not printed) */}
          <div className="flex items-center justify-between print:hidden">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Edit
            </Button>
            <Button onClick={handleFinalize} size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Finalize Case
            </Button>
          </div>

          {/* Footer (for print) */}
          <div className="hidden print:block mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>Thank you for trusting us with {pet.name}'s care.</p>
            <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
}