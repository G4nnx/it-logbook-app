
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LogbookProvider } from "@/context/LogbookContext";
import Header from "@/components/Header";
import ITLogbook from "@/pages/ITLogbook";
import BackupLogs from "@/pages/BackupLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LogbookProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<ITLogbook />} />
                <Route path="/backup-logs" element={<BackupLogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LogbookProvider>
  </QueryClientProvider>
);

export default App;
