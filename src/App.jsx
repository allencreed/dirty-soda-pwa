import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useAuth } from '@clerk/clerk-react'
import { CartProvider } from './context/CartContext.jsx'
import MenuPage from './pages/Menu.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CartPage from './pages/Cart.jsx'
import OrdersPage from './pages/Orders.jsx'
import BottomNav from './components/BottomNav.jsx'
import SignInPage from './pages/SignIn.jsx'
import SignUpPage from './pages/SignUp.jsx'

function PrivateRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return <Box p={6} textAlign="center">Loading...</Box>
  return isSignedIn ? children : <Navigate to="/sign-in" replace />
}

function RedirectOnAuth() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/', { replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <RedirectOnAuth />
      <Box minH="100dvh" pb={['24', null, '0']}>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/" element={<PrivateRoute><MenuPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        </Routes>
        <BottomNav />
      </Box>
    </CartProvider>
  )
}
