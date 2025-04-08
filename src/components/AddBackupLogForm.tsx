
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogbook } from '@/context/LogbookContext';
import { toast } from 'sonner';
import { Shift } from '@/types';

const AddBackupLogForm = () => {
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());
  const [shift, setShift] = useState<Shift>("Pagi");
  const [pic, setPic] = useState("");
  const { addBackupLog } = useLogbook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tanggal || !shift || !pic) {
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      console.log("Submitting backup log with shift:", shift);
      
      await addBackupLog({
        tanggal: format(tanggal, 'yyyy-MM-dd'),
        shift,
        pic,
        timestamp: new Date().toISOString() // Add current timestamp
      });
      
      // Reset form
      setPic("");
      toast.success("Backup log saved successfully");
    } catch (error) {
      console.error("Error saving backup log:", error);
      toast.error("Failed to save backup log");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl text-red-600">Log BackupDB</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="tanggal"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !tanggal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggal ? format(tanggal, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={setTanggal}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Shift</Label>
            <RadioGroup value={shift} onValueChange={(value: Shift) => setShift(value)}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Pagi" id="pagi" />
                  <Label htmlFor="pagi">Pagi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Siang" id="siang" />
                  <Label htmlFor="siang">Siang</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sore" id="sore" />
                  <Label htmlFor="sore">Sore</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pic">PIC</Label>
            <Input
              id="pic"
              placeholder="Enter person in charge"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            SUBMIT
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBackupLogForm;
