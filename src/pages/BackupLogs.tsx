
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, FileDown } from 'lucide-react';
import AddBackupLogForm from '@/components/AddBackupLogForm';
import RecentBackupLogs from '@/components/RecentBackupLogs';
import { useLogbook } from '@/context/LogbookContext';
import { format } from 'date-fns';

const BackupLogs = () => {
  const { backupLogs, loading } = useLogbook();

  const handleExport = () => {
    try {
      // Format data for Excel
      const exportData = backupLogs.map((log, index) => ({
        'No': index + 1,
        'Tanggal': log.tanggal,
        'Shift': log.shift,
        'PIC': log.pic,
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '').replace(/"/g, '""')
          ).join(',')
        )
      ];
      const csvString = csvRows.join('\n');

      // Create a blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Backup_Logs_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

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
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <FileDown className="h-4 w-4 mr-1" />
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
