import { useState, useEffect } from 'react'
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
    const res = await fetch(`${API_BASE}/api/admin/menu`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return navigate('/sign-in')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [getToken, navigate])

  const save = async () => {
    const token = await getToken()
    const payload = { ...form, basePrice: Number(form.basePrice) }
    const url = editingId ? `${API_BASE}/api/admin/menu/${editingId}` : `${API_BASE}/api/admin/menu`
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (!res.ok) return toast({ title: 'Save failed', status: 'error' })
    toast({ title: editingId ? 'Updated' : 'Created', status: 'success' })
    setForm({ name: '', description: '', basePrice: '', image: '', category: 'signature', isActive: true })
    setEditingId(null)
    setIsModalOpen(false)
    load()
  }

  const remove = async (id) => {
    const token = await getToken()
    const res = await fetch(`${API_BASE}/api/admin/menu/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return toast({ title: 'Delete failed', status: 'error' })
    toast({ title: 'Deleted', status: 'success' })
    load()
  }

  return (
    <Box p={4} maxW="1000px" mx="auto">
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Admin Menu</Heading>
        <Button colorScheme="brand" leftIcon={<Icon as={FiPlus} />} onClick={() => { setEditingId(null); setForm({ name: '', description: '', basePrice: '', image: '', category: 'signature', isActive: true }); setIsModalOpen(true) }}>New Item</Button>
      </HStack>

      <SimpleGrid columns={columns} gap={3}>
        {items.map(item => (
          <Box key={item.id} borderWidth="1px" borderRadius="lg" p={4} bg="white">
            <Text fontWeight="bold">{item.name}</Text>
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
