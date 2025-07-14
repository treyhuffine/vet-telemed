'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Building,
  Clock,
  Phone,
  Mail,
  MapPin,
  Save,
  Shield,
  Bell,
  Zap,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Globe,
  Palette,
  FileText,
  Heart,
  Stethoscope,
  Activity
} from 'lucide-react';
import { mockClinics } from '@/constants/mocks';
import { format } from 'date-fns';

interface ClinicData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  emergencyPhone: string;
  timezone: string;
}

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    is24Hour: boolean;
  };
}

interface TriageSettings {
  autoAssignEnabled: boolean;
  redTriageAlertAll: boolean;
  maxQueueSize: number;
  avgConsultTime: number;
  enableWaitTimeEstimates: boolean;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  newCaseAlert: boolean;
  queueThresholdAlert: boolean;
  queueThreshold: number;
}

export default function ClinicSettingsScreen() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const clinic = mockClinics[0];

  const [clinicData, setClinicData] = useState<ClinicData>({
    name: clinic.name,
    address: clinic.address,
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    phone: clinic.phone,
    email: 'contact@emergencyvet.com',
    website: 'https://emergencyvet.com',
    description: 'Leading 24/7 emergency veterinary care facility providing comprehensive medical services for pets.',
    emergencyPhone: '(555) 911-9111',
    timezone: 'America/Los_Angeles',
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00', is24Hour: false },
    friday: { isOpen: true, openTime: '08:00', closeTime: '22:00', is24Hour: false },
    saturday: { isOpen: true, openTime: '00:00', closeTime: '00:00', is24Hour: true },
    sunday: { isOpen: true, openTime: '00:00', closeTime: '00:00', is24Hour: true },
  });

  const [triageSettings, setTriageSettings] = useState<TriageSettings>({
    autoAssignEnabled: true,
    redTriageAlertAll: true,
    maxQueueSize: 20,
    avgConsultTime: 15,
    enableWaitTimeEstimates: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    newCaseAlert: true,
    queueThresholdAlert: true,
    queueThreshold: 15,
  });

  const [integrations, setIntegrations] = useState({
    pims: { enabled: false, system: '', apiKey: '' },
    payment: { enabled: true, processor: 'stripe', apiKey: '' },
    sms: { enabled: false, provider: 'twilio', apiKey: '' },
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
                <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your clinic configuration and preferences</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Configuration</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      System settings and platform features
                    </p>
                  </div>
                  <Button size="sm" onClick={() => router.push('/admin/configuration')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Data Export</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Export cases, patients, and analytics
                    </p>
                  </div>
                  <Button size="sm" onClick={() => router.push('/admin/export')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="triage">Triage</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                    <CardDescription>
                      Basic information about your clinic
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Clinic Name</Label>
                      <Input
                        id="name"
                        value={clinicData.name}
                        onChange={(e) => setClinicData({ ...clinicData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={clinicData.description}
                        onChange={(e) => setClinicData({ ...clinicData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Main Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={clinicData.phone}
                          onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={clinicData.emergencyPhone}
                          onChange={(e) => setClinicData({ ...clinicData, emergencyPhone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Contact Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clinicData.email}
                        onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={clinicData.website}
                        onChange={(e) => setClinicData({ ...clinicData, website: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>
                      Physical address and timezone settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={clinicData.address}
                        onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={clinicData.city}
                          onChange={(e) => setClinicData({ ...clinicData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={clinicData.state}
                          onChange={(e) => setClinicData({ ...clinicData, state: e.target.value })}
                          maxLength={2}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={clinicData.zipCode}
                        onChange={(e) => setClinicData({ ...clinicData, zipCode: e.target.value })}
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={clinicData.timezone}
                        onValueChange={(value) => setClinicData({ ...clinicData, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>
                    Set your clinic's operating hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-center gap-4 flex-1">
                          <Switch
                            checked={businessHours[day].isOpen}
                            onCheckedChange={(checked) => 
                              setBusinessHours({
                                ...businessHours,
                                [day]: { ...businessHours[day], isOpen: checked }
                              })
                            }
                          />
                          <span className="font-medium capitalize w-28">{day}</span>
                        </div>
                        {businessHours[day].isOpen && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={businessHours[day].openTime}
                                onChange={(e) =>
                                  setBusinessHours({
                                    ...businessHours,
                                    [day]: { ...businessHours[day], openTime: e.target.value }
                                  })
                                }
                                disabled={businessHours[day].is24Hour}
                                className="w-32"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={businessHours[day].closeTime}
                                onChange={(e) =>
                                  setBusinessHours({
                                    ...businessHours,
                                    [day]: { ...businessHours[day], closeTime: e.target.value }
                                  })
                                }
                                disabled={businessHours[day].is24Hour}
                                className="w-32"
                              />
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={businessHours[day].is24Hour}
                                onChange={(e) =>
                                  setBusinessHours({
                                    ...businessHours,
                                    [day]: { ...businessHours[day], is24Hour: e.target.checked }
                                  })
                                }
                              />
                              <span className="text-sm">24 hours</span>
                            </label>
                          </div>
                        )}
                        {!businessHours[day].isOpen && (
                          <span className="text-gray-500">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <Alert className="mt-6">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Emergency services are available 24/7 regardless of regular business hours.
                      These hours are for display purposes and staff scheduling.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="triage" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Queue Management</CardTitle>
                    <CardDescription>
                      Configure how cases are assigned and managed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Assign Cases</Label>
                        <p className="text-sm text-gray-600">
                          Automatically assign new cases to available veterinarians
                        </p>
                      </div>
                      <Switch
                        checked={triageSettings.autoAssignEnabled}
                        onCheckedChange={(checked) =>
                          setTriageSettings({ ...triageSettings, autoAssignEnabled: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Red Triage Alert All</Label>
                        <p className="text-sm text-gray-600">
                          Alert all available vets for critical cases
                        </p>
                      </div>
                      <Switch
                        checked={triageSettings.redTriageAlertAll}
                        onCheckedChange={(checked) =>
                          setTriageSettings({ ...triageSettings, redTriageAlertAll: checked })
                        }
                      />
                    </div>

                    <div>
                      <Label>Maximum Queue Size</Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Alert when queue exceeds this number
                      </p>
                      <Input
                        type="number"
                        value={triageSettings.maxQueueSize}
                        onChange={(e) =>
                          setTriageSettings({ ...triageSettings, maxQueueSize: parseInt(e.target.value) })
                        }
                        className="w-32"
                      />
                    </div>

                    <div>
                      <Label>Average Consultation Time</Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Used for wait time estimates (minutes)
                      </p>
                      <Input
                        type="number"
                        value={triageSettings.avgConsultTime}
                        onChange={(e) =>
                          setTriageSettings({ ...triageSettings, avgConsultTime: parseInt(e.target.value) })
                        }
                        className="w-32"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Triage Levels</CardTitle>
                    <CardDescription>
                      Define criteria for each triage level
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <h4 className="font-medium">Red - Critical</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Life-threatening conditions requiring immediate attention. Examples: severe trauma,
                        respiratory distress, unconsciousness, active seizures.
                      </p>
                    </div>

                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <h4 className="font-medium">Yellow - Urgent</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Serious conditions needing prompt care within 30 minutes. Examples: moderate pain,
                        vomiting, difficulty urinating, minor trauma.
                      </p>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <h4 className="font-medium">Green - Non-Urgent</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Stable conditions that can wait. Examples: minor wounds, chronic conditions,
                        wellness checks, follow-up visits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how your clinic receives alerts and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Notification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-600">Send alerts via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailEnabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Send urgent alerts via text message</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsEnabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, smsEnabled: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-gray-600">In-app push notifications</p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushEnabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, pushEnabled: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Alert Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Case Alerts</Label>
                          <p className="text-sm text-gray-600">Notify when new cases are added</p>
                        </div>
                        <Switch
                          checked={notificationSettings.newCaseAlert}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, newCaseAlert: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Queue Threshold Alerts</Label>
                          <p className="text-sm text-gray-600">Alert when queue size exceeds limit</p>
                        </div>
                        <Switch
                          checked={notificationSettings.queueThresholdAlert}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, queueThresholdAlert: checked })
                          }
                        />
                      </div>
                      {notificationSettings.queueThresholdAlert && (
                        <div className="ml-8">
                          <Label>Queue Threshold</Label>
                          <Input
                            type="number"
                            value={notificationSettings.queueThreshold}
                            onChange={(e) =>
                              setNotificationSettings({ 
                                ...notificationSettings, 
                                queueThreshold: parseInt(e.target.value) 
                              })
                            }
                            className="w-32 mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Management System</CardTitle>
                    <CardDescription>
                      Connect your existing PIMS for seamless data sync
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable PIMS Integration</Label>
                        <p className="text-sm text-gray-600">Sync patient data with your practice system</p>
                      </div>
                      <Switch
                        checked={integrations.pims.enabled}
                        onCheckedChange={(checked) =>
                          setIntegrations({
                            ...integrations,
                            pims: { ...integrations.pims, enabled: checked }
                          })
                        }
                      />
                    </div>
                    {integrations.pims.enabled && (
                      <>
                        <div>
                          <Label>PIMS System</Label>
                          <Select
                            value={integrations.pims.system}
                            onValueChange={(value) =>
                              setIntegrations({
                                ...integrations,
                                pims: { ...integrations.pims, system: value }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your PIMS" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="avimark">AVImark</SelectItem>
                              <SelectItem value="cornerstone">Cornerstone</SelectItem>
                              <SelectItem value="impromed">Impromed</SelectItem>
                              <SelectItem value="vetspire">Vetspire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>API Key</Label>
                          <Input
                            type="password"
                            placeholder="Enter your PIMS API key"
                            value={integrations.pims.apiKey}
                            onChange={(e) =>
                              setIntegrations({
                                ...integrations,
                                pims: { ...integrations.pims, apiKey: e.target.value }
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Processing</CardTitle>
                    <CardDescription>
                      Configure payment collection for services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <DollarSign className="h-4 w-4" />
                      <AlertDescription>
                        Payment processing is currently enabled through Stripe.
                        Contact support to change payment processors.
                      </AlertDescription>
                    </Alert>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Payment Processing</Label>
                        <p className="text-sm text-gray-600">Accept payments through the platform</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SMS Provider</CardTitle>
                    <CardDescription>
                      Send text message notifications to staff
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable SMS</Label>
                        <p className="text-sm text-gray-600">Send urgent alerts via text</p>
                      </div>
                      <Switch
                        checked={integrations.sms.enabled}
                        onCheckedChange={(checked) =>
                          setIntegrations({
                            ...integrations,
                            sms: { ...integrations.sms, enabled: checked }
                          })
                        }
                      />
                    </div>
                    {integrations.sms.enabled && (
                      <Alert>
                        <Phone className="h-4 w-4" />
                        <AlertDescription>
                          SMS integration requires additional setup. Contact support to configure
                          your Twilio account for text messaging.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}