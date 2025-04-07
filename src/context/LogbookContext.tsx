
import { createContext, useContext, useState, ReactNode } from "react";
import { BackupLog, LogEntry } from "@/types";
import { logEntries as initialEntries, backupLogs as initialBackupLogs } from "@/data/mockData";

interface LogbookContextType {
  logEntries: LogEntry[];
  backupLogs: BackupLog[];
  addLogEntry: (entry: Omit<LogEntry, "id">) => void;
  updateLogEntry: (entry: LogEntry) => void;
  deleteLogEntry: (id: number) => void;
  addBackupLog: (log: Omit<BackupLog, "id">) => void;
  getNextId: (isBackupLog?: boolean) => number;
}

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export function LogbookProvider({ children }: { children: ReactNode }) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialEntries);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>(initialBackupLogs);

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

  const addLogEntry = (entry: Omit<LogEntry, "id">) => {
    const newEntry = { ...entry, id: getNextId() };
    setLogEntries([...logEntries, newEntry as LogEntry]);
  };

  const updateLogEntry = (updatedEntry: LogEntry) => {
    setLogEntries(logEntries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  const deleteLogEntry = (id: number) => {
    setLogEntries(logEntries.filter(entry => entry.id !== id));
  };

  const addBackupLog = (log: Omit<BackupLog, "id">) => {
    const newLog = { ...log, id: getNextId(true) };
    setBackupLogs([...backupLogs, newLog as BackupLog]);
  };

  return (
    <LogbookContext.Provider value={{ 
      logEntries, 
      backupLogs, 
      addLogEntry, 
      updateLogEntry, 
      deleteLogEntry, 
      addBackupLog,
      getNextId
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
