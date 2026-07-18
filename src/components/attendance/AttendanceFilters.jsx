import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  function AttendanceFilters({
    status,
    setStatus,
  }) {
    return (
      <div className="flex gap-3">
  
        <Select
          value={status}
          onValueChange={setStatus}
        >
  
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
  
          <SelectContent>
  
            <SelectItem value="all">
              All Status
            </SelectItem>
  
            <SelectItem value="present">
              Present
            </SelectItem>
  
            <SelectItem value="break">
              On Break
            </SelectItem>
  
            <SelectItem value="timedout">
              Timed Out
            </SelectItem>
  
          </SelectContent>
  
        </Select>
  
      </div>
    );
  }
  
  export default AttendanceFilters;