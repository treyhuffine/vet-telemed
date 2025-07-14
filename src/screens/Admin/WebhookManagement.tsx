'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Webhook,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Copy,
  Eye,
  EyeOff,
  TestTube,
  Save,
  ExternalLink
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';

interface WebhookConfig {
  provider: string;
  enabled: boolean;
  webhookUrl: string;
  events: string[];
  lastTest?: {
    timestamp: string;
    success: boolean;
    message?: string;
  };
}

const providers = [
  { id: 'avimark', name: 'AVImark', description: 'Veterinary practice management software' },
  { id: 'cornerstone', name: 'Cornerstone', description: 'IDEXX veterinary software' },
  { id: 'impromed', name: 'Impromed', description: 'Covetrus practice management' },
  { id: 'vetspire', name: 'Vetspire', description: 'Cloud-based veterinary software' },
];

const availableEvents = [
  { id: 'case.created', name: 'Case Created', description: 'When a new case is created' },
  { id: 'case.updated', name: 'Case Updated', description: 'When case details are modified' },
  { id: 'consultation.completed', name: 'Consultation Completed', description: 'When a video consultation ends' },
  { id: 'patient.created', name: 'Patient Created', description: 'When a new patient profile is created' },
  { id: 'patient.updated', name: 'Patient Updated', description: 'When patient information is updated' },
];

export default function WebhookManagementScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [configs, setConfigs] = useState<Record<string, WebhookConfig>>({});
  const [selectedProvider, setSelectedProvider] = useState<string>('avimark');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Fetch webhook configurations
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/v1/webhooks/config');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error('Failed to fetch webhook configs:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config = configs[selectedProvider];
      const response = await fetch(`/api/v1/webhooks/config?provider=${selectedProvider}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        // Show success message
        console.log('Configuration saved');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/v1/webhooks/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          provider: selectedProvider,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update config with test result
        setConfigs(prev => ({
          ...prev,
          [selectedProvider]: {
            ...prev[selectedProvider],
            lastTest: {
              timestamp: result.timestamp,
              success: result.success,
              message: result.message,
            },
          },
        }));
      }
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const config = configs[selectedProvider] || {
    provider: selectedProvider,
    enabled: false,
    webhookUrl: '',
    events: [],
  };

  const webhookEndpoint = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.emergencyvet.com'}/api/webhooks/pims`;

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600 mt-2">Only administrators can manage webhooks.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1>
                <p className="text-sm text-gray-600 mt-1">Configure PIMS integrations and webhooks</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Provider Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>PIMS Providers</CardTitle>
                  <CardDescription>Select a provider to configure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {providers.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedProvider === provider.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-gray-600">{provider.description}</p>
                          </div>
                          {configs[provider.id]?.enabled && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Incoming Webhook Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Incoming Webhook</CardTitle>
                  <CardDescription>
                    Configure your PIMS to send webhooks to this endpoint
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={webhookEndpoint}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(webhookEndpoint)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey || 'sk_live_...'}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Add this API key to your PIMS webhook configuration headers as "X-API-Key"
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Configuration */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {providers.find(p => p.id === selectedProvider)?.name} Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure outgoing webhooks to {providers.find(p => p.id === selectedProvider)?.name}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => {
                        setConfigs(prev => ({
                          ...prev,
                          [selectedProvider]: {
                            ...prev[selectedProvider],
                            enabled: checked,
                          },
                        }));
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://your-pims.com/webhook"
                      value={config.webhookUrl}
                      onChange={(e) => {
                        setConfigs(prev => ({
                          ...prev,
                          [selectedProvider]: {
                            ...prev[selectedProvider],
                            webhookUrl: e.target.value,
                          },
                        }));
                      }}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      The endpoint URL provided by your PIMS for receiving webhooks
                    </p>
                  </div>

                  <div>
                    <Label>Events to Send</Label>
                    <div className="space-y-3 mt-2">
                      {availableEvents.map(event => (
                        <label key={event.id} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={config.events?.includes(event.id) || false}
                            onChange={(e) => {
                              const events = config.events || [];
                              if (e.target.checked) {
                                setConfigs(prev => ({
                                  ...prev,
                                  [selectedProvider]: {
                                    ...prev[selectedProvider],
                                    events: [...events, event.id],
                                  },
                                }));
                              } else {
                                setConfigs(prev => ({
                                  ...prev,
                                  [selectedProvider]: {
                                    ...prev[selectedProvider],
                                    events: events.filter(e => e !== event.id),
                                  },
                                }));
                              }
                            }}
                            className="mt-1 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.name}</p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Test Connection */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Test Connection</h4>
                        <p className="text-sm text-gray-600">
                          Send a test webhook to verify the connection
                        </p>
                      </div>
                      <Button
                        onClick={handleTest}
                        disabled={!config.enabled || !config.webhookUrl || testing}
                      >
                        {testing ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <TestTube className="mr-2 h-4 w-4" />
                            Test Webhook
                          </>
                        )}
                      </Button>
                    </div>

                    {config.lastTest && (
                      <Alert className={config.lastTest.success ? 'border-green-200' : 'border-red-200'}>
                        {config.lastTest.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>{config.lastTest.message}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(config.lastTest.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documentation */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Integration Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Webhook Payload Format</h4>
                    <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "case.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "caseId": "case_123",
    "patientId": "pet_456",
    "clinicId": "clinic_789",
    "triageLevel": "yellow",
    "presentingComplaint": "Vomiting",
    "vitals": { ... }
  }
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Headers</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <code className="text-blue-600">X-API-Key</code>
                        <span className="text-gray-600">Your API key for authentication</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <code className="text-blue-600">X-Event-Type</code>
                        <span className="text-gray-600">The type of event being sent</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <code className="text-blue-600">X-Timestamp</code>
                        <span className="text-gray-600">ISO 8601 timestamp of the event</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full API Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}