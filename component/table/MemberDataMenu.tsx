import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, FormControl, FormLabel, IconButton, Image, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Modal, ModalCloseButton, ModalContent, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { MemberState } from "../../utils/interface";

const DeleteData = ({ data }: { data: MemberState }) => {
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
                        title: 'Member Data Deleted',
                        description: `Member Data with ID ${data.id} has successfully deleted.`,
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

const EditData = ({ data }: { data: MemberState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [updatedData, setUpdatedData] = useState<MemberState>(data);

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
                  <FormLabel fontSize={'sm'}>Class</FormLabel>
                  <Input type={'number'} size={'sm'} value={updatedData.class} name={'class'} onChange={e => handleInputChange(e)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Phone</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftAddon children={'+62'} />
                    <Input type={'tel'} value={updatedData.phone.replace(/[^\w\s]62/g, '')} name={'phone'} onChange={e => setUpdatedData(d => ({ ...d, phone: '+62' + e.target.value }))} />
                  </InputGroup>
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
                        title: 'Member Data Updated',
                        description: `Member Data with ID ${data.id} has successfully updated.`,
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

export const MemberMenuComponent = ({ data }: { data: MemberState }) => {
  return (
    <>
      <Menu>
        <MenuButton as={IconButton} variant={'ghost'} size={'xs'} icon={<i className="ri-more-2-line"></i>} />
        <MenuList fontSize={'xs'}>
          <MenuItem icon={<i className="ri-message-2-line"></i>}>Send Message</MenuItem>
          <MenuDivider />
          <EditData data={data} />
          <DeleteData data={data} />
        </MenuList>
      </Menu>
    </>
  )
}