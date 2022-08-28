import Head from "next/head"
import Router from "next/router";
import Link from "next/link";
import { signIn } from 'next-auth/react'

import { useState } from "react";

import { Alert, AlertIcon, AlertTitle, Box, Button, chakra, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react"

const LoginPage = () => {

  const bg = useColorModeValue('white', 'gray.900');
  const cardBG = useColorModeValue('gray.50', 'gray.800');

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false })
  const [loginStatus, setLoginStatus] = useState({ success: false, message: '', show: false });

  const handleLogin = async () => {

    const res = await signIn('credentials',
      {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
        remember: loginData.remember,
        callbackUrl: `${window.location.origin}/dashboard`
      }
    )

    if (res?.error) {
      setLoginStatus(s => ({ show: true, success: res.ok, message: String(res.error) }))
      console.log('error', res)
    }
    else {
      setLoginStatus(s => ({ show: true, success: true, message: 'Login success, redirecting...' }))
      setTimeout(() => {
        Router.push('/dashboard');
      }, 1000);
    }
  }

  return (
    <div>
      <Head>
        <title>KonsPay</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex h={'100vh'} w={'100vw'} bg={bg}>
        <Flex w={{ base: '100%', md: '50%' }} alignItems={'center'}>
          <Container maxW={'md'}>
            <Heading fontSize={'3xl'} textAlign={'center'}>
              Sign In
            </Heading>
            <Text fontSize={'md'} color={'gray.600'} textAlign={'center'}>
              to enjoy all of our cool features ✌️
            </Text>
            <Flex p={6} bg={cardBG} mt={6} rounded={'xl'}>
              <chakra.form w={'full'} onSubmit={e => { e.preventDefault(); handleLogin() }}>
                <Stack gap={2}>
                  <FormControl isInvalid={loginStatus.show && loginStatus.message == 'User not found.'}>
                    <FormLabel fontSize={'sm'}>Email address</FormLabel>
                    <Input value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} size={'md'} type={'email'} rounded={'md'} />
                    <FormErrorMessage>Wrong email address.</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={loginStatus.show && loginStatus.message == 'Incorrect password.'}>
                    <FormLabel fontSize={'sm'}>Password</FormLabel>
                    <InputGroup>
                      <Input value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} size={'md'} type={showPassword ? 'text' : 'password'} rounded={'md'} />
                      <InputRightElement h={'100%'} w={'fit-content'} px={1}>
                        <Button size={'xs'} fontSize={'0.5rem'} onClick={() => setShowPassword(s => !s)}>
                          <i className="ri-eye-line"></i>
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>Incorrect Password.</FormErrorMessage>
                  </FormControl>
                  <Flex justifyContent={'space-between'}>
                    <FormControl display={'flex'} alignItems={'center'}>
                      <Switch onChange={() => setLoginData(d => ({ ...d, remember: !d.remember }))} id={'remember-signin'} mr={3} size={'sm'} />
                      <FormLabel fontSize={'sm'} mb={'0'}>Remember me</FormLabel>
                    </FormControl>
                    <Box>
                      <Link href={'/auth/forgot'} passHref><Button size={'sm'} variant={'link'}>Forgot password?</Button></Link>
                    </Box>
                  </Flex>
                  {loginStatus.show &&
                    <Alert status={loginStatus.success ? 'success' : 'error'} rounded={'md'}>
                      <AlertIcon />
                      <AlertTitle fontSize={'sm'}>{loginStatus.message}</AlertTitle>
                    </Alert>
                  }
                  <Button type={'submit'} variant={'solid'} colorScheme={'blue'}>Sign In</Button>
                </Stack>
              </chakra.form>
            </Flex>
          </Container>
        </Flex>
        <Box display={{ base: 'none', md: 'block' }} w={'50%'}
          bgImage={`url('https://images.unsplash.com/photo-1510146758428-e5e4b17b8b6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=820&q=80')`}
          bgSize={'cover'}
          bgPos={'right'}
          bgRepeat={'no-repeat'}
          h={'95vh'}
          borderBottomLeftRadius={'3xl'}
        >
          <Box w={'full'} h={'full'} bg={'gray.800'} opacity={0.5}></Box>
        </Box>
      </Flex >
    </div >

  )
}

export default LoginPage