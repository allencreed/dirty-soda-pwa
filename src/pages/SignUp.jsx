import { SignUp } from '@clerk/clerk-react'
import { Box, Flex, Text } from '@chakra-ui/react'

export default function SignUpPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" p={4} bg="surface.100">
      <Box w="full" maxW="sm">
        <Box textAlign="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">Georgia Fizz Co.</Text>
          <Text color="gray.500" mt={1}>Create your account</Text>
        </Box>
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="surface.200" p={{ base: 4, md: 6 }} boxShadow="sm">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
        </Box>
      </Box>
    </Flex>
  )
}
