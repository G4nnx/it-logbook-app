
import { BackupLog, LogEntry } from "@/types";

export const logEntries: LogEntry[] = [
  {
    id: 1,
    tanggalMulai: "2023-05-10",
    jenisKerjaan: "Network Maintenance",
    department: "IT Infrastructure",
    tanggalSelesai: "2023-05-12",
    pic: "John Doe",
    status: "Completed",
    keterangan: "Replaced faulty router in server room",
    nomorPR: "PR-2023-001"
  },
  {
    id: 2,
    tanggalMulai: "2023-05-15",
    jenisKerjaan: "Software Installation",
    department: "Finance",
    tanggalSelesai: "",
    pic: "Jane Smith",
    status: "In Progress",
    keterangan: "Installing accounting software on 5 workstations",
    nomorPR: "PR-2023-002"
  },
  {
    id: 3,
    tanggalMulai: "2023-05-18",
    jenisKerjaan: "Hardware Replacement",
    department: "HR",
    tanggalSelesai: "",
    pic: "Mike Johnson",
    status: "Pending",
    keterangan: "Replace 3 monitors with new LED displays",
    nomorPR: "PR-2023-003"
  }
];

export const backupLogs: BackupLog[] = [];

export const departments: string[] = [
  "IT Infrastructure",
  "Finance",
  "HR",
  "Marketing",
  "Sales",
  "Operations",
  "Executive",
  "Development",
  "QA"
];

export const statuses: string[] = ["Completed", "In Progress", "Pending"];
