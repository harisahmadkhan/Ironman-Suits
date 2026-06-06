import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing    from '@/pages/Landing'
import Armory     from '@/pages/Armory'
import SuitDetail from '@/pages/SuitDetail'
import Compare    from '@/pages/Compare'
import NotFound   from '@/pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"               element={<Landing />} />
        <Route path="/armory"         element={<Armory />} />
        <Route path="/armory/:suitId" element={<SuitDetail />} />
        <Route path="/compare"        element={<Compare />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
