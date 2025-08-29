import React from 'react';
// Removed broken import

interface ProjectEditDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = (props) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Project Edit</h2>
      <p className="text-muted-foreground">Project editing functionality coming soon.</p>
    </div>
  );
};

export default ProjectEditDialog;