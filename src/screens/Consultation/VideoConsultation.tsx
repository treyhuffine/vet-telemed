'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText,
  Heart,
  Thermometer,
  Wind,
  Clock,
  AlertCircle,
  Check,
  Camera,
  Plus,
  Save,
  ChevronLeft
} from 'lucide-react';
import { useDemoData } from '@/context/DemoData';
import { useVetAuth } from '@/context/VetAuth';
import SimulatedVideoCall from '@/components/VideoCall/SimulatedVideoCall';
import { toast } from 'sonner';

interface QuickNote {
  id: string;
  timestamp: Date;
  text: string;
}

interface ExamChecklist {
  id: string;
  category: string;
  items: Array<{
    id: string;
    label: string;
    checked: boolean;
    findings?: string;
  }>;
}

export default function VideoConsultationScreen() {
  const router = useRouter();
  const { caseId } = router.query;
  const { user } = useVetAuth();
  const { getCase, updateCase } = useDemoData();
  
  const [showVideo, setShowVideo] = useState(true);
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  
  const [examChecklist, setExamChecklist] = useState<ExamChecklist[]>([
    {
      id: 'general',
      category: 'General Appearance',
      items: [
        { id: 'alert', label: 'Alert & Responsive', checked: false },
        { id: 'posture', label: 'Normal Posture', checked: false },
        { id: 'gait', label: 'Normal Gait', checked: false },
        { id: 'breathing', label: 'Normal Breathing', checked: false },
      ]
    },
    {
      id: 'head',
      category: 'Head & Neck',
      items: [
        { id: 'eyes', label: 'Eyes Clear', checked: false },
        { id: 'ears', label: 'Ears Clean', checked: false },
        { id: 'nose', label: 'Nose Normal', checked: false },
        { id: 'mouth', label: 'Oral Cavity Normal', checked: false },
      ]
    },
    {
      id: 'body',
      category: 'Body Systems',
      items: [
        { id: 'heart', label: 'Heart Sounds Normal', checked: false },
        { id: 'lungs', label: 'Lung Sounds Clear', checked: false },
        { id: 'abdomen', label: 'Abdomen Soft', checked: false },
        { id: 'skin', label: 'Skin & Coat Normal', checked: false },
      ]
    }
  ]);

  const caseData = getCase(caseId as string);

  useEffect(() => {
    if (caseData) {
      // Pre-fill SOAP notes with initial data
      setSoapNotes({
        subjective: `Owner reports: ${caseData.chiefComplaint}`,
        objective: `T: ${caseData.vitals.temperature}°F, HR: ${caseData.vitals.heartRate} bpm, RR: ${caseData.vitals.respiratoryRate} rpm`,
        assessment: '',
        plan: ''
      });
    }
  }, [caseData]);

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Case not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const addQuickNote = () => {
    if (currentNote.trim()) {
      const newNote: QuickNote = {
        id: Date.now().toString(),
        timestamp: new Date(),
        text: currentNote
      };
      setQuickNotes([...quickNotes, newNote]);
      setCurrentNote('');
      toast.success('Note added');
    }
  };

  const updateChecklistItem = (categoryId: string, itemId: string, checked: boolean) => {
    setExamChecklist(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, checked } : item
          )
        };
      }
      return category;
    }));
  };

  const saveConsultation = () => {
    // Update case with notes
    updateCase(caseData.id, {
      notes: JSON.stringify({
        soap: soapNotes,
        quickNotes,
        examChecklist
      }),
      status: 'completed'
    });
    
    toast.success('Consultation saved successfully');
    router.push('/dashboard');
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (showVideo) {
    return (
      <div className="relative h-screen">
        <SimulatedVideoCall caseId={caseId as string} />
        
        {/* Overlay panel */}
        <div className="absolute top-20 right-4 w-96 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{caseData.petName}</h3>
              <Badge className={getTriageColor(caseData.triageLevel)}>
                {caseData.triageLevel.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{caseData.chiefComplaint}</p>
          </div>
          
          <Tabs defaultValue="vitals" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="checklist">Exam</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vitals" className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="font-semibold">{caseData.vitals.temperature}°F</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="font-semibold">{caseData.vitals.heartRate} bpm</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Resp Rate</p>
                    <p className="font-semibold">{caseData.vitals.respiratoryRate} rpm</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-pink-400" />
                  <div>
                    <p className="text-xs text-gray-500">MM Color</p>
                    <p className="font-semibold">{caseData.vitals.mmColor}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add quick note..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={addQuickNote} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {quickNotes.map(note => (
                      <div key={note.id} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="text-xs text-gray-500">
                          {note.timestamp.toLocaleTimeString()}
                        </p>
                        <p>{note.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="checklist" className="p-4">
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {examChecklist.map(category => (
                    <div key={category.id}>
                      <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                      <div className="space-y-2">
                        {category.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={(checked) => 
                                updateChecklistItem(category.id, item.id, checked as boolean)
                              }
                            />
                            <label className="text-sm">{item.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 border-t">
            <Button 
              onClick={() => setShowVideo(false)} 
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Complete Consultation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full notes view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Consultation Notes</h1>
              <Badge className={getTriageColor(caseData.triageLevel)}>
                {caseData.petName} - {caseData.chiefComplaint}
              </Badge>
            </div>
            <Button onClick={saveConsultation}>
              <Save className="h-4 w-4 mr-2" />
              Save & Complete
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOAP Notes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>SOAP Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subjective</label>
                  <Textarea
                    value={soapNotes.subjective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                    rows={3}
                    placeholder="Owner observations, history..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Objective</label>
                  <Textarea
                    value={soapNotes.objective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                    rows={3}
                    placeholder="Physical exam findings, vitals..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Assessment</label>
                  <Textarea
                    value={soapNotes.assessment}
                    onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                    rows={3}
                    placeholder="Diagnosis, differential diagnoses..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Plan</label>
                  <Textarea
                    value={soapNotes.plan}
                    onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                    rows={3}
                    placeholder="Treatment plan, medications, follow-up..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Notes & Exam Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {quickNotes.map(note => (
                      <div key={note.id} className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">
                          {note.timestamp.toLocaleTimeString()}
                        </p>
                        <p className="text-sm">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Examination Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examChecklist.map(category => {
                    const checkedCount = category.items.filter(item => item.checked).length;
                    const totalCount = category.items.length;
                    
                    return (
                      <div key={category.id}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium">{category.category}</h4>
                          <Badge variant="outline" className="text-xs">
                            {checkedCount}/{totalCount}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {category.items
                            .filter(item => item.checked)
                            .map(item => item.label)
                            .join(', ') || 'No items checked'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}