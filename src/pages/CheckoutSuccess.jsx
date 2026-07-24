import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <Box p={4} maxW="sm" mx="auto" textAlign="center" minH="60vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Icon as={FiCheckCircle} boxSize={16} color="green.500" />
        <Heading size="lg">Payment Successful</Heading>
        <Text color="gray.500">
          {orderId ? `Order #${orderId.slice(-6)} confirmed.` : 'Your order has been confirmed.'}
        </Text>
        <Button colorScheme="brand" onClick={() => navigate('/orders')}>View Orders</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>Back to Menu</Button>
      </VStack>
    </Box>
  )
}
