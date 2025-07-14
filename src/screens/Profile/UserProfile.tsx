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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Clock,
  Calendar,
  Save,
  Camera,
  Bell,
  Moon,
  Monitor,
  Stethoscope,
  Award,
  CheckCircle,
  AlertCircle,
  Plus,
  Sun,
  Activity,
  FileText
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';
import { mockClinics } from '@/constants/mocks';
import { format } from 'date-fns';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializations: string[];
  bio: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface NotificationSettings {
  newCases: boolean;
  urgentCases: boolean;
  caseUpdates: boolean;
  shiftReminders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const clinic = mockClinics[0];

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    licenseNumber: user?.licenseNumber || '',
    specializations: user?.specializations || [],
    bio: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newCases: true,
    urgentCases: true,
    caseUpdates: true,
    shiftReminders: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'vet': return 'bg-blue-100 text-blue-700';
      case 'vet_tech': return 'bg-green-100 text-green-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Mock stats
  const stats = {
    casesToday: 12,
    casesThisWeek: 47,
    avgConsultTime: '11 min',
    satisfactionRate: '98%',
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
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
              </div>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
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
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Avatar & Basic Info */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={user?.avatarUrl} />
                            <AvatarFallback className="text-2xl">
                              {user?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute bottom-0 right-0 h-10 w-10 rounded-full"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
                        <Badge className={`mt-2 ${getRoleBadgeColor(user?.role || '')}`}>
                          {user?.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-sm text-gray-600">Status:</span>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isAvailable}
                              onCheckedChange={setIsAvailable}
                              disabled={!isEditing}
                            />
                            <span className="text-sm font-medium">
                              {isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{clinic.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Joined {format(new Date(user?.createdAt || ''), 'MMMM yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  {user?.role === 'vet' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Performance Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cases Today</span>
                          <span className="font-medium">{stats.casesToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">This Week</span>
                          <span className="font-medium">{stats.casesThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Consult Time</span>
                          <span className="font-medium">{stats.avgConsultTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Satisfaction</span>
                          <span className="font-medium text-green-600">{stats.satisfactionRate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            disabled={!isEditing}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        {user?.role === 'vet' && (
                          <div>
                            <Label htmlFor="license">License Number</Label>
                            <Input
                              id="license"
                              value={profileData.licenseNumber}
                              onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        )}
                      </div>

                      {user?.role === 'vet' && (
                        <div>
                          <Label>Specializations</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {profileData.specializations.map((spec, idx) => (
                              <Badge key={idx} variant="secondary">
                                <Award className="mr-1 h-3 w-3" />
                                {spec}
                              </Badge>
                            ))}
                            {isEditing && (
                              <Button size="sm" variant="outline">
                                <Plus className="h-3 w-3" />
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Tell us about your experience and expertise..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Contact</CardTitle>
                      <CardDescription>
                        This information will be used in case of emergencies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencyContact">Contact Name</Label>
                          <Input
                            id="emergencyContact"
                            value={profileData.emergencyContact}
                            onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyPhone">Contact Phone</Label>
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            value={profileData.emergencyPhone}
                            onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Case Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Cases</Label>
                          <p className="text-sm text-gray-600">Get notified when new cases are added to the queue</p>
                        </div>
                        <Switch
                          checked={notificationSettings.newCases}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, newCases: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Urgent Cases</Label>
                          <p className="text-sm text-gray-600">Immediate alerts for red triage cases</p>
                        </div>
                        <Switch
                          checked={notificationSettings.urgentCases}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, urgentCases: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Case Updates</Label>
                          <p className="text-sm text-gray-600">Updates on cases you're assigned to</p>
                        </div>
                        <Switch
                          checked={notificationSettings.caseUpdates}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, caseUpdates: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Get text messages for urgent alerts</p>
                        </div>
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      You'll always receive critical system alerts regardless of these settings.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                        className="w-full"
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                        className="w-full"
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        onClick={() => setTheme('system')}
                        className="w-full"
                      >
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Default Dashboard View</Label>
                    <p className="text-sm text-gray-600 mb-2">Choose your preferred landing page</p>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>Queue Overview</option>
                      <option>My Cases</option>
                      <option>Performance Dashboard</option>
                    </select>
                  </div>

                  <div>
                    <Label>Quick Actions</Label>
                    <p className="text-sm text-gray-600 mb-2">Customize your quick action buttons</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Show "New Patient" button</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Show "Search Patient" button</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Show "Recent Cases" button</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Completed consultation', patient: 'Buddy (Golden Retriever)', time: '2 hours ago', icon: CheckCircle },
                      { action: 'Started consultation', patient: 'Mittens (Persian Cat)', time: '3 hours ago', icon: Stethoscope },
                      { action: 'Updated vitals', patient: 'Max (German Shepherd)', time: '4 hours ago', icon: Activity },
                      { action: 'Created treatment plan', patient: 'Luna (Labrador)', time: '5 hours ago', icon: FileText },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <activity.icon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.patient}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
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