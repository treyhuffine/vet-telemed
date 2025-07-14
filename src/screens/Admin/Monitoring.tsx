'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Wifi,
  Users,
  Video,
  HardDrive,
  Cpu,
  MemoryStick,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Filter,
  Bell,
  BarChart,
  LineChart,
  PieChart
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  uptime: string;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: Date;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface PerformanceMetric {
  timestamp: Date;
  value: number;
}

export default function MonitoringScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('1h');

  // Mock data - in real app would come from monitoring service
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: {
      in: 125,
      out: 89
    },
    uptime: '15 days, 7 hours'
  });

  const [services] = useState<ServiceStatus[]>([
    {
      name: 'Web Application',
      status: 'healthy',
      latency: 45,
      uptime: 99.9,
      lastCheck: new Date()
    },
    {
      name: 'Video Service',
      status: 'healthy',
      latency: 120,
      uptime: 99.5,
      lastCheck: new Date()
    },
    {
      name: 'Database',
      status: 'healthy',
      latency: 15,
      uptime: 100,
      lastCheck: new Date()
    },
    {
      name: 'File Storage',
      status: 'degraded',
      latency: 350,
      uptime: 98.5,
      lastCheck: new Date()
    },
    {
      name: 'Email Service',
      status: 'healthy',
      latency: 85,
      uptime: 99.8,
      lastCheck: new Date()
    },
    {
      name: 'SMS Gateway',
      status: 'down',
      latency: 0,
      uptime: 95.2,
      lastCheck: new Date()
    }
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'SMS Gateway Down',
      message: 'SMS notification service is currently unavailable. Text alerts will not be sent.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Storage Latency',
      message: 'File storage service is experiencing higher than normal latency (350ms average).',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance window scheduled for tonight at 2:00 AM EST.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolved: false
    },
    {
      id: '4',
      type: 'warning',
      title: 'CPU Usage Spike',
      message: 'CPU usage exceeded 80% threshold for 5 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      resolved: true
    }
  ]);

  const [performanceData] = useState<PerformanceMetric[]>(
    Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 5 * 60 * 1000),
      value: Math.random() * 100
    })).reverse()
  );

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: {
          in: Math.max(0, prev.network.in + (Math.random() - 0.5) * 20),
          out: Math.max(0, prev.network.out + (Math.random() - 0.5) * 15)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50';
      case 'down':
        return 'text-red-600 bg-red-50';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const healthyServices = services.filter(s => s.status === 'healthy').length;
  const totalServices = services.length;
  const systemHealth = (healthyServices / totalServices) * 100;

  const activeAlerts = alerts.filter(a => !a.resolved);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Restricted</h2>
          <p className="text-gray-600 mt-2">Only administrators can access system monitoring.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
                <p className="text-sm text-gray-600 mt-1">Real-time system health and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="5m">Last 5 minutes</option>
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
              </select>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-gray-900">{systemHealth.toFixed(0)}%</p>
                  </div>
                  <div className={`p-3 rounded-full ${systemHealth >= 90 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Activity className={`h-6 w-6 ${systemHealth >= 90 ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                </div>
                <Progress value={systemHealth} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{activeAlerts.length}</p>
                  </div>
                  <div className={`p-3 rounded-full ${activeAlerts.length === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <AlertTriangle className={`h-6 w-6 ${activeAlerts.length === 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge variant="destructive">{activeAlerts.filter(a => a.type === 'critical').length} Critical</Badge>
                  <Badge variant="outline">{activeAlerts.filter(a => a.type === 'warning').length} Warning</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Services</p>
                    <p className="text-2xl font-bold text-gray-900">{healthyServices}/{totalServices}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Server className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {services.filter(s => s.status === 'degraded').length} degraded, {services.filter(s => s.status === 'down').length} down
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Since last restart
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* System Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.cpu.toFixed(0)}%</div>
                    <Progress value={systemMetrics.cpu} className="mt-2" />
                    <p className="text-xs text-gray-600 mt-2">4 cores @ 2.4GHz</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MemoryStick className="h-4 w-4" />
                      Memory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.memory.toFixed(0)}%</div>
                    <Progress value={systemMetrics.memory} className="mt-2" />
                    <p className="text-xs text-gray-600 mt-2">10.2GB / 16GB</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Disk Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{systemMetrics.disk}%</div>
                    <Progress value={systemMetrics.disk} className="mt-2" />
                    <p className="text-xs text-gray-600 mt-2">38GB / 100GB</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-600">In</p>
                        <p className="font-bold">{systemMetrics.network.in} MB/s</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Out</p>
                        <p className="font-bold">{systemMetrics.network.out} MB/s</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Database backup completed</p>
                        <p className="text-xs text-gray-600">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High memory usage detected</p>
                        <p className="text-xs text-gray-600">25 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">SMS gateway connection lost</p>
                        <p className="text-xs text-gray-600">45 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">SSL certificates renewed</p>
                        <p className="text-xs text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card key={service.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Latency</p>
                          <p className="font-medium">{service.latency}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Uptime</p>
                          <p className="font-medium">{service.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Check</p>
                          <p className="font-medium">{service.lastCheck.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <Progress 
                        value={service.uptime} 
                        className="mt-3"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <Badge variant="outline">
                  {activeAlerts.length} Active, {alerts.filter(a => a.resolved).length} Resolved
                </Badge>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <span className="text-xs text-gray-600">
                              {alert.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          {alert.resolved && (
                            <Badge variant="outline" className="mt-2">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        {!alert.resolved && (
                          <Button size="sm" variant="outline">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>System performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <LineChart className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-600">Performance chart visualization</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">&lt; 100ms</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">100-500ms</span>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                      <Progress value={20} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">&gt; 500ms</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <Progress value={5} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Error Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">0.12%</div>
                      <p className="text-sm text-gray-600 mt-1">
                        12 errors out of 10,000 requests
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">-0.05% from last hour</span>
                      </div>
                    </div>
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