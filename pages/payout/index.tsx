import { ReactElement, useMemo, useState } from "react"

import Head from 'next/head'
import { useRouter } from "next/router"

import { Badge, Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Select, Stack, TableContainer, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel } from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { DebouncedInput, Filter } from "../../component/table/FormFilter"

import { PayoutState } from "../../utils/interface"
import { PayoutData } from "../../data/PayoutData"
import { MemberData } from "../../data/MemberData"
import { PayoutMenuComponent } from "../../component/table/PayoutDataMenu"

const PayoutPage = () => {
  const router = useRouter()
  const { memberid } = router.query

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconBG = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const increaseColor = useColorModeValue('green.500', 'green.400');
  const decreaseColor = useColorModeValue('red.500', 'red.400');

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredDate, setFilteredDate] = useState<string | 'day' | 'month' | 'year'>('month');
  const columnHelper = createColumnHelper<PayoutState>();

  const data: PayoutState[] = useMemo(
    () => [...PayoutData], [],
  )

  const columns = [
    columnHelper.accessor('id', {
      enableColumnFilter: false,
      enableSorting: true,
      cell: i => i.getValue()
    }),
    columnHelper.accessor('memberID', {
      header: 'Member',
      enableColumnFilter: false,
      enableSorting: false,
      filterFn: 'equals',
      cell: i => {
        const member = MemberData.filter(f => f.id === i.getValue())[0];

        return (
          <Popover placement={'bottom-start'}>
            <PopoverTrigger>
              <Button size={'xs'} variant={'unstyled'}>{member.name}</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textTransform={'capitalize'}>
                <>{member.name}<Tag ml={1} size={'sm'} colorScheme={'blue'}>{member.class}</Tag></>
              </PopoverHeader>
              <PopoverBody overflow={'hidden'} whiteSpace={'break-spaces'}>
                <Text>Check all payout data with name: {member.name}</Text>
              </PopoverBody>
              <PopoverFooter display={'flex'} justifyContent={'flex-end'}>
                <Button onClick={() => router.push(`/payout/${member.id}`)} size={'xs'} variant={'solid'} colorScheme={'blue'}>Check Data</Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        )
      }
    }),
    columnHelper.accessor('amount', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('payoutDate', {
      header: 'Date',
      cell: i => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(i.getValue()))
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'equalsString',
      cell: i => (
        <>
          <Popover placement={'bottom-end'}>
            <PopoverTrigger>
              <Badge cursor={'pointer'} colorScheme={i.getValue() == 'confirmed' ? 'green' : 'red'} fontSize={10}>{i.getValue()}</Badge>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textTransform={'capitalize'}>
                <Badge cursor={'pointer'} colorScheme={i.getValue() == 'confirmed' ? 'green' : 'red'} fontSize={10}>{i.getValue()}</Badge>
              </PopoverHeader>
              <PopoverBody overflow={'hidden'} whiteSpace={'break-spaces'}>
                <Text>
                  {i.getValue() == 'confirmed' ?
                    <chakra.span>
                      Confirmed by <chakra.strong>{MemberData.filter(f => f.id === i.row.original.confirmedBy)[0].name}</chakra.strong> <chakra.br />
                      on <chakra.strong>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'long' }).format(new Date(i.row.original.lastUpdate))}</chakra.strong>
                    </chakra.span>
                    :
                    <chakra.span>This payout data is unconfirmed, please check payout evidence and confirm it in next action button.</chakra.span>
                  }
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      )
    }),
    columnHelper.display({
      header: '',
      id: 'action',
      enableSorting: false,
      cell: i => (
        <PayoutMenuComponent data={i.row.original} />
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

  var totalamount: number = 0;
  var totalData: number = 0;
  var totalConfirmed: number = 0;
  var totalUnconfirmed: number = 0;

  if (table.getFilteredRowModel().rows.length > 0) {
    totalData = table.getFilteredRowModel().rows.length;
    table.getFilteredRowModel().rows.map(d => {
      totalamount = totalamount + d.original.amount;
      totalConfirmed = d.original.status == 'confirmed' ? totalConfirmed + 1 : totalConfirmed;
      totalUnconfirmed = d.original.status == 'unconfirmed' ? totalUnconfirmed + 1 : totalUnconfirmed;
    })
  }

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-wallet-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Amount</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'standard' }).format(totalamount)}</Heading>
                <Flex fontSize={10} color={increaseColor} alignItems={'center'}>
                  <i className="ri-arrow-up-s-fill"></i>
                  <Text fontWeight={'bold'}>10%</Text>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
            <Flex minW={10} w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-file-list-3-fill"></i></Flex>
            <Box>
              <Text fontSize={'xs'}>Total Data</Text>
              <Flex gap={1} alignItems={'flex-end'}>
                <Heading as={'h4'} size={'md'}>{totalData}</Heading>
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
              <Heading as={'h4'} size={'md'}>Payout Data</Heading>
              <Text mt={2} fontSize={'xs'}>Payout data list per member.</Text>
              <Flex gap={2} mt={4}>
                {columnFilters.length > 0 && columnFilters.map((i, x) => (
                  <Tag key={x} size={'sm'}>
                    <TagLabel>
                      {i.id == 'memberID' ?
                        <>{MemberData.filter(f => f.id == i.value)[0].name}</>
                        :
                        <>{String(i.value)}</>
                      }
                    </TagLabel>
                    <TagCloseButton onClick={() => setColumnFilters(s => s.filter(x => x.value !== i.value))} />
                  </Tag>
                ))}
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

PayoutPage.getLayout = (page: ReactElement) => {
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

export default PayoutPage