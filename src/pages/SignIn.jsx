import { SignIn } from '@clerk/clerk-react'
import { Box, Flex } from '@chakra-ui/react'

export default function SignInPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" p={4}>
      <Box w="full" maxW="sm">
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
      </Box>
    </Flex>
  )
}
