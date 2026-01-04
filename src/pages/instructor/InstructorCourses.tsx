import { Link } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle } from 'lucide-react';

export default function InstructorCourses() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your course content.
            </p>
          </div>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/instructor/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">All Courses</CardTitle>
            <CardDescription>View and manage all your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <BookOpen className="h-10 w-10" />
              </div>
              <p className="font-medium text-lg mb-2">No courses yet</p>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start by creating your first course. You can add modules, lessons, and assessments.
              </p>
              <Button asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/instructor/courses/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}