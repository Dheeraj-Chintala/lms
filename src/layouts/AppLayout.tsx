import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PlusCircle,
  Building2,
  Library,
  Shield,
  BarChart3,
  Video,
  FileCheck,
  Award,
  Briefcase,
  ClipboardList,
} from 'lucide-react';
import type { AppRole } from '@/types/database';
import { ROLE_LABELS } from '@/types/database';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  allowedRoles: AppRole[];
}

// Navigation items with role-based access
const getNavItems = (): NavItem[] => [
  // Student navigation
  { 
    label: 'Dashboard', 
    href: '/student/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ['student'],
  },
  { 
    label: 'My Learning', 
    href: '/my-learning', 
    icon: <GraduationCap className="h-5 w-5" />,
    allowedRoles: ['student'],
  },
  { 
    label: 'Browse Courses', 
    href: '/courses', 
    icon: <BookOpen className="h-5 w-5" />,
    allowedRoles: ['student'],
  },
  { 
    label: 'Internships', 
    href: '/internships', 
    icon: <Briefcase className="h-5 w-5" />,
    allowedRoles: ['student'],
  },
  { 
    label: 'My Internships', 
    href: '/my-internships', 
    icon: <ClipboardList className="h-5 w-5" />,
    allowedRoles: ['student'],
  },
  // Trainer/Mentor navigation
  { 
    label: 'Dashboard', 
    href: '/instructor/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'Analytics', 
    href: '/instructor/analytics', 
    icon: <BarChart3 className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'My Courses', 
    href: '/instructor/courses', 
    icon: <Library className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'Create Course', 
    href: '/instructor/courses/create', 
    icon: <PlusCircle className="h-5 w-5" />,
    allowedRoles: ['trainer'],
  },
  { 
    label: 'My Students', 
    href: '/instructor/students', 
    icon: <Users className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'Live Classes', 
    href: '/instructor/live-classes', 
    icon: <Video className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'Assignments', 
    href: '/instructor/assignments', 
    icon: <FileCheck className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  { 
    label: 'Internships', 
    href: '/internships', 
    icon: <Briefcase className="h-5 w-5" />,
    allowedRoles: ['trainer', 'mentor'],
  },
  // Admin navigation
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ['super_admin', 'admin', 'sub_admin'],
  },
  { 
    label: 'Courses', 
    href: '/admin/courses', 
    icon: <BookOpen className="h-5 w-5" />,
    allowedRoles: ['super_admin', 'admin', 'sub_admin'],
  },
  { 
    label: 'Users', 
    href: '/admin/users', 
    icon: <Users className="h-5 w-5" />,
    allowedRoles: ['super_admin', 'admin', 'sub_admin'],
  },
  { 
    label: 'Certificates', 
    href: '/admin/certificates', 
    icon: <Award className="h-5 w-5" />,
    allowedRoles: ['super_admin', 'admin', 'sub_admin', 'trainer'],
  },
  { 
    label: 'Roles & Permissions', 
    href: '/admin/roles', 
    icon: <Shield className="h-5 w-5" />,
    allowedRoles: ['super_admin'],
  },
  { 
    label: 'Internships', 
    href: '/internships', 
    icon: <Briefcase className="h-5 w-5" />,
    allowedRoles: ['super_admin', 'admin', 'sub_admin'],
  },
  // Corporate HR / Manager navigation
  { 
    label: 'Dashboard', 
    href: '/manager/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ['corporate_hr'],
  },
  { 
    label: 'Browse Courses', 
    href: '/courses', 
    icon: <BookOpen className="h-5 w-5" />,
    allowedRoles: ['corporate_hr'],
  },
  { 
    label: 'My Learning', 
    href: '/my-learning', 
    icon: <GraduationCap className="h-5 w-5" />,
    allowedRoles: ['corporate_hr'],
  },
  // Distribution network navigation
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: ['franchise', 'distributor', 'super_distributor', 'affiliate'],
  },
  { 
    label: 'Browse Courses', 
    href: '/courses', 
    icon: <BookOpen className="h-5 w-5" />,
    allowedRoles: ['franchise', 'distributor', 'super_distributor', 'affiliate'],
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { profile, roles, primaryRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Filter nav items based on user's roles
  const filteredNavItems = getNavItems().filter(item => 
    item.allowedRoles.some(role => roles.includes(role))
  );

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = () => {
    return primaryRole ? ROLE_LABELS[primaryRole] : 'User';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">LMS</span>
            </div>
          </div>
          <UserMenu 
            profile={profile} 
            getInitials={getInitials} 
            getRoleBadge={getRoleBadge}
            onSignOut={handleSignOut}
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">LMS Platform</h1>
                <p className="text-xs text-muted-foreground">{getRoleBadge()}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* User Section - Desktop */}
            <div className="hidden lg:block border-t border-border p-4">
              <UserMenu 
                profile={profile} 
                getInitials={getInitials} 
                getRoleBadge={getRoleBadge}
                onSignOut={handleSignOut}
                expanded
              />
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface UserMenuProps {
  profile: any;
  getInitials: (name: string | null) => string;
  getRoleBadge: () => string;
  onSignOut: () => void;
  expanded?: boolean;
}

function UserMenu({ profile, getInitials, getRoleBadge, onSignOut, expanded }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "h-auto p-2 hover:bg-secondary",
            expanded && "w-full justify-start"
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="ml-3 text-left">
              <p className="text-sm font-medium truncate max-w-[140px]">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">{getRoleBadge()}</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{getRoleBadge()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
