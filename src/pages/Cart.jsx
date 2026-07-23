import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Box, Heading, VStack, Text, Button, HStack, Icon, Badge, useToast, Spinner, Center } from '@chakra-ui/react'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE } from '../utils/api.js'

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
      const res = await fetch(`${API_BASE}/api/orders/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ items: cart, total }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error('No checkout URL')
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
    <Box p={4} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>Your Cart</Heading>
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
              <HStack key={item.id} justify="space-between" align="flex-start" borderWidth="1px" borderRadius="md" p={3} bg="white">
                <Box minW="0" flex="1">
                  <Text fontWeight="bold" noOfLines={1}>{item.name}</Text>
                  <HStack mt={2}>
                    <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, -1)}><Icon as={FiMinus} /></Button>
                    <Badge>{item.quantity}</Badge>
                    <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, 1)}><Icon as={FiPlus} /></Button>
                  </HStack>
                  {mods.map((m, idx) => <Text key={idx} fontSize="xs" color="brand.600">+{m.name}</Text>)}
                </Box>
                <HStack flexShrink={0}>
                  <Text fontWeight="bold">${line.toFixed(2)}</Text>
                  <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromCart(item.id)}><Icon as={FiTrash2} /></Button>
                </HStack>
              </HStack>
            )
          })}
          <HStack justify="space-between" pt={4}>
            <Text fontSize="xl" fontWeight="bold">Total: ${total.toFixed(2)}</Text>
            <Button colorScheme="brand" onClick={checkout} isLoading={checkingOut}>
              {checkingOut ? 'Redirecting...' : 'Checkout'}
            </Button>
          </HStack>
          <Button variant="ghost" colorScheme="red" onClick={clearCart} size="sm">Clear cart</Button>
        </VStack>
      )}
    </Box>
  )
}
