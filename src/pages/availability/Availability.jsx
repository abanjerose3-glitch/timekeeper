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
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  useEffect(() => {
    if (employee) {
      loadAvailability();
    }
  }, [employee]);

  async function loadAvailability() {
    try {
        const data =
        role === "Admin"
          ? await getAvailability()
          : await getMyAvailability();
      
      console.log(data);

      setAvailability(data || []);
    } catch (error) {
        console.error("SAVE ERROR:", error);
        toast.error(error.message);
      }
  }

  async function handleSave(records) {
    try {
      await saveAvailability(records);

      toast.success("Availability saved.");

      loadAvailability();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save availability.");
    }
  }

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
            {role === "Admin"
              ? "Manage employee availability."
              : "Manage your availability."}
          </p>
        </div>

        <AvailabilityForm
          employeeId={employee?.id}
          onSave={handleSave}
        />

        <AvailabilityTable
          data={availability}
          isAdmin={role === "Admin"}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={setSelectedEmployee}
        />
      </div>
    </Layout>
  );
}

export default Availability;