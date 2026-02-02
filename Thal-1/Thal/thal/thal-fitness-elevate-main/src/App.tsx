import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FloorPage from "./pages/FloorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {(() => {
        const Router = import.meta.env.VITE_USE_HASH === 'true' ? HashRouter : BrowserRouter;
        return (
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="floor-1" element={<FloorPage />} />
              <Route path="floor-2" element={<FloorPage />} />
              <Route path="floor-3" element={<FloorPage />} />
              <Route path="floor-4" element={<FloorPage />} />
              <Route path="floor-ground" element={<FloorPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        );
      })()}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
