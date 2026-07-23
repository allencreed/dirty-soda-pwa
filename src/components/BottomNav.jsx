import { NavLink, useLocation } from 'react-router-dom'
import { Box, Flex, Text, IconButton } from '@chakra-ui/react'
import { FiHome, FiShoppingCart, FiClipboard, FiSettings, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

const items = [
  { to: '/', icon: FiHome, label: 'Menu' },
  { to: '/cart', icon: FiShoppingCart, label: 'Cart' },
  { to: '/orders', icon: FiClipboard, label: 'Orders' },
  { to: '/admin', icon: FiSettings, label: 'Admin' },
]

export default function BottomNav() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthPage = location.pathname.startsWith('/sign-')

  const handleSignOut = async () => {
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <Box
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      zIndex={100}
    >
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={{ flex: 1, textDecoration: 'none' }}>
          {({ isActive }) => (
            <Flex direction="column" align="center" py={3} color={isActive ? 'brand.600' : 'gray.500'}>
              <Icon fontSize="xl" />
              <Text fontSize="xs" fontWeight={isActive ? 'bold' : 'normal'}>{label}</Text>
            </Flex>
          )}
        </NavLink>
      ))}
      {!isAuthPage && (
        <IconButton
          aria-label="Sign out"
          position="absolute"
          right={3}
          bottom={3}
          variant="ghost"
          colorScheme="red"
          size="sm"
          onClick={handleSignOut}
          icon={<FiLogOut />}
        />
      )}
    </Box>
  )
}
