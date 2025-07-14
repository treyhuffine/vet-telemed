'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  Maximize2
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'text' | 'quiz';
  content?: string;
  videoUrl?: string;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const moduleData = {
  id: '1',
  title: 'Getting Started with EmergencyVet',
  description: 'Learn the basics of navigating and using the EmergencyVet platform',
  lessons: [
    {
      id: '1-1',
      title: 'Platform Overview',
      duration: 5,
      type: 'video' as const,
      videoUrl: 'https://example.com/video1.mp4',
      content: 'Welcome to EmergencyVet! This video will give you a comprehensive overview of our platform.',
    },
    {
      id: '1-2',
      title: 'Navigation Basics',
      duration: 10,
      type: 'text' as const,
      content: `
# Navigation Basics

## Main Dashboard
The dashboard is your home base in EmergencyVet. Here you can:
- View the current patient queue
- See active cases
- Access quick actions

## Navigation Menu
The top navigation bar provides access to:
- **Dashboard**: Your main workspace
- **New Patient**: Quick patient intake
- **Search**: Find existing patients
- **Settings**: Configure your preferences

## Key Shortcuts
- **Ctrl/Cmd + N**: New patient
- **Ctrl/Cmd + F**: Search
- **Ctrl/Cmd + S**: Save current work

## Tips for Efficient Navigation
1. Use the breadcrumb navigation to quickly move between sections
2. Pin frequently used pages to your browser bookmarks
3. Use keyboard shortcuts for common actions
      `,
    },
    {
      id: '1-3',
      title: 'Your First Patient',
      duration: 10,
      type: 'video' as const,
      videoUrl: 'https://example.com/video2.mp4',
      content: 'Follow along as we walk through creating your first patient profile and recording vitals.',
    },
    {
      id: '1-4',
      title: 'Knowledge Check',
      duration: 5,
      type: 'quiz' as const,
      questions: [
        {
          id: 'q1',
          question: 'What is the keyboard shortcut for creating a new patient?',
          options: [
            'Ctrl/Cmd + P',
            'Ctrl/Cmd + N',
            'Ctrl/Cmd + Enter',
            'Ctrl/Cmd + Shift + N',
          ],
          correctAnswer: 1,
          explanation: 'Ctrl/Cmd + N is the shortcut for creating a new patient, following common application conventions.',
        },
        {
          id: 'q2',
          question: 'Where can you view the current patient queue?',
          options: [
            'Settings page',
            'Profile page',
            'Dashboard',
            'Help center',
          ],
          correctAnswer: 2,
          explanation: 'The Dashboard is your main workspace where you can view the current patient queue and active cases.',
        },
        {
          id: 'q3',
          question: 'Which of the following is NOT a main navigation item?',
          options: [
            'Dashboard',
            'New Patient',
            'Reports',
            'Search',
          ],
          correctAnswer: 2,
          explanation: 'Reports are accessed through the Admin section, not the main navigation.',
        },
      ],
    },
  ],
};

export default function TrainingModuleScreen() {
  const router = useRouter();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [notes, setNotes] = useState('');

  const currentLesson = moduleData.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === moduleData.lessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  useEffect(() => {
    // Simulate video progress
    if (currentLesson.type === 'video' && isPlaying) {
      const interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentLesson.type, isPlaying]);

  const handleLessonComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }

    if (!isLastLesson) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setVideoProgress(0);
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
  };

  const calculateQuizScore = () => {
    if (!currentLesson.questions) return 0;
    
    const correctAnswers = currentLesson.questions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    
    return (correctAnswers / currentLesson.questions.length) * 100;
  };

  const getProgressPercentage = () => {
    return Math.round(((completedLessons.length + 1) / moduleData.lessons.length) * 100);
  };

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-12 w-12" />
                  ) : (
                    <PlayCircle className="h-12 w-12" />
                  )}
                </Button>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <Progress value={videoProgress} className="mb-2" />
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm">
                      {Math.floor((videoProgress / 100) * currentLesson.duration)}:00 / {currentLesson.duration}:00
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">{currentLesson.content}</p>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="prose prose-blue max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: currentLesson.content?.replace(/\n/g, '<br>') || '' }}
              className="space-y-4"
            />
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            {currentLesson.questions?.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                      {index + 1}
                    </span>
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={quizAnswers[question.id]?.toString()}
                    onValueChange={(value) => 
                      setQuizAnswers({ ...quizAnswers, [question.id]: parseInt(value) })
                    }
                    disabled={showQuizResults}
                  >
                    {question.options.map((option, optionIndex) => {
                      const isSelected = quizAnswers[question.id] === optionIndex;
                      const isCorrect = question.correctAnswer === optionIndex;
                      const showResult = showQuizResults;

                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-50 border border-green-200'
                                : isSelected
                                ? 'bg-red-50 border border-red-200'
                                : ''
                              : isSelected
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <RadioGroupItem 
                            value={optionIndex.toString()} 
                            id={`${question.id}-${optionIndex}`}
                          />
                          <Label 
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                          {showResult && (
                            <>
                              {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                              {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                  
                  {showQuizResults && quizAnswers[question.id] !== question.correctAnswer && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {!showQuizResults && (
              <Button 
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== currentLesson.questions?.length}
                className="w-full"
              >
                Submit Quiz
              </Button>
            )}

            {showQuizResults && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">
                      {calculateQuizScore()}%
                    </div>
                    <p className="text-blue-600 mb-4">
                      {calculateQuizScore() >= 80 ? 'Great job!' : 'Keep practicing!'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setQuizAnswers({});
                          setShowQuizResults(false);
                        }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retry Quiz
                      </Button>
                      {calculateQuizScore() >= 80 && (
                        <Button onClick={handleLessonComplete}>
                          Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
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
                onClick={() => router.push('/training')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{moduleData.title}</h1>
                <p className="text-sm text-gray-600 mt-1">{moduleData.description}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              <Clock className="mr-1 h-3 w-3" />
              {moduleData.lessons.reduce((acc, l) => acc + l.duration, 0)} min total
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Module Progress</span>
              <span className="text-sm font-medium">{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex items-center gap-2 mt-3">
              {moduleData.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLessonIndex(index);
                    setVideoProgress(0);
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    completedLessons.includes(lesson.id)
                      ? 'bg-green-500'
                      : index === currentLessonIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lesson Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {currentLesson.type === 'video' && <PlayCircle className="h-5 w-5" />}
                      {currentLesson.type === 'text' && <FileText className="h-5 w-5" />}
                      {currentLesson.type === 'quiz' && <HelpCircle className="h-5 w-5" />}
                      {currentLesson.title}
                    </CardTitle>
                    <Badge>
                      Lesson {currentLessonIndex + 1} of {moduleData.lessons.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderLessonContent()}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentLessonIndex(currentLessonIndex - 1);
                    setVideoProgress(0);
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  disabled={isFirstLesson}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>

                {currentLesson.type !== 'quiz' && (
                  <Button
                    onClick={handleLessonComplete}
                    disabled={currentLesson.type === 'video' && videoProgress < 90}
                  >
                    {isLastLesson ? 'Complete Module' : 'Next Lesson'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lesson Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {moduleData.lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setCurrentLessonIndex(index);
                          setVideoProgress(0);
                          setQuizAnswers({});
                          setShowQuizResults(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                          index === currentLessonIndex
                            ? 'bg-blue-50 border border-blue-200'
                            : completedLessons.includes(lesson.id)
                            ? 'bg-green-50 hover:bg-green-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {completedLessons.includes(lesson.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : index === currentLessonIndex ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-600">{lesson.duration} min</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Take notes while learning..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                  />
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Certificate Preview */}
              {completedLessons.length === moduleData.lessons.length && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Module Complete!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You've successfully completed this training module
                    </p>
                    <Button className="w-full">
                      View Certificate
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}