
import { BackupLog, LogEntry } from "@/types";
import { format } from "date-fns";

// Get the next ID for entries
export const getNextId = (
  entries: LogEntry[] | BackupLog[], 
  isBackupLog = false
) => {
  return entries.length > 0 
    ? Math.max(...entries.map(entry => entry.id)) + 1 
    : 1;
};

// Format log entries for export
export const formatLogEntriesForExport = (logEntries: LogEntry[]) => {
  return logEntries.map((entry, index) => ({
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
};

// Format backup logs for export
export const formatBackupLogsForExport = (backupLogs: BackupLog[]) => {
  return backupLogs.map((log, index) => ({
    'No': index + 1,
    'Tanggal': log.tanggal,
    'Shift': log.shift,
    'PIC': log.pic,
  }));
};

// Create and download a CSV file
export const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
