import { ReactElement, useMemo, useState } from "react"

import dynamic from "next/dynamic"
import Head from 'next/head'
import { Badge, Box, ButtonGroup, filter, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Select, Stack, TableContainer, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel } from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { BalanceState } from "../../utils/interface"
import { BalancesData } from "../../data/BalancesData"
import { TransactionMenuComponent } from "../../component/table/TransactionDataMenu"
import { DebouncedInput, Filter } from "../../component/table/FormFilter"
import { CondensedCard } from "../../component/Card"
import { BalancesChartData, CashFlowChartData } from "../../data/ChartData"

const ChartCashFlow = dynamic(
  () => import('../../component/Chart'),
  { ssr: false }
)

const BalancesChart = dynamic(
  () => import('../../component/Chart'),
  { ssr: false }
)

const BalancesPage = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredDate, setFilteredDate] = useState<string | 'day' | 'month' | 'year'>('month');
  const columnHelper = createColumnHelper<BalanceState>();

  const data: BalanceState[] = useMemo(() => [...BalancesData], [])

  const columns = [
    columnHelper.accessor('id', {
      enableColumnFilter: false,
      enableSorting: true,
      cell: i => i.getValue()
    }),
    columnHelper.accessor('month', {
      cell: i => new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(i.getValue()))
    }),
    columnHelper.accessor('income', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('outcome', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('balance', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
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

  var totalBalances: number = 0;
  var totalIncome: number = 0;
  var totalOutcome: number = 0;
  var balanceThisMonth: number = 0;
  var totalMonth: number = 0;

  const DateNow = new Date();

  if (table.getFilteredRowModel().rows.length > 0) {
    totalMonth = table.getRowModel().rows.length;

    table.getFilteredRowModel().rows.map((x) => {
      totalBalances = totalBalances + x.original.balance;
      totalIncome = totalIncome + x.original.income;
      totalOutcome = totalOutcome + x.original.outcome;
    })

    table.getFilteredRowModel().rows.filter(f => f.original.month.includes(DateNow.getFullYear() + '-' + DateNow.getMonth())).map(x => {
      balanceThisMonth = balanceThisMonth + x.original.balance;
    })

  }

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Balances'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalBalances)} icon={'ri-scales-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Income'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalIncome)} icon={'ri-hand-coin-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Outcome'} data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(totalOutcome)} icon={'ri-bank-card-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Data'} data={totalMonth} icon={'ri-file-text-fill'} />
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(6, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 6, md: 4, lg: 4 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Cash Flow</Heading>
              <Text fontSize={'xs'}>Monthly cashflow overview.</Text>
            </Box>
            <Menu>
              <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-line"></i>} />
              <MenuList fontSize={'xs'}>
                <MenuItem icon={<i className="ri-calendar-event-line"></i>}>Change Year</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box mt={2} overflow={'hidden'}>
            <ChartCashFlow chartOption={CashFlowChartData} width={'100%'} height={'330px'} />
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 6, md: 2, lg: 2 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Balances</Heading>
              <Text fontSize={'xs'}>Monthly balances overview.</Text>
            </Box>
            <Menu>
              <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-line"></i>} />
              <MenuList fontSize={'xs'}>
                <MenuItem icon={<i className="ri-calendar-event-line"></i>}>Change Year</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box mt={2} overflow={'hidden'}>
            <BalancesChart chartOption={BalancesChartData} width={'100%'} height={'330px'} />
          </Box>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 4 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Balances Data</Heading>
              {/* <Text fontSize={'xs'}>Monthly cashflow overview.</Text> */}
            </Box>
            <Box>
              {/* <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-fill"></i>} />
                <MenuList fontSize={'xs'}>
                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={filteredDate} onChange={(value: string | string[]) => setFilteredDate(String(value))} title='Filter By' type={'radio'}>
                    <MenuItemOption value='day'>Day</MenuItemOption>
                    <MenuItemOption value='month'>Month</MenuItemOption>
                    <MenuItemOption value='year'>Year</MenuItemOption>
                    <Box p={2} ml={2}>
                      <Filter type={filteredDate == 'day' ? 'date' : filteredDate == 'month' ? 'month' : 'select'} column={table.getColumn('transactionDate')} table={table} />
                    </Box>
                    {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                  </MenuOptionGroup>
                </MenuList>
              </Menu> */}
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

BalancesPage.getLayout = (page: ReactElement) => {
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


export default BalancesPage