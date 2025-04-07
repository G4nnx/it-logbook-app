
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLogbook } from '@/context/LogbookContext';
import { departments, statuses } from '@/data/mockData';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { LogEntry, Status } from '@/types';
import { toast } from 'sonner';

interface EditEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: LogEntry | null;
}

const EditEntryDialog: React.FC<EditEntryDialogProps> = ({ open, onOpenChange, entry }) => {
  const { updateLogEntry } = useLogbook();
  const [jenisKerjaan, setJenisKerjaan] = useState('');
  const [department, setDepartment] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState<Date | undefined>(new Date());
  const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>(new Date());
  const [pic, setPic] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const [nomorPR, setNomorPR] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with entry data when it's available
  useEffect(() => {
    if (entry) {
      setJenisKerjaan(entry.jenisKerjaan);
      setDepartment(entry.department);
      setTanggalMulai(entry.tanggalMulai ? parseISO(entry.tanggalMulai) : new Date());
      setTanggalSelesai(entry.tanggalSelesai ? parseISO(entry.tanggalSelesai) : new Date());
      setPic(entry.pic);
      setStatus(entry.status);
      setKeterangan(entry.keterangan || '');
      setNomorPR(entry.nomorPR || '');
    }
  }, [entry]);

  const handleSubmit = async () => {
    if (!entry || !jenisKerjaan || !department || !tanggalMulai || !pic || !status) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateLogEntry({
        ...entry,
        jenisKerjaan,
        department,
        tanggalMulai: format(tanggalMulai, 'yyyy-MM-dd'),
        tanggalSelesai: tanggalSelesai ? format(tanggalSelesai, 'yyyy-MM-dd') : '',
        pic,
        status,
        keterangan,
        nomorPR
      });

      onOpenChange(false);
      toast.success('Log entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Log Entry</DialogTitle>
          <DialogDescription>
            Make changes to the log entry and save when done.
          </DialogDescription>
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
                      !tanggalMulai && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalMulai ? format(tanggalMulai, "PPP") : <span>Pick a date</span>}
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tanggalSelesai && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalSelesai ? format(tanggalSelesai, "PPP") : <span>Pick a date</span>}
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nomorPR">Nomor PR</Label>
            <Input
              id="nomorPR"
              placeholder="Enter PR number"
              value={nomorPR}
              onChange={(e) => setNomorPR(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEntryDialog;
