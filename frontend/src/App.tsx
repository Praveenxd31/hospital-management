import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { useAuthStore } from '@store/authStore'

function App() {
  const { initAuth, token } = useAuthStore()

  useEffect(() => {
    if (token) initAuth()
  }, [])

  return (
    <>
       <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  )
}

export default App