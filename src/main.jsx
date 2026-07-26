import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { ChakraProvider, extendTheme, Spinner, Center, Box, Text } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#fff8f1',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      900: '#7c2d12',
    },
    surface: {
      50: '#faf9f7',
      100: '#f5f3ef',
      200: '#e7e5e4',
    },
  },
  fonts: {
    heading: "Inter, ui-sans-serif, system-ui",
    body: "Inter, ui-sans-serif, system-ui",
  },
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
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
