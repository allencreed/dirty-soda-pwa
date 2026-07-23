import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { ChakraProvider, extendTheme, Spinner, Center, Box, Text } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'

const theme = extendTheme({
  colors: {
    brand: { 50: '#fffaf0', 100: '#feebc8', 500: '#ed8936', 600: '#dd6b20', 900: '#1a202c' }
  },
  fonts: {
    heading: "Inter, ui-sans-serif, system-ui",
    body: "Inter, ui-sans-serif, system-ui"
  }
})

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function Root() {
  if (!key || key.includes('placeholder')) {
    return (
      <ChakraProvider theme={theme}>
        <Center minH="100dvh" p={4}>
          <Box textAlign="center" maxW="sm">
            <Text fontSize="xl" fontWeight="bold" mb={2}>Setup Required</Text>
            <Text color="gray.500" mb={4}>Add your VITE_CLERK_PUBLISHABLE_KEY to .env and restart the dev server.</Text>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">{key || 'VITE_CLERK_PUBLISHABLE_KEY is missing'}</Text>
          </Box>
        </Center>
      </ChakraProvider>
    )
  }
  return (
    <ClerkProvider publishableKey={key}>
      <ChakraProvider theme={theme}>
        <HashRouter>
          <App />
        </HashRouter>
      </ChakraProvider>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
