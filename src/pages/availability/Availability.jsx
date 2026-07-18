import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import AvailabilityForm from "../../components/availability/AvailabilityForm";
import AvailabilityTable from "../../components/availability/AvailabilityTable";

import {
  getAvailability,
  getMyAvailability,
  saveAvailability,
} from "../../services/availabilityService";

import { useAuth } from "../../context/AuthContext";

import { toast } from "sonner";

function Availability() {
  const { role, employee } = useAuth();

  const [availability, setAvailability] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingWeek, setEditingWeek] = useState(null);

  useEffect(() => {
    if (employee) {
      loadAvailability();
    }
  }, [employee, role]);

  async function loadAvailability() {
    try {
      setLoading(true);

      const data =
        role === "Admin"
          ? await getAvailability()
          : await getMyAvailability();

      setAvailability(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(records) {
    console.log("handleSave()");
    console.log(records);
  
    try {
      setLoading(true);
  
      const result = await saveAvailability(records);
  
      console.log("Supabase Result:", result);
  
      await loadAvailability();
  
      toast.success("Weekly availability saved.");
    } catch (error) {
      console.error("SAVE ERROR:", error);
  
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  console.log("AUTH EMPLOYEE:", employee);

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            {role === "Admin"
              ? "Employee Availability"
              : "My Availability"}
          </h1>

          <p className="mt-1 text-slate-500">
            Set employee weekly availability.
          </p>
        </div>

        <AvailabilityForm
  employeeId={employee?.id}
  role={role}
  editingWeek={editingWeek}
  setEditingWeek={setEditingWeek}
  loading={loading}
  onSave={handleSave}
/>

<AvailabilityTable
  data={availability}
  loading={loading}
  isAdmin={role === "Admin"}
  onEdit={setEditingWeek}
/>

      </div>
    </Layout>
  );
}

export default Availability;