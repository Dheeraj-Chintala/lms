import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, PlusCircle, TrendingUp, Clock, BarChart3 } from 'lucide-react';

export default function InstructorDashboard() {
  const { profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">
            {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Instructor'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your courses and track student progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard 
            title="Total Courses" 
            value="0" 
            icon={<BookOpen className="h-5 w-5" />}
            description="Courses created"
          />
          <StatCard 
            title="Published" 
            value="0" 
            icon={<TrendingUp className="h-5 w-5" />}
            description="Live courses"
          />
          <StatCard 
            title="Drafts" 
            value="0" 
            icon={<Clock className="h-5 w-5" />}
            description="In progress"
          />
          <StatCard 
            title="Enrollments" 
            value="0" 
            icon={<Users className="h-5 w-5" />}
            description="Total students"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">My Courses</CardTitle>
              <CardDescription>Courses you've created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <p className="font-medium mb-2">No courses yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first course to get started
                </p>
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/instructor/courses/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Course
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
              <CardDescription>Manage your content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <QuickAction 
                href="/instructor/courses/create" 
                icon={<PlusCircle className="h-5 w-5" />} 
                title="Create New Course" 
                description="Build a new learning experience" 
              />
              <QuickAction 
                href="/instructor/courses" 
                icon={<BookOpen className="h-5 w-5" />} 
                title="Manage Courses" 
                description="View and edit your courses" 
              />
              <QuickAction 
                href="/instructor/analytics" 
                icon={<BarChart3 className="h-5 w-5" />} 
                title="Analytics" 
                description="Track student progress" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon, description }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-display font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, icon, title, description }: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}