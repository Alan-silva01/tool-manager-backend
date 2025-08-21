
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingFallback } from "@/components/LoadingFallback";

// Lazy loading de todas as páginas com preload hints
const Index = React.lazy(() => 
  import("./pages/Index").then(module => ({ default: module.default }))
);
const PegarItem = React.lazy(() => 
  import("./pages/PegarItem").then(module => ({ default: module.default }))
);
const DevolverItem = React.lazy(() => 
  import("./pages/DevolverItem").then(module => ({ default: module.default }))
);
const Relatorios = React.lazy(() => 
  import("./pages/Relatorios").then(module => ({ default: module.default }))
);
const Admin = React.lazy(() => 
  import("./pages/Admin").then(module => ({ default: module.default }))
);
const NotFound = React.lazy(() => 
  import("./pages/NotFound").then(module => ({ default: module.default }))
);

// Configuração do QueryClient otimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        console.log('🔄 Query retry attempt:', failureCount, error);
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componentes de fallback específicos
const PageFallbacks = {
  Index: () => <LoadingFallback message="Carregando página inicial..." />,
  PegarItem: () => <LoadingFallback message="Carregando Pegar Item..." />,
  DevolverItem: () => <LoadingFallback message="Carregando Devolver Item..." />,
  Relatorios: () => <LoadingFallback message="Carregando Relatórios..." />,
  Admin: () => <LoadingFallback message="Carregando Admin..." />,
  NotFound: () => <LoadingFallback message="Carregando página..." />,
};

const App = () => {
  console.log('🚀 Iniciando aplicação AVB');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div id="skip-link">
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
            >
              Pular para conteúdo principal
            </a>
          </div>
          <Suspense fallback={<PageFallbacks.Index />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/pegar-item" 
                element={
                  <Suspense fallback={<PageFallbacks.PegarItem />}>
                    <PegarItem />
                  </Suspense>
                } 
              />
              <Route 
                path="/devolver-item" 
                element={
                  <Suspense fallback={<PageFallbacks.DevolverItem />}>
                    <DevolverItem />
                  </Suspense>
                } 
              />
              <Route 
                path="/relatorios" 
                element={
                  <Suspense fallback={<PageFallbacks.Relatorios />}>
                    <Relatorios />
                  </Suspense>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <Suspense fallback={<PageFallbacks.Admin />}>
                    <Admin />
                  </Suspense>
                } 
              />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<PageFallbacks.NotFound />}>
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
};

export default App;
