'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Download,
  FileJson,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Users,
  FileText,
  BarChart3,
  Info,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useVetAuth } from '@/context/VetAuth';
import { format } from 'date-fns';

interface ExportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}

export default function DataExportScreen() {
  const router = useRouter();
  const { user } = useVetAuth();
  const [exportType, setExportType] = useState('cases');
  const [format, setFormat] = useState('json');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [exportOptions, setExportOptions] = useState({
    includeNotes: true,
    includeVitals: true,
    includeOwnerInfo: true,
    includeMedicalHistory: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [recentExports, setRecentExports] = useState<ExportJob[]>([]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let url = `/api/v1/export/${exportType}?format=${format}`;
      
      // Add date range for relevant exports
      if (exportType !== 'patients') {
        url += `&dateFrom=${dateRange.from.toISOString()}&dateTo=${dateRange.to.toISOString()}`;
      }
      
      // Add options based on export type
      if (exportType === 'cases') {
        url += `&includeNotes=${exportOptions.includeNotes}&includeVitals=${exportOptions.includeVitals}`;
      } else if (exportType === 'patients') {
        url += `&includeOwnerInfo=${exportOptions.includeOwnerInfo}&includeMedicalHistory=${exportOptions.includeMedicalHistory}`;
      } else if (exportType === 'analytics') {
        url += '&reportType=detailed';
      }

      const response = await fetch(url);
      
      if (response.ok) {
        // Download the file
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${exportType}-export-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        // Add to recent exports
        const newExport: ExportJob = {
          id: Date.now().toString(),
          type: exportType,
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date(),
        };
        setRecentExports([newExport, ...recentExports.slice(0, 4)]);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      const failedExport: ExportJob = {
        id: Date.now().toString(),
        type: exportType,
        status: 'failed',
        createdAt: new Date(),
        error: 'Export failed. Please try again.',
      };
      setRecentExports([failedExport, ...recentExports.slice(0, 4)]);
    } finally {
      setIsExporting(false);
    }
  };

  const exportTypes = [
    {
      value: 'cases',
      label: 'Cases',
      description: 'Export case data including vitals and notes',
      icon: FileText,
      available: user?.role === 'admin' || user?.role === 'vet',
    },
    {
      value: 'patients',
      label: 'Patients',
      description: 'Export patient profiles and medical history',
      icon: Users,
      available: user?.role === 'admin',
    },
    {
      value: 'analytics',
      label: 'Analytics',
      description: 'Export performance metrics and reports',
      icon: BarChart3,
      available: user?.role === 'admin',
    },
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
                <p className="text-sm text-gray-600 mt-1">Export your data in various formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Export Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Export Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Type</CardTitle>
                  <CardDescription>Choose what data you want to export</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={exportType} onValueChange={setExportType}>
                    <div className="space-y-3">
                      {exportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <label
                            key={type.value}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              exportType === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            } ${!type.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <RadioGroupItem 
                              value={type.value} 
                              disabled={!type.available}
                              className="mt-1"
                            />
                            <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{type.label}</p>
                                {!type.available && (
                                  <Badge variant="outline" className="text-xs">
                                    Admin only
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Date Range */}
              {exportType !== 'patients' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Date Range</CardTitle>
                    <CardDescription>Select the time period for your export</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(dateRange.from, 'PP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>To</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(dateRange.to, 'PP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Customize what to include in your export</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exportType === 'cases' && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeNotes">Include case notes</Label>
                          <Switch
                            id="includeNotes"
                            checked={exportOptions.includeNotes}
                            onCheckedChange={(checked) => 
                              setExportOptions({ ...exportOptions, includeNotes: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeVitals">Include vitals data</Label>
                          <Switch
                            id="includeVitals"
                            checked={exportOptions.includeVitals}
                            onCheckedChange={(checked) => 
                              setExportOptions({ ...exportOptions, includeVitals: checked })
                            }
                          />
                        </div>
                      </>
                    )}
                    
                    {exportType === 'patients' && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeOwnerInfo">Include owner information</Label>
                          <Switch
                            id="includeOwnerInfo"
                            checked={exportOptions.includeOwnerInfo}
                            onCheckedChange={(checked) => 
                              setExportOptions({ ...exportOptions, includeOwnerInfo: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeMedicalHistory">Include medical history</Label>
                          <Switch
                            id="includeMedicalHistory"
                            checked={exportOptions.includeMedicalHistory}
                            onCheckedChange={(checked) => 
                              setExportOptions({ ...exportOptions, includeMedicalHistory: checked })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Format Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={format} onValueChange={setFormat}>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        format === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="json" />
                        <FileJson className="h-5 w-5" />
                        <span>JSON</span>
                      </label>
                      <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        format === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <RadioGroupItem value="csv" />
                        <FileSpreadsheet className="h-5 w-5" />
                        <span>CSV</span>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Export Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleExport}
                disabled={isExporting || (!exportTypes.find(t => t.value === exportType)?.available)}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Exports */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exports</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentExports.length === 0 ? (
                    <p className="text-sm text-gray-600">No recent exports</p>
                  ) : (
                    <div className="space-y-3">
                      {recentExports.map((job) => (
                        <div key={job.id} className="flex items-start gap-3">
                          {job.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{job.type} export</p>
                            <p className="text-xs text-gray-600">
                              {job.createdAt.toLocaleString()}
                            </p>
                            {job.error && (
                              <p className="text-xs text-red-600 mt-1">{job.error}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Data Privacy</strong>
                  <p className="mt-1">
                    Exported data contains sensitive information. Please handle with care and in compliance with privacy regulations.
                  </p>
                </AlertDescription>
              </Alert>

              {/* Storage Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max records</span>
                    <span className="font-medium">10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max file size</span>
                    <span className="font-medium">50 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retention</span>
                    <span className="font-medium">24 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}