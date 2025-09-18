import React, { createContext, useContext, useState } from "react";

type Application = {
  type: "Internship" | "Job" | "Hackathon";
  title: string;
  company?: string;
  date?: string;
};

type ApplicationContextType = {
  applications: Application[];
  addApplication: (app: Application) => void;
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  const addApplication = (app: Application) => {
    setApplications((prev) => [...prev, app]);
  };

  return (
    <ApplicationContext.Provider value={{ applications, addApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplication must be used inside ApplicationProvider");
  return ctx;
};
