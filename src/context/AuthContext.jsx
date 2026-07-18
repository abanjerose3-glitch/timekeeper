import { createContext, useContext, useEffect, useState } from "react";

import { getProfile } from "../services/auth/accountService";
import { getEmployeeByUserId } from "../services/employee/employeeService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const { user, profile } = await getProfile();

      setUser(user);
      setProfile(profile);

      if (user) {
        const employee = await getEmployeeByUserId(user.id);
        setEmployee(employee);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      setProfile(null);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        employee,
        role: employee?.role,
        loading,
        isAuthenticated: !!user,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}