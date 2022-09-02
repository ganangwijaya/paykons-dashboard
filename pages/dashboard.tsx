import { ReactElement, useEffect, useState } from "react"

import Head from 'next/head'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import { Box, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import DashboardLayout from "../component/layout/DashboardLayout"
import { BalancesData } from "../data/BalancesData"
import { BalancesCharts, MemberChartData } from "../data/ChartData"


const ChartCashFlow = dynamic(
  () => import('../component/Chart'),
  { ssr: false }
)

const ChartMember = dynamic(
  () => import('../component/Chart'),
  { ssr: false }
)

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

const DashboardPage = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconBG = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const increaseColor = useColorModeValue('green.500', 'green.400');
  const decreaseColor = useColorModeValue('red.500', 'red.400');

  const [BalancesArray] = BalancesData();
  const [CashFlowChartData, BalancesChartData] = BalancesCharts(BalancesArray)

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Balances</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>Rp1.400.000</Heading>
                <Flex fontSize={'sm'} color={decreaseColor} alignItems={'center'}>
                  <i className="ri-arrow-down-s-fill"></i>
                  <Text fontWeight={'bold'}>10%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-hand-coin-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Income this month</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>Rp2.400.000</Heading>
                <Flex fontSize={'sm'} color={increaseColor} alignItems={'center'}>
                  <i className="ri-arrow-up-s-fill"></i>
                  <Text fontWeight={'bold'}>15%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-bank-card-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Spend this month</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>Rp1.000.000</Heading>
                <Flex fontSize={'sm'} color={decreaseColor} alignItems={'center'}>
                  <i className="ri-arrow-down-s-fill"></i>
                  <Text fontWeight={'bold'}>10%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-team-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total member</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>27</Heading>
                <Flex fontSize={'sm'} color={increaseColor} alignItems={'center'}>
                  <i className="ri-arrow-up-s-fill"></i>
                  <Text fontWeight={'bold'}>10%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(3, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 3, md: 3, lg: 2 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Cash Flow</Heading>
              <Text fontSize={'xs'}>Monthly cashflow overview.</Text>
            </Box>
            <Menu>
              <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-line"></i>} />
              <MenuList fontSize={'xs'}>
                <MenuItem icon={<i className="ri-fullscreen-line"></i>}>Detail Cash Flow</MenuItem>
                <MenuItem icon={<i className="ri-calendar-event-line"></i>}>Change Year</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box mt={2} overflow={'hidden'}>
            {BalancesArray.length > 0 &&
              <ChartCashFlow chartOption={CashFlowChartData} width={'100%'} height={'330px'} />
            }
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 3, lg: 1 }} bg={bg} p={6} rounded={'xl'}>
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Member Payouts</Heading>
              <Text fontSize={'xs'}>Member payout this month overview.</Text>
            </Box>
            <Menu>
              <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-line"></i>} />
              <MenuList fontSize={'xs'}>
                <MenuItem icon={<i className="ri-fullscreen-line"></i>}>Detail Members</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box mt={10}>
            <ChartMember chartOption={MemberChartData} width={'100%'} height={'320px'} />
          </Box>
        </GridItem>
      </Grid>
      {/* <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={12} h={12} bg={'gray.800'} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'2xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Balances</Text>
              <Heading as={'h4'} size={'md'}>Rp1.400.000</Heading>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={12} h={12} bg={'gray.800'} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'2xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Income this month</Text>
              <Heading as={'h4'} size={'md'}>Rp2.400.000</Heading>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={12} h={12} bg={'gray.800'} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'2xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Spend this mont</Text>
              <Heading as={'h4'} size={'md'}>Rp1.000.000</Heading>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex w={12} h={12} bg={'gray.800'} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'2xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Profit last month</Text>
              <Heading as={'h4'} size={'md'}>+ Rp400.000</Heading>
            </Box>
          </Flex>
        </GridItem>
      </Grid> */}
    </Stack>
  )
}

DashboardPage.getLayout = (page: ReactElement) => {
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

export default DashboardPage