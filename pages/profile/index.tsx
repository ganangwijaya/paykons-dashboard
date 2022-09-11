import { ReactElement, useEffect, useState } from "react"

import { GetServerSideProps } from "next"
import Head from 'next/head'
import axios from "axios"
import { getSession, useSession } from "next-auth/react"

import { Avatar, Box, Button, ButtonGroup, chakra, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, Input, InputGroup, InputLeftAddon, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Tag, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import DashboardLayout from "../../component/layout/DashboardLayout"

import { MemberState, RoleState } from "../../utils/interface"

import { RoleData } from "../../data/RoleData"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }
  return {
    props: {
      session: session,
    },
  }
}

const EditProfileModal = (props: { data: MemberState, handlerEdit: (data: MemberState) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [updatedData, setUpdatedData] = useState<MemberState>(props.data);

  const handleInputChange = (event: any) => {
    setUpdatedData(s => ({ ...s, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <Button onClick={onOpen} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-edit-box-line"></i>} variant={'outline'}>Edit Profile</Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <chakra.form onSubmit={e => { e.preventDefault(); props.handlerEdit(updatedData); onClose(); }}>
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Name</FormLabel>
                  <Input rounded={'md'} type={'text'} size={'sm'} value={updatedData.name} name={'name'} onChange={e => handleInputChange(e)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Class</FormLabel>
                  <Select rounded={'md'} name={'class'} onChange={e => handleInputChange(e)} placeholder={'Select class'} size={'sm'} value={updatedData.class}>
                    {[2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022].map((items, index) => (
                      <option key={index} value={items}>{items}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Phone</FormLabel>
                  <InputGroup size={'sm'}>
                    <InputLeftAddon>+62</InputLeftAddon>
                    <Input rounded={'md'} type={'tel'} value={updatedData.phone.replace(/[^\w\s]62/g, '')} name={'phone'} onChange={e => setUpdatedData(d => ({ ...d, phone: '+62' + e.target.value }))} />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={'sm'}>Bio</FormLabel>
                  <Textarea rounded={'md'} size={'sm'} value={updatedData.bio} name={'bio'} onChange={e => handleInputChange(e)} />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size={'sm'}>
                <Button onClick={onClose}>Cancel</Button>
                <Button type={'submit'} colorScheme={'blue'}>Edit Profile</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </chakra.form>
      </Modal>
    </>
  )
}

const ChangePasswordModal = (props: { handlerEdit: (oldpassword: string, newpassword: string) => Promise<void> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [passwordData, setPasswordData] = useState({ oldpassword: '', newpassword: '', confpassword: '', invalid: false })

  const handleInputChange = (event: any) => {
    setPasswordData(s => ({ ...s, [event.target.name]: event.target.value }))
  }

  useEffect(() => {
    if (passwordData.newpassword !== passwordData.confpassword) {
      setPasswordData(d => ({ ...d, invalid: true }))
    } else {
      setPasswordData(d => ({ ...d, invalid: false }))
    }

    return () => { }
  }, [passwordData.newpassword, passwordData.confpassword])

  const handleSubmit = () => {
    if (passwordData.invalid == false && passwordData.oldpassword != "" && passwordData.newpassword != "") {
      props.handlerEdit(passwordData.oldpassword, passwordData.newpassword);
      onClose();
    }
  }
  return (
    <>
      <Button onClick={onOpen} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-lock-2-line"></i>} variant={'outline'}>Change Password</Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'} isCentered>
        <ModalOverlay />
        <chakra.form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel fontSize={'sm'}>Old Password</FormLabel>
                  <Input rounded={'md'} type={'password'} size={'sm'} name={'oldpassword'} onChange={e => handleInputChange(e)} placeholder={'Enter you old password'} />
                </FormControl>
                <FormControl isInvalid={passwordData.invalid} isRequired>
                  <FormLabel fontSize={'sm'}>New Password</FormLabel>
                  <Input rounded={'md'} type={'password'} size={'sm'} name={'newpassword'} onChange={e => handleInputChange(e)} placeholder={'Enter you new password'} />
                </FormControl>
                <FormControl isInvalid={passwordData.invalid} isRequired>
                  <FormLabel fontSize={'sm'}>Confirm Password</FormLabel>
                  <Input rounded={'md'} type={'password'} size={'sm'} name={'confpassword'} onChange={e => handleInputChange(e)} placeholder={'Reenter you new password'} />
                  <FormErrorMessage>Both password must match.</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup size={'sm'}>
                <Button onClick={onClose}>Cancel</Button>
                <Button type={'submit'} colorScheme={'blue'}>Change Password</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </chakra.form>
      </Modal>
    </>
  )
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const id = session?.id;

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const toast = useToast()

  const initialMemberData: MemberState = {
    id: 0,
    name: '',
    email: '',
    class: 0,
    phone: '',
    bio: '',
    role: 0,
    _id: '',
    _lastUpdate: '',
    _createdAt: ''
  }
  const [member, setMember] = useState<MemberState>(initialMemberData)
  const [role, setRole] = useState<RoleState>()
  const [reRender, setReRender] = useState(false)

  useEffect(() => {
    var mounted: boolean = true;
    const query = `query {
      getMember(_id: "${id}", email: "") {
        _id
        name
        email
        class
        phone
        bio
        role
        _lastUpdate
      }
    }`

    const getMember = async () => {
      await axios.post(`/api/graphql`, { query }).then(res => {
        const member = res.data.data.getMember;
        if (mounted) {
          setMember(member);
        }
      })
    }

    if (id !== undefined && id !== null) {
      getMember();
    }

    return () => { }
  }, [id, reRender])

  useEffect(() => {
    if (member.id != 0) {
      setRole({ ...RoleData.filter(f => f.id == member.role)[0] })
    }

    return () => { }
  }, [member])

  const editMember = async (updatedData: MemberState) => {
    const query = `mutation Mutation {
      editMember(
        name: "${updatedData.name}"
        email: "${updatedData.email}"
        classData: ${updatedData.class}
        phone: "${updatedData.phone}"
        bio: "${updatedData.bio}"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query }).then(
      res => {
        if (res.data.data.editMember.success == true) {
          toast({
            title: 'Profile Updated',
            description: `${res.data.data.editMember.message}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          setReRender(r => !r);
        } else {
          toast({
            title: 'Error',
            description: `${res.data.data.editMember.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    )

  }

  const changePassword = async (oldpassword: string, newpassword: string) => {
    const query = `mutation Mutation {
      changePassword(
        email: "${member.email}"
        oldPassword: "${oldpassword}"
        newPassword: "${newpassword}"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query }).then(
      res => {
        if (res.data.data.changePassword.success == true) {
          toast({
            title: 'Password Changed',
            description: `${res.data.data.changePassword.message}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          setReRender(r => !r);
        } else {
          toast({
            title: 'Error',
            description: `${res.data.data.changePassword.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    )
  }

  return (
    <Stack mt={4} gap={2}>
      {member._id !== "" &&
        <>
          <Grid templateColumns={'repeat(4, 1fr)'} gridAutoRows={'1fr'} gap={4}>
            <GridItem colSpan={4} minW={0}>
              <Flex p={4} bg={bg} rounded={'xl'} gap={6} alignItems={{ base: 'flex-start', md: 'center' }} justifyContent={{ base: 'flex-end', md: 'space-between' }} flexDir={{ base: 'column', md: 'row' }}>
                <Flex gap={4} alignItems={'center'}>
                  <Flex minW={10} w={16} h={16} bg={'iconBG'} color={iconColor} justifyContent={'center'} alignItems={'center'} fontSize={'xl'}>
                    <Avatar rounded={'xl'} borderRadius={'xl'} size={'full'} src={'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&&h=200&w=200'} />
                  </Flex>
                  <Box>
                    <Heading as={'h4'} size={'md'}>{member.name}</Heading>
                    <Text fontSize={'xs'}>{member.class}</Text>
                  </Box>
                </Flex>
                <Flex gap={2} alignItems={'center'} justifyContent={'flex-end'} w={{ base: '100%', md: 'auto' }}>
                  <EditProfileModal data={member} handlerEdit={(data: MemberState) => editMember(data)} />
                  <ChangePasswordModal handlerEdit={(oldpassword: string, newpassword: string) => changePassword(oldpassword, newpassword)} />
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
          <Grid templateColumns={'repeat(3, 1fr)'} gap={4}>
            <GridItem colSpan={{ base: 3, md: 1 }} bg={bg} p={4} rounded={'xl'} >
              <Heading as={'h4'} size={'xs'}>Overview Information</Heading>
              <Divider mt={4} />
              <Text fontSize={'xs'} mt={2}>{member.bio}</Text>
              <Divider mt={4} />
              <Stack mt={4}>
                <Text fontSize={'xs'}><chakra.strong mr={1}>Full name: </chakra.strong>{member.name}</Text>
                <Text fontSize={'xs'}><chakra.strong mr={1}>Class: </chakra.strong>{member.class}</Text>
                <Text fontSize={'xs'}><chakra.strong mr={1}>Email: </chakra.strong>{member.email}</Text>
                <Text fontSize={'xs'}><chakra.strong mr={1}>Phone: </chakra.strong>{member.phone}</Text>
              </Stack>
            </GridItem>
            <GridItem colSpan={{ base: 3, md: 1 }} bg={bg} p={4} rounded={'xl'} >
              <Heading as={'h4'} size={'xs'}>Platform Settings</Heading>
              <Divider mt={4} />
              {role !== undefined &&
                <Stack mt={4} gap={2}>
                  <Flex alignItems={'center'}>
                    <Tag size={'sm'}>{role.name}</Tag>
                  </Flex>
                  <Divider mt={4} />
                  <Heading as={'h4'} size={'xs'}>Permission</Heading>
                  <List spacing={2} mt={6}>
                    {role.permission.length > 0 && role.permission.map((items, index) => (
                      <ListItem key={index} display={'flex'} gap={2} fontSize={'xs'}>
                        <Box color={'green.500'}><i className="ri-checkbox-circle-fill"></i></Box>
                        {items.name}
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              }
            </GridItem>
          </Grid>
        </>
      }
    </Stack>
  )
}

ProfilePage.getLayout = (page: ReactElement) => {
  return (
    <>
      <Head>
        <title>KonsPay</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </>
  )
}

export default ProfilePage