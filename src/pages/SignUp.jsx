import { SignUp } from '@clerk/clerk-react'
import { Box, Flex } from '@chakra-ui/react'

export default function SignUpPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" p={4}>
      <Box w="full" maxW="sm">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
      </Box>
    </Flex>
  )
}
