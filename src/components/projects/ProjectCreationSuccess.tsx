import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Calendar, Users, Target, FileCheck } from 'lucide-react';

interface ProjectCreationSuccessProps {
  project: {
    id: string;
    name: string;
    client_name: string;
    total_sites: number;
    total_endpoints: number;
    compliance_frameworks: string[];
    estimated_timeline_weeks: number;
  };
  scopingData?: any;
  onViewProject: () => void;
  onCreateAnother: () => void;
}

const ProjectCreationSuccess: React.FC<ProjectCreationSuccessProps> = ({
  project,
  scopingData,
  onViewProject,
  onCreateAnother
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600">Project Created Successfully!</h1>
        <p className="text-lg text-muted-foreground">
          Your comprehensive NAC implementation project has been created with AI-powered recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Project Name</h3>
              <p className="font-medium">{project.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Client</h3>
              <p className="font-medium">{project.client_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Sites</h3>
              <p className="font-medium">{project.total_sites} sites</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Endpoints</h3>
              <p className="font-medium">{project.total_endpoints} devices</p>
            </div>
          </div>

          {project.compliance_frameworks.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Compliance Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {project.compliance_frameworks.map((framework) => (
                  <Badge key={framework} variant="secondary">{framework}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{project.estimated_timeline_weeks || 'TBD'}</p>
            <p className="text-sm text-muted-foreground">weeks estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Multi-Team</p>
            <p className="text-sm text-muted-foreground">coordination required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">AI-Guided</p>
            <p className="text-sm text-muted-foreground">implementation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-medium">Review Project Details</h4>
                <p className="text-sm text-muted-foreground">Access the project dashboard to review AI recommendations and project structure</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-medium">Assign Team Members</h4>
                <p className="text-sm text-muted-foreground">Add team members and assign roles for project execution</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-medium">Begin Discovery Phase</h4>
                <p className="text-sm text-muted-foreground">Start with the discovery and assessment phase as recommended by AI</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button onClick={onViewProject} className="bg-gradient-primary">
          <ArrowRight className="h-4 w-4 mr-2" />
          View Project Dashboard
        </Button>
        <Button variant="outline" onClick={onCreateAnother}>
          Create Another Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreationSuccess;