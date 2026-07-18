import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import {
  getProfile,
  saveProfile,
} from "../../services/auth/accountService";

function AccountForm() {
  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { user, profile } = await getProfile();

      setAccount({
        fullName: profile?.full_name || "",
        email: user?.email || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      setLoading(true);

      await saveProfile(account.fullName);

      toast.success("Profile updated successfully.");

      await loadProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  const initials = account.fullName
    ? account.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          My Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-700">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {account.fullName || "User"}
            </h3>

            <p className="text-sm text-slate-500">
              {account.email}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <Input
              name="fullName"
              value={account.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <Input
              name="email"
              value={account.email}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountForm;