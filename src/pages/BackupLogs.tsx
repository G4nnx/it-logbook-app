
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import AddBackupLogForm from '@/components/AddBackupLogForm';
import RecentBackupLogs from '@/components/RecentBackupLogs';

const BackupLogs = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Database Backup Logs</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-300 text-blue-600" asChild>
            <a href="/">
              <Eye className="h-4 w-4 mr-1" />
              IT Logbook
            </a>
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-600">
            <Eye className="h-4 w-4 mr-1" />
            Backup DB Logs
          </Button>
          <Button>
            Export to Excel
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddBackupLogForm />
        <RecentBackupLogs />
      </div>
    </div>
  );
};

export default BackupLogs;
