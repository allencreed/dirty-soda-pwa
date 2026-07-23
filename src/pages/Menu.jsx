import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Box, Heading, SimpleGrid, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, ModalFooter, Checkbox, useBreakpointValue, Image, Skeleton, Stack } from '@chakra-ui/react'
import { API_BASE } from '../utils/api.js'

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [sel, setSel] = useState(null)
  const [selectedModifierIds, setSelectedModifierIds] = useState([])
  const { addToCart } = useCart()
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 })

  useEffect(() => {
    fetch(`${API_BASE}/api/menu`).then(r => r.json()).then(setItems).catch(() => setItems([]))
  }, [])

  const open = (item) => {
    setSel(item)
    setSelectedModifierIds([])
  }

  const toggle = (id) => {
    setSelectedModifierIds((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]))
  }

  const modifiers = Array.isArray(sel?.modifiers) ? sel.modifiers : []
  const selectedMods = modifiers.filter((m) => selectedModifierIds.includes(m.id))
  const total = (sel?.basePrice || 0) + selectedMods.reduce((a, b) => a + (b.priceDelta || 0), 0)

  return (
    <Box p={4} maxW="1000px" mx="auto">
      <Heading size="lg" mb={4}>Menu</Heading>
      <SimpleGrid columns={columns} gap={3}>
        {items.map((item) => (
          <Box key={item.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm" cursor="pointer" onClick={() => open(item)} _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)', transition: 'all .2s' }}>
            <Box bg="gray.100" h="140px" position="relative">
              {item.image ? (
                <Image src={item.image} alt={item.name} objectFit="cover" w="full" h="full" fallback={<Skeleton w="full" h="full" />} />
              ) : (
                <Box w="full" h="full" display="flex" alignItems="center" justifyContent="center" color="gray.400" fontSize="xs">No Image</Box>
              )}
            </Box>
            <Box p={3}>
              <Text fontWeight="bold" fontSize="lg" noOfLines={1}>{item.name}</Text>
              <Text color="gray.500" noOfLines={2} fontSize="sm" mt={1}>{item.description}</Text>
              <Text fontWeight="bold" mt={2} fontSize="md" color="brand.600">${item.basePrice.toFixed(2)}</Text>
              {item.modifiers?.length > 0 ? <Text fontSize="xs" color="gray.400" mt={1}>+{item.modifiers.length} add-ons</Text> : null}
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={!!sel} onClose={() => setSel(null)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{sel?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {sel?.image ? (
              <Image src={sel.image} alt={sel?.name} borderRadius="md" mb={3} maxH="180px" objectFit="cover" />
            ) : null}
            <Text mb={4}>{sel?.description}</Text>
            <Text fontWeight="bold" mb={2}>Add-ons</Text>
            <VStack align="start" mb={3}>
              {modifiers.length === 0 ? <Text fontSize="sm" color="gray.400">No add-ons available</Text> : modifiers.map((m) => (
                <Checkbox key={m.id} isChecked={selectedModifierIds.includes(m.id)} onChange={() => toggle(m.id)} colorScheme="brand">
                  <Stack direction="row" align="center">
                    <Text fontSize="sm">{m.name}</Text>
                    <Text fontSize="xs" color="gray.500">+${m.priceDelta.toFixed(2)}</Text>
                  </Stack>
                </Checkbox>
              ))}
            </VStack>
            <Text fontWeight="bold" fontSize="lg" color="brand.600">Total: ${total.toFixed(2)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" w="full" onClick={() => { addToCart({ ...sel, selectedModifiers: selectedMods }); setSel(null) }}>Add to Cart</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
