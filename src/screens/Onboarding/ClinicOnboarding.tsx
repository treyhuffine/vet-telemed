'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Clock,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Activity
} from 'lucide-react';
import { validateEmail, validatePhone, validateRequired } from '@/lib/error-handling';
import { safeAsync } from '@/lib/error-handling';

interface OnboardingData {
  // Step 1: Clinic Information
  clinicName: string;
  clinicType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  
  // Step 2: Business Hours
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
      is24Hour: boolean;
    };
  };
  emergencyPhone: string;
  
  // Step 3: Services & Capacity
  services: string[];
  averageCapacity: number;
  numberOfVets: number;
  numberOfTechs: number;
  examRooms: number;
  
  // Step 4: Admin Account
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  
  // Step 5: Payment & Legal
  billingEmail: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  subscriptionPlan: string;
}

const STEPS = [
  { id: 1, title: 'Clinic Information', icon: Building },
  { id: 2, title: 'Hours & Contact', icon: Clock },
  { id: 3, title: 'Services & Staff', icon: Stethoscope },
  { id: 4, title: 'Admin Account', icon: Shield },
  { id: 5, title: 'Payment & Legal', icon: CreditCard },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const SERVICES = [
  'Emergency Care',
  'Critical Care',
  'Surgery',
  'Diagnostics (X-Ray)',
  'Diagnostics (Ultrasound)',
  'Laboratory',
  'Dental',
  'Exotic Animals',
  'Rehabilitation',
];

export default function ClinicOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<OnboardingData>({
    clinicName: '',
    clinicType: 'emergency',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    businessHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
      friday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
      saturday: { isOpen: true, openTime: '00:00', closeTime: '00:00', is24Hour: true },
      sunday: { isOpen: true, openTime: '00:00', closeTime: '00:00', is24Hour: true },
    },
    emergencyPhone: '',
    services: ['Emergency Care', 'Surgery', 'Diagnostics (X-Ray)'],
    averageCapacity: 20,
    numberOfVets: 3,
    numberOfTechs: 6,
    examRooms: 4,
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    billingEmail: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
    subscriptionPlan: 'professional',
  });

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    try {
      switch (step) {
        case 1:
          validateRequired(formData.clinicName, 'Clinic name');
          validateRequired(formData.address, 'Address');
          validateRequired(formData.city, 'City');
          validateRequired(formData.state, 'State');
          validateRequired(formData.zipCode, 'ZIP code');
          validatePhone(formData.phone);
          validateEmail(formData.email);
          break;
          
        case 2:
          validatePhone(formData.emergencyPhone);
          break;
          
        case 3:
          if (formData.services.length === 0) {
            newErrors.services = 'Please select at least one service';
          }
          if (formData.numberOfVets < 1) {
            newErrors.numberOfVets = 'Must have at least one veterinarian';
          }
          if (formData.numberOfTechs < 1) {
            newErrors.numberOfTechs = 'Must have at least one technician';
          }
          break;
          
        case 4:
          validateRequired(formData.adminName, 'Admin name');
          validateEmail(formData.adminEmail);
          validatePhone(formData.adminPhone);
          if (formData.adminPassword.length < 8) {
            newErrors.adminPassword = 'Password must be at least 8 characters';
          }
          break;
          
        case 5:
          validateEmail(formData.billingEmail);
          if (!formData.acceptedTerms) {
            newErrors.acceptedTerms = 'You must accept the terms of service';
          }
          if (!formData.acceptedPrivacy) {
            newErrors.acceptedPrivacy = 'You must accept the privacy policy';
          }
          break;
      }
    } catch (error: any) {
      newErrors.general = error.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await safeAsync(async () => {
      // In production, this would submit to the API
      console.log('Submitting onboarding data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard
      router.push('/dashboard');
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome to EmergencyVet</h1>
          </div>
          <p className="text-lg text-gray-600">
            Let's get your clinic set up in just a few minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your veterinary clinic'}
              {currentStep === 2 && 'Set your operating hours and emergency contact'}
              {currentStep === 3 && 'Configure your services and staff capacity'}
              {currentStep === 4 && 'Create your administrator account'}
              {currentStep === 5 && 'Choose your plan and review terms'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Clinic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clinicName">Clinic Name *</Label>
                    <Input
                      id="clinicName"
                      value={formData.clinicName}
                      onChange={(e) => updateField('clinicName', e.target.value)}
                      placeholder="Emergency Pet Care Center"
                    />
                    {errors.clinicName && <p className="text-sm text-red-600 mt-1">{errors.clinicName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="clinicType">Clinic Type</Label>
                    <Select
                      value={formData.clinicType}
                      onValueChange={(value) => updateField('clinicType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">24/7 Emergency</SelectItem>
                        <SelectItem value="urgent_care">Urgent Care</SelectItem>
                        <SelectItem value="specialty">Specialty Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="San Francisco"
                    />
                    {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => updateField('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="94107"
                      maxLength={10}
                    />
                    {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Main Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="contact@yourclinic.com"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://www.yourclinic.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Clinic Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Tell us about your clinic's specialties and services..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Hours */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyPhone">24/7 Emergency Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                    placeholder="(555) 911-9111"
                  />
                  {errors.emergencyPhone && <p className="text-sm text-red-600 mt-1">{errors.emergencyPhone}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Business Hours</Label>
                  {Object.entries(formData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={hours.isOpen}
                          onCheckedChange={(checked) => {
                            updateField('businessHours', {
                              ...formData.businessHours,
                              [day]: { ...hours, isOpen: checked as boolean }
                            });
                          }}
                        />
                        <span className="font-medium capitalize w-24">{day}</span>
                      </div>
                      
                      {hours.isOpen && (
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={hours.is24Hour}
                            onCheckedChange={(checked) => {
                              updateField('businessHours', {
                                ...formData.businessHours,
                                [day]: { ...hours, is24Hour: checked as boolean }
                              });
                            }}
                          />
                          <span className="text-sm">24 hours</span>
                          
                          {!hours.is24Hour && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={hours.openTime}
                                onChange={(e) => {
                                  updateField('businessHours', {
                                    ...formData.businessHours,
                                    [day]: { ...hours, openTime: e.target.value }
                                  });
                                }}
                                className="w-24"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) => {
                                  updateField('businessHours', {
                                    ...formData.businessHours,
                                    [day]: { ...hours, closeTime: e.target.value }
                                  });
                                }}
                                className="w-24"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!hours.isOpen && (
                        <span className="text-gray-500">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Services & Capacity */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Services Offered *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {SERVICES.map(service => (
                      <label key={service} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.services.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateField('services', [...formData.services, service]);
                            } else {
                              updateField('services', formData.services.filter(s => s !== service));
                            }
                          }}
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                  {errors.services && <p className="text-sm text-red-600 mt-1">{errors.services}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="averageCapacity">Average Daily Capacity</Label>
                    <Input
                      id="averageCapacity"
                      type="number"
                      value={formData.averageCapacity}
                      onChange={(e) => updateField('averageCapacity', parseInt(e.target.value))}
                      min={1}
                    />
                    <p className="text-xs text-gray-600 mt-1">Typical number of cases per day</p>
                  </div>
                  <div>
                    <Label htmlFor="examRooms">Number of Exam Rooms</Label>
                    <Input
                      id="examRooms"
                      type="number"
                      value={formData.examRooms}
                      onChange={(e) => updateField('examRooms', parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfVets">Number of Veterinarians *</Label>
                    <Input
                      id="numberOfVets"
                      type="number"
                      value={formData.numberOfVets}
                      onChange={(e) => updateField('numberOfVets', parseInt(e.target.value))}
                      min={1}
                    />
                    {errors.numberOfVets && <p className="text-sm text-red-600 mt-1">{errors.numberOfVets}</p>}
                  </div>
                  <div>
                    <Label htmlFor="numberOfTechs">Number of Vet Techs *</Label>
                    <Input
                      id="numberOfTechs"
                      type="number"
                      value={formData.numberOfTechs}
                      onChange={(e) => updateField('numberOfTechs', parseInt(e.target.value))}
                      min={1}
                    />
                    {errors.numberOfTechs && <p className="text-sm text-red-600 mt-1">{errors.numberOfTechs}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Admin Account */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This account will have full administrative access to your clinic's EmergencyVet system.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminName">Full Name *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminName}
                      onChange={(e) => updateField('adminName', e.target.value)}
                      placeholder="Dr. Jane Smith"
                    />
                    {errors.adminName && <p className="text-sm text-red-600 mt-1">{errors.adminName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="adminPhone">Phone Number *</Label>
                    <Input
                      id="adminPhone"
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => updateField('adminPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                    {errors.adminPhone && <p className="text-sm text-red-600 mt-1">{errors.adminPhone}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => updateField('adminEmail', e.target.value)}
                    placeholder="admin@yourclinic.com"
                  />
                  {errors.adminEmail && <p className="text-sm text-red-600 mt-1">{errors.adminEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="adminPassword">Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => updateField('adminPassword', e.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.adminPassword && <p className="text-sm text-red-600 mt-1">{errors.adminPassword}</p>}
                  <p className="text-xs text-gray-600 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Payment & Legal */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <Label>Subscription Plan</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        formData.subscriptionPlan === 'starter' ? 'border-blue-600 bg-blue-50' : ''
                      }`}
                      onClick={() => updateField('subscriptionPlan', 'starter')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Starter</h4>
                        <p className="text-2xl font-bold mt-2">$299/mo</p>
                        <p className="text-sm text-gray-600 mt-2">Up to 3 concurrent users</p>
                        <p className="text-sm text-gray-600">Basic features</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        formData.subscriptionPlan === 'professional' ? 'border-blue-600 bg-blue-50' : ''
                      }`}
                      onClick={() => updateField('subscriptionPlan', 'professional')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Professional</h4>
                        <p className="text-2xl font-bold mt-2">$599/mo</p>
                        <p className="text-sm text-gray-600 mt-2">Up to 10 concurrent users</p>
                        <p className="text-sm text-gray-600">All features</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        formData.subscriptionPlan === 'enterprise' ? 'border-blue-600 bg-blue-50' : ''
                      }`}
                      onClick={() => updateField('subscriptionPlan', 'enterprise')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Enterprise</h4>
                        <p className="text-2xl font-bold mt-2">Custom</p>
                        <p className="text-sm text-gray-600 mt-2">Unlimited users</p>
                        <p className="text-sm text-gray-600">Custom features</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <Label htmlFor="billingEmail">Billing Email *</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    value={formData.billingEmail}
                    onChange={(e) => updateField('billingEmail', e.target.value)}
                    placeholder="billing@yourclinic.com"
                  />
                  {errors.billingEmail && <p className="text-sm text-red-600 mt-1">{errors.billingEmail}</p>}
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-2">
                    <Checkbox
                      checked={formData.acceptedTerms}
                      onCheckedChange={(checked) => updateField('acceptedTerms', checked)}
                    />
                    <span className="text-sm">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    </span>
                  </label>
                  {errors.acceptedTerms && <p className="text-sm text-red-600">{errors.acceptedTerms}</p>}
                  
                  <label className="flex items-start gap-2">
                    <Checkbox
                      checked={formData.acceptedPrivacy}
                      onCheckedChange={(checked) => updateField('acceptedPrivacy', checked)}
                    />
                    <span className="text-sm">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.acceptedPrivacy && <p className="text-sm text-red-600">{errors.acceptedPrivacy}</p>}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === STEPS.length ? (
                  <>
                    Complete Setup
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}