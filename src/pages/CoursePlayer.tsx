import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fromTable } from '@/lib/supabase-helpers';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  FileText, 
  Lock, 
  PlayCircle,
  Menu
} from 'lucide-react';
import type { Course, CourseModule, Lesson } from '@/types/database';

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  useEffect(() => {
    // Set current lesson when lessonId changes or lessons load
    if (lessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === lessonId);
      setCurrentLesson(lesson || null);
    } else if (lessons.length > 0 && !currentLesson) {
      // Default to first lesson
      setCurrentLesson(lessons[0]);
    }
  }, [lessonId, lessons]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await fromTable('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      setCourse(courseData as Course | null);

      if (!courseData) {
        setIsLoading(false);
        return;
      }

      // Fetch modules
      const { data: modulesData, error: modulesError } = await fromTable('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;
      setModules((modulesData || []) as CourseModule[]);

      // Fetch lessons - RLS determines what's visible
      if (modulesData && modulesData.length > 0) {
        const moduleIds = (modulesData as CourseModule[]).map(m => m.id);
        const { data: lessonsData, error: lessonsError } = await fromTable('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons((lessonsData || []) as Lesson[]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLessonsForModule = (moduleId: string) => {
    return lessons.filter(l => l.module_id === moduleId);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'text':
        return FileText;
      default:
        return BookOpen;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">This course does not exist or you do not have access.</p>
          <Button asChild variant="outline">
            <Link to="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // No lessons available - show locked state
  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Content Locked</h2>
          <p className="text-muted-foreground mb-6">
            You need to enroll in this course to access its content.
          </p>
          <Button asChild>
            <Link to={`/courses/${courseId}`}>
              View Course Details
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Course Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            {/* Course Header */}
            <div className="p-4 border-b">
              <Link 
                to={`/courses/${courseId}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
              <h2 className="font-display font-semibold text-lg line-clamp-2">{course.title}</h2>
            </div>

            {/* Modules & Lessons */}
            <ScrollArea className="flex-1">
              {modules.map((module, moduleIndex) => {
                const moduleLessons = getLessonsForModule(module.id);
                
                return (
                  <SidebarGroup key={module.id}>
                    <SidebarGroupLabel className="px-4 py-2">
                      <span className="flex items-center gap-2">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {moduleIndex + 1}
                        </span>
                        <span className="truncate">{module.title}</span>
                      </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {moduleLessons.length > 0 ? (
                          moduleLessons.map((lesson) => {
                            const LessonIcon = getLessonIcon(lesson.lesson_type);
                            const isActive = currentLesson?.id === lesson.id;

                            return (
                              <SidebarMenuItem key={lesson.id}>
                                <SidebarMenuButton
                                  onClick={() => setCurrentLesson(lesson)}
                                  className={`w-full justify-start px-4 py-2 ${
                                    isActive 
                                      ? 'bg-primary/10 text-primary font-medium' 
                                      : 'hover:bg-muted/50'
                                  }`}
                                >
                                  <LessonIcon className="h-4 w-4 mr-2 shrink-0" />
                                  <span className="truncate">{lesson.title}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })
                        ) : (
                          <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            <span>No lessons available</span>
                          </div>
                        )}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                );
              })}
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b flex items-center px-4 gap-4 shrink-0">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1 min-w-0">
              <h1 className="font-medium truncate">
                {currentLesson?.title || 'Select a lesson'}
              </h1>
            </div>
          </header>

          {/* Lesson Content */}
          <div className="flex-1 overflow-auto">
            {currentLesson ? (
              <LessonViewer lesson={currentLesson} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a lesson to begin</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// Lesson Viewer Component
function LessonViewer({ lesson }: { lesson: Lesson }) {
  const content = lesson.content as Record<string, unknown> | null;

  if (lesson.lesson_type === 'video') {
    const videoUrl = content?.url as string | undefined;
    
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full"
                poster={content?.thumbnail as string | undefined}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 mx-auto mb-3" />
                  <p>Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground">
              Duration: {lesson.duration} minutes
            </p>
            {content?.description && (
              <p className="text-muted-foreground">{content.description as string}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (lesson.lesson_type === 'text') {
    const textContent = content?.body as string | undefined;
    
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-bold mb-6">{lesson.title}</h2>
          
          {textContent ? (
            <div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No content available for this lesson</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default/other lesson types
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-display font-bold mb-4">{lesson.title}</h2>
        <p className="text-muted-foreground mb-4">
          Lesson type: <span className="capitalize">{lesson.lesson_type}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Duration: {lesson.duration} minutes
        </p>
      </div>
    </div>
  );
}