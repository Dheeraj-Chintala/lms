import { useEffect, useState } from 'react';
import { Award, Download, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fromTable } from '@/lib/supabase-helpers';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import type { Certificate, Course } from '@/types/database';

interface CertificateWithCourse extends Certificate {
  course?: Course;
}

export function CertificatesSection() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data } = await fromTable('certificates')
        .select('*, course:courses(*)')
        .order('issued_at', { ascending: false });

      if (data) {
        setCertificates(data as CertificateWithCourse[]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Certificates
          </CardTitle>
          <CardDescription>Complete courses to earn certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No certificates earned yet. Complete a course to receive your first certificate!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          Certificates
        </CardTitle>
        <CardDescription>Your earned certifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-accent/5 to-transparent"
            >
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{cert.course?.title || 'Course Certificate'}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(cert.issued_at), 'MMM d, yyyy')}
                  </span>
                  <Badge variant="outline" className="text-[10px] h-5">
                    #{cert.certificate_number.slice(0, 8)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {cert.pdf_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.pdf_url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
