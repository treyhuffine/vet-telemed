'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  Activity,
  Clock,
  Users,
  HardDrive,
  Cpu,
  Database,
  Wifi,
  Video,
  Shield,
  CheckCircle
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';

interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  metric: string;
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  duration: number; // in minutes
  severity: 'critical' | 'warning' | 'info';
  notifications: string[];
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'webhook' | 'push';
  enabled: boolean;
  config: {
    email?: string;
    phone?: string;
    webhookUrl?: string;
  };
}

interface EscalationPolicy {
  id: string;
  name: string;
  levels: {
    delay: number; // minutes
    channels: string[];
  }[];
}

export default function AlertingConfigScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [activeTab, setActiveTab] = useState('rules');
  const [saving, setSaving] = useState(false);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'High CPU Usage',
      enabled: true,
      metric: 'cpu_usage',
      condition: 'above',
      threshold: 80,
      duration: 5,
      severity: 'warning',
      notifications: ['email-admin', 'sms-oncall']
    },
    {
      id: '2',
      name: 'Service Down',
      enabled: true,
      metric: 'service_health',
      condition: 'equals',
      threshold: 0,
      duration: 1,
      severity: 'critical',
      notifications: ['email-admin', 'sms-oncall', 'webhook-slack']
    },
    {
      id: '3',
      name: 'Low Disk Space',
      enabled: true,
      metric: 'disk_free',
      condition: 'below',
      threshold: 10,
      duration: 0,
      severity: 'warning',
      notifications: ['email-admin']
    },
    {
      id: '4',
      name: 'High Queue Size',
      enabled: true,
      metric: 'queue_size',
      condition: 'above',
      threshold: 20,
      duration: 10,
      severity: 'info',
      notifications: ['email-admin', 'push-app']
    }
  ]);

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email-admin',
      name: 'Admin Email',
      type: 'email',
      enabled: true,
      config: {
        email: 'admin@emergencyvet.com'
      }
    },
    {
      id: 'sms-oncall',
      name: 'On-Call SMS',
      type: 'sms',
      enabled: true,
      config: {
        phone: '+1-555-0123'
      }
    },
    {
      id: 'webhook-slack',
      name: 'Slack Webhook',
      type: 'webhook',
      enabled: true,
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...'
      }
    },
    {
      id: 'push-app',
      name: 'App Push Notifications',
      type: 'push',
      enabled: true,
      config: {}
    }
  ]);

  const [escalationPolicies] = useState<EscalationPolicy[]>([
    {
      id: '1',
      name: 'Critical Issues',
      levels: [
        { delay: 0, channels: ['email-admin', 'sms-oncall'] },
        { delay: 5, channels: ['webhook-slack'] },
        { delay: 15, channels: ['phone-manager'] }
      ]
    },
    {
      id: '2',
      name: 'Standard Alerts',
      levels: [
        { delay: 0, channels: ['email-admin'] },
        { delay: 30, channels: ['sms-oncall'] }
      ]
    }
  ]);

  const metricOptions = [
    { value: 'cpu_usage', label: 'CPU Usage (%)', icon: Cpu },
    { value: 'memory_usage', label: 'Memory Usage (%)', icon: Activity },
    { value: 'disk_free', label: 'Free Disk Space (GB)', icon: HardDrive },
    { value: 'service_health', label: 'Service Health', icon: Shield },
    { value: 'response_time', label: 'Response Time (ms)', icon: Clock },
    { value: 'error_rate', label: 'Error Rate (%)', icon: AlertTriangle },
    { value: 'queue_size', label: 'Queue Size', icon: Users },
    { value: 'active_calls', label: 'Active Video Calls', icon: Video },
    { value: 'network_latency', label: 'Network Latency (ms)', icon: Wifi },
    { value: 'database_connections', label: 'DB Connections', icon: Database }
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const addAlertRule = () => {
    const newRule: AlertRule = {
      id: Date.now().toString(),
      name: 'New Alert Rule',
      enabled: false,
      metric: 'cpu_usage',
      condition: 'above',
      threshold: 0,
      duration: 5,
      severity: 'warning',
      notifications: []
    };
    setAlertRules([...alertRules, newRule]);
  };

  const deleteAlertRule = (id: string) => {
    setAlertRules(alertRules.filter(rule => rule.id !== id));
  };

  const addChannel = () => {
    const newChannel: NotificationChannel = {
      id: Date.now().toString(),
      name: 'New Channel',
      type: 'email',
      enabled: false,
      config: {}
    };
    setChannels([...channels, newChannel]);
  };

  const deleteChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'webhook':
        return <MessageSquare className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600 mt-2">Only administrators can configure alerts.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Alerting Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">Configure monitoring alerts and notifications</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="rules">Alert Rules</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="escalation">Escalation</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {alertRules.filter(r => r.enabled).length} of {alertRules.length} rules active
                </p>
                <Button onClick={addAlertRule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => {
                              setAlertRules(alertRules.map(r => 
                                r.id === rule.id ? { ...r, enabled: checked } : r
                              ));
                            }}
                          />
                          <div>
                            <CardTitle className="text-lg">{rule.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getSeverityColor(rule.severity)}>
                                {rule.severity}
                              </Badge>
                              {rule.enabled && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAlertRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Metric</Label>
                          <select
                            value={rule.metric}
                            onChange={(e) => {
                              setAlertRules(alertRules.map(r => 
                                r.id === rule.id ? { ...r, metric: e.target.value } : r
                              ));
                            }}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            {metricOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Condition</Label>
                            <select
                              value={rule.condition}
                              onChange={(e) => {
                                setAlertRules(alertRules.map(r => 
                                  r.id === rule.id ? { ...r, condition: e.target.value as any } : r
                                ));
                              }}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="above">Above</option>
                              <option value="below">Below</option>
                              <option value="equals">Equals</option>
                            </select>
                          </div>
                          <div>
                            <Label>Threshold</Label>
                            <Input
                              type="number"
                              value={rule.threshold}
                              onChange={(e) => {
                                setAlertRules(alertRules.map(r => 
                                  r.id === rule.id ? { ...r, threshold: parseFloat(e.target.value) } : r
                                ));
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={rule.duration}
                            onChange={(e) => {
                              setAlertRules(alertRules.map(r => 
                                r.id === rule.id ? { ...r, duration: parseInt(e.target.value) } : r
                              ));
                            }}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            Alert triggers after condition persists for this duration
                          </p>
                        </div>

                        <div>
                          <Label>Severity</Label>
                          <select
                            value={rule.severity}
                            onChange={(e) => {
                              setAlertRules(alertRules.map(r => 
                                r.id === rule.id ? { ...r, severity: e.target.value as any } : r
                              ));
                            }}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="critical">Critical</option>
                            <option value="warning">Warning</option>
                            <option value="info">Info</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label>Notification Channels</Label>
                        <div className="mt-2 space-y-2">
                          {channels.map(channel => (
                            <label key={channel.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={rule.notifications.includes(channel.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAlertRules(alertRules.map(r => 
                                      r.id === rule.id 
                                        ? { ...r, notifications: [...r.notifications, channel.id] }
                                        : r
                                    ));
                                  } else {
                                    setAlertRules(alertRules.map(r => 
                                      r.id === rule.id 
                                        ? { ...r, notifications: r.notifications.filter(n => n !== channel.id) }
                                        : r
                                    ));
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="flex items-center gap-2 text-sm">
                                {getChannelIcon(channel.type)}
                                {channel.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {channels.filter(c => c.enabled).length} of {channels.length} channels active
                </p>
                <Button onClick={addChannel}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Channel
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((channel) => (
                  <Card key={channel.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={channel.enabled}
                            onCheckedChange={(checked) => {
                              setChannels(channels.map(c => 
                                c.id === channel.id ? { ...c, enabled: checked } : c
                              ));
                            }}
                          />
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getChannelIcon(channel.type)}
                            {channel.name}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteChannel(channel.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Channel Type</Label>
                        <select
                          value={channel.type}
                          onChange={(e) => {
                            setChannels(channels.map(c => 
                              c.id === channel.id ? { ...c, type: e.target.value as any } : c
                            ));
                          }}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="webhook">Webhook</option>
                          <option value="push">Push Notification</option>
                        </select>
                      </div>

                      {channel.type === 'email' && (
                        <div>
                          <Label>Email Address</Label>
                          <Input
                            type="email"
                            value={channel.config.email || ''}
                            onChange={(e) => {
                              setChannels(channels.map(c => 
                                c.id === channel.id 
                                  ? { ...c, config: { ...c.config, email: e.target.value } }
                                  : c
                              ));
                            }}
                            className="mt-1"
                            placeholder="admin@example.com"
                          />
                        </div>
                      )}

                      {channel.type === 'sms' && (
                        <div>
                          <Label>Phone Number</Label>
                          <Input
                            type="tel"
                            value={channel.config.phone || ''}
                            onChange={(e) => {
                              setChannels(channels.map(c => 
                                c.id === channel.id 
                                  ? { ...c, config: { ...c.config, phone: e.target.value } }
                                  : c
                              ));
                            }}
                            className="mt-1"
                            placeholder="+1-555-0123"
                          />
                        </div>
                      )}

                      {channel.type === 'webhook' && (
                        <div>
                          <Label>Webhook URL</Label>
                          <Input
                            type="url"
                            value={channel.config.webhookUrl || ''}
                            onChange={(e) => {
                              setChannels(channels.map(c => 
                                c.id === channel.id 
                                  ? { ...c, config: { ...c.config, webhookUrl: e.target.value } }
                                  : c
                              ));
                            }}
                            className="mt-1"
                            placeholder="https://example.com/webhook"
                          />
                        </div>
                      )}

                      <Button variant="outline" size="sm" className="w-full">
                        Test Channel
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="escalation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Escalation Policies</CardTitle>
                  <CardDescription>
                    Define how alerts escalate when not acknowledged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {escalationPolicies.map((policy) => (
                      <div key={policy.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{policy.name}</h4>
                        <div className="space-y-3">
                          {policy.levels.map((level, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">
                                  {level.delay === 0 ? 'Immediately' : `After ${level.delay} min`}
                                </span>
                              </div>
                              <div className="flex-1 flex flex-wrap gap-2">
                                {level.channels.map(channelId => {
                                  const channel = channels.find(c => c.id === channelId);
                                  return channel ? (
                                    <Badge key={channelId} variant="outline">
                                      {getChannelIcon(channel.type)}
                                      <span className="ml-1">{channel.name}</span>
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alert Summary</CardTitle>
                  <CardDescription>
                    Configure daily alert summary emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Summary Email</Label>
                      <p className="text-sm text-gray-600">
                        Receive a summary of all alerts from the past 24 hours
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-gray-600">
                        Detailed weekly report with trends and insights
                      </p>
                    </div>
                    <Switch />
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