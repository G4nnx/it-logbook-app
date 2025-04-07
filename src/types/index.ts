
export interface LogEntry {
  id: number;
  tanggalMulai: string;
  jenisKerjaan: string;
  department: string;
  tanggalSelesai: string;
  pic: string;
  status: "Completed" | "In Progress" | "Pending";
  keterangan: string;
  nomorPR: string;
}

export type Department = 
  | "IT Infrastructure" 
  | "Finance" 
  | "HR" 
  | "Marketing" 
  | "Sales" 
  | "Operations"
  | "Executive"
  | "Development"
  | "QA";

export type Status = "Completed" | "In Progress" | "Pending";

export type Shift = "Pagi" | "Siang" | "Sore";

export interface BackupLog {
  id: number;
  tanggal: string;
  shift: Shift;
  pic: string;
}
