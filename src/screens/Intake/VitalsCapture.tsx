'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  Clock,
  Heart,
  Plus,
  RefreshCw,
  Save,
  Thermometer,
  WifiOff,
  Wind,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { mockOwners, mockPets } from '@/constants/mocks';
import { TriageLevel } from '@/constants/mocks/cases';
import { useVetAuth } from '@/context/VetAuth';
import { useDemoData } from '@/context/DemoData';
import { useOffline } from '@/hooks/useOffline';
import { useOfflineVitals } from '@/hooks/useOfflineVitals';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface VitalsData {
  temperatureFahrenheit: string;
  heartRate: string;
  respiratoryRate: string;
  mucousMembraneColor: string;
  capillaryRefillTime: string;
  painScale: number;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  weight: string;
  notes: string;
}

interface TriageData {
  level: TriageLevel | '';
  presentingComplaint: string;
  chiefConcern: string;
}

export default function VitalsCaptureScreen() {
  const router = useRouter();
  const { petId } = router.query;
  const { user } = useVetAuth();
  const { isOffline } = useOffline();
  const { saveVitals, isSaving } = useOfflineVitals();
  const { addCase, getPatient } = useDemoData();
  
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [heartRateCounter, setHeartRateCounter] = useState(0);
  const [respiratoryCounter, setRespiratoryCounter] = useState(0);
  const [countingHeart, setCountingHeart] = useState(false);
  const [countingResp, setCountingResp] = useState(false);

  // Get pet data from demo context
  const pet = getPatient(petId as string) || mockPets[0];
  const owner = mockOwners.find((o) => o.id === pet.ownerId);

  const [vitals, setVitals] = useState<VitalsData>({
    temperatureFahrenheit: '',
    heartRate: '',
    respiratoryRate: '',
    mucousMembraneColor: '',
    capillaryRefillTime: '',
    painScale: 0,
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: pet.weight?.toString() || '',
    notes: '',
  });

  const [triage, setTriage] = useState<TriageData>({
    level: '',
    presentingComplaint: '',
    chiefConcern: '',
  });

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.values(vitals).some((v) => v !== '' && v !== 0) || triage.presentingComplaint) {
        setAutoSaving(true);
        // Simulate save
        setTimeout(() => {
          setAutoSaving(false);
          setLastSaved(new Date());
        }, 500);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [vitals, triage]);

  // Heart rate counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countingHeart) {
      interval = setInterval(() => {
        setHeartRateCounter((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countingHeart]);

  // Respiratory rate counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countingResp) {
      interval = setInterval(() => {
        setRespiratoryCounter((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countingResp]);

  const handleStartHeartCount = () => {
    setCountingHeart(true);
    setHeartRateCounter(0);
    
    // Stop after 15 seconds and calculate BPM
    setTimeout(() => {
      setCountingHeart(false);
      const bpm = heartRateCounter * 4; // Convert 15-second count to BPM
      setVitals({ ...vitals, heartRate: bpm.toString() });
    }, 15000);
  };

  const handleStartRespCount = () => {
    setCountingResp(true);
    setRespiratoryCounter(0);
    
    // Stop after 15 seconds and calculate RPM
    setTimeout(() => {
      setCountingResp(false);
      const rpm = respiratoryCounter * 4; // Convert 15-second count to RPM
      setVitals({ ...vitals, respiratoryRate: rpm.toString() });
    }, 15000);
  };

  const getTemperatureStatus = (temp: string) => {
    const tempNum = parseFloat(temp);
    if (isNaN(tempNum)) return null;
    if (tempNum < 100) return { color: 'text-blue-600', status: 'Low' };
    if (tempNum > 102.5) return { color: 'text-red-600', status: 'High' };
    return { color: 'text-green-600', status: 'Normal' };
  };

  const getHeartRateStatus = (hr: string) => {
    const hrNum = parseFloat(hr);
    if (isNaN(hrNum)) return null;
    if (hrNum < 60) return { color: 'text-blue-600', status: 'Low' };
    if (hrNum > 140) return { color: 'text-red-600', status: 'High' };
    return { color: 'text-green-600', status: 'Normal' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!triage.level) {
      toast.error('Please select a triage level');
      return;
    }

    if (!triage.presentingComplaint) {
      toast.error('Please enter presenting complaint');
      return;
    }

    // Create case in demo data
    const newCase = addCase({
      petId: pet.id,
      petName: pet.name,
      ownerName: owner?.name || 'Unknown',
      ownerPhone: owner?.phone || '',
      species: pet.species,
      triageLevel: triage.level as TriageLevel,
      status: 'waiting',
      chiefComplaint: triage.presentingComplaint,
      vitals: {
        temperature: parseFloat(vitals.temperatureFahrenheit) || 0,
        heartRate: parseInt(vitals.heartRate) || 0,
        respiratoryRate: parseInt(vitals.respiratoryRate) || 0,
        weight: parseFloat(vitals.weight) || pet.weight || 0,
        mmColor: vitals.mucousMembraneColor || 'pink',
        crt: vitals.capillaryRefillTime || '<2 seconds',
        painScale: vitals.painScale,
        bloodPressure: vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic 
          ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` 
          : undefined,
      },
      notes: vitals.notes,
    });

    toast.success('Case added to queue');
    router.push('/queue');
  };

  const triageLevels = [
    { value: 'red', label: 'Red - Critical', description: 'Life-threatening, immediate attention' },
    { value: 'yellow', label: 'Yellow - Urgent', description: 'Serious, see within 30 minutes' },
    { value: 'green', label: 'Green - Non-Urgent', description: 'Stable, can wait' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold">Vitals & Intake</h1>
                <p className="text-sm text-gray-600">{pet.name} - {owner?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOffline && (
                <Badge variant="outline" className="gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              )}
              {lastSaved && (
                <Badge variant="outline" className="gap-1 text-green-700">
                  <Check className="h-3 w-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
              {autoSaving && (
                <Badge variant="outline" className="gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Saving...
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={vitals.temperatureFahrenheit}
                    onChange={(e) => setVitals({ ...vitals, temperatureFahrenheit: e.target.value })}
                    className="flex-1"
                  />
                  <Thermometer className="h-5 w-5 text-gray-400" />
                  {getTemperatureStatus(vitals.temperatureFahrenheit) && (
                    <span className={getTemperatureStatus(vitals.temperatureFahrenheit)?.color}>
                      {getTemperatureStatus(vitals.temperatureFahrenheit)?.status}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="heartRate"
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={countingHeart ? 'destructive' : 'outline'}
                    onClick={handleStartHeartCount}
                    disabled={countingHeart}
                  >
                    <Heart className="h-4 w-4" />
                    {countingHeart ? `${heartRateCounter}s` : 'Count'}
                  </Button>
                  {getHeartRateStatus(vitals.heartRate) && (
                    <span className={getHeartRateStatus(vitals.heartRate)?.color}>
                      {getHeartRateStatus(vitals.heartRate)?.status}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="respiratoryRate">Respiratory Rate (RPM)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={countingResp ? 'destructive' : 'outline'}
                    onClick={handleStartRespCount}
                    disabled={countingResp}
                  >
                    <Wind className="h-4 w-4" />
                    {countingResp ? `${respiratoryCounter}s` : 'Count'}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="mmColor">Mucous Membrane Color</Label>
                <Select
                  value={vitals.mucousMembraneColor}
                  onValueChange={(value) => setVitals({ ...vitals, mucousMembraneColor: value })}
                >
                  <SelectTrigger id="mmColor">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pink">Pink (Normal)</SelectItem>
                    <SelectItem value="pale">Pale</SelectItem>
                    <SelectItem value="cyanotic">Blue/Cyanotic</SelectItem>
                    <SelectItem value="jaundiced">Yellow/Jaundiced</SelectItem>
                    <SelectItem value="injected">Red/Injected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="crt">Capillary Refill Time</Label>
                <Select
                  value={vitals.capillaryRefillTime}
                  onValueChange={(value) => setVitals({ ...vitals, capillaryRefillTime: value })}
                >
                  <SelectTrigger id="crt">
                    <SelectValue placeholder="Select CRT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<2 seconds">{"<2 seconds (Normal)"}</SelectItem>
                    <SelectItem value="2-3 seconds">2-3 seconds</SelectItem>
                    <SelectItem value=">3 seconds">{">3 seconds (Prolonged)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="painScale">Pain Scale (0-10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="painScale"
                    min={0}
                    max={10}
                    step={1}
                    value={[vitals.painScale]}
                    onValueChange={(value) => setVitals({ ...vitals, painScale: value[0] })}
                    className="flex-1"
                  />
                  <span className="font-semibold w-8">{vitals.painScale}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="bpSystolic">BP Systolic</Label>
                  <Input
                    id="bpSystolic"
                    type="number"
                    placeholder="120"
                    value={vitals.bloodPressureSystolic}
                    onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bpDiastolic">BP Diastolic</Label>
                  <Input
                    id="bpDiastolic"
                    type="number"
                    placeholder="80"
                    value={vitals.bloodPressureDiastolic}
                    onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Triage and Notes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Triage Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="triageLevel">Triage Level *</Label>
                  <div className="space-y-2 mt-2">
                    {triageLevels.map((level) => (
                      <div
                        key={level.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          triage.level === level.value
                            ? level.value === 'red'
                              ? 'border-red-500 bg-red-50'
                              : level.value === 'yellow'
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setTriage({ ...triage, level: level.value as TriageLevel })}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{level.label}</p>
                            <p className="text-sm text-gray-600">{level.description}</p>
                          </div>
                          {triage.level === level.value && <Check className="h-5 w-5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="complaint">Presenting Complaint *</Label>
                  <Textarea
                    id="complaint"
                    rows={3}
                    value={triage.presentingComplaint}
                    onChange={(e) => setTriage({ ...triage, presentingComplaint: e.target.value })}
                    placeholder="Describe the reason for visit..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="chief">Chief Concern</Label>
                  <Textarea
                    id="chief"
                    rows={2}
                    value={triage.chiefConcern}
                    onChange={(e) => setTriage({ ...triage, chiefConcern: e.target.value })}
                    placeholder="Main concern or symptom..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  value={vitals.notes}
                  onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                  placeholder="Any additional observations or notes..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Take or upload photos of the patient
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add to Queue
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}