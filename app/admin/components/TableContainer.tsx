import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function TableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const myTheme = useTheme();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"light" | "dark">(
    "light",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      if (myTheme.theme === "system") {
        setSelectedAlgorithm(myTheme.systemTheme === "dark" ? "dark" : "light");
      } else {
        setSelectedAlgorithm(myTheme.theme === "dark" ? "dark" : "light");
      }
    }
  }, [mounted, myTheme]);

  useEffect(() => setMounted(true), []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d4eefa",
          colorBgBase: selectedAlgorithm === "dark" ? "#242329" : "#f5f5f5",
        },
        algorithm:
          selectedAlgorithm === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
