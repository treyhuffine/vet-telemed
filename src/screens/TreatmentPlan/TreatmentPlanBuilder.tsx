'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Pill,
  Syringe,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  Check,
  Clock,
  Calculator,
  Send
} from 'lucide-react';
import { mockCases, mockPets, mockOwners } from '@/constants/mocks';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Procedure {
  id: string;
  name: string;
  description: string;
  estimatedCost: string;
  priority: 'immediate' | 'urgent' | 'routine';
}

interface TreatmentPlan {
  medications: Medication[];
  procedures: Procedure[];
  followUpInstructions: string;
  dischargeInstructions: string;
  estimatedCostLow: string;
  estimatedCostHigh: string;
  followUpDate: string;
}

const commonMedications = [
  { name: 'Cephalexin', dosage: '22mg/kg', route: 'PO', frequency: 'BID' },
  { name: 'Enrofloxacin', dosage: '5mg/kg', route: 'PO', frequency: 'SID' },
  { name: 'Maropitant', dosage: '1mg/kg', route: 'SQ', frequency: 'SID' },
  { name: 'Carprofen', dosage: '4.4mg/kg', route: 'PO', frequency: 'SID' },
  { name: 'Gabapentin', dosage: '10mg/kg', route: 'PO', frequency: 'TID' },
  { name: 'Omeprazole', dosage: '1mg/kg', route: 'PO', frequency: 'SID' },
];

const commonProcedures = [
  { name: 'IV Catheter Placement', cost: '75-125' },
  { name: 'Radiographs (2 view)', cost: '150-250' },
  { name: 'Radiographs (3 view)', cost: '200-300' },
  { name: 'Ultrasound - Abdominal', cost: '300-500' },
  { name: 'Blood Work - CBC/Chemistry', cost: '150-250' },
  { name: 'Urinalysis', cost: '50-100' },
  { name: 'Wound Cleaning & Closure', cost: '200-400' },
  { name: 'Oxygen Therapy (per hour)', cost: '50-100' },
  { name: 'Fluid Therapy - IV', cost: '100-200' },
];

export default function TreatmentPlanBuilderScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('medications');
  const [autoSaving, setAutoSaving] = useState(false);
  
  // Mock data
  const caseData = mockCases[1];
  const pet = mockPets.find(p => p.id === caseData.petId)!;
  const owner = mockOwners.find(o => o.id === pet.ownerId)!;

  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    medications: [],
    procedures: [],
    followUpInstructions: '',
    dischargeInstructions: '',
    estimatedCostLow: '',
    estimatedCostHigh: '',
    followUpDate: '',
  });

  const addMedication = (preset?: typeof commonMedications[0]) => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: preset?.name || '',
      dosage: preset?.dosage || '',
      route: preset?.route || '',
      frequency: preset?.frequency || '',
      duration: '',
      instructions: '',
    };
    setTreatmentPlan(prev => ({
      ...prev,
      medications: [...prev.medications, newMed],
    }));
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setTreatmentPlan(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.id === id ? { ...med, ...updates } : med
      ),
    }));
  };

  const removeMedication = (id: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id),
    }));
  };

  const addProcedure = (preset?: typeof commonProcedures[0]) => {
    const newProc: Procedure = {
      id: Date.now().toString(),
      name: preset?.name || '',
      description: '',
      estimatedCost: preset?.cost || '',
      priority: 'routine',
    };
    setTreatmentPlan(prev => ({
      ...prev,
      procedures: [...prev.procedures, newProc],
    }));
  };

  const updateProcedure = (id: string, updates: Partial<Procedure>) => {
    setTreatmentPlan(prev => ({
      ...prev,
      procedures: prev.procedures.map(proc => 
        proc.id === id ? { ...proc, ...updates } : proc
      ),
    }));
  };

  const removeProcedure = (id: string) => {
    setTreatmentPlan(prev => ({
      ...prev,
      procedures: prev.procedures.filter(proc => proc.id !== id),
    }));
  };

  const calculateTotalCost = () => {
    let lowTotal = 0;
    let highTotal = 0;

    treatmentPlan.procedures.forEach(proc => {
      if (proc.estimatedCost.includes('-')) {
        const [low, high] = proc.estimatedCost.split('-').map(s => parseFloat(s.trim()) || 0);
        lowTotal += low;
        highTotal += high;
      } else {
        const cost = parseFloat(proc.estimatedCost) || 0;
        lowTotal += cost;
        highTotal += cost;
      }
    });

    setTreatmentPlan(prev => ({
      ...prev,
      estimatedCostLow: lowTotal.toString(),
      estimatedCostHigh: highTotal.toString(),
    }));
  };

  const handleSave = () => {
    // In real app, would save to database
    router.push(`/case/${caseData.id}/summary`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'destructive';
      case 'urgent': return 'default';
      case 'routine': return 'secondary';
      default: return 'secondary';
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Treatment Plan</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {pet.name} • {caseData.chiefConcern} • Case #{caseData.id.slice(-6)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {autoSaving && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              )}
              <Button onClick={calculateTotalCost} variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Cost
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Cost Estimate Summary */}
          {(treatmentPlan.estimatedCostLow || treatmentPlan.estimatedCostHigh) && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Total Cost</p>
                      <p className="text-xl font-bold">
                        ${treatmentPlan.estimatedCostLow} - ${treatmentPlan.estimatedCostHigh}
                      </p>
                    </div>
                  </div>
                  <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is an estimate only. Final costs may vary based on patient response and additional diagnostics.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="medications">
                <Pill className="mr-2 h-4 w-4" />
                Medications
              </TabsTrigger>
              <TabsTrigger value="procedures">
                <Syringe className="mr-2 h-4 w-4" />
                Procedures
              </TabsTrigger>
              <TabsTrigger value="instructions">
                <FileText className="mr-2 h-4 w-4" />
                Instructions
              </TabsTrigger>
              <TabsTrigger value="followup">
                <Calendar className="mr-2 h-4 w-4" />
                Follow-up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Medications</span>
                    <Button onClick={() => addMedication()} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Add Common Medications */}
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-2">Quick add common medications:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonMedications.map((med, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => addMedication(med)}
                        >
                          {med.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Medications List */}
                  {treatmentPlan.medications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No medications added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {treatmentPlan.medications.map((med, index) => (
                        <div key={med.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">Medication #{index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMedication(med.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Medication Name</Label>
                              <Input
                                value={med.name}
                                onChange={(e) => updateMedication(med.id, { name: e.target.value })}
                                placeholder="e.g., Cephalexin"
                              />
                            </div>
                            <div>
                              <Label>Dosage</Label>
                              <Input
                                value={med.dosage}
                                onChange={(e) => updateMedication(med.id, { dosage: e.target.value })}
                                placeholder="e.g., 22mg/kg"
                              />
                            </div>
                            <div>
                              <Label>Route</Label>
                              <Select
                                value={med.route}
                                onValueChange={(value) => updateMedication(med.id, { route: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select route" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PO">PO (By mouth)</SelectItem>
                                  <SelectItem value="SQ">SQ (Subcutaneous)</SelectItem>
                                  <SelectItem value="IM">IM (Intramuscular)</SelectItem>
                                  <SelectItem value="IV">IV (Intravenous)</SelectItem>
                                  <SelectItem value="Topical">Topical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Frequency</Label>
                              <Select
                                value={med.frequency}
                                onValueChange={(value) => updateMedication(med.id, { frequency: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SID">SID (Once daily)</SelectItem>
                                  <SelectItem value="BID">BID (Twice daily)</SelectItem>
                                  <SelectItem value="TID">TID (Three times daily)</SelectItem>
                                  <SelectItem value="QID">QID (Four times daily)</SelectItem>
                                  <SelectItem value="PRN">PRN (As needed)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label>Duration</Label>
                              <Input
                                value={med.duration}
                                onChange={(e) => updateMedication(med.id, { duration: e.target.value })}
                                placeholder="e.g., 7 days"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Special Instructions</Label>
                            <Textarea
                              value={med.instructions}
                              onChange={(e) => updateMedication(med.id, { instructions: e.target.value })}
                              placeholder="e.g., Give with food, monitor for GI upset"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="procedures" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Procedures & Diagnostics</span>
                    <Button onClick={() => addProcedure()} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Procedure
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Add Common Procedures */}
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-2">Quick add common procedures:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {commonProcedures.map((proc, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="justify-between"
                          onClick={() => addProcedure(proc)}
                        >
                          <span>{proc.name}</span>
                          <span className="text-gray-500">${proc.cost}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Procedures List */}
                  {treatmentPlan.procedures.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No procedures added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {treatmentPlan.procedures.map((proc, index) => (
                        <div key={proc.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">Procedure #{index + 1}</h4>
                              <Badge variant={getPriorityColor(proc.priority)}>
                                {proc.priority}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProcedure(proc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Procedure Name</Label>
                              <Input
                                value={proc.name}
                                onChange={(e) => updateProcedure(proc.id, { name: e.target.value })}
                                placeholder="e.g., Radiographs"
                              />
                            </div>
                            <div>
                              <Label>Estimated Cost ($)</Label>
                              <Input
                                value={proc.estimatedCost}
                                onChange={(e) => updateProcedure(proc.id, { estimatedCost: e.target.value })}
                                placeholder="e.g., 150-250"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Priority</Label>
                              <Select
                                value={proc.priority}
                                onValueChange={(value) => updateProcedure(proc.id, { priority: value as Procedure['priority'] })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                  <SelectItem value="routine">Routine</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Description/Notes</Label>
                            <Textarea
                              value={proc.description}
                              onChange={(e) => updateProcedure(proc.id, { description: e.target.value })}
                              placeholder="e.g., 2-view chest radiographs to rule out pneumonia"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discharge Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={treatmentPlan.dischargeInstructions}
                      onChange={(e) => setTreatmentPlan(prev => ({ ...prev, dischargeInstructions: e.target.value }))}
                      placeholder="Enter discharge instructions for the owner..."
                      rows={6}
                    />
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">Common instructions:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">Rest & restrict activity</Button>
                        <Button variant="outline" size="sm">Monitor appetite</Button>
                        <Button variant="outline" size="sm">E-collar at all times</Button>
                        <Button variant="outline" size="sm">Keep incision dry</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={treatmentPlan.followUpInstructions}
                      onChange={(e) => setTreatmentPlan(prev => ({ ...prev, followUpInstructions: e.target.value }))}
                      placeholder="Enter any additional educational information or warning signs to watch for..."
                      rows={6}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="followup" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Follow-up Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Recommended Follow-up Date</Label>
                    <Input
                      type="date"
                      value={treatmentPlan.followUpDate}
                      onChange={(e) => setTreatmentPlan(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="max-w-xs"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      The owner will receive a reminder 24 hours before the scheduled follow-up date.
                    </AlertDescription>
                  </Alert>

                  <div className="pt-4">
                    <Label>When to return sooner:</Label>
                    <div className="mt-2 space-y-2">
                      {[
                        'Worsening symptoms',
                        'Not eating for >24 hours',
                        'Lethargy or depression',
                        'Vomiting or diarrhea',
                        'Difficulty breathing',
                        'Signs of pain despite medication'
                      ].map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Notes
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button onClick={handleSave}>
                <Send className="mr-2 h-4 w-4" />
                Finalize & Send to Owner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}