import React, { ReactElement, useEffect, useState } from "react"

import Head from 'next/head'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, Input, InputGroup, InputLeftAddon, InputRightElement, List, ListItem, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import DashboardLayout from "../../component/layout/DashboardLayout"
import { MemberState } from "../../utils/interface"
import { RoleData } from "../../data/RoleData"
import axios from "axios"

const AddMemberPage = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  const [tabIndex, setTabIndex] = useState(0)
  const [showPassword, setShowPassword] = useState({ pass: false, confpass: false })

  var DateNow = new Date();

  const initialMemberData: MemberState = {
    id: 0,
    name: '',
    email: '',
    class: 0,
    phone: '',
    bio: '',
    role: 2,
    _id: '',
    _lastUpdate: DateNow.toISOString(),
  }
  const [memberData, setMemberData] = useState<MemberState>(initialMemberData)
  const [confPass, setConfPass] = useState({ pass: '', confpass: '', same: false })
  const [submitted, setSubmitted] = useState({ loading: false, submitted: false })

  const handleInputChange = (event: any) => {
    DateNow = new Date;
    setMemberData(d => ({ ...d, [event.target.name]: event.target.value, lastUpdate: DateNow.toISOString() }))
  }

  const handleSubmitData = async () => {
    setSubmitted(s => ({ ...s, loading: true }));

    const query = `mutation Mutation {
      addMember(
        name: "${memberData.name}"
        email: "${memberData.email}"
        password: "${confPass.confpass}"
        classData: ${memberData.class}
        phone: "${memberData.phone}"
        bio: "${memberData.bio}"
        role: ${memberData.role}
        _lastUpdate: "${memberData._lastUpdate}"
      ) {
        success
        message
      }
    }`;

    await axios.post('/api/graphql', { query }).then(
      res => {
        if (res.data.data.addMember.success == true) {
          setSubmitted({ loading: false, submitted: true });
          setTabIndex(3);
          setMemberData(initialMemberData);
          setConfPass({ pass: '', confpass: '', same: false });
        }
      }
    )
  }

  useEffect(() => {
    if (confPass.pass == '' || confPass.confpass == '') {
      setConfPass(p => ({ ...p, same: false }))
    }
    else if (confPass.pass === confPass.confpass) {
      setConfPass(p => ({ ...p, same: true }))
    }
    else {
      setConfPass(p => ({ ...p, same: false }))
    }

    return () => { }
  }, [confPass.pass, confPass.confpass])

  return (
    <Flex mt={4} gap={2} justifyContent={'center'}>
      <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} variant={'unstyled'} w={{ base: '100%', lg: '60%' }} display={'flex'} flexDir={'column'} justifyContent={'center'}>
        <TabList justifyContent={'center'}>
          <Tab fontSize={'xs'} pos={'relative'} pt={6} w={'calc(100% / 3)'} fontWeight={tabIndex >= 0 ? 'semibold' : 'normal'}>
            User Account
            <Box zIndex={1} pos={'absolute'} top={0} w={'100%'} h={'100%'} color={tabIndex >= 0 ? 'blue.300' : 'gray.100'}>
              <chakra.span><i className="ri-checkbox-blank-circle-fill"></i></chakra.span>
            </Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 1 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} left={'50%'}></Box>
          </Tab>
          <Tab isDisabled={!confPass.same} _disabled={{ opacity: 1, cursor: 'not-allowed' }} fontSize={'xs'} pos={'relative'} pt={6} w={'calc(100% / 3)'} fontWeight={tabIndex >= 1 ? 'semibold' : 'normal'}>
            Profile Information
            <Box zIndex={1} pos={'absolute'} top={0} w={'100%'} h={'100%'} color={tabIndex >= 1 ? 'blue.300' : 'gray.100'}>
              <chakra.span><i className="ri-checkbox-blank-circle-fill"></i></chakra.span>
            </Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 2 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} left={'50%'}></Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 1 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} right={'50%'}></Box>
          </Tab>
          <Tab isDisabled={!confPass.same || memberData.class == 0} _disabled={{ opacity: 1, cursor: 'not-allowed' }} fontSize={'xs'} pos={'relative'} pt={6} w={'calc(100% / 3)'} fontWeight={tabIndex >= 2 ? 'semibold' : 'normal'}>
            Roles
            <Box zIndex={1} pos={'absolute'} top={0} w={'100%'} h={'100%'} color={tabIndex >= 2 ? 'blue.300' : 'gray.100'}>
              <chakra.span><i className="ri-checkbox-blank-circle-fill"></i></chakra.span>
            </Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 3 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} left={'50%'}></Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 2 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} right={'50%'}></Box>
          </Tab>
          <Tab isDisabled={!submitted} _disabled={{ opacity: 1, cursor: 'not-allowed' }} fontSize={'xs'} pos={'relative'} pt={6} w={'calc(100% / 3)'} fontWeight={tabIndex >= 2 ? 'semibold' : 'normal'}>
            Result
            <Box zIndex={1} pos={'absolute'} top={0} w={'100%'} h={'100%'} color={tabIndex >= 3 ? 'blue.300' : 'gray.100'}>
              <chakra.span><i className="ri-checkbox-blank-circle-fill"></i></chakra.span>
            </Box>
            <Box h={1} w={'50%'} bg={tabIndex >= 3 ? 'blue.300' : 'gray.100'} pos={'absolute'} top={2} right={'50%'}></Box>
          </Tab>
        </TabList>
        <TabPanels mt={8}>
          <TabPanel>
            <Box p={6} bg={bg} rounded={'lg'}>
              <Heading as={'h5'} size={'xs'}>Account Credentials</Heading>
              <Text fontSize={'xs'} mt={1}>Mandatory</Text>
              <form onSubmit={e => { e.preventDefault(); setTabIndex(i => i + 1) }}>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize={'xs'}>Full name</FormLabel>
                      <Input name={'name'} onChange={e => handleInputChange(e)} value={memberData.name} rounded={'md'} size={'sm'} type={'text'} placeholder={'Enter member full name'} />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize={'xs'}>Email address</FormLabel>
                      <Input name={'email'} onChange={e => handleInputChange(e)} value={memberData.email} rounded={'md'} size={'sm'} type={'email'} placeholder={'Enter member valid email address'} />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize={'xs'}>Password</FormLabel>
                      <InputGroup>
                        <Input name={'password'} onChange={e => setConfPass(p => ({ ...p, pass: e.target.value }))} value={confPass.pass} rounded={'md'} size={'sm'} type={showPassword.pass ? 'text' : 'password'} placeholder={'Enter member account password'} />
                        <InputRightElement h={'100%'} w={'fit-content'} px={1}>
                          <Button size={'xs'} fontSize={'0.5rem'} onClick={() => setShowPassword(s => ({ ...s, pass: !s.pass }))}>
                            <i className="ri-eye-line"></i>
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isInvalid={!confPass.same} isRequired>
                      <FormLabel fontSize={'xs'}>Repeat Password</FormLabel>
                      <InputGroup>
                        <Input name={'confpass'} onChange={e => setConfPass(p => ({ ...p, confpass: e.target.value }))} value={confPass.confpass} rounded={'md'} size={'sm'} type={showPassword.confpass ? 'text' : 'password'} placeholder={'Enter member password again'} />
                        <InputRightElement h={'100%'} w={'fit-content'} px={1}>
                          <Button size={'xs'} fontSize={'0.5rem'} onClick={() => setShowPassword(s => ({ ...s, confpass: !s.confpass }))}>
                            <i className="ri-eye-line"></i>
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage fontSize={'xs'}>Both password must same.</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>
                <Flex justifyContent={'flex-end'} mt={6}>
                  <Button colorScheme={'blue'} isDisabled={!confPass.same} type={'submit'} size={'sm'} variant={'solid'} rightIcon={<i className="ri-arrow-right-s-line"></i>}>Next</Button>
                </Flex>
              </form>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={6} bg={bg} rounded={'lg'}>
              <Heading as={'h5'} size={'xs'}>Profile Information</Heading>
              <Text fontSize={'xs'} mt={1}>Additional Information</Text>
              <form onSubmit={e => { e.preventDefault(); setTabIndex(i => i + 1) }}>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel fontSize={'xs'}>Class</FormLabel>
                      <Select name={'class'} onChange={e => handleInputChange(e)} placeholder={'Select class'} size={'sm'} rounded={'md'} value={memberData.class}>
                        {[2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022].map((items, index) => (
                          <option key={index} value={items}>{items}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontSize={'xs'}>Phone</FormLabel>
                      <InputGroup size={'sm'}>
                        <InputLeftAddon children={'+62'} />
                        <Input type={'tel'} value={memberData.phone.replace(/[^\w\s]62/g, '')} name={'phone'} onChange={e => setMemberData(d => ({ ...d, phone: '+62' + e.target.value }))} />
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel fontSize={'xs'}>Bio</FormLabel>
                      <Textarea name={'bio'} onChange={e => handleInputChange(e)} value={memberData.bio} rounded={'md'} size={'sm'} placeholder={'Enter bio'} />
                    </FormControl>
                  </GridItem>
                </Grid>
                <Flex justifyContent={'space-between'} mt={6}>
                  <Button onClick={() => setTabIndex(i => i - 1)} size={'sm'} variant={'solid'} leftIcon={<i className="ri-arrow-left-s-line"></i>}>Previous</Button>
                  <Button colorScheme={'blue'} type={'submit'} size={'sm'} variant={'solid'} rightIcon={<i className="ri-arrow-right-s-line"></i>}>Next</Button>
                </Flex>
              </form>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={6} bg={bg} rounded={'lg'}>
              <Heading as={'h5'} size={'xs'}>Member's Roles</Heading>
              <Text fontSize={'xs'} mt={1}>Member platform permission</Text>
              <form onSubmit={e => { e.preventDefault(); handleSubmitData(); }}>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontSize={'xs'}>Role</FormLabel>
                      <Select name={'role'} onChange={e => handleInputChange(e)} placeholder={'Select role'} size={'sm'} rounded={'md'} value={memberData.role}>
                        {RoleData.map((items, index) => (
                          <option key={index} value={items.id}>{items.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <Box mt={4}>
                      <Heading as={'h4'} size={'xs'}>Permission</Heading>
                      <List spacing={2} mt={2}>
                        {RoleData.filter(f => f.id == memberData.role).length > 0 && RoleData.filter(f => f.id == memberData.role).map((items, index) => (
                          <React.Fragment key={index}>
                            {items.permission.map((p, i) => (
                              <ListItem key={i} display={'flex'} gap={2} fontSize={'xs'}>
                                <Box color={'green.500'}><i className="ri-checkbox-circle-fill"></i></Box>
                                {p.name}
                              </ListItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </List>
                    </Box>
                  </GridItem>
                </Grid>
                <Flex justifyContent={'space-between'} mt={6}>
                  <Button onClick={() => setTabIndex(i => i - 1)} size={'sm'} variant={'solid'} leftIcon={<i className="ri-arrow-left-s-line"></i>}>Previous</Button>
                  <Button isLoading={submitted.loading} loadingText={'Submitting'} colorScheme={'blue'} isDisabled={!confPass.same} type={'submit'} size={'sm'} variant={'solid'} rightIcon={<i className="ri-arrow-right-s-line"></i>}>Submit Data</Button>
                </Flex>
              </form>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={6} bg={bg} rounded={'lg'}>
              <Alert bg={'transparent'} status={'success'} variant={'subtle'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} textAlign={'center'} py={6}>
                <AlertIcon boxSize={'40px'} mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                  Member data submitted!
                </AlertTitle>
                <AlertDescription maxWidth={'sm'} fontSize={'sm'} color={'gray.500'}>
                  Member data has been successfully submitted, please check on the member page.
                </AlertDescription>
              </Alert>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

AddMemberPage.getLayout = (page: ReactElement) => {
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

export default AddMemberPage