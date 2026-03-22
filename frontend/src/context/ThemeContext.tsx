import { createContext, useContext, useState } from "react";

interface ThemeCtx { dark: boolean; toggle: () => void }

const ThemeContext = createContext<ThemeCtx>({ dark: true, toggle: () => { } });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [dark, setDark] = useState(true);
    return (
        <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
            <div style={{
                minHeight: "100vh",
                background: dark ? "#0f172a" : "#f1f5f9",
                color: dark ? "white" : "#1e293b",
                transition: "background 0.3s, color 0.3s",
            }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
