import React from 'react'
import { RouterProvider } from 'react-router-dom'
import Router from './router/Router'
import { AuthContextProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthContextProvider>
      <Toaster richColors position="top-right" duration={3000} toastOptions={{
        className: 'border border-gray-200 shadow-lg p-4'
      }} />
      <RouterProvider router={Router} />
    </AuthContextProvider>
  )
}
