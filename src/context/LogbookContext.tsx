
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BackupLog, LogEntry } from "@/types";
import { logEntries as mockEntries, backupLogs as mockBackupLogs } from "@/data/mockData";
import { toast } from "sonner";
import { 
  fetchLogEntries, 
  fetchBackupLogs, 
  createLogEntry, 
  updateLogEntryById, 
  deleteLogEntryById, 
  createBackupLog,
  convertToCSV
} from "@/services/logbookService";
import {
  getNextId,
  formatLogEntriesForExport,
  formatBackupLogsForExport,
  downloadCSV
} from "@/utils/logbookUtils";

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
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load log entries
        try {
          const entries = await fetchLogEntries();
          setLogEntries(entries.length > 0 ? entries : mockEntries);
        } catch (error) {
          console.error('Error loading log entries:', error);
          setLogEntries(mockEntries);
        }
        
        // Load backup logs
        try {
          const logs = await fetchBackupLogs();
          setBackupLogs(logs.length > 0 ? logs : mockBackupLogs);
        } catch (error) {
          console.error('Error loading backup logs:', error);
          setBackupLogs(mockBackupLogs);
        }
      } catch (err) {
        console.error('Unexpected error during data loading:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addLogEntry = async (entry: Omit<LogEntry, "id">) => {
    try {
      console.log("Adding entry with status:", entry.status);
      
      const newEntry = await createLogEntry(entry);
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

      await updateLogEntryById(updatedEntry);
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

      await deleteLogEntryById(entryToDelete.id.toString());
      setLogEntries(logEntries.filter(entry => entry.id !== id));
      toast.success('Log entry deleted successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const addBackupLog = async (log: Omit<BackupLog, "id">) => {
    try {
      const newLog = await createBackupLog(log);
      console.log("Successfully created backup log:", newLog);
      setBackupLogs([...backupLogs, newLog]);
      toast.success('Backup log saved successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = formatLogEntriesForExport(logEntries);
      const csvString = convertToCSV(exportData);
      downloadCSV(csvString, 'IT_Logbook_Export');
      toast.success('Data exported successfully');
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Failed to export data');
    }
  };

  const getNextIdWrapper = (isBackupLog = false) => {
    return isBackupLog 
      ? getNextId(backupLogs, true)
      : getNextId(logEntries);
  };

  return (
    <LogbookContext.Provider value={{ 
      logEntries, 
      backupLogs, 
      addLogEntry, 
      updateLogEntry, 
      deleteLogEntry, 
      addBackupLog,
      getNextId: getNextIdWrapper,
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
