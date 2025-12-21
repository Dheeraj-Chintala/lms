import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { BookOpen, Users, GraduationCap, Clock, TrendingUp, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course, Enrollment } from '@/types/database';

interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  totalUsers?: number;
  totalEnrollments?: number;
}

export default function Dashboard() {
  const { profile, roles, orgId, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOrgAdmin = hasRole('org_admin');
  const isInstructor = hasRole('instructor');

  useEffect(() => {
    if (orgId) {
      fetchDashboardData();
    }
  }, [orgId]);

  const fetchDashboardData = async () => {
    try {
      const { data: coursesData, count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: enrollmentsData, count: enrollmentsCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact' });

      const completedCount = enrollmentsData?.filter(e => e.completed_at !== null).length || 0;

      let statsData: DashboardStats = {
        totalCourses: coursesCount || 0,
        enrolledCourses: enrollmentsCount || 0,
        completedCourses: completedCount,
      };

      if (isOrgAdmin && orgId) {
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', orgId);

        statsData.totalUsers = usersCount || 0;
        statsData.totalEnrollments = enrollmentsCount || 0;
      }

      setStats(statsData);
      setRecentCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {isOrgAdmin 
              ? "Here's an overview of your organization's learning platform."
              : isInstructor
              ? "Manage your courses and track student progress."
              : "Continue your learning journey."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isOrgAdmin && (
            <>
              <StatCard
                title="Total Users"
                value={stats?.totalUsers}
                icon={<Users className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="Total Courses"
                value={stats?.totalCourses}
                icon={<BookOpen className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="Total Enrollments"
                value={stats?.totalEnrollments}
                icon={<GraduationCap className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="Completion Rate"
                value={stats?.totalEnrollments 
                  ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100) + '%'
                  : '0%'}
                icon={<TrendingUp className="h-5 w-5" />}
                isLoading={isLoading}
              />
            </>
          )}

          {!isOrgAdmin && (
            <>
              <StatCard
                title="Enrolled Courses"
                value={stats?.enrolledCourses}
                icon={<BookOpen className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="Completed"
                value={stats?.completedCourses}
                icon={<Award className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="In Progress"
                value={(stats?.enrolledCourses || 0) - (stats?.completedCourses || 0)}
                icon={<Clock className="h-5 w-5" />}
                isLoading={isLoading}
              />
              <StatCard
                title="Available Courses"
                value={stats?.totalCourses}
                icon={<GraduationCap className="h-5 w-5" />}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        {/* Recent Courses / Continue Learning */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">
                {isOrgAdmin ? 'Recent Courses' : 'Continue Learning'}
              </CardTitle>
              <CardDescription>
                {isOrgAdmin 
                  ? 'Latest courses in your organization'
                  : 'Pick up where you left off'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentCourses.length > 0 ? (
                <div className="space-y-3">
                  {recentCourses.slice(0, 4).map(course => (
                    <CourseListItem key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<BookOpen className="h-10 w-10" />}
                  title="No courses yet"
                  description="Courses will appear here once available."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
              <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <QuickAction
                  href="/courses"
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Browse Courses"
                  description="Explore available courses"
                />
                {isInstructor && (
                  <QuickAction
                    href="/courses/create"
                    icon={<GraduationCap className="h-5 w-5" />}
                    title="Create Course"
                    description="Build a new learning experience"
                  />
                )}
                {isOrgAdmin && (
                  <QuickAction
                    href="/users"
                    icon={<Users className="h-5 w-5" />}
                    title="Manage Users"
                    description="View organization members"
                  />
                )}
                <QuickAction
                  href="/my-learning"
                  icon={<Award className="h-5 w-5" />}
                  title="My Learning"
                  description="View your enrolled courses"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  isLoading 
}: { 
  title: string; 
  value: number | string | undefined; 
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-display font-bold mt-1">{value ?? 0}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseListItem({ course }: { course: Course }) {
  const statusColors = {
    draft: 'bg-warning/10 text-warning',
    published: 'bg-success/10 text-success',
    archived: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
        <BookOpen className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{course.title}</p>
        <p className="text-sm text-muted-foreground truncate">
          {course.category || 'Uncategorized'}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[course.status]}`}>
        {course.status}
      </span>
    </div>
  );
}

function QuickAction({ 
  href, 
  icon, 
  title, 
  description 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-medium group-hover:text-primary transition-colors">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}

function EmptyState({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
