import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, MapPin, Users, Shield, Target, 
  AlertTriangle, CheckCircle, ExternalLink, BookOpen,
  Lightbulb, Star, Clock, TrendingUp
} from 'lucide-react';

import { useVendorLibrary } from '@/hooks/useVendorLibrary';
import { useUseCaseLibrary } from '@/hooks/useUseCaseLibrary';
import { useEnterpriseReports } from '@/hooks/useEnterpriseReports';
import { WizardContext } from '../EnhancedWizardEngine';

interface ProjectSetupStepProps extends WizardContext {}

const ProjectSetupStep: React.FC<ProjectSetupStepProps> = ({
  data,
  stepData,
  documentation,
  updateData
}) => {
  const [formData, setFormData] = useState({
    projectName: data.projectName || '',
    clientName: data.clientName || '',
    industry: data.industry || '',
    description: data.description || '',
    estimatedUsers: data.estimatedUsers || '',
    complianceRequirements: data.complianceRequirements || [],
    primaryUseCase: data.primaryUseCase || '',
    selectedVendors: data.selectedVendors || []
  });

  const { data: vendors, isLoading: vendorsLoading } = useVendorLibrary();
  const { data: useCases, isLoading: useCasesLoading } = useUseCaseLibrary();
  const { generateReport } = useEnterpriseReports();

  const industries = [
    'Healthcare', 'Finance', 'Education', 'Government', 'Retail',
    'Manufacturing', 'Technology', 'Real Estate', 'Transportation',
    'Energy', 'Telecommunications', 'Hospitality', 'Legal'
  ];

  const complianceOptions = [
    'HIPAA', 'PCI DSS', 'SOX', 'GDPR', 'CCPA', 'ISO 27001',
    'NIST', 'CIS Controls', 'FDA', 'FERPA', 'GLBA'
  ];

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, [stepData]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    updateData(field, value);
  };

  const handleVendorToggle = (vendorId: string) => {
    const currentVendors = [...formData.selectedVendors];
    const index = currentVendors.indexOf(vendorId);
    
    if (index > -1) {
      currentVendors.splice(index, 1);
    } else {
      currentVendors.push(vendorId);
    }
    
    handleInputChange('selectedVendors', currentVendors);
  };

  const handleComplianceToggle = (compliance: string) => {
    const currentCompliance = [...formData.complianceRequirements];
    const index = currentCompliance.indexOf(compliance);
    
    if (index > -1) {
      currentCompliance.splice(index, 1);
    } else {
      currentCompliance.push(compliance);
    }
    
    handleInputChange('complianceRequirements', currentCompliance);
  };

  const generateProjectAnalysis = async () => {
    try {
      const report = await generateReport({
        type: 'project_analysis',
        projectContext: {
          name: formData.projectName,
          client: formData.clientName,
          industry: formData.industry,
          useCase: formData.primaryUseCase,
          vendors: formData.selectedVendors,
          compliance: formData.complianceRequirements
        }
      });
      
      // Store the report for later use
      handleInputChange('projectAnalysis', report);
    } catch (error) {
      console.error('Failed to generate project analysis:', error);
    }
  };

  const getRecommendedVendors = () => {
    if (!vendors || !formData.industry || !formData.primaryUseCase) return [];
    
    return vendors
      .filter(vendor => 
        vendor.industries?.includes(formData.industry) ||
        vendor.use_cases?.includes(formData.primaryUseCase)
      )
      .slice(0, 5);
  };

  const getRecommendedUseCases = () => {
    if (!useCases || !formData.industry) return [];
    
    return useCases
      .filter(useCase => 
        useCase.industries?.includes(formData.industry) ||
        useCase.categories?.includes('common')
      )
      .slice(0, 5);
  };

  const isFormValid = () => {
    return formData.projectName && 
           formData.clientName && 
           formData.industry && 
           formData.primaryUseCase;
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Basic Project Information</span>
          </CardTitle>
          <CardDescription>
            Provide essential details about your project to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedUsers">Estimated Number of Users</Label>
            <Select value={formData.estimatedUsers} onValueChange={(value) => handleInputChange('estimatedUsers', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-50">1-50 users</SelectItem>
                <SelectItem value="51-200">51-200 users</SelectItem>
                <SelectItem value="201-1000">201-1,000 users</SelectItem>
                <SelectItem value="1001-5000">1,001-5,000 users</SelectItem>
                <SelectItem value="5000+">5,000+ users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project requirements and objectives"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Use Case Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Primary Use Case *</span>
          </CardTitle>
          <CardDescription>
            Select the primary use case that best describes your project goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recommended Use Cases</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getRecommendedUseCases().map((useCase) => (
                <div
                  key={useCase.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.primaryUseCase === useCase.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleInputChange('primaryUseCase', useCase.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{useCase.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {useCase.description}
                      </p>
                    </div>
                    {formData.primaryUseCase === useCase.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {useCasesLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading use cases...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Vendor Selection</span>
          </CardTitle>
          <CardDescription>
            Select vendors that will be part of your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recommended Vendors</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getRecommendedVendors().map((vendor) => (
                <div
                  key={vendor.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.selectedVendors.includes(vendor.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleVendorToggle(vendor.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{vendor.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vendor.description}
                      </p>
                      {vendor.industries && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vendor.industries.slice(0, 2).map((industry) => (
                            <Badge key={industry} variant="secondary" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.selectedVendors.includes(vendor.id) && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {vendorsLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading vendors...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Compliance Requirements</span>
          </CardTitle>
          <CardDescription>
            Select any compliance frameworks that apply to your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {complianceOptions.map((compliance) => (
              <div
                key={compliance}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.complianceRequirements.includes(compliance)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleComplianceToggle(compliance)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{compliance}</span>
                  {formData.complianceRequirements.includes(compliance) && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Integration */}
      {documentation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Related Documentation</span>
            </CardTitle>
            <CardDescription>
              Relevant documentation based on your selections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentation.slice(0, 3).map((doc, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        {doc.source_url?.split('/').pop() || 'Project Setup Guide'}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {doc.extracted_data?.prerequisites?.[0] || 
                         doc.extracted_data?.configuration_steps?.[0] ||
                         'Project initialization and setup documentation'}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Validation Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFormValid() ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All required fields are completed. You can proceed to the next step.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required fields marked with * before proceeding.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Button */}
      {isFormValid() && (
        <div className="flex justify-center">
          <Button 
            onClick={generateProjectAnalysis}
            className="flex items-center space-x-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Generate AI Project Analysis</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectSetupStep;
