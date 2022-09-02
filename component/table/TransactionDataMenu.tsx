import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Button, ButtonGroup, chakra, Divider, FormControl, FormLabel, Grid, GridItem, IconButton, Image, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { MemberState, TransactionState } from "../../utils/interface";

const ConfirmData = ({ data, handlerConfirm }: { data: TransactionState, handlerConfirm: (confirmData: TransactionState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
              Are you sure want to confirm transaction data <chakra.strong>{data.name}</chakra.strong> with <chakra.strong> {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(data.transactionDate))}</chakra.strong>?
              You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => { handlerConfirm(data) }}
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

const DeleteData = ({ data, handlerDelete }: { data: TransactionState, handlerDelete: (deleteData: TransactionState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
              Are you sure want to delete transaction data <chakra.strong>{data.name}</chakra.strong> with <chakra.strong> {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(data.transactionDate))}</chakra.strong>?
              You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => handlerDelete(data)} colorScheme={'red'}>
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

const EditData = ({ data, handlerEdit }: { data: TransactionState, handlerEdit: (editData: TransactionState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [updatedData, setUpdatedData] = useState<TransactionState>(data);

  const handleSubmit = () => {
    handlerEdit(updatedData);
    setUpdatedData(data);
    onClose();
  }

  const handleInputChange = (event: any) => {
    setUpdatedData(s => ({ ...s, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <MenuItem onClick={onOpen} icon={<i className="ri-edit-box-line"></i>}>Edit</MenuItem>
      <Modal size={'xl'} onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <chakra.form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ModalContent>
            <ModalHeader>Edit Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Name</FormLabel>
                  <Input type={'text'} size={'sm'} value={updatedData.name} name={'name'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Amount</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftAddon rounded={'md'}>Rp</InputLeftAddon>
                    <Input type={'text'} name={'amount'} rounded={'md'}
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
                <FormControl mt={4} isRequired>
                  <FormLabel fontSize={'sm'}>Transaction Date</FormLabel>
                  <Input type={'date'} size={'sm'} value={data.transactionDate} onChange={e => e.target.value} rounded={'md'} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Transaction Evidence</FormLabel>
                  <Input type={'text'} size={'sm'} value={updatedData.evidence} name={'evidence'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size={'sm'}>
                <Button onClick={onClose}>Close</Button>
                <Button type={'submit'} colorScheme={'blue'}>Submit</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </chakra.form>
      </Modal>
    </>
  )
}

const ViewImage = ({ data }: { data: TransactionState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <MenuItem onClick={onOpen} icon={<i className="ri-bill-line"></i>}>View Payment Evidence</MenuItem>
      <Modal size={'4xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Image src={data.evidence}></Image>
        </ModalContent>
      </Modal>
    </>
  )
}

const ViewDetail = ({ data }: { data: TransactionState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [pic, setPic] = useState<MemberState>()
  const [confirmedBy, setConfirmedBy] = useState<MemberState>()

  useEffect(() => {
    var mounted: boolean = true;

    const queryPic = `query Query {
      getMember(email: "${data.pic}", _id: "") {
        name
      }
    }`

    const queryConfirmedby = `query Query {
      getMember(email: "${data.confirmedBy}", _id: "") {
        name
      }
    }`

    const getPic = async () => {
      await axios.post('/api/graphql', { query: queryPic }).then(res => {
        const member = res.data.data.getMember;
        if (mounted) {
          setPic(member);
        }
      })
    }

    const getConfirmedby = async () => {
      await axios.post('/api/graphql', { query: queryConfirmedby }).then(res => {
        const member = res.data.data.getMember;
        if (mounted) {
          setConfirmedBy(member);
        }
      })
    }

    if (isOpen) {
      getPic();
      getConfirmedby()
    }

    return () => { mounted = false; }
  }, [data.pic, data.confirmedBy, isOpen])

  return (
    <>
      <MenuItem onClick={onOpen} icon={<i className="ri-fullscreen-line"></i>}>View Detail</MenuItem>
      <Modal size={'xl'} onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={1} fontSize={'sm'} divider={<Divider />}>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Name</GridItem>
                <GridItem colSpan={3}>: {data.name}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Amount</GridItem>
                <GridItem colSpan={3}>: {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(data.amount)}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Date</GridItem>
                <GridItem colSpan={3}>: {Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(data.transactionDate))}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>PIC</GridItem>
                <GridItem colSpan={3}>: {pic?.name}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Status</GridItem>
                <GridItem colSpan={3}>: {data.status == 'confirmed' ?
                  <><Badge colorScheme={'green'} fontSize={10}>{data.status}</Badge> by {confirmedBy?.name}</>
                  : <Badge colorScheme={'red'} fontSize={10}>{data.status}</Badge>}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Evidence</GridItem>
                <GridItem colSpan={3}>: {data.evidence}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Last Update</GridItem>
                <GridItem colSpan={3}>: {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'long' }).format(new Date(data._lastUpdate))}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Created</GridItem>
                <GridItem colSpan={3}>: {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'long' }).format(new Date(data._createdAt))}</GridItem>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter><Button onClick={onClose} size={'sm'} colorScheme={'blue'}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const AddDataModal = (props: { handlerSubmit: (data: TransactionState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialTransacionData: TransactionState = {
    _id: '',
    name: '',
    transactionDate: '',
    amount: 0,
    pic: '',
    evidence: '',
    status: 'unconfirmed',
    confirmedBy: '',
    _lastUpdate: '',
    _createdAt: '',
  }

  const [transactionData, setTransactionData] = useState<TransactionState>(initialTransacionData);

  const handleSubmit = () => {
    props.handlerSubmit(transactionData);

    setTransactionData(initialTransacionData);
    onClose();
  }

  const handleInputChange = (event: any) => {
    setTransactionData(d => ({ ...d, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <Button onClick={onOpen} w={{ base: '100%', md: 'auto' }} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-add-line"></i>} variant={'outline'}>Add Transaction</Button>
      <Modal size={'xl'} onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <chakra.form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ModalContent>
            <ModalHeader>Add Transaction</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Transaction Name</FormLabel>
                  <Input type={'text'} size={'sm'} value={transactionData.name} placeholder={'Enter transaction name'} name={'name'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Amount</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftAddon rounded={'md'}>Rp</InputLeftAddon>
                    <Input type={'text'} name={'amount'} rounded={'md'}
                      value={transactionData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      onChange={(e) => {
                        var ea = e.target.value.replace(/[^0-9\.-]+/g, '');
                        ea = ea.replace(/\./g, '');
                        setTransactionData(d => ({ ...d, amount: isNaN(Number(ea)) ? 0 : Number(ea) }))
                      }} />
                    <InputRightElement height={'100%'} p={0}>
                      <Stack gap={0}>
                        <IconButton aria-label={"increment-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-up-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setTransactionData(d => ({ ...d, amount: d.amount + 1000 })); }}></IconButton>
                        <IconButton mt={'0!important'} aria-label={"decrement-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-down-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setTransactionData(d => ({ ...d, amount: d.amount - 1000 })); }}></IconButton>
                      </Stack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired mt={4} >
                  <FormLabel fontSize={'sm'}>Transaction Date</FormLabel>
                  <Input type={'date'} size={'sm'} value={transactionData.transactionDate} name={'transactionDate'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Transaction Evidence</FormLabel>
                  <Input type={'text'} size={'sm'} value={transactionData.evidence} placeholder={'Enter transaction evidence'}  name={'evidence'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size={'sm'}>
                <Button onClick={onClose}>Close</Button>
                <Button type={'submit'} colorScheme={'blue'}>Submit</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </chakra.form>
      </Modal>
    </>
  )
}

export const TransactionMenuComponent = ({ data, handlerEdit, handlerConfirm, handlerDelete }:
  {
    data: TransactionState,
    handlerEdit: (editData: TransactionState) => Promise<void>,
    handlerConfirm: (confirmData: TransactionState) => Promise<void>,
    handlerDelete: (deleteData: TransactionState) => Promise<void>
  }) => {
  return (
    <>
      <Menu>
        <MenuButton as={IconButton} variant={'ghost'} size={'xs'} icon={<i className="ri-more-2-line"></i>} />
        <MenuList fontSize={'xs'}>
          <ViewImage data={data} />
          <ViewDetail data={data} />
          <MenuDivider />
          {data.status == "unconfirmed" &&
            <>
              <ConfirmData data={data} handlerConfirm={(confirmData: TransactionState) => handlerConfirm(confirmData)} />
              <EditData data={data} handlerEdit={(editData: TransactionState) => handlerEdit(editData)} />
            </>
          }
          <DeleteData data={data} handlerDelete={(deleteData: TransactionState) => handlerDelete(deleteData)} />
        </MenuList>
      </Menu>
    </>
  )
}