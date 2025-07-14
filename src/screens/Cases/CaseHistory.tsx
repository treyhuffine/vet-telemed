'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  Download,
  ChevronRight,
  Dog,
  Cat,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  AlertCircle
} from 'lucide-react';
import { mockCases, mockPets, mockOwners, mockUsers, mockVitals } from '@/constants/mocks';
import { format, subDays, isWithinInterval } from 'date-fns';
import { useVetAuth } from '@/context/VetAuth';
import { Case } from '@/types';

interface FilterOptions {
  dateRange: string;
  species: string;
  triageLevel: string;
  status: string;
  searchQuery: string;
}

export default function CaseHistoryScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [activeTab, setActiveTab] = useState<'my-cases' | 'all-cases'>('my-cases');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '7days',
    species: 'all',
    triageLevel: 'all',
    status: 'all',
    searchQuery: '',
  });

  // Filter cases based on tab and filters
  const getFilteredCases = (): Case[] => {
    let cases = activeTab === 'my-cases' 
      ? mockCases.filter(c => c.assignedVetId === user?.id)
      : mockCases;

    // Apply date range filter
    const now = new Date();
    const dateRanges: { [key: string]: Date } = {
      '7days': subDays(now, 7),
      '30days': subDays(now, 30),
      '90days': subDays(now, 90),
      '1year': subDays(now, 365),
    };

    if (filters.dateRange !== 'all' && dateRanges[filters.dateRange]) {
      cases = cases.filter(c => {
        const caseDate = new Date(c.createdAt);
        return isWithinInterval(caseDate, {
          start: dateRanges[filters.dateRange],
          end: now,
        });
      });
    }

    // Apply species filter
    if (filters.species !== 'all') {
      cases = cases.filter(c => {
        const pet = mockPets.find(p => p.id === c.petId);
        return pet?.species.toLowerCase() === filters.species;
      });
    }

    // Apply triage level filter
    if (filters.triageLevel !== 'all') {
      cases = cases.filter(c => c.triageLevel === filters.triageLevel);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      cases = cases.filter(c => c.status === filters.status);
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      cases = cases.filter(c => {
        const pet = mockPets.find(p => p.id === c.petId);
        const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;
        
        return (
          c.id.toLowerCase().includes(query) ||
          c.chiefComplaint.toLowerCase().includes(query) ||
          pet?.name.toLowerCase().includes(query) ||
          owner?.firstName.toLowerCase().includes(query) ||
          owner?.lastName.toLowerCase().includes(query)
        );
      });
    }

    // Sort by date (newest first)
    return cases.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const filteredCases = getFilteredCases();

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'yellow': return 'bg-yellow-100 text-yellow-700';
      case 'green': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-50">Complete</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPetIcon = (species: string) => {
    return species.toLowerCase() === 'dog' ? Dog : Cat;
  };

  const exportCases = () => {
    console.log('Exporting cases...');
    // In production, this would generate a CSV or PDF
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
                <h1 className="text-2xl font-bold text-gray-900">Case History</h1>
                <p className="text-sm text-gray-600 mt-1">Review past consultations and treatments</p>
              </div>
            </div>
            <Button onClick={exportCases}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="my-cases">My Cases</TabsTrigger>
              <TabsTrigger value="all-cases">All Cases</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <Card className="mt-6 mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by patient, owner, or case ID..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select 
                    value={filters.dateRange} 
                    onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                  >
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.species} 
                    onValueChange={(value) => setFilters({ ...filters, species: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                      <SelectItem value="cat">Cats</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.triageLevel} 
                    onValueChange={(value) => setFilters({ ...filters, triageLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Triage</SelectItem>
                      <SelectItem value="red">Red (Critical)</SelectItem>
                      <SelectItem value="yellow">Yellow (Urgent)</SelectItem>
                      <SelectItem value="green">Green (Non-urgent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Case List */}
            <div className="space-y-4">
              {filteredCases.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredCases.map((caseData) => {
                  const pet = mockPets.find(p => p.id === caseData.petId);
                  const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;
                  const assignedVet = mockUsers.find(u => u.id === caseData.assignedVetId);
                  const vitals = mockVitals.find(v => v.caseId === caseData.id);
                  const PetIcon = pet ? getPetIcon(pet.species) : Dog;

                  return (
                    <Card 
                      key={caseData.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/case/${caseData.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                  <PetIcon className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">
                                    {pet?.name} - {pet?.species}, {pet?.breed}
                                  </h3>
                                  <Badge className={getTriageColor(caseData.triageLevel)}>
                                    {caseData.triageLevel.toUpperCase()}
                                  </Badge>
                                  {getStatusBadge(caseData.status)}
                                </div>
                                <p className="text-sm text-gray-600">
                                  Owner: {owner?.firstName} {owner?.lastName} • Case #{caseData.id}
                                </p>
                              </div>
                            </div>

                            {/* Case Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Chief Complaint</p>
                                <p className="font-medium">{caseData.chiefComplaint}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Veterinarian</p>
                                <p className="font-medium">{assignedVet?.name || 'Not assigned'}</p>
                              </div>
                            </div>

                            {/* Vitals Summary */}
                            {vitals && (
                              <div className="mt-3 flex items-center gap-4 text-sm">
                                {vitals.temperatureCelsius && (
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4 text-gray-400" />
                                    <span>{(vitals.temperatureCelsius * 9/5 + 32).toFixed(1)}°F</span>
                                  </div>
                                )}
                                {vitals.heartRate && (
                                  <div className="flex items-center gap-1">
                                    <Activity className="h-4 w-4 text-gray-400" />
                                    <span>{vitals.heartRate} bpm</span>
                                  </div>
                                )}
                                {vitals.respiratoryRate && (
                                  <div className="flex items-center gap-1">
                                    <Stethoscope className="h-4 w-4 text-gray-400" />
                                    <span>RR: {vitals.respiratoryRate}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Date and Action */}
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-600 mb-2">
                              <p>{format(new Date(caseData.createdAt), 'MMM d, yyyy')}</p>
                              <p>{format(new Date(caseData.createdAt), 'h:mm a')}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Cases</p>
                    <p className="text-2xl font-bold mt-1">{filteredCases.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Critical Cases</p>
                    <p className="text-2xl font-bold mt-1 text-red-600">
                      {filteredCases.filter(c => c.triageLevel === 'red').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {filteredCases.filter(c => c.status === 'complete').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Consult Time</p>
                    <p className="text-2xl font-bold mt-1">12 min</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}