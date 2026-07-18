import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import DigitalClock from "../../components/timeclock/DigitalClock";
import TodayAttendanceCard from "../../components/timeclock/TodayAttendanceCard";
import ClockButtons from "../../components/timeclock/ClockButtons";

import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

import {
  getTodayAttendance,
  clockIn,
  breakOut,
  breakIn,
  clockOut,
} from "../../services/attendance/attendanceService";

function TimeClock() {
  const { role } = useAuth();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      setLoading(true);

      const data = await getTodayAttendance();

      setAttendance(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load today's attendance.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClockIn() {
    try {
      await clockIn();
      await loadAttendance();

      toast.success("Clock In Successful", {
        description: "Have a productive day!",
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleBreakOut() {
    try {
      await breakOut();
      await loadAttendance();

      toast.success("Break Out Successful", {
        description: "Enjoy your break!",
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleBreakIn() {
    try {
      await breakIn();
      await loadAttendance();

      toast.success("Break In Successful", {
        description: "Welcome back!",
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleClockOut() {
    try {
      await clockOut();
      await loadAttendance();

      toast.success("Clock Out Successful", {
        description: "Have a great day!",
      });
    } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {role === "Admin"
              ? "Time Clock"
              : "My Time Clock"}
          </h1>

          <p className="mt-1 text-slate-500">
            {role === "Admin"
              ? "Manage today's attendance."
              : "Clock in and manage today's attendance."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DigitalClock />

          <TodayAttendanceCard
            attendance={attendance}
            loading={loading}
          />
        </div>

        <ClockButtons
          attendance={attendance}
          loading={loading}
          onClockIn={handleClockIn}
          onBreakOut={handleBreakOut}
          onBreakIn={handleBreakIn}
          onClockOut={handleClockOut}
        />
      </div>
    </Layout>
  );
}

export default TimeClock;