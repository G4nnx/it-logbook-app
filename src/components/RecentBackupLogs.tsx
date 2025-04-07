
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogbook } from '@/context/LogbookContext';
import { format, parseISO } from 'date-fns';

const RecentBackupLogs = () => {
  const { backupLogs } = useLogbook();
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {backupLogs.length > 0 ? (
          <ul className="space-y-2">
            {backupLogs.map((log) => (
              <li key={log.id} className="text-sm border-b pb-2">
                <div className="flex justify-between">
                  <span>{format(parseISO(log.tanggal), 'dd MMM yyyy')}</span>
                  <span>{log.shift}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>PIC: {log.pic}</span>
                  {log.timestamp && (
                    <span className="text-xs text-gray-500">
                      {format(parseISO(log.timestamp), 'HH:mm:ss')}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No logs yet. Add a new entry to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBackupLogs;
