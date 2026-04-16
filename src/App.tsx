import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Dashboard } from "@/pages/Dashboard";
import { ClientDetail } from "@/pages/ClientDetail";
import { NewClient } from "@/pages/NewClient";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client/:id" element={<ClientDetail />} />
          <Route path="/new" element={<NewClient />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
