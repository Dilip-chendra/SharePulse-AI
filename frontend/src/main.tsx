import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

// A real key starts with pk_test_ or pk_live_ and is not a placeholder
const isValidClerkKey =
  typeof PUBLISHABLE_KEY === 'string' &&
  (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  !PUBLISHABLE_KEY.includes('REPLACE_WITH')

const root = createRoot(document.getElementById('root')!)

if (isValidClerkKey && PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App clerkEnabled={true} />
      </ClerkProvider>
    </StrictMode>
  )
} else {
  if (PUBLISHABLE_KEY) {
    console.info('[SharePulse-AI] Clerk key is a placeholder — running in demo mode (no authentication).')
  }
  root.render(
    <StrictMode>
      <App clerkEnabled={false} />
    </StrictMode>
  )
}
