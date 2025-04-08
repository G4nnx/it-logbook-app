import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { LogbookProvider } from "@/context/LogbookContext";
import Header from "@/components/Header";
import ITLogbook from "@/pages/ITLogbook";
import BackupLogs from "@/pages/BackupLogs";
import DepartmentSettings from "@/pages/DepartmentSettings";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "react-error-boundary";
import { useState } from "react";

// @ts-ignore - This import is added by Tempo
import routes from "tempo-routes";

const queryClient = new QueryClient();

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-red-600">
          Something went wrong
        </h2>
        <p className="mb-4 text-gray-700">
          An error occurred in the application.
        </p>
        <pre className="p-3 mb-4 overflow-auto text-sm bg-gray-100 rounded">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  // Tempo routes - only included if VITE_TEMPO is true
  const tempoRoutes = import.meta.env.VITE_TEMPO ? useRoutes(routes) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow">
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<ITLogbook />} />
          <Route path="/backup-logs" element={<BackupLogs />} />
          <Route path="/department-settings" element={<DepartmentSettings />} />
          {/* Add this before the catchall route to allow Tempo to capture its routes */}
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error("Application error:", error);
        setError(error);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LogbookProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </LogbookProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
