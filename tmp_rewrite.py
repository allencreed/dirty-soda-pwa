import os
repo = r'C:\Users\allen\dirty-soda-pwa'

cart_page = '''import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Box, Heading, VStack, Text, Button, HStack, Icon, Badge, useToast, Spinner, Center } from '@chakra-ui/react'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE } from '../utils/api.js'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart, syncing } = useCart()
  const { isLoaded, getToken } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [checkingOut, setCheckingOut] = useState(false)

  const checkout = async () => {
    if (!isLoaded) return
    setCheckingOut(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/api/orders/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${token || ''},
        },
        body: JSON.stringify({ items: cart, total }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else throw new Error('No checkout URL')
    } catch (e) {
      toast({ title: 'Checkout failed', status: 'error' })
    } finally {
      setCheckingOut(false)
    }
  }

  if (!isLoaded) {
    return (
      <Center minH="60vh">
        <Spinner />
      </Center>
    )
  }

  return (
    <Box p={4} maxW="600px" mx="auto" pb="24">
      <Heading size="lg" mb={4} color="gray.900">Your Cart</Heading>
      {syncing ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">Syncing cart...</Text>
        </Box>
      ) : cart.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">Your cart is empty</Text>
          <Button mt={4} colorScheme="brand" onClick={() => navigate('/')}>Browse Menu</Button>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {cart.map((item) => {
            const mods = Array.isArray(item.modifiers) ? item.modifiers : []
            const modTotal = mods.reduce((a, b) => a + (b.priceDelta || 0), 0)
            const line = (item.basePrice + modTotal) * (item.quantity || 1)
            return (
              <Box key={item.id} borderWidth="1px" borderRadius="xl" p={4} bg="white" borderColor="surface.200">
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="bold" color="gray.900">{item.name}</Text>
                      {mods.length > 0 && (
                        <Text fontSize="xs" color="brand.600" mt={1}>
                          {mods.map(m => '+${m.name}').join(', ')}
                        </Text>
                      )}
                    </Box>
                    <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </HStack>
                  <HStack justify="space-between" align="center">
                    <HStack>
                      <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                      <Badge colorScheme="brand">{item.quantity}</Badge>
                      <Button size="xs" variant="outline" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                    </HStack>
                    <Text fontWeight="bold" color="brand.600">${line.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>
            )
          })}
          <Box borderWidth="1px" borderRadius="xl" p={4} bg="surface.50" borderColor="surface.200">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold" color="gray.900">Total</Text>
              <Text fontSize="lg" fontWeight="bold" color="brand.600">${total.toFixed(2)}</Text>
            </HStack>
          </Box>
          <Button colorScheme="brand" size="lg" w="full" onClick={checkout} isLoading={checkingOut}>
            {checkingOut ? 'Redirecting...' : 'Checkout'}
          </Button>
          <Button variant="ghost" colorScheme="red" onClick={clearCart} size="sm" w="full">Clear cart</Button>
        </VStack>
      )}
    </Box>
  )
}
'''

admin_page = '''import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, VStack, Text, Button, Input, Textarea, FormControl, FormLabel, HStack, Icon, useToast, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, NumberInput, NumberInputField, Switch, useBreakpointValue } from '@chakra-ui/react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE } from '../utils/api.js'

export default function AdminPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', basePrice: '', image: '', category: 'signature', isActive: true })
  const [editingId, setEditingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const columns = useBreakpointValue({ base: 1, md: 2 })

  const load = async () => {
    const token = await getToken()
    if (!token) return navigate('/sign-in')
    const res = await fetch(`${API_BASE}/api/admin/menu`, { headers: { Authorization: Bearer ${token}` } })
    if (!res.ok) return navigate('/sign-in')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [getToken, navigate])

  const save = async () => {
    const token = await getToken()
    const payload = { ...form, basePrice: Number(form.basePrice) }
    const url = editingId ? `${API_BASE}/api/admin/menu/${editingId}` : `${API_BASE}/api/admin/menu`
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: Bearer ${token}` }, body: JSON.stringify(payload) })
    if (!res.ok) return toast({ title: 'Save failed', status: 'error' })
    toast({ title: editingId ? 'Updated' : 'Created', status: 'success' })
    setForm({ name: '', description: '', basePrice: '', image: '', category: 'signature', isActive: true })
    setEditingId(null)
    setIsModalOpen(false)
    load()
  }

  const remove = async (id) => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/admin/menu/${id}`, { method: 'DELETE', headers: { Authorization: Bearer ${token}` } })
    if (!res.ok) return toast({ title: 'Delete failed', status: 'error' })
    toast({ title: 'Deleted', status: 'success' })
    load()
  }

  return (
    <Box p={4} maxW="1000px" mx="auto" pb="24">
      <HStack justify="space-between" mb={4}>
        <Heading size="lg" color="gray.900">Admin Menu</Heading>
        <Button colorScheme="brand" leftIcon={<Icon as={FiPlus} />} onClick={() => { setEditingId(null); setForm({ name: '', description: '', basePrice: '', image: '', category: 'signature', isActive: true }); setIsModalOpen(true) }}>New Item</Button>
      </HStack>

      <SimpleGrid columns={columns} gap={3}>
        {items.map(item => (
          <Box key={item.id} borderWidth="1px" borderRadius="xl" p={4} bg="white" borderColor="surface.200">
            <Text fontWeight="bold" color="gray.900">{item.name}</Text>
            <Text fontSize="sm" color="gray.500">{item.description}</Text>
            <Text color="brand.600" fontWeight="bold">${Number(item.basePrice).toFixed(2)}</Text>
            <HStack mt={3}>
              <Button size="sm" variant="outline" onClick={() => { setEditingId(item.id); setForm(item); setIsModalOpen(true) }}><Icon as={FiEdit2} /></Button>
              <Button size="sm" colorScheme="red" variant="ghost" onClick={() => remove(item.id)}><Icon as={FiTrash2} /></Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? 'Edit Item' : 'New Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Base Price</FormLabel>
                <NumberInput min={0} step={0.25} value={form.basePrice} onChange={v => setForm({ ...form, basePrice: v })}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              </FormControl>
              <HStack>
                <Text>Active</Text>
                <Switch isChecked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button w="full" colorScheme="brand" onClick={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
'''

with open(os.path.join(repo, 'src/pages/Cart.jsx'), 'w', encoding='utf-8') as f:
    f.write(cart_page)
print('WROTE src/pages/Cart.jsx')

with open(os.path.join(repo, 'src/pages/AdminPage.jsx'), 'w', encoding='utf-8') as f:
    f.write(admin_page)
print('WROTE src/pages/AdminPage.jsx')
