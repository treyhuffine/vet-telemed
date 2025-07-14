'use client';

import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertCircle,
  Clock,
  Heart,
  Plus,
  RefreshCw,
  Search,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { mockOwners, mockPets, mockVitals } from '@/constants/mocks';
import { safeAsync } from '@/lib/error-handling';
import { useRealtimeQueue } from '@/hooks/useRealtimeQueue';
import ErrorDisplay from '@/components/ErrorDisplay/ErrorDisplay';
import { CardSkeleton } from '@/components/LoadingStates/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function VetTechDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { cases, isConnected, lastUpdate, refresh, isLoading, error } = useRealtimeQueue();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force re-render every minute to update wait times
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((n) => n + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    await safeAsync(
      async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 500);
      },
      {
        onError: () => setIsRefreshing(false),
      },
    );
  };

  const navigateToNewPatient = () => {
    safeAsync(async () => {
      await router.push('/intake/new');
    });
  };

  const navigateToSearch = () => {
    safeAsync(async () => {
      await router.push('/search/patient');
    });
  };

  const navigateToCase = (caseId: string) => {
    safeAsync(async () => {
      await router.push(`/case/${caseId}`);
    });
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTriageTextColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'text-red-700 bg-red-100';
      case 'yellow':
        return 'text-yellow-700 bg-yellow-100';
      case 'green':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Waiting</Badge>;
      case 'ready':
        return <Badge variant="default">Ready</Badge>;
      case 'in_consult':
        return (
          <Badge variant="default" className="bg-primary">
            In Consult
          </Badge>
        );
      case 'complete':
        return <Badge variant="outline">Complete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeCases = cases.filter((c) => c.status !== 'complete' && c.status !== 'cancelled');
  const redCases = activeCases.filter((c) => c.triageLevel === 'red');
  const yellowCases = activeCases.filter((c) => c.triageLevel === 'yellow');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emergency Queue</h1>
              <div className="mt-1 flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Active Cases: {activeCases.length}
                  {redCases.length > 0 && (
                    <span className="ml-3 font-medium text-red-600">
                      🔴 {redCases.length} Critical
                    </span>
                  )}
                  {yellowCases.length > 0 && (
                    <span className="ml-3 font-medium text-yellow-600">
                      🟡 {yellowCases.length} Urgent
                    </span>
                  )}
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
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh queue"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search patient..."
                  className="w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="bg-primary hover:bg-blue-700"
                onClick={navigateToNewPatient}
              >
                <Plus className="mr-2 h-5 w-5" />
                New Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            variant="outline"
            size="lg"
            className="h-24 text-lg font-medium"
            onClick={navigateToSearch}
          >
            <Search className="mr-3 h-6 w-6" />
            Find Existing Patient
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-24 text-lg font-medium"
            onClick={navigateToNewPatient}
          >
            <Plus className="mr-3 h-6 w-6" />
            New Patient Check-In
          </Button>
        </div>

        {/* Active Cases */}
        {error ? (
          <ErrorDisplay error={error} onRetry={refresh} className="mt-6" />
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activeCases.map((caseData) => {
              const pet = mockPets.find((p) => p.id === caseData.petId);
              const owner = pet ? mockOwners.find((o) => o.id === pet.ownerId) : null;
              const vitals = mockVitals.find((v) => v.caseId === caseData.id);
              const waitTime = formatDistanceToNow(caseData.createdAt, {
                addSuffix: false,
              });

              return (
                <Card
                  key={caseData.id}
                  className={`cursor-pointer transition-shadow hover:shadow-lg ${
                    caseData.triageLevel === 'red' ? 'border-2 border-red-500' : ''
                  }`}
                  onClick={() => navigateToCase(caseData.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-4">
                          <div
                            className={`h-4 w-4 rounded-full ${getTriageColor(caseData.triageLevel)}`}
                          />
                          <h3 className="text-xl font-semibold">
                            {pet?.name} - {pet?.species}, {pet?.breed}
                          </h3>
                          {getStatusBadge(caseData.status)}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              <User className="mr-1 inline h-4 w-4" />
                              Owner: {owner?.firstName} {owner?.lastName}
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {caseData.chiefComplaint}
                            </p>
                          </div>

                          {vitals && (
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-gray-700">Latest Vitals:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {vitals.temperatureCelsius && (
                                  <span>
                                    Temp: {((vitals.temperatureCelsius * 9) / 5 + 32).toFixed(1)}°F
                                  </span>
                                )}
                                {vitals.heartRate && <span>HR: {vitals.heartRate} bpm</span>}
                                {vitals.respiratoryRate && (
                                  <span>RR: {vitals.respiratoryRate}</span>
                                )}
                                {vitals.painScale !== undefined && (
                                  <span>Pain: {vitals.painScale}/10</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="mb-2 flex items-center text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="font-medium">{waitTime}</span>
                        </div>
                        {caseData.status === 'waiting' && caseData.queuePosition && (
                          <div
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getTriageTextColor(caseData.triageLevel)}`}
                          >
                            #{caseData.queuePosition} in queue
                          </div>
                        )}
                        {caseData.status === 'in_consult' && (
                          <Button size="sm" className="bg-primary hover:bg-blue-700">
                            Join Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!error && !isLoading && activeCases.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <Activity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No Active Cases</h3>
              <p className="text-gray-600">All patients have been seen or the queue is empty.</p>
              <Button className="mt-4" onClick={navigateToNewPatient}>
                Check In New Patient
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
