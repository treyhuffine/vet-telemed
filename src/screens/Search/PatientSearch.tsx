'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  Clock,
  Filter,
  ChevronRight,
  AlertCircle,
  Plus
} from 'lucide-react';
import { mockCases } from '@/constants/mocks';
import { formatDistanceToNow } from 'date-fns';
import { useDemoData } from '@/context/DemoData';

interface SearchResult {
  type: 'pet' | 'owner';
  data: any;
  matchedOn: string[];
}

export default function PatientSearchScreen() {
  const router = useRouter();
  const { patients, owners } = useDemoData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'pet' | 'owner'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Perform search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      performSearch();
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchType]);

  const performSearch = () => {
    const term = searchTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search pets
    if (searchType === 'all' || searchType === 'pet') {
      patients.forEach(pet => {
        const matchedOn: string[] = [];
        
        if (pet.name.toLowerCase().includes(term)) matchedOn.push('name');
        if (pet.microchipId?.toLowerCase().includes(term)) matchedOn.push('microchip');
        if (pet.breed.toLowerCase().includes(term)) matchedOn.push('breed');
        
        if (matchedOn.length > 0) {
          searchResults.push({
            type: 'pet',
            data: pet,
            matchedOn
          });
        }
      });
    }

    // Search owners
    if (searchType === 'all' || searchType === 'owner') {
      owners.forEach(owner => {
        const matchedOn: string[] = [];
        const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase();
        
        if (fullName.includes(term)) matchedOn.push('name');
        if (owner.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) matchedOn.push('phone');
        if (owner.email?.toLowerCase().includes(term)) matchedOn.push('email');
        
        if (matchedOn.length > 0) {
          searchResults.push({
            type: 'owner',
            data: owner,
            matchedOn
          });
        }
      });
    }

    setResults(searchResults);
  };

  const getLastVisit = (petId: string) => {
    const petCases = mockCases.filter(c => c.petId === petId && c.status === 'complete');
    if (petCases.length === 0) return null;
    
    const lastCase = petCases.sort((a, b) => 
      new Date(b.consultationEndTime || b.checkInTime).getTime() - 
      new Date(a.consultationEndTime || a.checkInTime).getTime()
    )[0];
    
    return lastCase;
  };

  const handleSelectPet = (petId: string) => {
    router.push(`/intake/vitals/${petId}`);
  };

  const handleSelectOwner = (ownerId: string) => {
    // Find pets for this owner
    const ownerPets = patients.filter(p => p.ownerId === ownerId);
    if (ownerPets.length === 1) {
      handleSelectPet(ownerPets[0].id);
    } else {
      // Show pet selection
      setSelectedPet(null);
    }
  };

  const renderPetResult = (pet: typeof patients[0], matchedOn: string[]) => {
    const owner = owners.find(o => o.id === pet.ownerId);
    const lastVisit = getLastVisit(pet.id);
    
    return (
      <Card 
        key={pet.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleSelectPet(pet.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {pet.photoUrl && (
                <img 
                  src={pet.photoUrl} 
                  alt={pet.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {pet.name}
                    <Heart className="h-4 w-4 text-gray-400" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pet.species} - {pet.breed} • {pet.ageYears}y {pet.ageMonths}m • {pet.weightKg}kg
                  </p>
                </div>
                
                {owner && (
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {owner.firstName} {owner.lastName}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {owner.phone}
                    </p>
                  </div>
                )}

                {pet.allergies.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">Allergies: {pet.allergies.join(', ')}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {matchedOn.map(field => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      Matched: {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              {lastVisit && (
                <div className="text-sm text-gray-600">
                  <p className="flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    Last visit
                  </p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(lastVisit.checkInTime), { addSuffix: true })}
                  </p>
                  <p className="text-xs">{lastVisit.chiefConcern}</p>
                </div>
              )}
              <ChevronRight className="h-5 w-5 text-gray-400 mt-2 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOwnerResult = (owner: typeof owners[0], matchedOn: string[]) => {
    const ownerPets = patients.filter(p => p.ownerId === owner.id);
    
    return (
      <Card 
        key={owner.id} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleSelectOwner(owner.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {owner.firstName} {owner.lastName}
                  <User className="h-4 w-4 text-gray-400" />
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {owner.phone}
                </p>
                {owner.email && (
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {owner.email}
                  </p>
                )}
                {owner.address && (
                  <p className="flex items-center gap-1 col-span-2">
                    <MapPin className="h-3 w-3" />
                    {owner.address}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {matchedOn.map(field => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      Matched: {field}
                    </Badge>
                  ))}
                </div>
                
                {ownerPets.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {ownerPets.length} pet{ownerPets.length > 1 ? 's' : ''} on file
                  </p>
                )}
              </div>

              {ownerPets.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Pets:</p>
                  <div className="space-y-1">
                    {ownerPets.map(pet => (
                      <div key={pet.id} className="flex items-center justify-between text-sm">
                        <span>{pet.name} - {pet.species}, {pet.breed}</span>
                        <Badge variant="outline" className="text-xs">
                          {pet.ageYears}y {pet.ageMonths}m
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Patients</h1>
              <p className="text-sm text-gray-600 mt-1">Find existing pets and owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Input */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search by name, phone, email, or microchip</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Enter search term..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <Label>Search in</Label>
                  <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pet">Pets Only</TabsTrigger>
                      <TabsTrigger value="owner">Owners Only</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {searchTerm.length >= 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">
                  {isSearching ? 'Searching...' : `${results.length} results found`}
                </h2>
                {results.length === 0 && !isSearching && (
                  <Button onClick={() => router.push('/intake/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Patient
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-4 pr-4">
                  {results.map((result) => (
                    result.type === 'pet' 
                      ? renderPetResult(result.data, result.matchedOn)
                      : renderOwnerResult(result.data, result.matchedOn)
                  ))}

                  {results.length === 0 && !isSearching && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No results found for "{searchTerm}"</p>
                        <Button onClick={() => router.push('/intake/new')}>
                          Create New Patient
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {searchTerm.length < 2 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Start typing to search for patients
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 2 characters required
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}