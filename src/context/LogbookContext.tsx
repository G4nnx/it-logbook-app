
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BackupLog, LogEntry, Shift } from "@/types";
import { logEntries as mockEntries, backupLogs as mockBackupLogs } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface LogbookContextType {
  logEntries: LogEntry[];
  backupLogs: BackupLog[];
  addLogEntry: (entry: Omit<LogEntry, "id">) => Promise<void>;
  updateLogEntry: (entry: LogEntry) => Promise<void>;
  deleteLogEntry: (id: number) => Promise<void>;
  addBackupLog: (log: Omit<BackupLog, "id">) => Promise<void>;
  getNextId: (isBackupLog?: boolean) => number;
  loading: boolean;
  exportToExcel: () => void;
}

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export function LogbookProvider({ children }: { children: ReactNode }) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogEntries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('logbook_entries')
          .select('*');

        if (error) {
          console.error('Error fetching log entries:', error);
          toast.error('Failed to load log entries');
          setLogEntries(mockEntries);
        } else {
          const formattedEntries = data.map(entry => ({
            id: parseInt(entry.id.toString().substring(0, 8), 16),
            tanggalMulai: entry.tanggal_mulai,
            jenisKerjaan: entry.jenis_pekerjaan,
            department: entry.department,
            tanggalSelesai: entry.tanggal_selesai || '',
            pic: entry.pic,
            status: entry.status as "Completed" | "In Progress" | "Pending",
            keterangan: entry.keterangan || '',
            nomorPR: entry.nomor_pr || ''
          }));
          setLogEntries(formattedEntries.length > 0 ? formattedEntries : mockEntries);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setLogEntries(mockEntries);
      } finally {
        setLoading(false);
      }
    };

    const fetchBackupLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('backup_logs')
          .select('*');

        if (error) {
          console.error('Error fetching backup logs:', error);
          setBackupLogs(mockBackupLogs);
        } else {
          const formattedLogs = data.map(log => ({
            id: parseInt(log.id.toString().substring(0, 8), 16),
            tanggal: log.tanggal,
            shift: log.shift as "Pagi" | "Siang" | "Sore",
            pic: log.pic
          }));
          setBackupLogs(formattedLogs.length > 0 ? formattedLogs : mockBackupLogs);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setBackupLogs(mockBackupLogs);
      }
    };

    fetchLogEntries();
    fetchBackupLogs();
  }, []);

  const getNextId = (isBackupLog = false) => {
    if (isBackupLog) {
      return backupLogs.length > 0 
        ? Math.max(...backupLogs.map(log => log.id)) + 1 
        : 1;
    }
    return logEntries.length > 0 
      ? Math.max(...logEntries.map(entry => entry.id)) + 1 
      : 1;
  };

  const addLogEntry = async (entry: Omit<LogEntry, "id">) => {
    try {
      console.log("Adding entry with status:", entry.status);
      
      const { data, error } = await supabase
        .from('logbook_entries')
        .insert({
          tanggal_mulai: entry.tanggalMulai,
          jenis_pekerjaan: entry.jenisKerjaan,
          department: entry.department,
          tanggal_selesai: entry.tanggalSelesai || null,
          pic: entry.pic,
          status: entry.status,
          keterangan: entry.keterangan || null,
          nomor_pr: entry.nomorPR || null
        })
        .select();

      if (error) {
        console.error('Error adding log entry:', error);
        toast.error('Failed to save log entry');
        return;
      }

      const newEntry = {
        id: parseInt(data[0].id.toString().substring(0, 8), 16),
        tanggalMulai: data[0].tanggal_mulai,
        jenisKerjaan: data[0].jenis_pekerjaan,
        department: data[0].department,
        tanggalSelesai: data[0].tanggal_selesai || '',
        pic: data[0].pic,
        status: data[0].status as "Completed" | "In Progress" | "Pending",
        keterangan: data[0].keterangan || '',
        nomorPR: data[0].nomor_pr || ''
      };

      setLogEntries([...logEntries, newEntry]);
      toast.success('Log entry saved successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const updateLogEntry = async (updatedEntry: LogEntry) => {
    try {
      const originalEntry = logEntries.find(entry => entry.id === updatedEntry.id);
      if (!originalEntry) {
        toast.error('Entry not found');
        return;
      }

      const { error } = await supabase
        .from('logbook_entries')
        .update({
          tanggal_mulai: updatedEntry.tanggalMulai,
          jenis_pekerjaan: updatedEntry.jenisKerjaan,
          department: updatedEntry.department,
          tanggal_selesai: updatedEntry.tanggalSelesai || null,
          pic: updatedEntry.pic,
          status: updatedEntry.status,
          keterangan: updatedEntry.keterangan || null,
          nomor_pr: updatedEntry.nomorPR || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', originalEntry.id.toString());

      if (error) {
        console.error('Error updating log entry:', error);
        toast.error('Failed to update log entry');
        return;
      }

      setLogEntries(logEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
      toast.success('Log entry updated successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const deleteLogEntry = async (id: number) => {
    try {
      const entryToDelete = logEntries.find(entry => entry.id === id);
      if (!entryToDelete) {
        toast.error('Entry not found');
        return;
      }

      const { error } = await supabase
        .from('logbook_entries')
        .delete()
        .eq('id', entryToDelete.id.toString());

      if (error) {
        console.error('Error deleting log entry:', error);
        toast.error('Failed to delete log entry');
        return;
      }

      setLogEntries(logEntries.filter(entry => entry.id !== id));
      toast.success('Log entry deleted successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const addBackupLog = async (log: Omit<BackupLog, "id">) => {
    try {
      // Make sure timestamp is included
      const timestamp = log.timestamp || new Date().toISOString();
      
      console.log("Sending backup log with shift:", log.shift);
      console.log("Full log data being sent:", JSON.stringify({
        tanggal: log.tanggal,
        shift: log.shift,
        pic: log.pic,
        timestamp
      }));
      
      const { data, error } = await supabase
        .from('backup_logs')
        .insert({
          tanggal: log.tanggal,
          shift: log.shift,
          pic: log.pic,
          timestamp
        })
        .select();

      if (error) {
        console.error('Error adding backup log:', error);
        toast.error('Failed to save backup log: ' + error.message);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No data returned after insert');
        toast.error('Failed to save backup log: No data returned');
        throw new Error('No data returned after insert');
      }

      const newLog = {
        id: parseInt(data[0].id.toString().substring(0, 8), 16),
        tanggal: data[0].tanggal,
        shift: data[0].shift as Shift,
        pic: data[0].pic,
        timestamp: data[0].timestamp
      };

      console.log("Successfully created backup log:", newLog);
      setBackupLogs([...backupLogs, newLog]);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = logEntries.map((entry, index) => ({
        'No': index + 1,
        'Tanggal Mulai': entry.tanggalMulai,
        'Jenis Pekerjaan': entry.jenisKerjaan,
        'Department': entry.department,
        'Tanggal Selesai': entry.tanggalSelesai || '-',
        'PIC': entry.pic,
        'Status': entry.status,
        'Keterangan': entry.keterangan || '-',
        'Nomor PR': entry.nomorPR || '-'
      }));

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

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `IT_Logbook_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported successfully');
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Failed to export data');
    }
  };

  return (
    <LogbookContext.Provider value={{ 
      logEntries, 
      backupLogs, 
      addLogEntry, 
      updateLogEntry, 
      deleteLogEntry, 
      addBackupLog,
      getNextId,
      loading,
      exportToExcel
    }}>
      {children}
    </LogbookContext.Provider>
  );
}

export function useLogbook() {
  const context = useContext(LogbookContext);
  if (context === undefined) {
    throw new Error("useLogbook must be used within a LogbookProvider");
  }
  return context;
}
