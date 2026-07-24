import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react'
import { FiXCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function CheckoutCancel() {
  const navigate = useNavigate()

  return (
    <Box p={4} maxW="sm" mx="auto" textAlign="center" minH="60vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Icon as={FiXCircle} boxSize={16} color="red.500" />
        <Heading size="lg">Payment Cancelled</Heading>
        <Text color="gray.500">Your payment was cancelled. Your cart is still saved.</Text>
        <Button colorScheme="brand" onClick={() => navigate('/cart')}>Return to Cart</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>Back to Menu</Button>
      </VStack>
    </Box>
  )
}
