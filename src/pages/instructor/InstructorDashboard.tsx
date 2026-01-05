import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, PlusCircle, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fromTable } from '@/lib/supabase-helpers';
import type { Course } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
}

export default function InstructorDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verify user has instructor role
      const { data: instructorRole } = await fromTable('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .in('role', ['instructor', 'content_creator', 'org_admin', 'super_admin'])
        .maybeSingle();

      if (!instructorRole) {
        setIsLoading(false);
        return;
      }

      // Fetch instructor's courses
      const { data: coursesData, error: coursesError } = await fromTable('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      const instructorCourses = coursesData || [];
      setCourses(instructorCourses);

      // Calculate stats from courses
      const published = instructorCourses.filter(c => c.status === 'published').length;
      const drafts = instructorCourses.filter(c => c.status === 'draft').length;

      // Fetch enrollments for instructor's courses
      let totalEnrollments = 0;
      if (instructorCourses.length > 0) {
        const courseIds = instructorCourses.map(c => c.id);
        const { count } = await fromTable('enrollments')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds);
        totalEnrollments = count || 0;
      }

      setStats({
        totalCourses: instructorCourses.length,
        publishedCourses: published,
        draftCourses: drafts,
        totalEnrollments,
      });
    } catch (error) {
      console.error('Error fetching instructor data:', error);
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
            value={stats?.totalCourses} 
            icon={<BookOpen className="h-5 w-5" />}
            description="Courses created"
            isLoading={isLoading}
          />
          <StatCard 
            title="Published" 
            value={stats?.publishedCourses} 
            icon={<TrendingUp className="h-5 w-5" />}
            description="Live courses"
            isLoading={isLoading}
          />
          <StatCard 
            title="Drafts" 
            value={stats?.draftCourses} 
            icon={<Clock className="h-5 w-5" />}
            description="In progress"
            isLoading={isLoading}
          />
          <StatCard 
            title="Enrollments" 
            value={stats?.totalEnrollments} 
            icon={<Users className="h-5 w-5" />}
            description="Total students"
            isLoading={isLoading}
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
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.slice(0, 5).map(course => (
                    <CourseListItem key={course.id} course={course} />
                  ))}
                  {courses.length > 5 && (
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/instructor/courses">View all courses</Link>
                    </Button>
                  )}
                </div>
              ) : (
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
              )}
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

function StatCard({ title, value, icon, description, isLoading }: { 
  title: string; 
  value: number | undefined; 
  icon: React.ReactNode;
  description: string;
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