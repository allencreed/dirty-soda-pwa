import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Box, Heading, VStack, Text, Button, HStack, Icon, Badge, useToast, Spinner, Center } from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE } from '../utils/api.js'
import { apiFetch } from '../utils/apiFetch.js'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart, syncing } = useCart()
  const { isLoaded, getToken } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [checkingOut, setCheckingOut] = useState(false)

  const checkout = async () => {
    if (!isLoaded) return
    setCheckingOut(true)
    try {
      const token = await getToken()
      const res = await apiFetch('/api/orders/session', {
        method: 'POST',
        body: JSON.stringify({ items: cart, total })
      }, token)
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else throw new Error('No checkout URL')
    } catch (e) {
      toast({ title: 'Checkout failed', status: 'error' })
    } finally {
      setCheckingOut(false)
    }
  }

  if (!isLoaded) {
    return (
      <Center minH="60vh">
        <Spinner />
      </Center>
    )
  }

  return (
    <Box p={4} maxW="600px" mx="auto" pb="24">
      <Heading size="lg" mb={4} color="gray.900">Your Cart</Heading>
      {syncing ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">Syncing cart...</Text>
        </Box>
      ) : cart.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">Your cart is empty</Text>
          <Button mt={4} colorScheme="brand" onClick={() => navigate('/')}>Browse Menu</Button>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {cart.map((item) => {
            const mods = Array.isArray(item.modifiers) ? item.modifiers : []
            const modTotal = mods.reduce((a, b) => a + (b.priceDelta || 0), 0)
            const line = (item.basePrice + modTotal) * (item.quantity || 1)
            return (
              <Box key={item.id} borderWidth="1px" borderRadius="xl" p={4} bg="white" borderColor="surface.200">
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="bold" color="gray.900">{item.name}</Text>
                      {mods.length > 0 && (
                        <Text fontSize="xs" color="brand.600" mt={1}>
                          {mods.map(m => `+${m.name}`).join(', ')}
                        </Text>
                      )}
                    </Box>
                    <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                      <Badge colorScheme="brand">{item.quantity}</Badge>
                      <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                    </HStack>
                    <Text fontWeight="bold" color="brand.600">${line.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>
            )
          })}
          <Box borderWidth="1px" borderRadius="xl" p={4} bg="surface.50" borderColor="surface.200">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold" color="gray.900">Total</Text>
              <Text fontSize="lg" fontWeight="bold" color="brand.600">${total.toFixed(2)}</Text>
            </HStack>
          </Box>
          <Button colorScheme="brand" size="lg" w="full" onClick={checkout} isLoading={checkingOut}>
            {checkingOut ? 'Redirecting...' : 'Checkout'}
          </Button>
          <Button variant="ghost" colorScheme="red" onClick={clearCart} size="sm" w="full">Clear cart</Button>
        </VStack>
      )}
    </Box>
  )
}
