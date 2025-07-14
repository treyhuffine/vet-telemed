'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Shield,
  FileText,
  UserPlus,
  UserX,
  Settings,
  Activity,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { mockUsers } from '@/constants/mocks';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'vet',
    action: 'case.complete',
    resource: 'Case',
    resourceId: 'CASE-2024-0123',
    details: 'Completed consultation for Buddy',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    userId: '2',
    userName: 'Mike Chen',
    userRole: 'vet_tech',
    action: 'vitals.update',
    resource: 'Vitals',
    resourceId: 'CASE-2024-0123',
    details: 'Updated vitals: Temp 101.5°F, HR 120',
    ipAddress: '192.168.1.101',
    status: 'success',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    userId: '3',
    userName: 'Emily Rodriguez',
    userRole: 'admin',
    action: 'user.create',
    resource: 'User',
    resourceId: 'user-456',
    details: 'Created new user account for Dr. James Wilson',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'vet',
    action: 'login.failed',
    resource: 'Authentication',
    details: 'Failed login attempt - incorrect password',
    ipAddress: '192.168.1.100',
    status: 'failed',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    userId: '4',
    userName: 'Dr. James Wilson',
    userRole: 'vet',
    action: 'file.upload',
    resource: 'File',
    resourceId: 'file-789',
    details: 'Uploaded X-ray image (2.3 MB)',
    ipAddress: '192.168.1.103',
    status: 'success',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    userId: '3',
    userName: 'Emily Rodriguez',
    userRole: 'admin',
    action: 'settings.update',
    resource: 'Clinic Settings',
    details: 'Updated business hours for Saturday',
    ipAddress: '192.168.1.102',
    status: 'success',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    userId: '2',
    userName: 'Mike Chen',
    userRole: 'vet_tech',
    action: 'case.transfer',
    resource: 'Case',
    resourceId: 'CASE-2024-0122',
    details: 'Transferred case to Dr. Sarah Johnson',
    ipAddress: '192.168.1.101',
    status: 'success',
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'vet',
    action: 'permission.denied',
    resource: 'Admin Panel',
    details: 'Attempted to access admin settings',
    ipAddress: '192.168.1.100',
    status: 'warning',
  },
];

export default function AuditLogScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter logs
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAction = filterAction === 'all' || log.action.startsWith(filterAction);
    const matchesUser = filterUser === 'all' || log.userId === filterUser;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesAction && matchesUser && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting audit logs...');
  };

  const getActionIcon = (action: string) => {
    if (action.startsWith('user')) return <UserPlus className="h-4 w-4" />;
    if (action.startsWith('case')) return <FileText className="h-4 w-4" />;
    if (action.startsWith('vitals')) return <Activity className="h-4 w-4" />;
    if (action.startsWith('file')) return <FileText className="h-4 w-4" />;
    if (action.startsWith('settings')) return <Settings className="h-4 w-4" />;
    if (action.startsWith('login')) return <Shield className="h-4 w-4" />;
    if (action.startsWith('permission')) return <Shield className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActionDisplay = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'case.complete': 'Completed Case',
      'case.create': 'Created Case',
      'case.update': 'Updated Case',
      'case.transfer': 'Transferred Case',
      'vitals.update': 'Updated Vitals',
      'vitals.create': 'Recorded Vitals',
      'user.create': 'Created User',
      'user.update': 'Updated User',
      'user.delete': 'Deleted User',
      'file.upload': 'Uploaded File',
      'file.delete': 'Deleted File',
      'settings.update': 'Updated Settings',
      'login.success': 'Successful Login',
      'login.failed': 'Failed Login',
      'permission.denied': 'Permission Denied',
    };
    
    return actionMap[action] || action;
  };

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action.split('.')[0])));

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
                <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-sm text-gray-600 mt-1">Track all system activities and changes</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Security Alert */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Audit logs are immutable and retained for 90 days. All user actions are tracked for security
            and compliance purposes.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search actions, users, or details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {mockUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{format(log.timestamp, 'MMM d, yyyy')}</p>
                        <p className="text-gray-600">{format(log.timestamp, 'h:mm:ss a')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {log.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{log.userName}</p>
                          <p className="text-xs text-gray-600">{log.userRole}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm font-medium">{getActionDisplay(log.action)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{log.resource}</p>
                        {log.resourceId && (
                          <p className="text-gray-600">{log.resourceId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {log.details || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                        {log.ipAddress}
                      </code>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No audit logs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {mockAuditLogs.length} entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}