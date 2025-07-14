'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Lock,
  PlayCircle,
  Shield,
  Star,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useVetAuth } from '@/context/VetAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'interactive' | 'document';
  role: 'vet_tech' | 'vet' | 'admin' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed?: boolean;
  progress?: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'text' | 'quiz';
  completed?: boolean;
}

const trainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Getting Started with EmergencyVet',
    description: 'Learn the basics of navigating and using the EmergencyVet platform',
    duration: 30,
    type: 'interactive',
    role: 'all',
    difficulty: 'beginner',
    lessons: [
      { id: '1-1', title: 'Platform Overview', duration: 5, type: 'video' },
      { id: '1-2', title: 'Navigation Basics', duration: 10, type: 'text' },
      { id: '1-3', title: 'Your First Patient', duration: 10, type: 'video' },
      { id: '1-4', title: 'Knowledge Check', duration: 5, type: 'quiz' },
    ],
  },
  {
    id: '2',
    title: 'Patient Intake Mastery',
    description: 'Master the patient intake process from check-in to triage',
    duration: 45,
    type: 'interactive',
    role: 'vet_tech',
    difficulty: 'intermediate',
    lessons: [
      { id: '2-1', title: 'Creating Patient Profiles', duration: 10, type: 'video' },
      { id: '2-2', title: 'Recording Vitals Accurately', duration: 15, type: 'video' },
      { id: '2-3', title: 'Triage Best Practices', duration: 10, type: 'text' },
      { id: '2-4', title: 'Hands-on Practice', duration: 10, type: 'quiz' },
    ],
  },
  {
    id: '3',
    title: 'Video Consultation Excellence',
    description: 'Learn how to conduct effective video consultations',
    duration: 40,
    type: 'video',
    role: 'vet',
    difficulty: 'intermediate',
    lessons: [
      { id: '3-1', title: 'Pre-consultation Setup', duration: 10, type: 'video' },
      { id: '3-2', title: 'Effective Communication', duration: 15, type: 'video' },
      { id: '3-3', title: 'Remote Examination Techniques', duration: 10, type: 'video' },
      { id: '3-4', title: 'Documentation Best Practices', duration: 5, type: 'text' },
    ],
  },
  {
    id: '4',
    title: 'Admin Dashboard & Analytics',
    description: 'Understand clinic performance metrics and user management',
    duration: 35,
    type: 'interactive',
    role: 'admin',
    difficulty: 'intermediate',
    lessons: [
      { id: '4-1', title: 'Dashboard Overview', duration: 10, type: 'video' },
      { id: '4-2', title: 'Understanding Metrics', duration: 10, type: 'text' },
      { id: '4-3', title: 'User Management', duration: 10, type: 'video' },
      { id: '4-4', title: 'Generating Reports', duration: 5, type: 'text' },
    ],
  },
  {
    id: '5',
    title: 'Emergency Protocols',
    description: 'Critical procedures for handling emergency situations',
    duration: 60,
    type: 'video',
    role: 'all',
    difficulty: 'advanced',
    lessons: [
      { id: '5-1', title: 'Red Triage Cases', duration: 20, type: 'video' },
      { id: '5-2', title: 'Communication Protocols', duration: 15, type: 'text' },
      { id: '5-3', title: 'Documentation Requirements', duration: 15, type: 'video' },
      { id: '5-4', title: 'Case Studies', duration: 10, type: 'quiz' },
    ],
  },
  {
    id: '6',
    title: 'Offline Mode & Sync',
    description: 'Working effectively when internet connectivity is limited',
    duration: 25,
    type: 'interactive',
    role: 'all',
    difficulty: 'beginner',
    lessons: [
      { id: '6-1', title: 'Understanding Offline Mode', duration: 5, type: 'video' },
      { id: '6-2', title: 'Saving Data Offline', duration: 10, type: 'text' },
      { id: '6-3', title: 'Syncing When Online', duration: 5, type: 'video' },
      { id: '6-4', title: 'Troubleshooting', duration: 5, type: 'text' },
    ],
  },
];

const certifications = [
  {
    id: 'basic',
    title: 'EmergencyVet Certified User',
    description: 'Complete all beginner modules',
    icon: Award,
    color: 'bg-green-100 text-green-700',
    requirements: ['1', '6'],
  },
  {
    id: 'tech',
    title: 'Certified Vet Tech Specialist',
    description: 'Master patient intake and triage',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-700',
    requirements: ['1', '2', '5'],
  },
  {
    id: 'vet',
    title: 'Telemedicine Expert',
    description: 'Excel at remote consultations',
    icon: Video,
    color: 'bg-purple-100 text-purple-700',
    requirements: ['1', '3', '5'],
  },
  {
    id: 'admin',
    title: 'Platform Administrator',
    description: 'Master clinic management',
    icon: Shield,
    color: 'bg-orange-100 text-orange-700',
    requirements: ['1', '4'],
  },
];

export default function TrainingCenterScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Mock progress data - in real app would come from database
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({
    '1': 75,
    '2': 30,
    '6': 100,
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>([
    '1-1',
    '1-2',
    '1-3',
    '6-1',
    '6-2',
    '6-3',
    '6-4',
  ]);

  const filteredModules = trainingModules.filter((module) => {
    // Filter by role
    if (module.role !== 'all' && module.role !== user?.role) {
      return false;
    }

    // Filter by completion status
    const progress = moduleProgress[module.id] || 0;
    if (filter === 'completed' && progress !== 100) return false;
    if (filter === 'in-progress' && (progress === 0 || progress === 100)) return false;

    return true;
  });

  const getModuleProgress = (module: TrainingModule) => {
    return moduleProgress[module.id] || 0;
  };

  const getCompletedLessonsCount = (module: TrainingModule) => {
    return module.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  };

  const getTotalTrainingTime = () => {
    return filteredModules.reduce((total, module) => total + module.duration, 0);
  };

  const getCompletedTime = () => {
    return filteredModules.reduce((total, module) => {
      const progress = getModuleProgress(module) / 100;
      return total + module.duration * progress;
    }, 0);
  };

  const checkCertificationProgress = (cert: (typeof certifications)[0]) => {
    const completedRequirements = cert.requirements.filter(
      (reqId) => moduleProgress[reqId] === 100,
    );
    return (completedRequirements.length / cert.requirements.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Training Center</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Build your skills with interactive training
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="border-b bg-white">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((getCompletedTime() / getTotalTrainingTime()) * 100)}%
                  </div>
                  <Progress
                    value={(getCompletedTime() / getTotalTrainingTime()) * 100}
                    className="mt-3"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {Math.round(getCompletedTime())} of {getTotalTrainingTime()} minutes completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Modules Completed</span>
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.values(moduleProgress).filter((p) => p === 100).length} /{' '}
                    {filteredModules.length}
                  </div>
                  <div className="mt-3 flex gap-1">
                    {filteredModules.map((module) => (
                      <div
                        key={module.id}
                        className={`h-2 flex-1 rounded ${
                          getModuleProgress(module) === 100
                            ? 'bg-green-500'
                            : getModuleProgress(module) > 0
                              ? 'bg-yellow-500'
                              : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Milestone</span>
                    <Award className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">EmergencyVet Certified</div>
                  <Progress value={75} className="mt-3" />
                  <p className="mt-2 text-xs text-gray-500">
                    Complete 1 more module to earn certification
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="modules">Training Modules</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-6">
              {/* Filters */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All Modules
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'in-progress' ? 'default' : 'outline'}
                  onClick={() => setFilter('in-progress')}
                >
                  In Progress
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </Button>
              </div>

              {/* Module Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module) => {
                  const progress = getModuleProgress(module);
                  const completedCount = getCompletedLessonsCount(module);
                  const isLocked =
                    module.difficulty === 'advanced' &&
                    Object.values(moduleProgress).filter((p) => p === 100).length < 2;

                  return (
                    <Card
                      key={module.id}
                      className={`cursor-pointer transition-shadow hover:shadow-md ${
                        isLocked ? 'opacity-60' : ''
                      }`}
                      onClick={() => !isLocked && router.push(`/training/module/${module.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          {isLocked && <Lock className="h-5 w-5 text-gray-400" />}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Badge
                            variant="secondary"
                            className={getDifficultyColor(module.difficulty)}
                          >
                            {module.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {module.duration} min
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-sm text-gray-600">{module.description}</p>

                        {progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} />
                            <p className="text-xs text-gray-500">
                              {completedCount} of {module.lessons.length} lessons completed
                            </p>
                          </div>
                        )}

                        {progress === 0 && !isLocked && (
                          <Button className="w-full" size="sm">
                            Start Module
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}

                        {progress === 100 && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {certifications.map((cert) => {
                  const progress = checkCertificationProgress(cert);
                  const Icon = cert.icon;

                  return (
                    <Card key={cert.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-3 ${cert.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{cert.title}</CardTitle>
                            <p className="text-sm text-gray-600">{cert.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Requirements:</p>
                            {cert.requirements.map((reqId) => {
                              const module = trainingModules.find((m) => m.id === reqId);
                              const isCompleted = moduleProgress[reqId] === 100;

                              return (
                                <div key={reqId} className="flex items-center gap-2 text-sm">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                  )}
                                  <span className={isCompleted ? 'text-gray-700' : 'text-gray-500'}>
                                    {module?.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {progress === 100 && (
                            <Button className="w-full" size="sm">
                              <Award className="mr-2 h-4 w-4" />
                              View Certificate
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <FileText className="mb-3 h-8 w-8 text-blue-600" />
                    <h3 className="mb-2 font-semibold">Quick Reference Guide</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Printable PDF with key procedures and shortcuts
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <Video className="mb-3 h-8 w-8 text-purple-600" />
                    <h3 className="mb-2 font-semibold">Video Library</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      All training videos in one place for easy access
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Browse Videos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <Users className="mb-3 h-8 w-8 text-green-600" />
                    <h3 className="mb-2 font-semibold">Practice Scenarios</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Interactive case studies to test your skills
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Training Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Training Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary font-bold text-white">
                          1
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Week 1: Foundation</h4>
                        <p className="text-sm text-gray-600">
                          Complete "Getting Started" and "Offline Mode" modules
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg bg-purple-50 p-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 font-bold text-white">
                          2
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Week 2: Role-Specific Training</h4>
                        <p className="text-sm text-gray-600">
                          Focus on modules specific to your role
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 font-bold text-white">
                          3
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Week 3: Advanced & Emergency</h4>
                        <p className="text-sm text-gray-600">
                          Complete emergency protocols and earn your certification
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
