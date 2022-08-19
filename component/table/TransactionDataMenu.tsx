import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, FormControl, FormLabel, IconButton, Image, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Modal, ModalCloseButton, ModalContent, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure, useToast } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { DataState } from "../../utils/interface";

const ConfirmData = ({ data }: { data: DataState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <>
      <MenuItem onClick={onOpen} _hover={{ color: 'green.500' }} icon={<i className="ri-checkbox-circle-line"></i>}>Confirm</MenuItem>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Confirm Data
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    () => {
                      onClose();
                      toast({
                        title: 'Transaction Data Confirmed',
                        description: `Transaction Data with ID ${data.id} has successfully confirmed.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right',
                      });
                    }
                  }
                  colorScheme={'green'} >
                  Confirm
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const DeleteData = ({ data }: { data: DataState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <>
      <MenuItem onClick={onOpen} _hover={{ color: 'red.500' }} icon={<i className="ri-delete-bin-2-line"></i>}>Delete</MenuItem>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Data
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    () => {
                      onClose();
                      toast({
                        title: 'Transaction Data Deleted',
                        description: `Transaction Data with ID ${data.id} has successfully deleted.`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right',
                      });
                    }
                  }
                  colorScheme={'red'}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const EditData = ({ data }: { data: DataState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [updatedData, setUpdatedData] = useState<DataState>(data);

  const handleInputChange = (event: any) => {
    setUpdatedData(s => ({ ...s, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <MenuItem onClick={onOpen} icon={<i className="ri-edit-box-line"></i>}>Edit</MenuItem>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Edit Data
            </AlertDialogHeader>
            <AlertDialogBody>
              <Stack>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Name</FormLabel>
                  <Input type={'text'} size={'sm'} value={updatedData.name} name={'name'} onChange={e => handleInputChange(e)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Amount</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftElement
                      pointerEvents='none'
                      color='gray.400'
                      fontSize={'sm'}
                      children='Rp'
                    />
                    <Input type={'text'} name={'amount'}
                      value={updatedData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      onChange={(e) => {
                        var ea = e.target.value.replace(/[^0-9\.-]+/g, '');
                        ea = ea.replace(/\./g, '');
                        setUpdatedData(d => ({ ...d, amount: isNaN(Number(ea)) ? 0 : Number(ea) }))
                      }} />
                    <InputRightElement height={'100%'} p={0}>
                      <Stack gap={0}>
                        <IconButton aria-label={"increment-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-up-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setUpdatedData(d => ({ ...d, amount: d.amount + 1000 })); }}></IconButton>
                        <IconButton mt={'0!important'} aria-label={"decrement-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-down-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setUpdatedData(d => ({ ...d, amount: d.amount - 1000 })); }}></IconButton>
                      </Stack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl mt={4} >
                  <FormLabel fontSize={'sm'}>Transaction Date</FormLabel>
                  <Input type={'date'} size={'sm'} value={data.transactionDate} onChange={e => e.target.value} />
                </FormControl>
                <FormControl isDisabled>
                  <FormLabel fontSize={'sm'}>PIC</FormLabel>
                  <Input type={'text'} size={'sm'} value={updatedData.pic} name={'name'} onChange={e => handleInputChange(e)} />
                </FormControl>
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    () => {
                      onClose();
                      toast({
                        title: 'Transaction Data Updated',
                        description: `Transaction Data with ID ${data.id} has successfully updated.`,
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right',
                      });
                    }
                  }
                  colorScheme={'blue'}>
                  Edit
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const ViewImage = ({ data }: { data: DataState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <MenuItem onClick={onOpen} icon={<i className="ri-bill-line"></i>}>View Payment Evidence</MenuItem>
      <Modal size={'4xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Image src="https://picsum.photos/960/540"></Image>
        </ModalContent>
      </Modal>
    </>
  )
}

export const TransactionMenuComponent = ({ data }: { data: DataState }) => {
  return (
    <>
      <Menu>
        <MenuButton as={IconButton} variant={'ghost'} size={'xs'} icon={<i className="ri-more-2-line"></i>} />
        <MenuList fontSize={'xs'}>
          <ViewImage data={data} />
          <MenuDivider />
          <ConfirmData data={data} />
          <EditData data={data} />
          <DeleteData data={data} />
        </MenuList>
      </Menu>
    </>
  )
}