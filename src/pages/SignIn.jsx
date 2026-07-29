import { SignIn } from '@clerk/clerk-react'
import { Box, Flex, Text } from '@chakra-ui/react'

export default function SignInPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" p={4} bg="surface.100">
      <Box w="full" maxW="sm">
        <Box textAlign="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">Georgia Fizz Co.</Text>
          <Text color="gray.500" mt={1}>Sign in to your account</Text>
        </Box>
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="surface.200" p={{ base: 4, md: 6 }} boxShadow="sm">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
        </Box>
      </Box>
    </Flex>
  )
}
