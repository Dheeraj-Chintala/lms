export type AppRole = 
  | 'super_admin'
  | 'org_admin'
  | 'instructor'
  | 'content_creator'
  | 'manager'
  | 'learner'
  | 'guest';

export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseVisibility = 'public' | 'org_only' | 'private';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonType = 'video' | 'text' | 'quiz' | 'file';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  org_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  job_title?: string | null;
  department?: string | null;
  timezone?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  org_id: string;
  role: AppRole;
  created_at: string;
}

export interface Course {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  instructor_id: string;
  status: CourseStatus;
  category: string | null;
  duration: string | null;
  // Optional fields for compatibility with existing pages
  visibility?: CourseVisibility;
  difficulty?: DifficultyLevel;
  estimated_duration?: number;
  price?: number;
  is_free?: boolean;
  published_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_type: LessonType;
  content_url: string | null;
  content_text: string | null;
  content?: Record<string, unknown> | null;
  duration: number | null;
  sort_order: number;
  order_index?: number;
  lesson_type?: LessonType;
  is_preview?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent?: number;
  last_position?: number;
  created_at: string;
  updated_at?: string;
}

export interface CourseWithInstructor extends Course {
  instructor?: Profile;
}

export interface EnrollmentWithCourse extends Enrollment {
  course?: Course;
}
