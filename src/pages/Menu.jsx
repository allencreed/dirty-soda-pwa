import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Box, Heading, SimpleGrid, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, ModalFooter, Checkbox, useBreakpointValue, Image, Skeleton, Stack, useToast } from '@chakra-ui/react'
import { API_BASE } from '../utils/api.js'

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [sel, setSel] = useState(null)
  const [selectedModifierIds, setSelectedModifierIds] = useState([])
  const { addToCart } = useCart()
  const toast = useToast()
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 })

  useEffect(() => {
    fetch(`${API_BASE}/api/menu`)
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]))
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

  const handleAddToCart = () => {
    if (!sel) return
    addToCart({
      ...sel,
      modifiers: selectedMods,
      quantity: 1,
    })
    setSel(null)
    toast({
      title: 'Added to cart',
      status: 'success',
      duration: 1500,
    })
  }

  return (
    <Box p={4} maxW="1000px" mx="auto">
      <Heading size="lg" mb={4}>Menu</Heading>
      <SimpleGrid columns={columns} gap={3}>
        {items.map((item) => (
          <Box
            key={item.id}
            borderWidth="1px"
            borderRadius="2xl"
            overflow="hidden"
            bg="white"
            borderColor="surface.200"
            boxShadow="sm"
            transition="all .2s ease"
            _hover={{ borderColor: 'brand.300', transform: 'translateY(-2px)', boxShadow: 'md' }}
            cursor="pointer"
            onClick={() => open(item)}
          >
            <Box bg="surface.100" h="160px" position="relative">
              {item.image ? (
                <Image src={item.image} alt={item.name} objectFit="cover" w="full" h="full" fallback={<Skeleton w="full" h="full" />} />
              ) : (
                <Box w="full" h="full" display="flex" alignItems="center" justifyContent="center" color="gray.400" fontSize="xs">No Image</Box>
              )}
            </Box>
            <Box p={4}>
              <Text fontWeight="bold" fontSize="md" noOfLines={1} color="gray.900">{item.name}</Text>
              <Text color="gray.500" noOfLines={2} fontSize="sm" mt={1}>{item.description}</Text>
              <HStack justify="space-between" align="center" mt={3}>
                <Text fontWeight="bold" fontSize="md" color="brand.600">${item.basePrice.toFixed(2)}</Text>
                {item.modifiers?.length > 0 ? <Text fontSize="xs" color="gray.400">+{item.modifiers.length} add-ons</Text> : null}
              </HStack>
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
            <Button colorScheme="brand" w="full" onClick={handleAddToCart}>Add to Cart</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
