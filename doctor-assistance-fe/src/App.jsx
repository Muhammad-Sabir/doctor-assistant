import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Router from '@/router/Router';

export default function App() {
  
  const queryClient = new QueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" duration={3000} toastOptions={{
          className: 'border border-gray-200 shadow-lg p-4'
        }} />
        <RouterProvider router={Router} />
      </QueryClientProvider>
    
  );
}
