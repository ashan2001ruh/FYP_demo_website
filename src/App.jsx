import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Testbed from './pages/Testbed.jsx'
import Framework1 from './pages/Framework1.jsx'
import Framework2 from './pages/Framework2.jsx'
import Framework3 from './pages/Framework3.jsx'
import SecurityTesting from './pages/SecurityTesting.jsx'
import Results from './pages/Results.jsx'
import Team from './pages/Team.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/testbed" element={<Testbed />} />
          <Route path="/framework-1" element={<Framework1 />} />
          <Route path="/framework-2" element={<Framework2 />} />
          <Route path="/framework-3" element={<Framework3 />} />
          <Route path="/security-testing" element={<SecurityTesting />} />
          <Route path="/results" element={<Results />} />
          <Route path="/team" element={<Team />} />
          {/* legacy paths */}
          <Route path="/architecture" element={<Navigate to="/testbed" replace />} />
          <Route path="/comparison" element={<Navigate to="/results" replace />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
