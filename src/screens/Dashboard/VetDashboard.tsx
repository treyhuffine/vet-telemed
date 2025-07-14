'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Video,
  Clock,
  Activity,
  User,
  FileText,
  AlertCircle,
  TrendingUp,
  Heart,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { mockPets, mockOwners, mockVitals } from '@/constants/mocks';
import { formatDistanceToNow, format } from 'date-fns';
import { useVetAuth } from '@/context/VetAuth';
import { useRealtimeQueue, useRealtimeNotifications } from '@/hooks/useRealtimeQueue';

export default function VetDashboard() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const { cases, isConnected, lastUpdate, refresh } = useRealtimeQueue();
  const { notifications, unreadCount } = useRealtimeNotifications(user?.id || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force re-render every minute to update wait times
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(n => n + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const waitingCases = cases.filter(c => c.status === 'waiting');
  const myCases = cases.filter(c => c.assignedVetId === user?.id);
  const completedToday = cases.filter(c => 
    c.status === 'completed' && 
    c.consultationEndTime && 
    c.consultationEndTime.toDateString() === new Date().toDateString()
  ).length;

  const prioritizedCases = [...waitingCases].sort((a, b) => {
    // Sort by triage level first
    const triageOrder = { red: 0, yellow: 1, green: 2 };
    const triageDiff = triageOrder[a.triageLevel] - triageOrder[b.triageLevel];
    if (triageDiff !== 0) return triageDiff;
    
    // Then by wait time
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const nextCase = prioritizedCases[0];

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const startConsultation = (caseId: string) => {
    // In real app, this would update the case status and generate video room
    router.push(`/consultation/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Veterinarian Dashboard</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-red-500" />
                      <span>Offline</span>
                    </>
                  )}
                  <span>• Updated {format(lastUpdate, 'h:mm a')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh queue"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Available</span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Cases Today</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Queue</span>
                  <Badge variant="secondary">{waitingCases.length} waiting</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextCase ? (
                  <div className="space-y-4">
                    {/* Next Case Highlight */}
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Next Case</h3>
                        <Button onClick={() => startConsultation(nextCase.id)}>
                          <Video className="mr-2 h-4 w-4" />
                          Start Consultation
                        </Button>
                      </div>
                      {(() => {
                        const pet = mockPets.find(p => p.id === nextCase.petId);
                        const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;
                        const vitals = mockVitals.find(v => v.caseId === nextCase.id);
                        const waitTime = formatDistanceToNow(nextCase.createdAt, { addSuffix: false });

                        return (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getTriageColor(nextCase.triageLevel)}`} />
                              <span className="font-medium">
                                {pet?.name} - {pet?.species}, {pet?.breed}
                              </span>
                              <Badge variant="outline" className="ml-auto">
                                <Clock className="mr-1 h-3 w-3" />
                                {waitTime}
                              </Badge>
                            </div>
                            <p className="text-gray-700">{nextCase.chiefComplaint}</p>
                            {vitals && (
                              <div className="text-sm text-gray-600">
                                Vitals: Temp {(vitals.temperatureCelsius! * 9/5 + 32).toFixed(1)}°F, 
                                HR {vitals.heartRate}, RR {vitals.respiratoryRate}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Other Waiting Cases */}
                    {prioritizedCases.slice(1).map((caseData) => {
                      const pet = mockPets.find(p => p.id === caseData.petId);
                      const waitTime = formatDistanceToNow(caseData.createdAt, { addSuffix: false });

                      return (
                        <div key={caseData.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getTriageColor(caseData.triageLevel)}`} />
                            <div>
                              <p className="font-medium">{pet?.name}</p>
                              <p className="text-sm text-gray-600">{caseData.chiefComplaint}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{waitTime}</p>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => router.push(`/case/${caseData.id}/preview`)}
                            >
                              Preview
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cases waiting</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Active Cases */}
            {myCases.filter(c => c.status === 'in_consultation').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Active Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  {myCases.filter(c => c.status === 'in_consultation').map((caseData) => {
                    const pet = mockPets.find(p => p.id === caseData.petId);
                    const consultTime = caseData.consultationStartTime 
                      ? formatDistanceToNow(caseData.consultationStartTime, { addSuffix: false })
                      : '';

                    return (
                      <div key={caseData.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">{pet?.name}</p>
                          <p className="text-sm text-gray-600">In consultation for {consultTime}</p>
                        </div>
                        <Button onClick={() => router.push(`/consultation/${caseData.id}`)}>
                          Resume Call
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cases Completed</span>
                  <span className="text-2xl font-bold">{completedToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Consult Time</span>
                  <span className="text-lg font-medium">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Queue Status</span>
                  <div className="flex items-center gap-2">
                    {waitingCases.filter(c => c.triageLevel === 'red').length > 0 && (
                      <Badge variant="destructive">
                        {waitingCases.filter(c => c.triageLevel === 'red').length} Critical
                      </Badge>
                    )}
                    {waitingCases.filter(c => c.triageLevel === 'yellow').length > 0 && (
                      <Badge className="bg-yellow-500">
                        {waitingCases.filter(c => c.triageLevel === 'yellow').length} Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/cases/completed')}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Completed Cases
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/templates')}>
                  <Heart className="mr-2 h-4 w-4" />
                  Treatment Templates
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/analytics')}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}