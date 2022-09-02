import { ReactElement, useEffect, useMemo, useState } from "react"

import { GetServerSideProps } from "next"
import Head from 'next/head'
import axios from "axios"
import { getSession, useSession } from "next-auth/react"

import { Badge, Box, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Select, Stack, TableContainer, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { useColorModeValue, useToast } from '@chakra-ui/react'

import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel } from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { TransactionState } from "../../utils/interface"
import { AddDataModal, TransactionMenuComponent } from "../../component/table/TransactionDataMenu"
import { DebouncedInput, Filter } from "../../component/table/FormFilter"
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

const TransactionPage = () => {
  const { data: session } = useSession();

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const toast = useToast()

  const [transaction, setTransaction] = useState<TransactionState[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredDate, setFilteredDate] = useState<string | 'day' | 'month' | 'year'>('month');
  const columnHelper = createColumnHelper<TransactionState>();
  const [reRender, setReRender] = useState(false)
  const data: TransactionState[] = useMemo(
    () => [...transaction], [transaction],
  )

  var totalamount: number = 0;
  var totalData: number = 0;
  var totalConfirmed: number = 0;
  var totalUnconfirmed: number = 0;

  const submitTransaction = async (data: TransactionState) => {
    const querySubmit = `mutation Mutation {
      addTransaction(
        name: "${data.name}"
        transactionDate: "${data.transactionDate}"
        amount: ${data.amount}
        pic: "${session?.user?.email}"
        evidence: "${data.evidence}"
        status: "unconfirmed"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query: querySubmit }).then(res => {
      const transaction = res.data.data.addTransaction;
      if (res.data.data.addTransaction.success == true) {
        toast({
          title: 'Transaction Data Submitted',
          description: `${res.data.data.addTransaction.message}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        setReRender(r => !r);
      } else {
        toast({
          title: 'Error',
          description: `${res.data.data.addTransaction.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    })
  }

  const editTransaction = async (data: TransactionState) => {
    const queryEdit = `mutation Mutation {
      editTransaction(
        _id: "${data._id}"
        name: "${data.name}"
        transactionDate: "${data.transactionDate}"
        amount: ${data.amount}
        pic: "${data.pic}"
        evidence: "${data.evidence}"
        status: "${data.status}"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query: queryEdit }).then(res => {
      const transaction = res.data.data.editTransaction;
      if (transaction.success == true) {
        toast({
          title: 'Transaction Data Updated',
          description: `${transaction.message}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        setReRender(r => !r);
      } else {
        toast({
          title: 'Error',
          description: `${transaction.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    })
  }

  const confirmTransaction = async (data: TransactionState) => {
    const queryConfirm = `mutation Mutation {
      editTransaction(
        _id: "${data._id}"
        name: null
        status: "confirmed"
        pic: "${session?.user?.email}"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query: queryConfirm }).then(res => {
      const transaction = res.data.data.editTransaction;
      if (transaction.success == true) {
        toast({
          title: 'Transaction Data Updated',
          description: `${transaction.message}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        setReRender(r => !r);
      } else {
        toast({
          title: 'Error',
          description: `${transaction.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    })
  }

  const deleteTransaction = async (data: TransactionState) => {
    const queryDelete = `mutation Mutation {
      deleteTransaction(
        _id: "${data._id}"
      ) {
        success
        message
      }
    }`

    await axios.post('/api/graphql', { query: queryDelete }).then(res => {
      const transaction = res.data.data.deleteTransaction;
      if (transaction.success == true) {
        toast({
          title: 'Transaction Data Deleted.',
          description: `${transaction.message}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        setReRender(r => !r);
      } else {
        toast({
          title: 'Error',
          description: `${transaction.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    })
  }

  const columns = [
    columnHelper.accessor('name', {
      cell: i => i.getValue()
    }),
    columnHelper.accessor('amount', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('transactionDate', {
      header: 'Date',
      cell: i => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(i.getValue()))
    }),
    // columnHelper.accessor('pic', {
    //   cell: i => i.getValue()
    // }),
    columnHelper.accessor('status', {
      filterFn: 'equals',
      cell: i => (
        <Badge colorScheme={i.getValue() == 'confirmed' ? 'green' : 'red'} fontSize={10}>{i.getValue()}</Badge>
      )
    }),
    columnHelper.display({
      header: '',
      id: 'action',
      enableSorting: false,
      cell: i => (
        <TransactionMenuComponent
          data={i.row.original}
          handlerEdit={(editData: TransactionState) => editTransaction(editData)}
          handlerConfirm={(confirmData: TransactionState) => confirmTransaction(confirmData)}
          handlerDelete={(deleteData: TransactionState) => deleteTransaction(deleteData)} />
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

  if (table.getFilteredRowModel().rows.length > 0) {
    totalData = table.getFilteredRowModel().rows.length;
    table.getFilteredRowModel().rows.map(d => {
      totalamount = totalamount + d.original.amount;
      totalConfirmed = d.original.status == 'confirmed' ? totalConfirmed + 1 : totalConfirmed;
      totalUnconfirmed = d.original.status == 'unconfirmed' ? totalUnconfirmed + 1 : totalUnconfirmed;
    })
  }

  useEffect(() => {
    var mounted: boolean = true;

    const query = `query Query {
      transactions {
        _id
        name
        transactionDate
        amount
        pic
        status
        confirmedBy
        evidence
        _lastUpdate
        _createdAt
      }
    }`

    const getTransaction = async () => {
      await axios.post('/api/graphql', { query }).then(res => {
        const transactions = res.data.data.transactions;
        if (mounted) {
          setTransaction([...transactions]);
        }
      })
    }

    getTransaction();
    return () => { mounted = false; }
  }, [reRender])

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Amount'} data={Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(totalamount)} icon={'ri-wallet-3-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Data'} data={totalData} icon={'ri-file-list-3-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex cursor={'pointer'} onClick={() => setColumnFilters([{ id: 'status', value: 'confirmed' }])} p={4} bg={bg} boxShadow={columnFilters.length > 0 ? columnFilters[0].value == 'confirmed' ? 'darkGreen' : 'green' : 'green'} _hover={{ boxShadow: 'darkGreen' }} transition={'all 0.3s ease-in-out'} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={'green.500'} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-checkbox-circle-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Confirmed</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{totalConfirmed}</Heading>
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
                <Heading as={'h4'} size={'md'}>{totalUnconfirmed}</Heading>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 4 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Transaction Data</Heading>
              <Text fontSize={'xs'} mt={2}>List all of transaction data.</Text>
            </Box>
            <Box>
              <ButtonGroup>
                <AddDataModal handlerSubmit={(submitTransactionData: TransactionState) => submitTransaction(submitTransactionData)} />
              </ButtonGroup>
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
                                  {h.column.columnDef.header == 'Date' ?
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
                                    <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter by Input'>
                                      <Box p={2} ml={2}>
                                        <Filter type={'text'} column={h.column} table={table} />
                                        {/* {h.column.getFilterValue()} */}
                                      </Box>
                                      {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                    </MenuOptionGroup>
                                  }
                                  <MenuDivider />
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

TransactionPage.getLayout = (page: ReactElement) => {
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


export default TransactionPage