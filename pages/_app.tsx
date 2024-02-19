// Import CSS styles
import { AppProps } from 'next/app'
import { lazy, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import '../styles/custom.css'
import { AuthContextProvider } from '@/context/AuthContext'


export default function App({



  return (
    <>
      <AuthContextProvider>
        <Toaster position="bottom-center" />

      </AuthContextProvider>
    </>
  )
}