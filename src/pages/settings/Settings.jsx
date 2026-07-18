import { useContext } from "react";

import Layout from "../../components/layout/Layout";
import SettingsForm from "../../components/settings/SettingsForm";
import AccountForm from "../../components/account/AccountForm";
import ChangePasswordForm from "../../components/password/ChangePasswordForm";

import { AuthContext } from "../../context/AuthContext";

function Settings() {
  const { role } = useContext(AuthContext);

  return (
    <Layout
      title="Settings"
      subtitle="Manage your account and system preferences."
    >
      <div className="space-y-6">
        <AccountForm />

        <ChangePasswordForm />

        {role === "Admin" && (
          <SettingsForm />
        )}
      </div>
    </Layout>
  );
}

export default Settings;