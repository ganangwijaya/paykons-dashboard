import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Button, ButtonGroup, chakra, Divider, FormControl, FormLabel, Grid, GridItem, IconButton, Image, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { MemberState, PayoutState } from "../../utils/interface";

const ConfirmData = ({ data, handlerConfirm }: { data: PayoutState, handlerConfirm: (confirmData: PayoutState) => Promise<void> }) => {
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
              Are you sure want to confirm payout data from <chakra.strong>{data.member.name}</chakra.strong> at <chakra.strong> {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(data.payoutDate))}</chakra.strong>?
              You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    () => { handlerConfirm(data) }
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

const DeleteData = ({ data, handlerDelete }: { data: PayoutState, handlerDelete: (deleteData: PayoutState) => Promise<void> }) => {
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
              Are you sure want to delete payout data from <chakra.strong>{data.member.name}</chakra.strong> at <chakra.strong> {Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(data.payoutDate))}</chakra.strong>?
              You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup size={'sm'}>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    () => { handlerDelete(data) }
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

const EditData = ({ data, handlerEdit }: { data: PayoutState, handlerEdit: (editData: PayoutState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updatedData, setUpdatedData] = useState<PayoutState>(data);

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
            <ModalHeader>Edit Payout Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
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
                <FormControl isRequired mt={4} >
                  <FormLabel fontSize={'sm'}>Payout Date</FormLabel>
                  <Input type={'date'} size={'sm'} value={data.payoutDate} name={'payoutDate'} onChange={e => handleInputChange(e)} rounded={'md'} />
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

export const AddDataPayoutModal = ({ handlerSubmit }: { handlerSubmit: (editData: PayoutState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialPayoutData: PayoutState = {
    _id: '',
    pic: '',
    payoutDate: '',
    amount: 0,
    status: 'unconfirmed',
    confirmedBy: undefined,
    evidence: '',
    member: {
      id: 0,
      name: '',
      email: '',
      class: 0,
      phone: '',
      bio: '',
      role: 0,
      _id: '',
      _lastUpdate: '',
      _createdAt: '',
    },
    _lastUpdate: '',
    _createdAt: '',
  }

  const [payoutData, setPayoutData] = useState<PayoutState>(initialPayoutData);
  const [memberList, setMemberList] = useState<MemberState[]>([])

  const handleSubmit = () => {
    handlerSubmit(payoutData);
    setPayoutData(initialPayoutData);
    onClose();
  }

  const handleInputChange = (event: any) => {
    setPayoutData(d => ({ ...d, [event.target.name]: event.target.value }))
  }

  useEffect(() => {
    var mounted: boolean = true;

    const query = `query { 
      member { 
        name, 
        email,
      }
    }`

    const getMember = async () => {
      await axios.post('/api/graphql', { query }).then(res => {
        const member = res.data.data.member;
        if (mounted) {
          setMemberList([...member]);
        }
      })
    }

    if (isOpen) {
      getMember()
    }

    getMember();
    return () => { mounted = false; }
  }, [isOpen])

  return (
    <>
      <Button onClick={onOpen} w={{ base: '100%', md: 'auto' }} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-add-line"></i>} variant={'outline'}>Add Payout</Button>
      <Modal size={'xl'} onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <chakra.form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ModalContent>
            <ModalHeader>Add Payout</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Payout By</FormLabel>
                  <InputGroup>
                    <chakra.datalist id={'payout-datalist'}>
                      {memberList.map((items, index) => (
                        <option key={index} value={items.email}>{items.name}</option>
                      ))}
                    </chakra.datalist>
                    <Input list={'payout-datalist'} type={'text'} size={'sm'} value={payoutData.pic} placeholder={'Enter payout by'} name={'pic'} onChange={e => handleInputChange(e)} rounded={'md'} />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Amount</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftAddon rounded={'md'}>Rp</InputLeftAddon>
                    <Input type={'text'} name={'amount'} rounded={'md'}
                      value={payoutData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      onChange={(e) => {
                        var ea = e.target.value.replace(/[^0-9\.-]+/g, '');
                        ea = ea.replace(/\./g, '');
                        setPayoutData(d => ({ ...d, amount: isNaN(Number(ea)) ? 0 : Number(ea) }))
                      }} />
                    <InputRightElement height={'100%'} p={0}>
                      <Stack gap={0}>
                        <IconButton aria-label={"increment-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-up-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setPayoutData(d => ({ ...d, amount: d.amount + 1000 })); }}></IconButton>
                        <IconButton mt={'0!important'} aria-label={"decrement-stepper"} h={3} fontSize={10} icon={<i className="ri-arrow-down-s-fill"></i>} size={'xs'} variant={'unstyled'} onClick={(e) => { e.preventDefault(); setPayoutData(d => ({ ...d, amount: d.amount - 1000 })); }}></IconButton>
                      </Stack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isRequired mt={4} >
                  <FormLabel fontSize={'sm'}>Payout Date</FormLabel>
                  <Input type={'date'} size={'sm'} value={payoutData.payoutDate} name={'payoutDate'} onChange={e => handleInputChange(e)} rounded={'md'} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Transaction Evidence</FormLabel>
                  <Input type={'text'} size={'sm'} value={payoutData.evidence} placeholder={'Enter transaction evidence'} name={'evidence'} onChange={e => handleInputChange(e)} rounded={'md'} />
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

const ViewImage = ({ data }: { data: PayoutState }) => {
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

const ViewDetail = ({ data }: { data: PayoutState }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [confirmedBy, setConfirmedBy] = useState<MemberState>()

  useEffect(() => {
    var mounted: boolean = true;

    const queryConfirmedby = `query Query {
      getMember(email: "${data.confirmedBy}", _id: "") {
        name
      }
    }`

    const getConfirmedby = async () => {
      await axios.post('/api/graphql', { query: queryConfirmedby }).then(res => {
        const member = res.data.data.getMember;
        if (mounted) {
          setConfirmedBy(member);
        }
      })
    }

    if (isOpen) {
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
          <ModalHeader>Payout Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack gap={1} fontSize={'sm'} divider={<Divider />}>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Name</GridItem>
                <GridItem colSpan={3}>: {data.member.name}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Amount</GridItem>
                <GridItem colSpan={3}>: {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(data.amount)}</GridItem>
              </Grid>
              <Grid templateColumns={{ base: 'repeat(4, 1fr)' }}>
                <GridItem>Date</GridItem>
                <GridItem colSpan={3}>: {Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(data.payoutDate))}</GridItem>
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

export const PayoutMenuComponent = ({ data, handlerEdit, handlerConfirm, handlerDelete }:
  {
    data: PayoutState,
    handlerEdit: (editData: PayoutState) => Promise<void>,
    handlerConfirm: (confirmData: PayoutState) => Promise<void>,
    handlerDelete: (deleteData: PayoutState) => Promise<void>
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
              <ConfirmData data={data} handlerConfirm={(confirmData: PayoutState) => handlerConfirm(confirmData)} />
              <EditData data={data} handlerEdit={(editData: PayoutState) => handlerEdit(editData)} />
            </>
          }
          <DeleteData data={data} handlerDelete={(deleteData: PayoutState) => handlerDelete(deleteData)} />
        </MenuList>
      </Menu>
    </>
  )
}