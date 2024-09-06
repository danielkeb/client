"use client";

import { Alert, AlertsWrapper } from "@/components/global/Alert";
import { createContext, useContext, useState } from "react";

interface AlertType {
  id?: string;
  severity: "info" | "success" | "warning" | "error";
  message: string;
}

interface AlertsContextType {
  alerts: AlertType[];
  addAlert: (alert: AlertType) => string;
  dismissAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType>({
  alerts: [],
  addAlert: (_alert: AlertType): string => {
    return "";
  },
  dismissAlert: (_id: string) => {},
});

const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = (alert: AlertType) => {
    const id =
      Math.random().toString(36).slice(2, 9) +
      new Date().getTime().toString(36);
    setAlerts((prev) => [{ ...alert, id: id }, ...prev]);
    return id;
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, dismissAlert }}>
      <AlertsWrapper>
        {alerts.map((alert, index) => (
          <Alert key={index} {...alert} handleDismiss={() => {}} />
        ))}
      </AlertsWrapper>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlertsContext = () => {
  const context = useContext(AlertsContext);

  if (!context) {
    throw new Error("useAlertsContext must be used within a AlertsProvider");
  }

  return context;
};

export default AlertsProvider;
