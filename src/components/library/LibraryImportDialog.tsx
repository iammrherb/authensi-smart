import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Database, Plus } from 'lucide-react';
import { UseCaseImportForm } from './UseCaseImportForm';
import { RequirementImportForm } from './RequirementImportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LibraryImportDialogProps {
  children: React.ReactNode;
}

export const LibraryImportDialog: React.FC<LibraryImportDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('use-cases');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Library Items
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="use-cases" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Use Cases
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Bulk Import
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="use-cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Use Cases</CardTitle>
                <CardDescription>
                  Add new use cases to the library. You can create individual use cases or import multiple at once.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UseCaseImportForm onSuccess={() => setOpen(false)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Requirements</CardTitle>
                <CardDescription>
                  Add new requirements to the library. Define technical, functional, and compliance requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequirementImportForm onSuccess={() => setOpen(false)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Use Cases</CardTitle>
                  <CardDescription>
                    Import multiple use cases from CSV or JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UseCaseImportForm bulk onSuccess={() => setOpen(false)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Requirements</CardTitle>
                  <CardDescription>
                    Import multiple requirements from CSV or JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RequirementImportForm bulk onSuccess={() => setOpen(false)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};