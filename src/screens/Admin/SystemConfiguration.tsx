'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Zap,
  Mail,
  MessageSquare,
  Save,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wifi,
  Clock,
  HardDrive,
  Activity
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';

interface SystemConfig {
  general: {
    clinicName: string;
    timezone: string;
    dateFormat: string;
    autoLogoutMinutes: number;
  };
  features: {
    videoConsultations: boolean;
    offlineMode: boolean;
    aiAssistance: boolean;
    advancedAnalytics: boolean;
    integrations: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    criticalAlerts: boolean;
    dailyDigest: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    passwordComplexity: 'low' | 'medium' | 'high';
    sessionTimeout: number;
    ipWhitelisting: boolean;
    auditLogging: boolean;
  };
  integrations: {
    pims: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
    payment: {
      enabled: boolean;
      provider: string;
      publicKey: string;
    };
    communication: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
  };
}

export default function SystemConfigurationScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const [config, setConfig] = useState<SystemConfig>({
    general: {
      clinicName: 'Emergency Pet Hospital',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      autoLogoutMinutes: 30,
    },
    features: {
      videoConsultations: true,
      offlineMode: true,
      aiAssistance: false,
      advancedAnalytics: true,
      integrations: true,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      criticalAlerts: true,
      dailyDigest: false,
    },
    security: {
      twoFactorRequired: false,
      passwordComplexity: 'medium',
      sessionTimeout: 30,
      ipWhitelisting: false,
      auditLogging: true,
    },
    integrations: {
      pims: {
        enabled: false,
        provider: '',
        apiKey: '',
      },
      payment: {
        enabled: false,
        provider: 'stripe',
        publicKey: '',
      },
      communication: {
        enabled: false,
        provider: 'twilio',
        apiKey: '',
      },
    },
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date());
    }, 1000);
  };

  const systemStatus = {
    uptime: '15 days, 7 hours',
    version: 'v1.2.0',
    lastBackup: '2 hours ago',
    storage: { used: 45, total: 100 },
    activeUsers: 12,
    queuedCases: 3,
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600 mt-2">Only administrators can access system configuration.</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">Manage platform settings and integrations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastSaved && (
                <span className="text-sm text-gray-600">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <Button variant="outline" onClick={() => router.push('/admin/alerts')}>
                <Bell className="mr-2 h-4 w-4" />
                Alert Settings
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
      </div>

      {/* System Status */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{systemStatus.uptime}</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{systemStatus.version}</div>
              <div className="text-xs text-gray-600">Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{systemStatus.lastBackup}</div>
              <div className="text-xs text-gray-600">Last Backup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {systemStatus.storage.used}GB
              </div>
              <div className="text-xs text-gray-600">Storage Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemStatus.activeUsers}</div>
              <div className="text-xs text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemStatus.queuedCases}</div>
              <div className="text-xs text-gray-600">Queued Cases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic configuration for your clinic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                      id="clinicName"
                      value={config.general.clinicName}
                      onChange={(e) => setConfig({
                        ...config,
                        general: { ...config.general, clinicName: e.target.value }
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={config.general.timezone}
                      onChange={(e) => setConfig({
                        ...config,
                        general: { ...config.general, timezone: e.target.value }
                      })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      value={config.general.dateFormat}
                      onChange={(e) => setConfig({
                        ...config,
                        general: { ...config.general, dateFormat: e.target.value }
                      })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="autoLogout">Auto-logout after (minutes)</Label>
                    <Input
                      id="autoLogout"
                      type="number"
                      value={config.general.autoLogoutMinutes}
                      onChange={(e) => setConfig({
                        ...config,
                        general: { ...config.general, autoLogoutMinutes: parseInt(e.target.value) }
                      })}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                  <CardDescription>Enable or disable platform capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="videoConsultations" className="text-base">
                        Video Consultations
                      </Label>
                      <p className="text-sm text-gray-600">
                        Enable remote veterinary consultations via video
                      </p>
                    </div>
                    <Switch
                      id="videoConsultations"
                      checked={config.features.videoConsultations}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        features: { ...config.features, videoConsultations: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="offlineMode" className="text-base">
                        Offline Mode
                      </Label>
                      <p className="text-sm text-gray-600">
                        Allow system to work without internet connection
                      </p>
                    </div>
                    <Switch
                      id="offlineMode"
                      checked={config.features.offlineMode}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        features: { ...config.features, offlineMode: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="aiAssistance" className="text-base">
                        AI Assistance
                        <Badge variant="secondary" className="ml-2">Beta</Badge>
                      </Label>
                      <p className="text-sm text-gray-600">
                        Enable AI-powered triage and documentation assistance
                      </p>
                    </div>
                    <Switch
                      id="aiAssistance"
                      checked={config.features.aiAssistance}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        features: { ...config.features, aiAssistance: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="advancedAnalytics" className="text-base">
                        Advanced Analytics
                      </Label>
                      <p className="text-sm text-gray-600">
                        Detailed performance metrics and insights
                      </p>
                    </div>
                    <Switch
                      id="advancedAnalytics"
                      checked={config.features.advancedAnalytics}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        features: { ...config.features, advancedAnalytics: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how your team receives alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={config.notifications.emailEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, emailEnabled: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications" className="text-base">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Send urgent alerts via text message
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={config.notifications.smsEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, smsEnabled: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications" className="text-base">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Browser and mobile push notifications
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={config.notifications.pushEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, pushEnabled: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="criticalAlerts" className="text-base">
                        Critical Alerts
                      </Label>
                      <p className="text-sm text-gray-600">
                        Immediate alerts for red triage cases
                      </p>
                    </div>
                    <Switch
                      id="criticalAlerts"
                      checked={config.notifications.criticalAlerts}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, criticalAlerts: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security and compliance features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor" className="text-base">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-gray-600">
                        Require 2FA for all users
                      </p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={config.security.twoFactorRequired}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        security: { ...config.security, twoFactorRequired: checked }
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="passwordComplexity">Password Complexity</Label>
                    <select
                      id="passwordComplexity"
                      value={config.security.passwordComplexity}
                      onChange={(e) => setConfig({
                        ...config,
                        security: { ...config.security, passwordComplexity: e.target.value as any }
                      })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low (8+ characters)</option>
                      <option value="medium">Medium (8+ chars, mixed case, numbers)</option>
                      <option value="high">High (12+ chars, mixed case, numbers, symbols)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ipWhitelisting" className="text-base">
                        IP Whitelisting
                      </Label>
                      <p className="text-sm text-gray-600">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch
                      id="ipWhitelisting"
                      checked={config.security.ipWhitelisting}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        security: { ...config.security, ipWhitelisting: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auditLogging" className="text-base">
                        Audit Logging
                      </Label>
                      <p className="text-sm text-gray-600">
                        Track all user actions for compliance
                      </p>
                    </div>
                    <Switch
                      id="auditLogging"
                      checked={config.security.auditLogging}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        security: { ...config.security, auditLogging: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>PIMS Integration</CardTitle>
                  <CardDescription>Connect with Practice Information Management Systems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="pimsEnabled" className="text-base">Enable PIMS Integration</Label>
                    <Switch
                      id="pimsEnabled"
                      checked={config.integrations.pims.enabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        integrations: {
                          ...config.integrations,
                          pims: { ...config.integrations.pims, enabled: checked }
                        }
                      })}
                    />
                  </div>

                  {config.integrations.pims.enabled && (
                    <>
                      <div>
                        <Label htmlFor="pimsProvider">PIMS Provider</Label>
                        <select
                          id="pimsProvider"
                          value={config.integrations.pims.provider}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: {
                              ...config.integrations,
                              pims: { ...config.integrations.pims, provider: e.target.value }
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Provider</option>
                          <option value="avimark">AVImark</option>
                          <option value="cornerstone">Cornerstone</option>
                          <option value="impromed">Impromed</option>
                          <option value="vetspire">Vetspire</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="pimsApiKey">API Key</Label>
                        <Input
                          id="pimsApiKey"
                          type="password"
                          value={config.integrations.pims.apiKey}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: {
                              ...config.integrations,
                              pims: { ...config.integrations.pims, apiKey: e.target.value }
                            }
                          })}
                          className="mt-1"
                          placeholder="Enter your PIMS API key"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Webhook Management Link */}
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Webhook Management</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Configure incoming and outgoing webhooks for PIMS integrations
                      </p>
                    </div>
                    <Button onClick={() => router.push('/admin/webhooks')}>
                      <Zap className="mr-2 h-4 w-4" />
                      Manage Webhooks
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                  <CardDescription>Configure payment gateway integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="paymentEnabled" className="text-base">Enable Payment Processing</Label>
                    <Switch
                      id="paymentEnabled"
                      checked={config.integrations.payment.enabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        integrations: {
                          ...config.integrations,
                          payment: { ...config.integrations.payment, enabled: checked }
                        }
                      })}
                    />
                  </div>

                  {config.integrations.payment.enabled && (
                    <>
                      <div>
                        <Label htmlFor="paymentProvider">Payment Provider</Label>
                        <select
                          id="paymentProvider"
                          value={config.integrations.payment.provider}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: {
                              ...config.integrations,
                              payment: { ...config.integrations.payment, provider: e.target.value }
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="stripe">Stripe</option>
                          <option value="square">Square</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="paymentPublicKey">Public Key</Label>
                        <Input
                          id="paymentPublicKey"
                          value={config.integrations.payment.publicKey}
                          onChange={(e) => setConfig({
                            ...config,
                            integrations: {
                              ...config.integrations,
                              payment: { ...config.integrations.payment, publicKey: e.target.value }
                            }
                          })}
                          className="mt-1"
                          placeholder="pk_test_..."
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* System Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Actions</CardTitle>
              <CardDescription>Maintenance and diagnostic tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
                <Button variant="outline" className="justify-start">
                  <HardDrive className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Run Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}