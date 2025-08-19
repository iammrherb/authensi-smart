import React from 'react';
import EnhancedProjectEditDialog from './EnhancedProjectEditDialog';

interface ProjectEditDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = (props) => {
  return <EnhancedProjectEditDialog {...props} />;
};

export default ProjectEditDialog;