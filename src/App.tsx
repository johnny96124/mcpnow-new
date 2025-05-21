
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import TrayPopup from "@/pages/TrayPopup";
import HostNewLayout from "@/pages/Host-newlayout";
import MockHostPage from "@/pages/MockHostPage";

function App() {
  const [isPopup] = useState(window.location.search.includes("popup"));

  if (isPopup) {
    return (
      <ThemeProvider>
        <TrayPopup />
        <Toaster />
      </ThemeProvider>
    );
  }
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HostNewLayout />} />
          <Route path="/mock-host" element={<MockHostPage />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
