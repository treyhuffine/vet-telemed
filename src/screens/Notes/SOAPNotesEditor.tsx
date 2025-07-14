'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Save,
  FileText,
  Mic,
  MicOff,
  Clock,
  Check,
  AlertCircle,
  ChevronDown,
  Copy,
  Wand2,
  Stethoscope,
  Heart,
  Pill,
  Syringe
} from 'lucide-react';
import { mockCases, mockPets, mockOwners, mockVitals } from '@/constants/mocks';
import { formatDistanceToNow } from 'date-fns';

interface SOAPNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  content: Partial<SOAPNotes>;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Gastroenteritis',
    category: 'GI',
    content: {
      subjective: 'Owner reports patient has been vomiting [frequency] times over the past [duration]. Last normal bowel movement was [time]. Appetite is [decreased/absent]. No known dietary indiscretion.',
      objective: 'Patient appears [bright/quiet/depressed]. Mucous membranes are [pink/pale/tacky]. CRT [<2/>2] seconds. Abdominal palpation reveals [findings]. No signs of bloat or obstruction.',
      assessment: 'Acute gastroenteritis, likely dietary indiscretion vs infectious etiology. No evidence of obstruction or systemic illness at this time.',
      plan: '1. Maropitant 1mg/kg SQ\n2. Fluid therapy - LRS 60ml/kg/day\n3. NPO for 12 hours, then bland diet\n4. Probiotics daily\n5. Recheck if no improvement in 24-48 hours'
    }
  },
  {
    id: '2',
    name: 'Respiratory Distress',
    category: 'Respiratory',
    content: {
      subjective: 'Owner reports increased respiratory effort starting [duration] ago. [Coughing/No coughing] noted. Exercise tolerance [decreased/normal]. No known trauma.',
      objective: 'Patient showing [increased respiratory effort/normal breathing]. RR [value] bpm. Lung sounds [clear/crackles/wheezes] bilaterally. Heart rate [value] bpm, rhythm [regular/irregular]. SpO2 [value]%.',
      assessment: 'Respiratory distress - differential diagnoses include [pneumonia/CHF/asthma/other]. Further diagnostics recommended.',
      plan: '1. Oxygen supplementation via [method]\n2. Chest radiographs - 3 view\n3. CBC/Chemistry panel\n4. Consider furosemide 2mg/kg if CHF suspected\n5. Continuous monitoring of vitals'
    }
  },
  {
    id: '3',
    name: 'Laceration',
    category: 'Wound',
    content: {
      subjective: 'Owner reports patient sustained laceration to [location] approximately [time] ago. Bleeding [controlled/ongoing]. Patient [is/is not] current on rabies vaccination.',
      objective: '[Length]cm laceration to [location], [superficial/deep/full thickness]. [Active bleeding/No active bleeding]. Wound edges [clean/contaminated]. No evidence of underlying structure damage.',
      assessment: '[Superficial/Deep] laceration requiring [sutures/staples/tissue adhesive]. No evidence of major vessel or nerve damage.',
      plan: '1. Clip and clean wound with dilute betadine\n2. Local block with lidocaine\n3. Closure with [sutures/staples]\n4. Cephalexin 22mg/kg PO BID x 7 days\n5. E-collar to prevent self-trauma\n6. Recheck and suture removal in 10-14 days'
    }
  }
];

export default function SOAPNotesEditorScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<SOAPNotes>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [activeSection, setActiveSection] = useState<keyof SOAPNotes>('subjective');
  const [isRecording, setIsRecording] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Mock data
  const caseData = mockCases[1];
  const pet = mockPets.find(p => p.id === caseData.petId)!;
  const owner = mockOwners.find(o => o.id === pet.ownerId)!;
  const vitals = mockVitals.find(v => v.caseId === caseData.id)!;

  // Auto-save functionality
  useEffect(() => {
    const hasContent = Object.values(notes).some(section => section.trim() !== '');
    if (!hasContent) return;

    const saveTimer = setTimeout(() => {
      setAutoSaving(true);
      // Simulate save
      setTimeout(() => {
        setAutoSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [notes]);

  // Pre-populate objective section with vitals
  useEffect(() => {
    if (vitals && !notes.objective) {
      const temp = vitals.temperatureCelsius ? `T: ${(vitals.temperatureCelsius * 9/5 + 32).toFixed(1)}°F` : '';
      const hr = vitals.heartRate ? `HR: ${vitals.heartRate} bpm` : '';
      const rr = vitals.respiratoryRate ? `RR: ${vitals.respiratoryRate} /min` : '';
      const mm = vitals.mucousMembraneColor ? `MM: ${vitals.mucousMembraneColor}` : '';
      const crt = vitals.capillaryRefillTime ? `CRT: ${vitals.capillaryRefillTime}s` : '';
      
      const vitalsList = [temp, hr, rr, mm, crt].filter(v => v).join(', ');
      
      if (vitalsList) {
        setNotes(prev => ({
          ...prev,
          objective: `Vitals: ${vitalsList}\n\n${vitals.notes || ''}`
        }));
      }
    }
  }, [vitals]);

  const handleTemplateSelect = (template: Template) => {
    setNotes(prev => ({
      subjective: template.content.subjective || prev.subjective,
      objective: template.content.objective || prev.objective,
      assessment: template.content.assessment || prev.assessment,
      plan: template.content.plan || prev.plan,
    }));
    setShowTemplates(false);
    setSelectedTemplate(template.id);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In real app, would integrate with speech-to-text API
  };

  const handleSave = () => {
    // In real app, would save to database
    router.push(`/case/${caseData.id}/treatment-plan`);
  };

  const getSectionIcon = (section: keyof SOAPNotes) => {
    switch (section) {
      case 'subjective': return <Heart className="h-4 w-4" />;
      case 'objective': return <Stethoscope className="h-4 w-4" />;
      case 'assessment': return <AlertCircle className="h-4 w-4" />;
      case 'plan': return <Pill className="h-4 w-4" />;
    }
  };

  const getSectionDescription = (section: keyof SOAPNotes) => {
    switch (section) {
      case 'subjective': return "Owner's observations and patient history";
      case 'objective': return "Clinical findings and examination results";
      case 'assessment': return "Diagnosis and clinical impressions";
      case 'plan': return "Treatment plan and recommendations";
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
                <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {pet.name} • {caseData.chiefConcern} • Case #{caseData.id.slice(-6)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastSaved && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                </div>
              )}
              {autoSaving && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              )}
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
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Templates
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Dictation
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Assist
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Previous
            </Button>
          </div>

          {/* Templates Dropdown */}
          {showTemplates && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SOAP Notes Editor */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as keyof SOAPNotes)}>
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none h-auto p-0">
                    {(['subjective', 'objective', 'assessment', 'plan'] as const).map((section) => (
                      <TabsTrigger
                        key={section}
                        value={section}
                        className="rounded-none border-r last:border-r-0 data-[state=active]:bg-blue-50 px-6 py-4"
                      >
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section)}
                          <span className="capitalize">{section}</span>
                          {notes[section] && (
                            <Badge variant="secondary" className="ml-2">
                              {notes[section].length} chars
                            </Badge>
                          )}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {(['subjective', 'objective', 'assessment', 'plan'] as const).map((section) => (
                  <TabsContent key={section} value={section} className="p-6 m-0">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-lg font-medium capitalize">{section}</Label>
                        <p className="text-sm text-gray-600 mt-1">{getSectionDescription(section)}</p>
                      </div>
                      
                      <Textarea
                        value={notes[section]}
                        onChange={(e) => setNotes({ ...notes, [section]: e.target.value })}
                        placeholder={`Enter ${section} findings...`}
                        className="min-h-[300px] text-base"
                      />

                      {section === 'plan' && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Remember to include: medications with dosing, follow-up instructions, and client education
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Consultation
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button onClick={handleSave}>
                Save & Create Treatment Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}