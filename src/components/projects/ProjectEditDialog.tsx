import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Save, X } from 'lucide-react';

interface ProjectEditDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { toast } = useToast();
  const updateProject = useUpdateProject();
  
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    current_phase: project?.current_phase || 'discovery',
    start_date: project?.start_date || '',
    target_completion: project?.target_completion || '',
    budget: project?.budget || '',
    client_name: project?.client_name || '',
    progress_percentage: project?.progress_percentage || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProject.mutateAsync({
        id: project.id,
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget.toString()) : null,
        progress_percentage: parseInt(formData.progress_percentage.toString())
      });
      
      toast({
        title: "Project Updated",
        description: "Project details have been successfully updated."
      });
      
      onUpdate?.();
      onClose();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Project: {project?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={formData.client_name}
                onChange={(e) => handleChange('client_name', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="scoping">Scoping</SelectItem>
                  <SelectItem value="designing">Designing</SelectItem>
                  <SelectItem value="implementing">Implementing</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase">Current Phase</Label>
              <Select value={formData.current_phase} onValueChange={(value) => handleChange('current_phase', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="scoping">Scoping</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_completion">Target Completion</Label>
              <Input
                id="target_completion"
                type="date"
                value={formData.target_completion}
                onChange={(e) => handleChange('target_completion', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => handleChange('progress_percentage', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={updateProject.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateProject.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;