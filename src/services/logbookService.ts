
import { supabase } from "@/integrations/supabase/client";
import { BackupLog, LogEntry } from "@/types";
import { toast } from "sonner";

// Fetch log entries from Supabase
export const fetchLogEntries = async () => {
  const { data, error } = await supabase
    .from('logbook_entries')
    .select('*');

  if (error) {
    console.error('Error fetching log entries:', error);
    toast.error('Failed to load log entries');
    throw error;
  }

  return data.map(entry => ({
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
};

// Fetch backup logs from Supabase
export const fetchBackupLogs = async () => {
  const { data, error } = await supabase
    .from('backup_logs')
    .select('*');

  if (error) {
    console.error('Error fetching backup logs:', error);
    throw error;
  }

  return data.map(log => ({
    id: parseInt(log.id.toString().substring(0, 8), 16),
    tanggal: log.tanggal,
    shift: log.shift as "Pagi" | "Siang" | "Sore",
    pic: log.pic,
    timestamp: log.timestamp
  }));
};

// Add a new log entry
export const createLogEntry = async (entry: Omit<LogEntry, "id">) => {
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
    throw error;
  }

  return {
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
};

// Update an existing log entry
export const updateLogEntryById = async (updatedEntry: LogEntry) => {
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
    .eq('id', updatedEntry.id.toString());

  if (error) {
    console.error('Error updating log entry:', error);
    toast.error('Failed to update log entry');
    throw error;
  }

  return updatedEntry;
};

// Delete a log entry
export const deleteLogEntryById = async (id: string) => {
  const { error } = await supabase
    .from('logbook_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting log entry:', error);
    toast.error('Failed to delete log entry');
    throw error;
  }
};

// Add a new backup log
export const createBackupLog = async (log: Omit<BackupLog, "id">) => {
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

  return {
    id: parseInt(data[0].id.toString().substring(0, 8), 16),
    tanggal: data[0].tanggal,
    shift: data[0].shift as "Pagi" | "Siang" | "Sore",
    pic: data[0].pic,
    timestamp: data[0].timestamp
  };
};

// Export helper for CSV
export const convertToCSV = (data: Record<string, any>[]) => {
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '').replace(/"/g, '""')
      ).join(',')
    )
  ];
  return csvRows.join('\n');
};
