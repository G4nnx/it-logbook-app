
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import AddEntryDialog from '@/components/AddEntryDialog';
import { useLogbook } from '@/context/LogbookContext';
import { departments, statuses } from '@/data/mockData';
import { CalendarIcon, Eye, FileDown, Loader2, Pencil, Search, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ITLogbook = () => {
  const { logEntries, deleteLogEntry, loading, exportToExcel } = useLogbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter entries based on search term and filters
  const filteredEntries = logEntries.filter(entry => {
    // Filter by search term (case insensitive)
    const matchesSearch = searchTerm === '' || 
      Object.values(entry).some(value => 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
    
    // Filter by department
    const matchesDepartment = selectedDepartment === 'all' || entry.department === selectedDepartment;
    
    // Filter by date
    const matchesDate = !selectedDate || 
      entry.tanggalMulai === format(selectedDate, 'yyyy-MM-dd') || 
      entry.tanggalSelesai === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedDepartment('all');
    setSelectedDate(undefined);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteLogEntry(id);
    }
  };

  const handleExport = () => {
    exportToExcel();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">IT Log Book</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-300 text-blue-600">
            <Eye className="h-4 w-4 mr-1" />
            IT Logbook
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-600" asChild>
            <a href="/backup-logs">
              <Eye className="h-4 w-4 mr-1" />
              Backup DB Logs
            </a>
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            Add New Entry
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by any field..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-44 justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Date Range</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
          Clear Filters
        </Button>

        <Button onClick={handleExport} className="whitespace-nowrap ml-auto bg-green-600 hover:bg-green-700">
          <FileDown className="h-4 w-4 mr-1" />
          Export to Excel
        </Button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading data...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-sm">No</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Tanggal Mulai</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Jenis Pekerjaan</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Department</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Tanggal Selesai</th>
                <th className="px-4 py-3 text-left font-medium text-sm">PIC</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Keterangan</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Nomor PR</th>
                <th className="px-4 py-3 text-center font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{format(parseISO(entry.tanggalMulai), 'yyyy-MM-dd')}</td>
                    <td className="px-4 py-3 text-sm">{entry.jenisKerjaan}</td>
                    <td className="px-4 py-3 text-sm">{entry.department}</td>
                    <td className="px-4 py-3 text-sm">{entry.tanggalSelesai ? format(parseISO(entry.tanggalSelesai), 'yyyy-MM-dd') : '-'}</td>
                    <td className="px-4 py-3 text-sm">{entry.pic}</td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-sm max-w-[200px] truncate">{entry.keterangan}</td>
                    <td className="px-4 py-3 text-sm">{entry.nomorPR}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={10} className="px-4 py-3 text-right text-sm font-medium">
                  Total Entries: {filteredEntries.length}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
      
      <AddEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default ITLogbook;
