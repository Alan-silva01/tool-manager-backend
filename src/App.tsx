
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Lazy loading com preload otimizado
const Index = React.lazy(() => import("./pages/Index"));

// Lazy loading condicional para páginas secundárias
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

// Preload das páginas principais quando o usuário interage
const preloadRoutes = () => {
  // Usa requestIdleCallback para preload durante idle time
  const schedulePreload = (preloadFn: () => Promise<any>) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadFn(), { timeout: 2000 });
    } else {
      setTimeout(preloadFn, 1000);
    }
  };
  
  schedulePreload(() => import("./pages/PegarItem"));
  schedulePreload(() => import("./pages/DevolverItem"));
  schedulePreload(() => import("./pages/Relatorios"));
};

// Configuração otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
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

// Componente de fallback minimalista
const PageFallback = React.memo(({ pageName }: { pageName: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      <p className="text-sm text-muted-foreground">Carregando {pageName}...</p>
    </div>
  </div>
));

PageFallback.displayName = 'PageFallback';

const App = () => {
  // Inicializar preload após montagem
  React.useEffect(() => {
    preloadRoutes();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="avb-theme">
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
