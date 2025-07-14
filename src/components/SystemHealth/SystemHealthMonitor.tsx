'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Database,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SystemMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    error: number;
  };
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  lastChecked: Date;
  responseTime?: number;
  uptime: number;
}

export default function SystemHealthMonitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      status: 'healthy',
      value: 45,
      unit: '%',
      threshold: { warning: 70, error: 90 }
    },
    {
      name: 'Memory Usage',
      status: 'healthy',
      value: 62,
      unit: '%',
      threshold: { warning: 80, error: 95 }
    },
    {
      name: 'Database Connections',
      status: 'healthy',
      value: 12,
      unit: 'active',
      threshold: { warning: 50, error: 80 }
    },
    {
      name: 'API Response Time',
      status: 'healthy',
      value: 125,
      unit: 'ms',
      threshold: { warning: 500, error: 1000 }
    }
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Web Server',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 45,
      uptime: 99.99
    },
    {
      name: 'Database',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 12,
      uptime: 99.95
    },
    {
      name: 'Video Service',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 89,
      uptime: 99.90
    },
    {
      name: 'File Storage',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 156,
      uptime: 99.98
    },
    {
      name: 'Real-time Updates',
      status: 'operational',
      lastChecked: new Date(),
      responseTime: 23,
      uptime: 99.85
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => prev.map(metric => {
        const variance = Math.random() * 10 - 5; // ±5 variance
        const newValue = Math.max(0, Math.min(100, metric.value + variance));
        
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        if (newValue >= metric.threshold.error) {
          status = 'error';
        } else if (newValue >= metric.threshold.warning) {
          status = 'warning';
        }
        
        return { ...metric, value: Math.round(newValue), status };
      }));

      // Update service status
      setServices(prev => prev.map(service => {
        // Occasionally simulate issues
        if (Math.random() > 0.98) {
          return {
            ...service,
            status: 'degraded',
            lastChecked: new Date(),
            responseTime: (service.responseTime || 0) * 3
          };
        }
        
        return {
          ...service,
          status: 'operational',
          lastChecked: new Date(),
          responseTime: Math.round((service.responseTime || 0) + (Math.random() * 20 - 10))
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      healthy: 'bg-green-100 text-green-700',
      operational: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      degraded: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      outage: 'bg-red-100 text-red-700',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-700'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'CPU Usage':
        return <Cpu className="h-5 w-5 text-gray-400" />;
      case 'Memory Usage':
        return <HardDrive className="h-5 w-5 text-gray-400" />;
      case 'Database Connections':
        return <Database className="h-5 w-5 text-gray-400" />;
      case 'API Response Time':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const overallHealth = [...metrics, ...services].every(
    item => item.status === 'healthy' || item.status === 'operational'
  );

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Alert className={overallHealth ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        {overallHealth ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        )}
        <AlertDescription className="text-sm font-medium">
          {overallHealth ? (
            'All systems are operating normally'
          ) : (
            'Some systems are experiencing issues'
          )}
        </AlertDescription>
      </Alert>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.name)}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {metric.value}{metric.unit}
                    </span>
                    {getStatusIcon(metric.status)}
                  </div>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${
                    metric.status === 'error' ? 'bg-red-100' :
                    metric.status === 'warning' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-gray-600">
                      Last checked {formatDistanceToNow(service.lastChecked, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {service.responseTime && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{service.responseTime}ms</p>
                      <p className="text-xs text-gray-600">Response time</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.uptime}%</p>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-400" />
            <p className="text-sm">No incidents in the last 7 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}