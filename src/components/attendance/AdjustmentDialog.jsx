import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { createAttendanceAdjustment } from "../../services/attendance/attendanceAdjustmentService";

function AdjustmentDialog({
  open,
  onOpenChange,
  record,
  onSuccess,
}) {
  const [adjustmentType, setAdjustmentType] =
    useState("Time Out");
  const [requestedTime, setRequestedTime] =
    useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!record) return;

    if (!record.time_in) {
      setAdjustmentType("Time In");
    } else if (!record.break_out) {
      setAdjustmentType("Break Out");
    } else if (!record.break_in) {
      setAdjustmentType("Break In");
    } else if (!record.time_out) {
      setAdjustmentType("Time Out");
    }

    setRequestedTime("");
    setReason("");
  }, [record]);

  function getOriginalTime() {
    if (!record) return null;

    switch (adjustmentType) {
      case "Time In":
        return record.time_in;
      case "Break Out":
        return record.break_out;
      case "Break In":
        return record.break_in;
      case "Time Out":
        return record.time_out;
      default:
        return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!requestedTime) {
      toast.error("Please select a requested time.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    try {
      setSaving(true);

      await createAttendanceAdjustment({
        attendanceId: record.id,
        employeeId: record.employee_id,
        adjustmentType,
        originalTime: getOriginalTime(),
        requestedTime,
        reason: reason.trim(),
      });

      toast.success(
        "Adjustment request submitted successfully."
      );

      setRequestedTime("");
      setReason("");

      onOpenChange(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit adjustment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Attendance Adjustment
          </DialogTitle>

          <DialogDescription>
            Request a correction for your attendance
            record.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Adjustment Type
            </label>

            <Input
              value={adjustmentType}
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Requested Time
            </label>

            <Input
              type="datetime-local"
              value={requestedTime}
              onChange={(e) =>
                setRequestedTime(e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Reason
            </label>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Provide the reason for this attendance adjustment..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Submitting..."
                : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdjustmentDialog;