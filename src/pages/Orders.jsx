import { useState, useEffect } from 'react'
import { Box, Heading, Text, Badge, VStack, HStack, Button } from '@chakra-ui/react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const statusColors = { pending: 'yellow', paid: 'green', preparing: 'blue', ready: 'teal', picked_up: 'gray' }

export default function OrdersPage() {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('status') === 'success') {
      // payment succeeded placeholder; in real flow we'd refresh orders
    }
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const token = await getToken()
      if (!token) return
      try {
        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!cancelled) setOrders(data)
      } catch {
        if (!cancelled) setOrders([])
      }
    }
    load()
    return () => { cancelled = true }
  }, [getToken])

  return (
    <Box p={4} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>Orders</Heading>
      {orders.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">No orders yet</Text>
          <Button mt={4} colorScheme="brand" onClick={() => navigate('/')}>Order Now</Button>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {orders.map(o => (
            <Box key={o.id} borderWidth="1px" borderRadius="md" p={3} bg="white">
              <HStack justify="space-between">
                <Text fontWeight="bold">Order #{o.id.slice(-6)}</Text>
                <Badge colorScheme={statusColors[o.status] || 'gray'} textTransform="capitalize">{o.status}</Badge>
              </HStack>
              <Text mt={1} fontSize="sm" color="gray.500">${Number(o.total).toFixed(2)} • {new Date(o.createdAt).toLocaleDateString()}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}
