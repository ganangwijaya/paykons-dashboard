import { ReactElement, useEffect, useState } from "react"

import Head from 'next/head'
import dynamic from 'next/dynamic'
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import { Box, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import DashboardLayout from "../component/layout/DashboardLayout"
import { BalancesData } from "../data/BalancesData"
import { PayoutMemberData } from "../data/PayoutData"
import { BalancesCharts, PayoutCharts } from "../data/ChartData"
import { CondensedCard } from "../component/Card"

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

  const [BalancesArray] = BalancesData();
  const payoutMemberData = PayoutMemberData();

  const [CashFlowChartData] = BalancesCharts(BalancesArray)
  const [MemberPayoutChartData] = PayoutCharts(payoutMemberData)

  var totalBalances = 0;
  var totalIncome = 0;
  var totalOutcome = 0;

  BalancesArray.map(i => {
    totalBalances = totalBalances + i.balance;
  })

  BalancesArray.filter(f => f.month == new Date().getFullYear() + '-' + Intl.DateTimeFormat('id-ID', { month: '2-digit' }).format(new Date())).map(i => {
    totalIncome = totalIncome + i.income;
    totalOutcome = totalOutcome + i.outcome;
  })

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem>
          <CondensedCard name={'Balances'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalBalances)} icon={'ri-wallet-3-fill'} />
        </GridItem>
        <GridItem>
          <CondensedCard name={'Income this month'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalIncome)} icon={'ri-hand-coin-fill'} />
        </GridItem>
        <GridItem>
          <CondensedCard name={'Spend this month'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalOutcome)} icon={'ri-bank-card-fill'} />
        </GridItem>
        <GridItem>
          <CondensedCard name={'Total member'} data={payoutMemberData !== undefined ? payoutMemberData.notPaid.length + payoutMemberData.paid.length : 0} icon={'ri-team-fill'} />
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
            {MemberPayoutChartData !== undefined &&
              <ChartMember chartOption={MemberPayoutChartData} width={'100%'} height={'320px'} />
            }
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