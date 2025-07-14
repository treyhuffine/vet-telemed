'use client';

import {
  Activity,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useVetAuth } from '@/context/VetAuth';
import NotificationBell from '@/components/Notifications/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MainNav() {
  const router = useRouter();
  const { user, signOut } = useVetAuth();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EmergencyVet</span>
            </Link>

            {/* Main Navigation Links */}
            <div className="ml-10 hidden items-center space-x-4 md:flex">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              {user.role === 'vet_tech' && (
                <>
                  <Link href="/intake/new">
                    <Button variant="ghost" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      New Patient
                    </Button>
                  </Link>
                  <Link href="/search/patient">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </Link>
                </>
              )}

              {user.role === 'vet' && (
                <Link href="/cases/active">
                  <Button variant="ghost" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    My Cases
                  </Button>
                </Link>
              )}

              {user.role === 'admin' && (
                <>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="ghost" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/admin/monitoring">
                    <Button variant="ghost" size="sm">
                      <Activity className="mr-2 h-4 w-4" />
                      Monitoring
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin/audit-log')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Audit Log</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/training')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Training Center</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help Center</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
