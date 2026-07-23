import { NavLink } from 'react-router-dom'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiHome, FiShoppingCart, FiClipboard, FiSettings } from 'react-icons/fi'

const items = [
  { to: '/', icon: FiHome, label: 'Menu' },
  { to: '/cart', icon: FiShoppingCart, label: 'Cart' },
  { to: '/orders', icon: FiClipboard, label: 'Orders' },
  { to: '/admin', icon: FiSettings, label: 'Admin' },
]

export default function BottomNav() {
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
    </Box>
  )
}
