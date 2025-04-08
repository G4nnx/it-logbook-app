import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLogbook } from "@/context/LogbookContext";
import { statuses } from "@/data/mockData";
import { getDepartments } from "@/services/departmentService";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Status } from "@/types";

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEntryDialog: React.FC<AddEntryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addLogEntry } = useLogbook();
  const [jenisKerjaan, setJenisKerjaan] = useState("");
  const [department, setDepartment] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState<Date | undefined>(
    new Date(),
  );
  const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>(
    new Date(),
  );
  const [pic, setPic] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [keterangan, setKeterangan] = useState("");
  const [nomorPR, setNomorPR] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  // Load departments when dialog opens
  useEffect(() => {
    if (open) {
      setDepartments(getDepartments());
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!jenisKerjaan || !department || !tanggalMulai || !pic || !status) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await addLogEntry({
        jenisKerjaan,
        department,
        tanggalMulai: format(tanggalMulai, "yyyy-MM-dd"),
        tanggalSelesai: tanggalSelesai
          ? format(tanggalSelesai, "yyyy-MM-dd")
          : "",
        pic,
        status: status as Status,
        keterangan,
        nomorPR,
      });

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setJenisKerjaan("");
    setDepartment("");
    setTanggalMulai(new Date());
    setTanggalSelesai(new Date());
    setPic("");
    setStatus("");
    setKeterangan("");
    setNomorPR("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Entry</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="jenisKerjaan">Jenis Pekerjaan</Label>
            <Input
              id="jenisKerjaan"
              placeholder="Enter jenis pekerjaan"
              value={jenisKerjaan}
              onChange={(e) => setJenisKerjaan(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the type of work being performed.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select the department requesting the work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tanggalMulai && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalMulai ? (
                      format(tanggalMulai, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tanggalMulai}
                    onSelect={setTanggalMulai}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                The date when the work started.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tanggalSelesai && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalSelesai ? (
                      format(tanggalSelesai, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tanggalSelesai}
                    onSelect={setTanggalSelesai}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                The date when the work was completed.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pic">PIC</Label>
            <Input
              id="pic"
              placeholder="Enter person in charge"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the person in charge of this task.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Status)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select the current status of the task.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Enter additional notes or details"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Add any additional notes or details about the task.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nomorPR">Nomor PR</Label>
            <Input
              id="nomorPR"
              placeholder="Enter PR number"
              value={nomorPR}
              onChange={(e) => setNomorPR(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the PR (Purchase Request) number if applicable.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
