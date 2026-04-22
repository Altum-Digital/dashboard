import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Dashboard } from "@/pages/Dashboard";
import { ClientDetail } from "@/pages/ClientDetail";
import { NewClient } from "@/pages/NewClient";
import { Onboarding } from "@/pages/Onboarding";
import { Submissions } from "@/pages/Submissions";
import { Propuesta } from "@/pages/Propuesta";
import { Paquetes } from "@/pages/Paquetes";
import { Templates } from "@/pages/Templates";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — no auth needed */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/propuesta" element={<Propuesta />} />
        {/* Dashboard — wrapped in AppProvider */}
        <Route path="/*" element={
          <AppProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/client/:id" element={<ClientDetail />} />
              <Route path="/new" element={<NewClient />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/paquetes" element={<Paquetes />} />
              <Route path="/templates" element={<Templates />} />
            </Routes>
          </AppProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}
