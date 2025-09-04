import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start MSW in development but don't block app startup
if (process.env.NODE_ENV === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
    }).catch(console.error)
  })
}

createRoot(document.getElementById("root")!).render(<App />)
