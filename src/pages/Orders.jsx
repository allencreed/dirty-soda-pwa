import { useState, useEffect } from 'react'
import { Box, Heading, Text, Badge, VStack, HStack, Button } from '@chakra-ui/react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../utils/api.js'
import { apiFetch } from '../utils/apiFetch.js'

const statusColors = { pending: 'yellow', paid: 'green', preparing: 'blue', ready: 'teal', picked_up: 'gray' }

export default function OrdersPage() {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const token = await getToken()
      if (!token) return
      try {
        const res = await apiFetch('/api/orders', {}, token)
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
    <Box p={4} maxW="600px" mx="auto" pb="24">
      <Heading size="lg" mb={4} color="gray.900">Orders</Heading>
      {orders.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">No orders yet</Text>
          <Button mt={4} colorScheme="brand" onClick={() => navigate('/')}>Order Now</Button>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {orders.map(o => (
            <Box key={o.id} borderWidth="1px" borderRadius="xl" p={4} bg="white" borderColor="surface.200">
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.900">Order #{o.id.slice(-6)}</Text>
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
