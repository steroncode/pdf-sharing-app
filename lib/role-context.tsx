import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "teacher" | "student" | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved role on mount
  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem("userRole");
        if (savedRole === "teacher" || savedRole === "student") {
          setRoleState(savedRole);
        }
      } catch (error) {
        console.error("Failed to load user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRole();
  }, []);

  const setRole = async (newRole: UserRole) => {
    try {
      if (newRole === null) {
        await AsyncStorage.removeItem("userRole");
      } else {
        await AsyncStorage.setItem("userRole", newRole);
      }
      setRoleState(newRole);
    } catch (error) {
      console.error("Failed to save user role:", error);
      throw error;
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
