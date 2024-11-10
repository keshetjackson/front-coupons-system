import { Suspense, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './global.css'
import { AppRouter } from './AppRouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/reactQuery'

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <AppRouter />
    </Suspense>
  </QueryClientProvider>
  )
}

export default App
