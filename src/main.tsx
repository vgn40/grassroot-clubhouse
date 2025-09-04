import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start MSW
import { worker } from './mocks/browser'

worker.start().then(() => {
  createRoot(document.getElementById("root")!).render(<App />)
})
