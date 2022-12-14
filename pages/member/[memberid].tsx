import { ReactElement, useEffect, useState } from "react"

import Head from 'next/head'
import axios from "axios"
import { GetServerSideProps } from "next"
import { Avatar, Box, Button, chakra, Divider, Flex, Grid, GridItem, Heading, List, ListItem, Stack, Tag, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import DashboardLayout from "../../component/layout/DashboardLayout"

import { MemberState, RoleState } from "../../utils/interface"

import { useRouter } from "next/router"
import { RoleData } from "../../data/RoleData"
import { getSession } from "next-auth/react"

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
const MemberDetailPage = () => {
  const router = useRouter()
  const { memberid } = router.query

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconColor = useColorModeValue('gray.100', 'gray.100');

  const initialMemberData = {
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
  }
  const [member, setMember] = useState<MemberState>(initialMemberData)
  const [role, setRole] = useState<RoleState>()

  useEffect(() => {
    var mounted: boolean = true;
    const query = `query {
      getMember(_id: "${memberid}", email: "") {
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

    if (memberid !== undefined) {
      getMember();
    }

    return () => { }
  }, [memberid])  

  useEffect(() => {
    if (member.id != 0) {
      setRole({ ...RoleData.filter(f => f.id == member.role)[0] })
    }

    return () => { }
  }, [member])

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
                  <Button size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-profile-line"></i>} variant={'outline'}>Overview</Button>
                  <Button size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-message-2-line"></i>} variant={'outline'}>Send Message</Button>
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

MemberDetailPage.getLayout = (page: ReactElement) => {
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

export default MemberDetailPage