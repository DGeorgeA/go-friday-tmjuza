
import * as React from "react";
import { createContext, useCallback, useContext } from "react";
import { Platform } from "react-native";

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const refreshWidget = useCallback(() => {
    // Only run on iOS
    if (Platform.OS === 'ios') {
      try {
        // Dynamically import ExtensionStorage only when needed
        const appleTargets = require("@bacons/apple-targets");
        if (appleTargets && appleTargets.ExtensionStorage) {
          appleTargets.ExtensionStorage.reloadWidget();
        }
      } catch (error) {
        console.log('Failed to reload widget:', error);
      }
    }
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
