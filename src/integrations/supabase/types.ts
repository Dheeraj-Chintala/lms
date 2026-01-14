export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_answers: {
        Row: {
          answered_at: string | null
          auto_graded: boolean | null
          created_at: string
          file_url: string | null
          graded_at: string | null
          graded_by: string | null
          grader_feedback: string | null
          id: string
          is_correct: boolean | null
          marks_obtained: number | null
          question_id: string
          selected_option_id: string | null
          selected_option_ids: string[] | null
          submission_id: string
          text_answer: string | null
          time_spent_seconds: number | null
          updated_at: string
        }
        Insert: {
          answered_at?: string | null
          auto_graded?: boolean | null
          created_at?: string
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grader_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_obtained?: number | null
          question_id: string
          selected_option_id?: string | null
          selected_option_ids?: string[] | null
          submission_id: string
          text_answer?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
        }
        Update: {
          answered_at?: string | null
          auto_graded?: boolean | null
          created_at?: string
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          grader_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          marks_obtained?: number | null
          question_id?: string
          selected_option_id?: string | null
          selected_option_ids?: string[] | null
          submission_id?: string
          text_answer?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assessment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          allowed_file_types: string[] | null
          assessment_id: string
          auto_gradable: boolean
          case_study_content: string | null
          created_at: string
          explanation: string | null
          grading_rubric: string | null
          id: string
          is_required: boolean
          marks: number
          max_file_size_mb: number | null
          question_media_url: string | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sort_order: number
          updated_at: string
        }
        Insert: {
          allowed_file_types?: string[] | null
          assessment_id: string
          auto_gradable?: boolean
          case_study_content?: string | null
          created_at?: string
          explanation?: string | null
          grading_rubric?: string | null
          id?: string
          is_required?: boolean
          marks?: number
          max_file_size_mb?: number | null
          question_media_url?: string | null
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          allowed_file_types?: string[] | null
          assessment_id?: string
          auto_gradable?: boolean
          case_study_content?: string | null
          created_at?: string
          explanation?: string | null
          grading_rubric?: string | null
          id?: string
          is_required?: boolean
          marks?: number
          max_file_size_mb?: number | null
          question_media_url?: string | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_submissions: {
        Row: {
          assessment_id: string
          attempt_number: number
          auto_graded_at: string | null
          created_at: string
          graded_by: string | null
          grader_comments: string | null
          id: string
          manually_graded_at: string | null
          passed: boolean | null
          percentage: number | null
          question_order: string[] | null
          started_at: string
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string | null
          time_spent_seconds: number | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id: string
          attempt_number?: number
          auto_graded_at?: string | null
          created_at?: string
          graded_by?: string | null
          grader_comments?: string | null
          id?: string
          manually_graded_at?: string | null
          passed?: boolean | null
          percentage?: number | null
          question_order?: string[] | null
          started_at?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          time_spent_seconds?: number | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string
          attempt_number?: number
          auto_graded_at?: string | null
          created_at?: string
          graded_by?: string | null
          grader_comments?: string | null
          id?: string
          manually_graded_at?: string | null
          passed?: boolean | null
          percentage?: number | null
          question_order?: string[] | null
          started_at?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          time_spent_seconds?: number | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          allow_resume: boolean
          assessment_type: string
          course_id: string
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          instructions: string | null
          lesson_id: string | null
          max_attempts: number
          module_id: string | null
          negative_mark_value: number | null
          negative_marking: boolean
          passing_marks: number
          questions_per_attempt: number | null
          randomize_options: boolean
          randomize_questions: boolean
          retake_delay_hours: number | null
          show_correct_answers: boolean
          show_score_immediately: boolean
          start_time: string | null
          status: Database["public"]["Enums"]["assessment_status"]
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          allow_resume?: boolean
          assessment_type?: string
          course_id: string
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_attempts?: number
          module_id?: string | null
          negative_mark_value?: number | null
          negative_marking?: boolean
          passing_marks?: number
          questions_per_attempt?: number | null
          randomize_options?: boolean
          randomize_questions?: boolean
          retake_delay_hours?: number | null
          show_correct_answers?: boolean
          show_score_immediately?: boolean
          start_time?: string | null
          status?: Database["public"]["Enums"]["assessment_status"]
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          allow_resume?: boolean
          assessment_type?: string
          course_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_attempts?: number
          module_id?: string | null
          negative_mark_value?: number | null
          negative_marking?: boolean
          passing_marks?: number
          questions_per_attempt?: number | null
          randomize_options?: boolean
          randomize_questions?: boolean
          retake_delay_hours?: number | null
          show_correct_answers?: boolean
          show_score_immediately?: boolean
          start_time?: string | null
          status?: Database["public"]["Enums"]["assessment_status"]
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_courses: {
        Row: {
          bundle_id: string
          course_id: string
          created_at: string
          id: string
          sort_order: number
        }
        Insert: {
          bundle_id: string
          course_id: string
          created_at?: string
          id?: string
          sort_order?: number
        }
        Update: {
          bundle_id?: string
          course_id?: string
          created_at?: string
          id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_courses_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "course_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_purchases: {
        Row: {
          amount_paid: number | null
          bundle_id: string
          expires_at: string | null
          id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          bundle_id: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          bundle_id?: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_purchases_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "course_bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string
          created_by: string
          css_styles: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          logo_position: string | null
          name: string
          org_id: string
          signature_position: string | null
          template_html: string
          updated_at: string
        }
        Insert: {
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          created_by: string
          css_styles?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          logo_position?: string | null
          name: string
          org_id: string
          signature_position?: string | null
          template_html: string
          updated_at?: string
        }
        Update: {
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          created_by?: string
          css_styles?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          logo_position?: string | null
          name?: string
          org_id?: string
          signature_position?: string | null
          template_html?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_verification_logs: {
        Row: {
          certificate_id: string | null
          id: string
          lor_id: string | null
          verification_method: string
          verification_result: string
          verified_at: string
          verifier_ip: string | null
          verifier_user_agent: string | null
        }
        Insert: {
          certificate_id?: string | null
          id?: string
          lor_id?: string | null
          verification_method: string
          verification_result: string
          verified_at?: string
          verifier_ip?: string | null
          verifier_user_agent?: string | null
        }
        Update: {
          certificate_id?: string | null
          id?: string
          lor_id?: string | null
          verification_method?: string
          verification_result?: string
          verified_at?: string
          verifier_ip?: string | null
          verifier_user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_verification_logs_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_verification_logs_lor_id_fkey"
            columns: ["lor_id"]
            isOneToOne: false
            referencedRelation: "letters_of_recommendation"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          additional_data: Json | null
          authorized_signature_url: string | null
          certificate_number: string
          certificate_type:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          course_duration: string | null
          course_id: string
          created_at: string
          end_date: string | null
          enrollment_id: string | null
          expires_at: string | null
          id: string
          is_revoked: boolean | null
          issued_at: string
          issued_by: string | null
          pdf_url: string | null
          qr_code_data: string | null
          recipient_email: string | null
          recipient_name: string | null
          revoked_at: string | null
          revoked_reason: string | null
          start_date: string | null
          template_id: string | null
          user_id: string
          verification_url: string | null
        }
        Insert: {
          additional_data?: Json | null
          authorized_signature_url?: string | null
          certificate_number: string
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          course_duration?: string | null
          course_id: string
          created_at?: string
          end_date?: string | null
          enrollment_id?: string | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_at?: string
          issued_by?: string | null
          pdf_url?: string | null
          qr_code_data?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          start_date?: string | null
          template_id?: string | null
          user_id: string
          verification_url?: string | null
        }
        Update: {
          additional_data?: Json | null
          authorized_signature_url?: string | null
          certificate_number?: string
          certificate_type?:
            | Database["public"]["Enums"]["certificate_type"]
            | null
          course_duration?: string | null
          course_id?: string
          created_at?: string
          end_date?: string | null
          enrollment_id?: string | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          issued_at?: string
          issued_by?: string | null
          pdf_url?: string | null
          qr_code_data?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          start_date?: string | null
          template_id?: string | null
          user_id?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      course_access_rules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_required: boolean
          priority: number | null
          rule_type: string
          rule_value: Json
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          priority?: number | null
          rule_type: string
          rule_value: Json
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          priority?: number | null
          rule_type?: string
          rule_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_access_rules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_batches: {
        Row: {
          batch_code: string | null
          course_end: string | null
          course_id: string
          course_start: string
          created_at: string
          description: string | null
          enrollment_end: string
          enrollment_start: string
          id: string
          max_students: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          batch_code?: string | null
          course_end?: string | null
          course_id: string
          course_start: string
          created_at?: string
          description?: string | null
          enrollment_end: string
          enrollment_start: string
          id?: string
          max_students?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          batch_code?: string | null
          course_end?: string | null
          course_id?: string
          course_start?: string
          created_at?: string
          description?: string | null
          enrollment_end?: string
          enrollment_start?: string
          id?: string
          max_students?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_bundles: {
        Row: {
          created_at: string
          created_by: string
          currency: string | null
          description: string | null
          discount_percent: number | null
          id: string
          is_active: boolean
          org_id: string
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean
          org_id: string
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean
          org_id?: string
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_bundles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prerequisites: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_required: boolean
          prerequisite_course_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          prerequisite_course_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          prerequisite_course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_prerequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prerequisites_prerequisite_course_id_fkey"
            columns: ["prerequisite_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_ratings: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_public: boolean
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_public?: boolean
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_public?: boolean
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_ratings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          access_days: number | null
          category: string | null
          course_type: string
          created_at: string
          currency: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          enrollment_type: string | null
          estimated_hours: number | null
          id: string
          instructor_id: string
          is_featured: boolean | null
          max_students: number | null
          org_id: string
          price: number | null
          published_at: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_days?: number | null
          category?: string | null
          course_type?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          enrollment_type?: string | null
          estimated_hours?: number | null
          id?: string
          instructor_id: string
          is_featured?: boolean | null
          max_students?: number | null
          org_id: string
          price?: number | null
          published_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_days?: number | null
          category?: string | null
          course_type?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          enrollment_type?: string | null
          estimated_hours?: number | null
          id?: string
          instructor_id?: string
          is_featured?: boolean | null
          max_students?: number | null
          org_id?: string
          price?: number | null
          published_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_role_permissions: {
        Row: {
          created_at: string
          custom_role_id: string
          id: string
          permission_id: string
        }
        Insert: {
          created_at?: string
          custom_role_id: string
          id?: string
          permission_id: string
        }
        Update: {
          created_at?: string
          custom_role_id?: string
          id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_role_permissions_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_solution: boolean
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "discussion_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_topics: {
        Row: {
          content: string
          course_id: string
          created_at: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_reply_at: string | null
          reply_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          reply_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          reply_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      doubt_responses: {
        Row: {
          content: string
          created_at: string
          doubt_id: string
          id: string
          is_solution: boolean
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          doubt_id: string
          id?: string
          is_solution?: boolean
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          doubt_id?: string
          id?: string
          is_solution?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_responses_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
        ]
      }
      doubts: {
        Row: {
          assigned_to: string | null
          course_id: string
          created_at: string
          description: string
          id: string
          lesson_id: string | null
          priority: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          course_id: string
          created_at?: string
          description: string
          id?: string
          lesson_id?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          course_id?: string
          created_at?: string
          description?: string
          id?: string
          lesson_id?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doubts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          access_revoked: boolean | null
          batch_id: string | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          expires_at: string | null
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          access_revoked?: boolean | null
          batch_id?: string | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          access_revoked?: boolean | null
          batch_id?: string | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "course_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          last_position: number | null
          lesson_id: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_position?: number | null
          lesson_id: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          last_position?: number | null
          lesson_id?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_text: string | null
          content_type: string
          content_url: string | null
          created_at: string
          duration: number | null
          id: string
          module_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          module_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          module_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      letters_of_recommendation: {
        Row: {
          achievements: string[] | null
          certificate_id: string | null
          content: string
          course_id: string | null
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_public: boolean | null
          issued_at: string
          lor_number: string
          pdf_url: string | null
          performance_rating: number | null
          recipient_email: string | null
          recipient_name: string
          recommendation_type: string
          recommender_name: string
          recommender_signature_url: string | null
          recommender_title: string | null
          skills_highlighted: string[] | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          certificate_id?: string | null
          content: string
          course_id?: string | null
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          issued_at?: string
          lor_number: string
          pdf_url?: string | null
          performance_rating?: number | null
          recipient_email?: string | null
          recipient_name: string
          recommendation_type?: string
          recommender_name: string
          recommender_signature_url?: string | null
          recommender_title?: string | null
          skills_highlighted?: string[] | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          certificate_id?: string | null
          content?: string
          course_id?: string | null
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          issued_at?: string
          lor_number?: string
          pdf_url?: string | null
          performance_rating?: number | null
          recipient_email?: string | null
          recipient_name?: string
          recommendation_type?: string
          recommender_name?: string
          recommender_signature_url?: string | null
          recommender_title?: string | null
          skills_highlighted?: string[] | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "letters_of_recommendation_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letters_of_recommendation_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_chat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentor_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_chat_sessions: {
        Row: {
          closed_at: string | null
          course_id: string | null
          created_at: string
          id: string
          mentor_id: string
          status: string
          student_id: string
        }
        Insert: {
          closed_at?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          mentor_id: string
          status?: string
          student_id: string
        }
        Update: {
          closed_at?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          mentor_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_chat_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          id: string
          option_text: string
          poll_id: string
          sort_order: number
          vote_count: number
        }
        Insert: {
          id?: string
          option_text: string
          poll_id: string
          sort_order?: number
          vote_count?: number
        }
        Update: {
          id?: string
          option_text?: string
          poll_id?: string
          sort_order?: number
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          org_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          org_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          org_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          category: string | null
          course_id: string | null
          created_at: string
          created_by: string
          difficulty: string | null
          explanation: string | null
          id: string
          org_id: string
          question_media_url: string | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          created_by: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          org_id: string
          question_media_url?: string | null
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          created_by?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          org_id?: string
          question_media_url?: string | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_bank_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_media_url: string | null
          option_text: string
          question_bank_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_media_url?: string | null
          option_text: string
          question_bank_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_media_url?: string | null
          option_text?: string
          question_bank_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_options_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_media_url: string | null
          option_text: string
          question_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_media_url?: string | null
          option_text: string
          question_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_media_url?: string | null
          option_text?: string
          question_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_custom_roles: {
        Row: {
          created_at: string
          custom_role_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_role_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_role_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_roles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_grade_submission: {
        Args: { submission_uuid: string }
        Returns: undefined
      }
      check_course_access: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      check_course_prerequisites: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      get_user_org_id: { Args: { _user_id: string }; Returns: string }
      has_any_permission: {
        Args: { _permissions: string[]; _user_id: string }
        Returns: boolean
      }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "sub_admin"
        | "trainer"
        | "mentor"
        | "student"
        | "franchise"
        | "distributor"
        | "super_distributor"
        | "affiliate"
        | "corporate_hr"
      assessment_status: "draft" | "published" | "closed" | "archived"
      certificate_type: "course" | "internship" | "experience" | "lor"
      question_type:
        | "mcq"
        | "descriptive"
        | "case_study"
        | "file_upload"
        | "true_false"
        | "fill_blank"
      submission_status:
        | "in_progress"
        | "submitted"
        | "graded"
        | "retake_allowed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "sub_admin",
        "trainer",
        "mentor",
        "student",
        "franchise",
        "distributor",
        "super_distributor",
        "affiliate",
        "corporate_hr",
      ],
      assessment_status: ["draft", "published", "closed", "archived"],
      certificate_type: ["course", "internship", "experience", "lor"],
      question_type: [
        "mcq",
        "descriptive",
        "case_study",
        "file_upload",
        "true_false",
        "fill_blank",
      ],
      submission_status: [
        "in_progress",
        "submitted",
        "graded",
        "retake_allowed",
      ],
    },
  },
} as const
