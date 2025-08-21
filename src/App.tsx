
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy loading de todas as páginas
const Index = React.lazy(() => import("./pages/Index"));
const PegarItem = React.lazy(() => import("./pages/PegarItem"));
const DevolverItem = React.lazy(() => import("./pages/DevolverItem"));
const Relatorios = React.lazy(() => import("./pages/Relatorios"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Otimizar configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      retry: (failureCount, error) => {
        // Não retentar para erros 4xx
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente de fallback otimizado
const PageFallback = ({ pageName }: { pageName: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Carregando {pageName}...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback pageName="página" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/pegar-item" 
              element={
                <Suspense fallback={<PageFallback pageName="Pegar Item" />}>
                  <PegarItem />
                </Suspense>
              } 
            />
            <Route 
              path="/devolver-item" 
              element={
                <Suspense fallback={<PageFallback pageName="Devolver Item" />}>
                  <DevolverItem />
                </Suspense>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <Suspense fallback={<PageFallback pageName="Relatórios" />}>
                  <Relatorios />
                </Suspense>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={<PageFallback pageName="Admin" />}>
                  <Admin />
                </Suspense>
              } 
            />
            <Route 
              path="*" 
              element={
                <Suspense fallback={<PageFallback pageName="página" />}>
                  <NotFound />
                </Suspense>
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
