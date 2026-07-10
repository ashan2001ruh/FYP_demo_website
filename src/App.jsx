import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Framework1 from './pages/Framework1.jsx'
import Framework2 from './pages/Framework2.jsx'
import Framework3 from './pages/Framework3.jsx'
import Architecture from './pages/Architecture.jsx'
import About from './pages/About.jsx'

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
          <Route path="/framework-1" element={<Framework1 />} />
          <Route path="/framework-2" element={<Framework2 />} />
          <Route path="/framework-3" element={<Framework3 />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
