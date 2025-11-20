import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Participants from "./pages/Participants";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/hardware" element={<div className="p-6"><h1 className="text-2xl font-bold">Hardware Inventory</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="/tracking" element={<div className="p-6"><h1 className="text-2xl font-bold">Live Tracking</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports & Exports</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="/messages" element={<div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="/audit" element={<div className="p-6"><h1 className="text-2xl font-bold">Audit Log</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
