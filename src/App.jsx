import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Box } from '@chakra-ui/react'
import { CartProvider } from './context/CartContext.jsx'
import MenuPage from './pages/Menu.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CartPage from './pages/Cart.jsx'
import OrdersPage from './pages/Orders.jsx'
import BottomNav from './components/BottomNav.jsx'

function PrivateRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) {
    return (
      <Box p={6} textAlign="center">
        <Box>Loading...</Box>
      </Box>
    )
  }
  return isSignedIn ? children : <Navigate to="/sign-in" replace />
}

function RedirectToMenu() {
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
      <RedirectToMenu />
      <Routes>
        <Route path="/" element={<PrivateRoute><MenuPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </CartProvider>
  )
}
