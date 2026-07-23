import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Box } from '@chakra-ui/react'
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
  if (!isLoaded) {
    return (
      <Box p={6} textAlign="center">
        <Box>Loading...</Box>
      </Box>
    )
  }
  return isSignedIn ? children : <Navigate to="/sign-in" replace />
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<PrivateRoute><MenuPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
      </Routes>
      <BottomNav />
    </CartProvider>
  )
}
