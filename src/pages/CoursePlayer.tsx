import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fromTable } from '@/lib/supabase-helpers';
import { sanitizeHTML } from '@/lib/sanitize-html';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
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
import type { Course, CourseModule, Lesson, LessonProgress } from '@/types/database';

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [searchParams] = useSearchParams();
  const lessonFromQuery = searchParams.get('lesson');
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Calculate progress dynamically
  const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  useEffect(() => {
    // Set current lesson from URL param, query string, or default to first
    const targetLessonId = lessonId || lessonFromQuery;
    
    if (targetLessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === targetLessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        return;
      }
    }
    
    // Default to first lesson if no target or target not found
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessonId, lessonFromQuery, lessons]);

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
        .order('sort_order', { ascending: true });

      if (modulesError) throw modulesError;
      setModules((modulesData || []) as CourseModule[]);

      // Fetch lessons - RLS determines what's visible
      if (modulesData && modulesData.length > 0) {
        const moduleIds = (modulesData as CourseModule[]).map(m => m.id);
        const { data: lessonsData, error: lessonsError } = await fromTable('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('sort_order', { ascending: true });

        if (lessonsError) throw lessonsError;
        const fetchedLessons = (lessonsData || []) as Lesson[];
        setLessons(fetchedLessons);

        // Fetch user's lesson progress for these lessons
        if (user && fetchedLessons.length > 0) {
          const lessonIds = fetchedLessons.map(l => l.id);
          const { data: progressData } = await fromTable('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);

          if (progressData) {
            const progressMap: Record<string, LessonProgress> = {};
            (progressData as LessonProgress[]).forEach(p => {
              progressMap[p.lesson_id] = p;
            });
            setLessonProgress(progressMap);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upsert lesson progress when opening a lesson
  const trackLessonOpen = useCallback(async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await fromTable('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          time_spent: lessonProgress[lessonId]?.time_spent || 0,
          last_position: lessonProgress[lessonId]?.last_position || 0,
          completed: lessonProgress[lessonId]?.completed || false,
        } as any, {
          onConflict: 'user_id,lesson_id',
        });

      if (error) {
        console.error('Error tracking lesson open:', error);
      }
    } catch (error) {
      console.error('Error tracking lesson open:', error);
    }
  }, [user, lessonProgress]);

  // Update progress (position, time spent)
  const updateProgress = useCallback(async (
    lessonId: string, 
    updates: { last_position?: number; time_spent?: number }
  ) => {
    if (!user) return;

    try {
      const { data, error } = await fromTable('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          ...updates,
        } as any, {
          onConflict: 'user_id,lesson_id',
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating progress:', error);
        return;
      }

      if (data) {
        setLessonProgress(prev => ({
          ...prev,
          [lessonId]: data as LessonProgress,
        }));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [user]);

  // Mark lesson as complete
  const markLessonComplete = useCallback(async (lessonId: string) => {
    if (!user) return;

    try {
      const { data, error } = await fromTable('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        } as any, {
          onConflict: 'user_id,lesson_id',
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error marking lesson complete:', error);
        return;
      }

      if (data) {
        setLessonProgress(prev => ({
          ...prev,
          [lessonId]: data as LessonProgress,
        }));
        toast({
          title: 'Lesson completed!',
          description: 'Your progress has been saved.',
        });
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  }, [user, toast]);

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
            {/* Course Header with Progress */}
            <div className="p-4 border-b">
              <Link 
                to={`/courses/${courseId}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
              <h2 className="font-display font-semibold text-lg line-clamp-2 mb-3">{course.title}</h2>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{completedLessons}/{totalLessons} lessons</span>
                  <span className="font-medium text-primary">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
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
                            const LessonIcon = getLessonIcon(lesson.content_type);
                            const isActive = currentLesson?.id === lesson.id;
                            const isCompleted = lessonProgress[lesson.id]?.completed;

                            return (
                              <SidebarMenuItem key={lesson.id}>
                                <SidebarMenuButton
                                  onClick={() => {
                                    setCurrentLesson(lesson);
                                    trackLessonOpen(lesson.id);
                                  }}
                                  className={`w-full justify-start px-4 py-2 ${
                                    isActive 
                                      ? 'bg-primary/10 text-primary font-medium' 
                                      : 'hover:bg-muted/50'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="h-4 w-4 mr-2 shrink-0 text-success" />
                                  ) : (
                                    <LessonIcon className="h-4 w-4 mr-2 shrink-0" />
                                  )}
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
              <LessonViewer 
                lesson={currentLesson} 
                progress={lessonProgress[currentLesson.id]}
                onUpdateProgress={(updates) => updateProgress(currentLesson.id, updates)}
                onMarkComplete={() => markLessonComplete(currentLesson.id)}
              />
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

interface LessonViewerProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onUpdateProgress: (updates: { last_position?: number; time_spent?: number }) => void;
  onMarkComplete: () => void;
}

// Lesson Viewer Component
function LessonViewer({ lesson, progress, onUpdateProgress, onMarkComplete }: LessonViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeSpentRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const content = lesson.content as Record<string, unknown> | null;

  // Track time spent
  useEffect(() => {
    startTimeRef.current = Date.now();
    timeSpentRef.current = progress?.time_spent || 0;

    return () => {
      // Save time spent when leaving lesson
      const additionalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const totalTime = timeSpentRef.current + additionalTime;
      onUpdateProgress({ time_spent: totalTime });
    };
  }, [lesson.id]);

  // Set initial video position
  useEffect(() => {
    if (videoRef.current && progress?.last_position) {
      videoRef.current.currentTime = progress.last_position;
    }
  }, [progress?.last_position, lesson.id]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      // Update position every 10 seconds
      if (currentTime % 10 === 0 && currentTime > 0) {
        onUpdateProgress({ last_position: currentTime });
      }
    }
  };

  const handleVideoEnded = () => {
    if (!progress?.completed) {
      onMarkComplete();
    }
  };

  if (lesson.content_type === 'video') {
    const videoUrl = content?.url as string | undefined;
    
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            {videoUrl ? (
              <video 
                ref={videoRef}
                src={videoUrl} 
                controls 
                className="w-full h-full"
                poster={content?.thumbnail as string | undefined}
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">{lesson.title}</h2>
              {progress?.completed ? (
                <span className="flex items-center gap-1 text-success text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </span>
              ) : (
                <Button size="sm" variant="outline" onClick={onMarkComplete}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}
            </div>
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

  if (lesson.content_type === 'text') {
    const textContent = content?.body as string | undefined;
    
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">{lesson.title}</h2>
            {progress?.completed ? (
              <span className="flex items-center gap-1 text-success text-sm">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            ) : (
              <Button size="sm" variant="outline" onClick={onMarkComplete}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
            )}
          </div>
          
          {textContent ? (
            <div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(textContent) }}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">{lesson.title}</h2>
          {progress?.completed ? (
            <span className="flex items-center gap-1 text-success text-sm">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          ) : (
            <Button size="sm" variant="outline" onClick={onMarkComplete}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mb-4">
          Lesson type: <span className="capitalize">{lesson.content_type}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Duration: {lesson.duration} minutes
        </p>
      </div>
    </div>
  );
}