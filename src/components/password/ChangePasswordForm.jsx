import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { changePassword } from "../../services/passwordService";

function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    if (!form.newPassword || !form.confirmPassword) {
      toast.error("Please complete all fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await changePassword(form.newPassword);

      toast.success(
        "Password updated successfully."
      );

      setForm({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Change Password
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>

          <Input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />

          <p className="mt-1 text-xs text-slate-500">
            Must contain at least 8 characters.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChangePasswordForm;