import { SignUp } from '@clerk/clerk-react'
import { Box, Flex } from '@chakra-ui/react'

export default function SignUpPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center" p={4}>
      <Box w="full" maxW="sm">
        <SignUp routing="hash" afterSignUpUrl="/" />
      </Box>
    </Flex>
  )
}
