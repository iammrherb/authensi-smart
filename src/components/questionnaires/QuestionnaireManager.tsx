import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useQuestionnaires, useDeleteQuestionnaire } from "@/hooks/useQuestionnaires";
import { useSites } from "@/hooks/useSites";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import QuestionnaireForm from "./QuestionnaireForm";

const QuestionnaireManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'view' | 'edit'>('create');

  const { data: questionnaires, isLoading } = useQuestionnaires();
  const { data: sites } = useSites();
  const { data: projects } = useProjects();
  const deleteQuestionnaire = useDeleteQuestionnaire();

  const filteredQuestionnaires = questionnaires?.filter(q => {
    const matchesSearch = q.sites?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.sites?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedQuestionnaire(null);
    setViewMode('create');
    setShowForm(true);
  };

  const handleView = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setViewMode('view');
    setShowForm(true);
  };

  const handleEdit = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setViewMode('edit');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this questionnaire?')) {
      deleteQuestionnaire.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'secondary',
      'in-progress': 'default',
      'completed': 'success',
      'reviewed': 'success'
    };
    return colors[status as keyof typeof colors] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading questionnaires...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Scoping Questionnaires
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage comprehensive scoping questionnaires for all sites and projects
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          New Questionnaire
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questionnaires by site name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questionnaires Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questionnaires ({filteredQuestionnaires?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredQuestionnaires && filteredQuestionnaires.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestionnaires.map((questionnaire) => (
                  <TableRow key={questionnaire.id}>
                    <TableCell className="font-medium">
                      {questionnaire.sites?.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {questionnaire.sites?.location || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(questionnaire.status) as any}>
                        {questionnaire.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={questionnaire.completion_percentage} className="w-20" />
                        <span className="text-sm text-muted-foreground">
                          {questionnaire.completion_percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(questionnaire.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(questionnaire.updated_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(questionnaire)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(questionnaire)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(questionnaire.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <div className="text-muted-foreground mb-4">
                {questionnaires?.length === 0 
                  ? "No questionnaires found. Create your first questionnaire to get started."
                  : "No questionnaires match your current filters."
                }
              </div>
              {questionnaires?.length === 0 && (
                <Button onClick={handleCreate} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Questionnaire
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questionnaire Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'create' && 'Create New Questionnaire'}
              {viewMode === 'view' && 'View Questionnaire'}
              {viewMode === 'edit' && 'Edit Questionnaire'}
            </DialogTitle>
          </DialogHeader>
          <QuestionnaireForm
            questionnaire={selectedQuestionnaire}
            sites={sites || []}
            projects={projects || []}
            mode={viewMode}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionnaireManager;