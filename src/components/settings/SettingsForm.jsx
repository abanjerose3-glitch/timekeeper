import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

import timezones from "../../data/timezones";

import {
  getSettings,
  saveSettings,
} from "../../services/settingsService";

function SettingsForm() {
  const [settings, setSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    workingHours: 8,
    breakDuration: 60,
    gracePeriod: 15,
    overtimeAfter: 8,
    timezone: "Asia/Manila",
  });

  const [loading, setLoading] =useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();

      if (!data) return;

      setSettings({
        companyName: data.company_name || "",
        companyEmail: data.company_email || "",
        companyPhone: data.company_phone || "",
        workingHours: data.working_hours || 8,
        breakDuration: data.break_duration || 60,
        gracePeriod: data.grace_period || 15,
        overtimeAfter: data.overtime_after || 8,
        timezone: data.timezone || "Asia/Manila",
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to load settings.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      setLoading(true);

      await saveSettings(settings);

      toast.success("Settings saved successfully.");

      await loadSettings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Company */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">
          Company Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Name
            </label>

            <Input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Email
            </label>

            <Input
              type="email"
              name="companyEmail"
              value={settings.companyEmail}
              onChange={handleChange}
              placeholder="company@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Company Phone
            </label>

            <Input
              name="companyPhone"
              value={settings.companyPhone}
              onChange={handleChange}
              placeholder="+63 912 345 6789"
            />
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">
          Attendance Settings
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Working Hours
            </label>

            <Input
              type="number"
              name="workingHours"
              value={settings.workingHours}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Break Duration (Minutes)
            </label>

            <Input
              type="number"
              name="breakDuration"
              value={settings.breakDuration}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Grace Period (Minutes)
            </label>

            <Input
              type="number"
              name="gracePeriod"
              value={settings.gracePeriod}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Overtime Starts After (Hours)
            </label>

            <Input
              type="number"
              name="overtimeAfter"
              value={settings.overtimeAfter}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">
          System Settings
        </h2>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Timezone
          </label>

          <select
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map((timezone) => (
              <option
                key={timezone}
                value={timezone}
              >
                {timezone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

export default SettingsForm;