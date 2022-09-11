import { ReactElement, useEffect, useMemo, useState } from "react"

import Head from 'next/head'
import Link from "next/link"
import { GetServerSideProps } from "next"
import axios from "axios"
import { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"

import { Avatar, Badge, Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Select, Stack, TableContainer, Tag, TagCloseButton, TagLabel, Text, useToast } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel } from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { DebouncedInput, Filter } from "../../component/table/FormFilter"

import { MemberState, PayoutState } from "../../utils/interface"
import { PayoutMenuComponent } from "../../component/table/PayoutDataMenu"

import { ConfirmPayout, DeletePayout, EditPayout } from "../../utils/handler"
import { CondensedCard } from "../../component/Card"

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

const MemberPayoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const { memberid } = router.query

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconBG = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const increaseColor = useColorModeValue('green.500', 'green.400');
  const decreaseColor = useColorModeValue('red.500', 'red.400');
  const toast = useToast()

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

  const [payout, setPayout] = useState<PayoutState[]>([])
  const [member, setMember] = useState<MemberState>(initialMemberData)
  const [totalPayouts, setTotalPayouts] = useState({ all: 0, thisMonth: 0 })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredDate, setFilteredDate] = useState<string | 'day' | 'month' | 'year'>('month');
  const columnHelper = createColumnHelper<PayoutState>();
  const [reRender, setReRender] = useState(false)

  const data: PayoutState[] = useMemo(
    () => [...payout], [payout],
  )

  const columns = [
    columnHelper.accessor('payoutDate', {
      header: 'Date',
      cell: i => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(i.getValue()))
    }),
    columnHelper.accessor('amount', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'equalsString',
      cell: i => (
        <Badge colorScheme={i.getValue() == 'confirmed' ? 'green' : 'red'} fontSize={10}>{i.getValue()}</Badge>
      )
    }),
    columnHelper.display({
      header: '',
      id: 'action',
      enableSorting: false,
      cell: i => (
        <PayoutMenuComponent
          data={i.row.original}
          handlerEdit={(editData: PayoutState) => editPayout(editData)}
          handlerConfirm={(confirmData: PayoutState) => confirmPayout(confirmData)}
          handlerDelete={(deleteData: PayoutState) => deletePayout(deleteData)} />
      ),
    }),
  ]

  const table = useReactTable({
    data, columns, state: { sorting, columnFilters },
    onColumnFiltersChange: setColumnFilters, getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting, getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
  })

  const editPayout = async (data: PayoutState) => {
    await EditPayout(data).then(
      res => {
        if (res.success == true) {
          toast({
            title: 'Payout Data Updated',
            description: `${res.message}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          setReRender(r => !r);
        } else {
          toast({
            title: 'Error',
            description: `${res.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    )
  }

  const confirmPayout = async (data: PayoutState) => {
    const newdata = { ...data, pic: String(session?.user?.email), amount: 0 };

    await ConfirmPayout(newdata).then(
      res => {
        if (res.success == true) {
          toast({
            title: 'Payout Status Updated',
            description: `${res.message}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          setReRender(r => !r);
        } else {
          toast({
            title: 'Error',
            description: `${res.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    )
  }

  const deletePayout = async (data: PayoutState) => {
    await DeletePayout(data).then(
      res => {
        if (res.success == true) {
          toast({
            title: 'Payout Data Deleted',
            description: `${res.message}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          setReRender(r => !r);
        } else {
          toast({
            title: 'Error',
            description: `${res.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    )
  }

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

    return () => { mounted = false; }
  }, [memberid])

  useEffect(() => {
    var mounted: boolean = true;
    const query = `query Query {
      getTotalPayouts(pic: "ganang@paykons.com", payoutDate: "")
    }`

    const queryThisMonth = `query Query {
      getTotalPayouts(pic: "ganang@paykons.com", payoutDate: "${new Date().getFullYear() + '-' + Intl.DateTimeFormat('id-ID', { month: '2-digit' }).format(new Date())}")
    }`

    const getTotalPayouts = async () => {
      await axios.post(`/api/graphql`, { query }).then(res => {
        const totalPayout = res.data.data.getTotalPayouts;
        if (mounted) {
          setTotalPayouts(t => ({ ...t, all: totalPayout }))
        }
      })

      await axios.post(`/api/graphql`, { query: queryThisMonth }).then(res => {
        const totalPayout = res.data.data.getTotalPayouts;
        if (mounted) {
          setTotalPayouts(t => ({ ...t, thisMonth: totalPayout }))
        }
      })
    }

    if (member.email !== "") {
      getTotalPayouts();
    }

    return () => { mounted = false; }
  }, [member.email])

  useEffect(() => {
    var mounted: boolean = true;

    const query = `query Payouts {
      getPayouts(pic: "${member.email}") {
        _id
        pic
        payoutDate
        amount
        status
        evidence
        confirmedBy
        _lastUpdate
        _createdAt
        member {
          _id
          name
          email
          class
        }
      }
    }`

    const getPayout = async () => {
      await axios.post('/api/graphql', { query }).then(res => {
        const payouts = res.data.data.getPayouts;
        if (mounted) {
          setPayout([...payouts]);
        }
      })
    }

    if (member.email !== "" || member.email !== null) {
      getPayout();
    }

    return () => { mounted = false; }
  }, [reRender, member])

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }} gridAutoRows={{ base: 'auto', md: '1fr' }} gap={4} >
        <GridItem colSpan={{ base: 1, sm: 5, lg: 3 }} minW={0}>
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
              <Link href={`/member/${memberid}`} passHref>
                <Button size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-profile-line"></i>} variant={'outline'}>View Profile</Button>
              </Link>
              <Button size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-message-2-line"></i>} variant={'outline'}>Send Message</Button>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 1, sm: 5, lg: 2 }} minW={0}>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={{ base: 'flexcen', md: 'center' }} justifyContent={{ base: 'center', md: 'space-between' }} flexDir={{ base: 'column', md: 'row' }} h={'100%'}>
            <Flex gap={4}>
              <Flex minW={10} w={10} h={10} bg={totalPayouts.thisMonth > 0 ? increaseColor : decreaseColor} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-hand-coin-fill"></i></Flex>
              <Box>
                <Text fontSize={'xs'}>Payout This {Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())}</Text>
                <Flex gap={1} alignItems={'flex-end'}>
                  <Heading as={'h4'} size={'md'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(totalPayouts.thisMonth)}</Heading>
                  <Flex fontSize={10} color={increaseColor} alignItems={'center'}>
                    <i className="ri-arrow-up-s-fill"></i>
                    <Text fontWeight={'bold'}>10%</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Payout'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(totalPayouts.all)} icon={'ri-wallet-3-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-file-list-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Data</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{payout.length}</Heading>
                <Flex fontSize={10} color={increaseColor} alignItems={'center'}>
                  <i className="ri-arrow-up-s-fill"></i>
                  <Text fontWeight={'bold'}>10%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex cursor={'pointer'} onClick={() => setColumnFilters([{ id: 'status', value: 'confirmed' }])} p={4} bg={bg} boxShadow={columnFilters.length > 0 ? columnFilters[0].value == 'confirmed' ? 'darkGreen' : 'green' : 'green'} _hover={{ boxShadow: 'darkGreen' }} transition={'all 0.3s ease-in-out'} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={'green.500'} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-checkbox-circle-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Confirmed</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{payout.filter(f => f.status == "confirmed").length}</Heading>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex cursor={'pointer'} onClick={() => setColumnFilters([{ id: 'status', value: 'unconfirmed' }])} p={4} bg={bg} boxShadow={columnFilters.length > 0 ? columnFilters[0].value == 'unconfirmed' ? 'darkRed' : 'red' : 'red'} _hover={{ boxShadow: 'darkRed' }} transition={'all 0.3s ease-in-out'} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={'red.500'} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-spam-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Unconfirmed</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{payout.filter(f => f.status == "unconfirmed").length}</Heading>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 4 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Member Payout Data</Heading>
              <Text mt={2} fontSize={'xs'}>Payout data.</Text>
              <Flex gap={2} mt={4}>
              </Flex>
            </Box>
            <Box>
              <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-fill"></i>} />
                <MenuList fontSize={'xs'}>
                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={filteredDate} onChange={(value: string | string[]) => setFilteredDate(String(value))} title='Filter By' type={'radio'}>
                    <MenuItemOption value='day'>Day</MenuItemOption>
                    <MenuItemOption value='month'>Month</MenuItemOption>
                    <MenuItemOption value='year'>Year</MenuItemOption>
                    <Box p={2} ml={2}>
                      <Filter type={filteredDate == 'day' ? 'date' : filteredDate == 'month' ? 'month' : 'select'} column={table.getColumn('payoutDate')} table={table} />
                    </Box>
                    {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <Box mt={6} overflow={'hidden'} pb={2}>
            <TableContainer>
              <Table colorScheme={'gray'}>
                <Thead>
                  {table.getHeaderGroups().map(hg => (
                    <Tr key={hg.id}>
                      {hg.headers.map(h => (
                        <Th role={'group'} key={h.id}>
                          {h.isPlaceholder ? null : (
                            <Flex justifyContent={'space-between'}
                            >
                              <Flex gap={2}>
                                {flexRender(
                                  h.column.columnDef.header,
                                  h.getContext()
                                )}
                                <chakra.span
                                  color={h.column.getIsSorted() ? 'blue.300' : 'gray.400'}
                                  {...{ onClick: h.column.getToggleSortingHandler() }}
                                  cursor={h.column.getCanSort() ? 'pointer' : 'default'}
                                  visibility={String(h.column.getIsSorted()) == "false" ? 'hidden' : 'visible'}
                                  _groupHover={{ visibility: h.column.getCanSort() ? 'visible' : 'hidden' }}
                                  className={String(h.column.getIsSorted()) == "false" ? 'ri-sort-asc' : String(h.column.getIsSorted()) == 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'}>
                                </chakra.span>
                                <chakra.span
                                  onClick={() => setColumnFilters([])}
                                  cursor={'pointer'}
                                  color={'blue.300'}
                                  display={h.column.getIsFiltered() ? 'block' : 'none'}
                                  className="ri-filter-2-fill"
                                >
                                </chakra.span>
                              </Flex>
                              <Menu closeOnSelect={false}>
                                {(h.column.getCanSort() || h.column.getCanFilter()) && <MenuButton visibility={'hidden'} _groupHover={{ visibility: 'visible' }} as={IconButton} w={4} h={4} variant={'ghost'} fontSize={12} size={'xs'} icon={<i className="ri-more-2-fill"></i>} />}
                                <MenuList fontSize={'xs'}>
                                  {h.column.getCanFilter() ?
                                    h.column.columnDef.header == 'Date' ?
                                      <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={filteredDate} onChange={(value: string | string[]) => setFilteredDate(String(value))} title='Filter By' type={'radio'}>
                                        <MenuItemOption value='day'>Day</MenuItemOption>
                                        <MenuItemOption value='month'>Month</MenuItemOption>
                                        <MenuItemOption value='year'>Year</MenuItemOption>
                                        <Box p={2} ml={2}>
                                          <Filter type={filteredDate == 'day' ? 'date' : filteredDate == 'month' ? 'month' : 'select'} column={h.column} table={table} />
                                          {/* {h.column.getFilterValue()} */}
                                        </Box>
                                        {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                      </MenuOptionGroup>
                                      :
                                      h.column.columnDef.header == 'Status' ?
                                        <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter by Input'>
                                          <Box p={2} ml={2}>
                                            <Filter type={'select'} column={h.column} table={table} />
                                            {/* {h.column.getFilterValue()} */}
                                          </Box>
                                          {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                        </MenuOptionGroup>
                                        :
                                        <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter by Input'>
                                          <Box p={2} ml={2}>
                                            <Filter type={'text'} column={h.column} table={table} />
                                            {/* {h.column.getFilterValue()} */}
                                          </Box>
                                          {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                        </MenuOptionGroup>
                                    : ''
                                  }
                                  {h.column.getCanFilter() && <MenuDivider />}
                                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={sorting.length == 0 ? 'none' : sorting[0].desc == false && h.column.getIsSorted() ? 'asc' : h.column.getIsSorted() ? 'desc' : 'none'} title='Order By' type={'radio'}>
                                    <MenuItemOption onClick={() => setSorting([])} value='none'>None</MenuItemOption>
                                    <MenuItemOption onClick={() => setSorting([{ id: h.column.id, desc: false }])} value='asc'>Ascending</MenuItemOption>
                                    <MenuItemOption onClick={() => setSorting([{ id: h.column.id, desc: true }])} value='desc'>Descending</MenuItemOption>
                                  </MenuOptionGroup>
                                </MenuList>
                              </Menu>
                            </Flex>
                          )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody fontSize={12}>
                  {table.getRowModel().rows.map(row => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <Td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex justifyContent={'space-between'} mt={4} flexDir={{ base: 'column', md: 'row' }} gap={4}>
              <Flex gap={6} alignItems={'center'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                  <Heading as={'h5'} size={'xs'}>Page</Heading>
                  <DebouncedInput
                    type={'number'}
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={value => table.setPageIndex(Number(value) - 1)}
                    width={12}
                  />
                  <Text fontSize={'xs'} whiteSpace={'nowrap'}>of {' '} {table.getPageCount()}</Text>
                </Flex>
                <ButtonGroup gap={1} ml={4}>
                  <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} size={'xs'} aria-label={"Prev Page"} icon={<i className="ri-arrow-left-s-line"></i>} />
                  <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} size={'xs'} aria-label={"Next Page"} icon={<i className="ri-arrow-right-s-line"></i>} />
                </ButtonGroup>
              </Flex>
              <Flex gap={2} alignItems={'center'} justifyContent={'flex-end'}>
                <Heading as={'h5'} size={'xs'}>Show</Heading>
                <Select
                  w={16}
                  size={'xs'}
                  rounded={'md'}
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </Select>
                <Text whiteSpace={'nowrap'} fontSize={'sm'}>of {table.getFilteredRowModel().rows.length} row</Text>
              </Flex>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Stack>
  )
}

MemberPayoutPage.getLayout = (page: ReactElement) => {
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

export default MemberPayoutPage